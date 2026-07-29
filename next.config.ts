import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This project lives inside a directory that has its own lockfile. Without an
  // explicit root, Turbopack infers the parent and warns on every dev/build.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  images: {
    // Next 16 requires an allowlist; anything not listed falls back to 75
    // without warning. 85 is the quality the hero and the card thumbnails ask
    // for. Revisit the trade-off in Phase 8.
    qualities: [85],
  },
};

export default nextConfig;
