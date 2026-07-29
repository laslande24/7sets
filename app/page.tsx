import Link from "next/link";

export default function Home() {
  return (
    <main className="px-gutter py-24">
      <h1 className="text-display-lg">7SETS</h1>
      <p className="mt-4 text-body text-ink/70">
        Phase 1 — design system. The hero is built in Phase 2.
      </p>
      <p className="mt-6">
        <Link
          href="/styleguide"
          className="rounded-xs text-label uppercase underline underline-offset-4 focus-visible:focus-ring"
        >
          Styleguide
        </Link>
      </p>
    </main>
  );
}
