import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This project lives inside a directory that has its own lockfile. Without an
  // explicit root, Turbopack infers the parent and warns on every dev/build.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
