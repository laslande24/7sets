param([Parameter(Mandatory = $true)][string]$Path)

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($Path)
$bmp = New-Object System.Drawing.Bitmap $img
$W = $bmp.Width; $H = $bmp.Height
$rect = New-Object System.Drawing.Rectangle 0, 0, $W, $H
$d = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$stride = $d.Stride
$B = New-Object byte[] ($stride * $H)
[System.Runtime.InteropServices.Marshal]::Copy($d.Scan0, $B, 0, $B.Length)
$bmp.UnlockBits($d); $bmp.Dispose(); $img.Dispose()

function Hex($r, $g, $b) { '#{0:X2}{1:X2}{2:X2}' -f [int]$r, [int]$g, [int]$b }

function Med($x0, $y0, $x1, $y1, $step = 1) {
  $rs = New-Object System.Collections.ArrayList
  $gs = New-Object System.Collections.ArrayList
  $bs = New-Object System.Collections.ArrayList
  for ($y = $y0; $y -le $y1; $y += $step) {
    $row = $y * $stride
    for ($x = $x0; $x -le $x1; $x += $step) {
      $i = $row + $x * 3
      [void]$rs.Add([int]$B[$i + 2]); [void]$gs.Add([int]$B[$i + 1]); [void]$bs.Add([int]$B[$i])
    }
  }
  $rs.Sort(); $gs.Sort(); $bs.Sort()
  $m = [int]($rs.Count / 2)
  Hex $rs[$m] $gs[$m] $bs[$m]
}

# darkest 5th-percentile colour in a box (true ink under antialiasing)
function Ink($x0, $y0, $x1, $y1) {
  $list = New-Object System.Collections.ArrayList
  for ($y = $y0; $y -le $y1; $y++) {
    $row = $y * $stride
    for ($x = $x0; $x -le $x1; $x++) {
      $i = $row + $x * 3
      $r = [int]$B[$i + 2]; $g = [int]$B[$i + 1]; $bb = [int]$B[$i]
      [void]$list.Add([pscustomobject]@{ L = 0.2126 * $r + 0.7152 * $g + 0.0722 * $bb; R = $r; G = $g; Bl = $bb })
    }
  }
  $sorted = $list | Sort-Object L
  $k = [int]($sorted.Count * 0.03)
  $p = $sorted[$k]
  Hex $p.R $p.G $p.Bl
}

# width of a light shape on a given row, scanning a generous x window
function LightWidth($x0, $x1, $y, $thr) {
  $f = -1; $l = -1
  $row = $y * $stride
  for ($x = $x0; $x -le $x1; $x++) {
    $i = $row + $x * 3
    if ($B[$i] -gt $thr -and $B[$i + 1] -gt $thr -and $B[$i + 2] -gt $thr) { if ($f -lt 0) { $f = $x }; $l = $x }
  }
  return @($f, $l, $(if ($f -ge 0) { $l - $f + 1 } else { 0 }))
}
function GreenWidth($x0, $x1, $y) {
  $f = -1; $l = -1
  $row = $y * $stride
  for ($x = $x0; $x -le $x1; $x++) {
    $i = $row + $x * 3
    $r = [int]$B[$i + 2]; $g = [int]$B[$i + 1]; $bb = [int]$B[$i]
    if ($g -gt $r + 40 -and $g -gt $bb + 70) { if ($f -lt 0) { $f = $x }; $l = $x }
  }
  return @($f, $l, $(if ($f -ge 0) { $l - $f + 1 } else { 0 }))
}

Write-Output "=== REFINED COLOURS ==="
Write-Output ("canvas (median, all margins)  " + (Med 4 4 1075 160 3))
Write-Output ("canvas bottom band            " + (Med 4 880 1075 945 3))
Write-Output ("lime  (CTA band above label)  " + (Med 104 751 246 755))
Write-Output ("lime  (CTA band below label)  " + (Med 104 771 224 775))
Write-Output ("lime-soft (badge top band)    " + (Med 822 270 884 273))
Write-Output ("arrow chip (in CTA)           " + (Med 234 752 246 757))
Write-Output ("surface (nav pill)            " + (Med 300 200 340 204))
Write-Output ("surface (CTA secondary)       " + (Med 270 752 410 755))
Write-Output ("ink (nav link glyphs)         " + (Ink 205 206 300 218))
Write-Output ("ink (logo monogram)           " + (Ink 104 203 124 222))
Write-Output ("ink (EXCLUSIVE label)         " + (Ink 824 274 880 284))
Write-Output ("court (mid court)             " + (Med 420 800 620 830))
Write-Output ("court-deep (lower left)       " + (Med 70 830 140 846))
Write-Output ("title white                   " + (Med 104 545 112 560))

Write-Output ""
Write-Output "=== RADII (r = (Wcenter - Wtop)/2) ==="
$shapes = @(
  @{ n = 'nav block1 (logo)'; x0 = 90; x1 = 300; yTop = 198; yMid = 212; thr = 225; g = $false },
  @{ n = 'nav block2 (links)'; x0 = 285; x1 = 530; yTop = 198; yMid = 200; thr = 225; g = $false },
  @{ n = 'nav block3 (grip)'; x0 = 530; x1 = 575; yTop = 198; yMid = 212; thr = 225; g = $false },
  @{ n = 'CTA secondary'; x0 = 258; x1 = 430; yTop = 749; yMid = 763; thr = 225; g = $false },
  @{ n = 'EXCLUSIVE badge'; x0 = 812; x1 = 895; yTop = 268; yMid = 278; thr = 215; g = $false },
  @{ n = 'arrow btn left'; x0 = 918; x1 = 946; yTop = 357; yMid = 367; thr = 215; g = $false },
  @{ n = 'CTA primary (lime)'; x0 = 88; x1 = 270; yTop = 749; yMid = 763; thr = 0; g = $true }
)
foreach ($s in $shapes) {
  $top = $null; $mid = $null
  for ($y = $s.yTop; $y -le $s.yTop + 6; $y++) {
    $w = $(if ($s.g) { GreenWidth $s.x0 $s.x1 $y } else { LightWidth $s.x0 $s.x1 $y $s.thr })
    if ($w[2] -gt 4) { $top = $w; $topY = $y; break }
  }
  $mid = $(if ($s.g) { GreenWidth $s.x0 $s.x1 $s.yMid } else { LightWidth $s.x0 $s.x1 $s.yMid $s.thr })
  if ($top -and $mid[2] -gt 0) {
    $r = [math]::Round(($mid[2] - $top[2]) / 2, 1)
    Write-Output ("{0,-22} top(y={1}) x={2}..{3} w={4} | mid x={5}..{6} w={7} | r~{8}px" -f $s.n, $topY, $top[0], $top[1], $top[2], $mid[0], $mid[1], $mid[2], $r)
  }
  else { Write-Output ("{0,-22} MEASURE FAILED" -f $s.n) }
}

Write-Output ""
Write-Output "=== NAV BLOCK SEPARATION (row 201, text-free) ==="
$runs = @(); $inRun = $false; $s = 0
$row = 201 * $stride
for ($x = 80; $x -le 600; $x++) {
  $i = $row + $x * 3
  $lit = ($B[$i] -gt 225 -and $B[$i + 1] -gt 225 -and $B[$i + 2] -gt 225)
  if ($lit -and -not $inRun) { $inRun = $true; $s = $x }
  if (-not $lit -and $inRun) { $inRun = $false; $runs += "$s..$($x-1) w=$($x-$s)" }
}
if ($inRun) { $runs += "$s..600" }
Write-Output ($runs -join '   |   ')

Write-Output ""
Write-Output "=== NAV VERTICAL EXTENT (col 320, text-free) ==="
$f = -1; $l = -1
for ($y = 180; $y -le 250; $y++) {
  $i = $y * $stride + 320 * 3
  if ($B[$i] -gt 225 -and $B[$i + 1] -gt 225 -and $B[$i + 2] -gt 225) { if ($f -lt 0) { $f = $y }; $l = $y }
}
Write-Output "y=$f..$l  h=$($l-$f+1)"

Write-Output ""
Write-Output "=== PARAGRAPH LINE BASELINES (thr 175) ==="
for ($y = 668; $y -le 740; $y++) {
  $n = 0; $row = $y * $stride
  for ($x = 96; $x -le 470; $x++) {
    $i = $row + $x * 3
    if ($B[$i] -gt 175 -and $B[$i + 1] -gt 175 -and $B[$i + 2] -gt 175) { $n++ }
  }
  if ($n -gt 0) { Write-Output ("y=$y  n=$n") }
}
