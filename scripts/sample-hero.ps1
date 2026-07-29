<#
  Phase 2 measurements: what is needed to place the hero at the pixel.

  Companion to scripts/sample-mockup.ps1, which sampled colour and the coarse
  geometry. This one measures the type block, the CTA row and the Summer Camp
  panel, and can cut the placeholder crops.

    powershell -ExecutionPolicy Bypass -File scripts/sample-hero.ps1 -Path docs/design/hero-mockup.jpeg
    powershell -ExecutionPolicy Bypass -File scripts/sample-hero.ps1 -Path docs/design/hero-mockup.jpeg -Crop

  Numbers are mockup pixels. The mockup reads as a 1440px viewport exported at
  1080px, so multiply by 4/3 for design pixels.

  Two Windows PowerShell traps this file deliberately avoids:
  keep it pure ASCII, because an unmarked .ps1 is read as ANSI and a UTF-8 em
  dash arrives as three bytes one of which is a quote; and never use
  single-letter variables, because names are case-insensitive and $b would
  silently overwrite $B.
#>
param(
  [Parameter(Mandatory = $true)][string]$Path,
  [switch]$Crop,
  [string]$CropDir = "public/images"
)

Add-Type -AssemblyName System.Drawing

$resolved = (Resolve-Path $Path).Path
$image = [System.Drawing.Image]::FromFile($resolved)
$bitmap = New-Object System.Drawing.Bitmap $image
$imgW = $bitmap.Width
$imgH = $bitmap.Height
$area = New-Object System.Drawing.Rectangle 0, 0, $imgW, $imgH
$locked = $bitmap.LockBits($area, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$rowBytes = $locked.Stride
$pixels = New-Object byte[] ($rowBytes * $imgH)
[System.Runtime.InteropServices.Marshal]::Copy($locked.Scan0, $pixels, 0, $pixels.Length)
$bitmap.UnlockBits($locked)
$bitmap.Dispose()
$image.Dispose()

function Get-Pixel {
  param([int]$px, [int]$py)
  $idx = $py * $rowBytes + $px * 3
  return @([int]$pixels[$idx + 2], [int]$pixels[$idx + 1], [int]$pixels[$idx])
}

function Get-Luma {
  param($rgb)
  return 0.2126 * $rgb[0] + 0.7152 * $rgb[1] + 0.0722 * $rgb[2]
}

# White type on a photograph: bright in every channel and close to neutral.
function Test-WhiteInk {
  param($rgb)
  $lo = [Math]::Min($rgb[0], [Math]::Min($rgb[1], $rgb[2]))
  $hi = [Math]::Max($rgb[0], [Math]::Max($rgb[1], $rgb[2]))
  return ($lo -gt 205) -and (($hi - $lo) -lt 32)
}

# --- card bounds -----------------------------------------------------------
$canvasRef = Get-Pixel 8 8
function Test-OffCanvas {
  param($rgb)
  $delta = [Math]::Max([Math]::Abs($rgb[0] - $canvasRef[0]), [Math]::Max([Math]::Abs($rgb[1] - $canvasRef[1]), [Math]::Abs($rgb[2] - $canvasRef[2])))
  return $delta -gt 70
}

$scanY = [int]($imgH / 2)
$cardL = 0
for ($sx = 0; $sx -lt $imgW; $sx++) { if (Test-OffCanvas (Get-Pixel $sx $scanY)) { $cardL = $sx; break } }
$cardR = $imgW - 1
for ($sx = $imgW - 1; $sx -ge 0; $sx--) { if (Test-OffCanvas (Get-Pixel $sx $scanY)) { $cardR = $sx; break } }
$scanX = [int](($cardL + $cardR) / 2)
$cardT = 0
for ($sy = 0; $sy -lt $imgH; $sy++) { if (Test-OffCanvas (Get-Pixel $scanX $sy)) { $cardT = $sy; break } }
$darkCol = $cardL + 60
$cardB = $imgH - 1
for ($sy = $imgH - 1; $sy -ge 0; $sy--) { if (Test-OffCanvas (Get-Pixel $darkCol $sy)) { $cardB = $sy; break } }

$cardW = $cardR - $cardL + 1
$cardH = $cardB - $cardT + 1
Write-Output "=== CARD ==="
Write-Output "x $cardL..$cardR  y $cardT..$cardB   ${cardW} x ${cardH}   aspect $([math]::Round($cardW / $cardH, 4))"
Write-Output "side margin $cardL px = $([math]::Round(100 * $cardL / $imgW, 2))vw   design px $([math]::Round($cardL * 4 / 3, 1))"

# --- text lines ------------------------------------------------------------
function Get-LineBands {
  param([int]$x0, [int]$y0, [int]$x1, [int]$y1, [int]$floor)
  $bands = New-Object System.Collections.ArrayList
  $runStart = -1
  for ($ly = $y0; $ly -le $y1; $ly++) {
    $hits = 0
    for ($lx = $x0; $lx -le $x1; $lx++) { if (Test-WhiteInk (Get-Pixel $lx $ly)) { $hits++ } }
    if ($hits -ge $floor -and $runStart -lt 0) { $runStart = $ly }
    if ($hits -lt $floor -and $runStart -ge 0) {
      [void]$bands.Add(@($runStart, ($ly - 1)))
      $runStart = -1
    }
  }
  if ($runStart -ge 0) { [void]$bands.Add(@($runStart, $y1)) }
  return $bands
}

function Get-InkExtentX {
  param([int]$x0, [int]$y0, [int]$x1, [int]$y1)
  $first = -1
  $last = -1
  for ($ex = $x0; $ex -le $x1; $ex++) {
    for ($ey = $y0; $ey -le $y1; $ey++) {
      if (Test-WhiteInk (Get-Pixel $ex $ey)) {
        if ($first -lt 0) { $first = $ex }
        $last = $ex
        break
      }
    }
  }
  return @($first, $last)
}

Write-Output ""
Write-Output "=== TYPE BLOCK ==="
$specs = @(
  @{ name = 'h1  '; x0 = 92; y0 = 515; x1 = 660; y1 = 665; floor = 3 },
  @{ name = 'para'; x0 = 92; y0 = 668; x1 = 500; y1 = 742; floor = 3 }
)
foreach ($spec in $specs) {
  $bands = Get-LineBands $spec.x0 $spec.y0 $spec.x1 $spec.y1 $spec.floor
  $lineNo = 1
  $prevTop = -1
  foreach ($band in $bands) {
    $extent = Get-InkExtentX $spec.x0 $band[0] $spec.x1 $band[1]
    $height = $band[1] - $band[0] + 1
    $width = $extent[1] - $extent[0] + 1
    $pitch = if ($prevTop -lt 0) { '-' } else { $band[0] - $prevTop }
    Write-Output "$($spec.name) line ${lineNo}: y $($band[0])..$($band[1]) (h $height)   x $($extent[0])..$($extent[1]) (w $width)   pitch $pitch"
    $prevTop = $band[0]
    $lineNo++
  }
}

# --- CTA row ---------------------------------------------------------------
$limeX0 = 9999; $limeX1 = 0; $limeY0 = 9999; $limeY1 = 0
for ($cy = 720; $cy -le 800; $cy++) {
  for ($cx = 80; $cx -le 300; $cx++) {
    $rgb = Get-Pixel $cx $cy
    if ($rgb[1] -gt $rgb[0] + 45 -and $rgb[1] -gt $rgb[2] + 80) {
      if ($cx -lt $limeX0) { $limeX0 = $cx }
      if ($cx -gt $limeX1) { $limeX1 = $cx }
      if ($cy -lt $limeY0) { $limeY0 = $cy }
      if ($cy -gt $limeY1) { $limeY1 = $cy }
    }
  }
}
$midRow = [int](($limeY0 + $limeY1) / 2)
$secX0 = -1; $secX1 = -1
for ($cx = $limeX1 + 2; $cx -le 500; $cx++) {
  $rgb = Get-Pixel $cx $midRow
  if ($rgb[0] -gt 235 -and $rgb[1] -gt 235 -and $rgb[2] -gt 235) { $secX0 = $cx; break }
}
for ($cx = 500; $cx -gt $limeX1; $cx--) {
  $rgb = Get-Pixel $cx $midRow
  if ($rgb[0] -gt 235 -and $rgb[1] -gt 235 -and $rgb[2] -gt 235) { $secX1 = $cx; break }
}

Write-Output ""
Write-Output "=== CTA ROW ==="
Write-Output "primary   x $limeX0..$limeX1 (w $($limeX1 - $limeX0 + 1))  y $limeY0..$limeY1 (h $($limeY1 - $limeY0 + 1))"
Write-Output "secondary x $secX0..$secX1 (w $($secX1 - $secX0 + 1))"
Write-Output "gap between buttons: $($secX0 - $limeX1 - 1)"
Write-Output "left inset from card: $($limeX0 - $cardL)   bottom gap to card: $($cardB - $limeY1)"

# --- Summer Camp panel -----------------------------------------------------
# The panel is a pale wash over the photo. Its left edge is the only hard
# vertical step in that band, so walk in from the thumbnail and out to the sky.
Write-Output ""
Write-Output "=== SUMMER CAMP PANEL ==="
$thumbX0 = 9999; $thumbX1 = 0; $thumbY0 = 9999; $thumbY1 = 0
for ($ty = 250; $ty -le 360; $ty++) {
  for ($tx = 680; $tx -le 830; $tx++) {
    if ((Get-Luma (Get-Pixel $tx $ty)) -lt 90) {
      if ($tx -lt $thumbX0) { $thumbX0 = $tx }
      if ($tx -gt $thumbX1) { $thumbX1 = $tx }
      if ($ty -lt $thumbY0) { $thumbY0 = $ty }
      if ($ty -gt $thumbY1) { $thumbY1 = $ty }
    }
  }
}
Write-Output "thumbnail x $thumbX0..$thumbX1 (w $($thumbX1 - $thumbX0 + 1))  y $thumbY0..$thumbY1 (h $($thumbY1 - $thumbY0 + 1))"

$badgeX0 = 9999; $badgeX1 = 0; $badgeY0 = 9999; $badgeY1 = 0
for ($by = 255; $by -le 300; $by++) {
  for ($bx = 800; $bx -le 920; $bx++) {
    $rgb = Get-Pixel $bx $by
    if ($rgb[0] -gt 210 -and $rgb[1] -gt 235 -and $rgb[2] -lt 225 -and ($rgb[1] - $rgb[2]) -gt 18) {
      if ($bx -lt $badgeX0) { $badgeX0 = $bx }
      if ($bx -gt $badgeX1) { $badgeX1 = $bx }
      if ($by -lt $badgeY0) { $badgeY0 = $by }
      if ($by -gt $badgeY1) { $badgeY1 = $by }
    }
  }
}
Write-Output "badge     x $badgeX0..$badgeX1 (w $($badgeX1 - $badgeX0 + 1))  y $badgeY0..$badgeY1 (h $($badgeY1 - $badgeY0 + 1))"

# Panel top and bottom, read on a column that sits inside the wash but clear of
# the thumbnail and of the type.
Write-Output ""
Write-Output "=== PANEL EDGES (column scans, luma) ==="
foreach ($col in @(695, 700, 960, 966, 972)) {
  $edges = @()
  $prev = Get-Luma (Get-Pixel $col 240)
  for ($py = 241; $py -le 400; $py++) {
    $cur = Get-Luma (Get-Pixel $col $py)
    if ([Math]::Abs($cur - $prev) -gt 18) { $edges += "${py}:$([int]$prev)->$([int]$cur)" }
    $prev = $cur
  }
  Write-Output "col ${col}: $($edges -join '  ')"
}

Write-Output ""
Write-Output "=== ARROW BUTTONS ==="
foreach ($row in @(360, 367, 374)) {
  $runs = @()
  $inRun = $false
  $runStart = 0
  for ($ax = 890; $ax -le 1010; $ax++) {
    $rgb = Get-Pixel $ax $row
    $lit = (Get-Luma $rgb) -gt 190
    if ($lit -and -not $inRun) { $inRun = $true; $runStart = $ax }
    if (-not $lit -and $inRun) { $inRun = $false; $runs += "$runStart..$($ax - 1) (w $($ax - $runStart))" }
  }
  if ($inRun) { $runs += "$runStart..1010" }
  Write-Output "row ${row}: $($runs -join '   ')"
}
$arrowY0 = -1; $arrowY1 = -1
for ($ay = 340; $ay -le 400; $ay++) {
  if ((Get-Luma (Get-Pixel 930 $ay)) -gt 190) {
    if ($arrowY0 -lt 0) { $arrowY0 = $ay }
    $arrowY1 = $ay
  }
}
Write-Output "vertical at x=930: y $arrowY0..$arrowY1 (h $($arrowY1 - $arrowY0 + 1))"

# --- darkening overlay -----------------------------------------------------
Write-Output ""
Write-Output "=== LUMINANCE GRID (5 x 5 across the card) ==="
for ($gr = 0; $gr -lt 5; $gr++) {
  $sampleY = [int]($cardT + ($cardH - 1) * $gr / 4)
  $sampleY = [Math]::Min([Math]::Max($sampleY, $cardT + 2), $cardB - 2)
  $cells = @()
  for ($gc = 0; $gc -lt 5; $gc++) {
    $sampleX = [int]($cardL + ($cardW - 1) * $gc / 4)
    $sampleX = [Math]::Min([Math]::Max($sampleX, $cardL + 2), $cardR - 2)
    $cells += ([int](Get-Luma (Get-Pixel $sampleX $sampleY))).ToString().PadLeft(4)
  }
  Write-Output "y $($sampleY.ToString().PadLeft(4)): $($cells -join ' ')"
}

# --- crops -----------------------------------------------------------------
if ($Crop) {
  if (-not (Test-Path $CropDir)) { New-Item -ItemType Directory -Path $CropDir -Force | Out-Null }
  $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

  function Save-Crop {
    param([string]$name, [int]$sx, [int]$sy, [int]$sw, [int]$sh, [int]$outW)
    $src = [System.Drawing.Image]::FromFile($resolved)
    $outH = [int][Math]::Round($sh * $outW / $sw)
    $dest = New-Object System.Drawing.Bitmap $outW, $outH
    $gfx = [System.Drawing.Graphics]::FromImage($dest)
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gfx.DrawImage($src, (New-Object System.Drawing.Rectangle 0, 0, $outW, $outH), (New-Object System.Drawing.Rectangle $sx, $sy, $sw, $sh), [System.Drawing.GraphicsUnit]::Pixel)
    $gfx.Dispose()
    $params = New-Object System.Drawing.Imaging.EncoderParameters 1
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 90L
    $outPath = Join-Path $CropDir "$name.jpg"
    $dest.Save($outPath, $jpegCodec, $params)
    $dest.Dispose()
    $src.Dispose()
    Write-Output "crop -> $outPath  (${outW} x ${outH})"
  }

  Write-Output ""
  Write-Output "=== CROPS ==="
  # The thumbnail runs 702..807; anything past that is the EXCLUSIVE badge.
  Save-Crop "hero-court" $cardL $cardT $cardW $cardH 1908
  Save-Crop "camp-summer" 702 273 106 70 424
  Save-Crop "camp-junior" 880 700 106 70 424
  Save-Crop "camp-adult" 150 770 106 70 424
}
