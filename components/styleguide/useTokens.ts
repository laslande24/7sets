"use client";

import { useCallback, useSyncExternalStore } from "react";

import { composite, contrastRatio, toHex, type Rgb } from "@/lib/color";
import { resolveColor, resolveLengthPx, resolveRaw } from "./resolve";

/**
 * The cascade is an external system as far as React is concerned, so tokens are
 * read through `useSyncExternalStore` rather than pushed into state from an
 * effect. Reads are cached so every snapshot is referentially stable, and the
 * cache is dropped on resize because the fluid tokens — `clamp`, `vw`, `min` —
 * resolve to different numbers at a different width.
 */

const cache = new Map<string, unknown>();
const listeners = new Set<() => void>();

function invalidate() {
  cache.clear();
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (listeners.size === 1) window.addEventListener("resize", invalidate);
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) window.removeEventListener("resize", invalidate);
  };
}

function cached<T>(key: string, read: () => T): T {
  if (!cache.has(key)) cache.set(key, read());
  return cache.get(key) as T;
}

/** Nothing resolves on the server; the UI renders a placeholder until hydration. */
const onServer = () => null;

/* ------------------------------------------------------------------ values */

export type TokenKind = "color" | "length" | "raw";

function readText(cssVar: string, kind: TokenKind): string {
  if (kind === "color") {
    const rgb = resolveColor(cssVar);
    return rgb ? toHex(rgb) : "—";
  }
  const raw = resolveRaw(cssVar);
  if (kind !== "length") return raw || "—";
  const px = resolveLengthPx(cssVar);
  if (px === null) return raw || "—";
  const rounded = Math.round(px * 100) / 100;
  return raw && raw !== `${rounded}px` ? `${raw} → ${rounded}px` : `${rounded}px`;
}

export function useTokenText(cssVar: string, kind: TokenKind): string | null {
  const getSnapshot = useCallback(
    () => cached(`text:${kind}:${cssVar}`, () => readText(cssVar, kind)),
    [cssVar, kind],
  );
  return useSyncExternalStore(subscribe, getSnapshot, onServer);
}

export function useEasePoints(cssVar: string): readonly number[] | null {
  const getSnapshot = useCallback(
    () =>
      cached(`ease:${cssVar}`, () => {
        const numbers = resolveRaw(cssVar).match(/-?\d*\.?\d+/g);
        return numbers?.length === 4 ? numbers.map(Number) : null;
      }),
    [cssVar],
  );
  return useSyncExternalStore(subscribe, getSnapshot, onServer);
}

/* ---------------------------------------------------------------- contrast */

export type ContrastPair = {
  readonly label: string;
  readonly fg: string;
  readonly bg: string;
  /** Set when the foreground ships with an opacity modifier. */
  readonly fgAlpha?: number;
  /** 4.5 for text under 24px, 3 for large text and non-text UI (WCAG 2.2 1.4.3 / 1.4.11). */
  readonly min: 3 | 4.5;
  readonly where: string;
};

export type MeasuredPair = ContrastPair & {
  readonly ratio: number;
  readonly fgHex: string;
  readonly bgHex: string;
};

function measure(pair: ContrastPair): MeasuredPair | null {
  const fg = resolveColor(pair.fg);
  const bg = resolveColor(pair.bg);
  if (!fg || !bg) return null;
  const painted: Rgb = pair.fgAlpha === undefined ? fg : composite(fg, bg, pair.fgAlpha);
  return {
    ...pair,
    ratio: contrastRatio(painted, bg),
    fgHex: toHex(painted),
    bgHex: toHex(bg),
  };
}

export function useContrastRows(
  pairs: readonly ContrastPair[],
): readonly MeasuredPair[] | null {
  const getSnapshot = useCallback(
    () =>
      cached("contrast", () =>
        pairs.map(measure).filter((row): row is MeasuredPair => row !== null),
      ),
    [pairs],
  );
  return useSyncExternalStore(subscribe, getSnapshot, onServer);
}
