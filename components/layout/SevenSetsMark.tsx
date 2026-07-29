import { cn } from "@/lib/cn";

/**
 * The 7SETS monogram, drawn rather than traced.
 *
 * In the mockup the mark is 24px wide and JPEG-compressed, so the outlines are
 * not recoverable. What is legible at 16x magnification is a half-drop
 * checkerboard: eight blocks in four rows of two, alternate rows shifted by
 * half a column, the whole thing leaning to the left, with the top and bottom
 * rows bleeding off the edges of its box. That is what this reproduces. It is
 * ink on the white nav block, not white on a black badge as the brief assumed.
 */

const COLUMN_PITCH = 10.6;
const ROW_PITCH = 5.6;
const BLOCK_W = 6.8;
const BLOCK_H = 4.8;

/** Rows 0 and 2 sit half a column to the right; 1 and 3 start at the edge. */
const BLOCKS = [0, 1, 2, 3].flatMap((row) => {
  const offsetX = row % 2 === 0 ? COLUMN_PITCH / 2 : 0;
  const y = 1 + row * ROW_PITCH;
  return [0, 1].map((column) => ({ x: offsetX + column * COLUMN_PITCH, y }));
});

export function SevenSetsMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <g transform="rotate(-12 12 12)">
        {BLOCKS.map((block) => (
          <rect
            key={`${block.x}-${block.y}`}
            x={block.x}
            y={block.y}
            width={BLOCK_W}
            height={BLOCK_H}
            rx="0.9"
          />
        ))}
      </g>
    </svg>
  );
}
