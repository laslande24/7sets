"use client";

import { useTokenText, type TokenKind } from "./useTokens";

/**
 * Prints a token's resolved value, read out of the live cascade. Renders a
 * placeholder until hydration, because the value only exists once there is a
 * document to ask.
 */
export function TokenValue({ cssVar, kind }: { cssVar: string; kind: TokenKind }) {
  const value = useTokenText(cssVar, kind);
  return (
    <code className="font-mono text-caption tracking-normal tabular-nums">
      {value ?? "…"}
    </code>
  );
}
