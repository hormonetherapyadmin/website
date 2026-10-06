import { SITE_NAME } from "@/lib/site";

// Placeholder shell for Phase 0. Replaced by the Prismic-driven homepage.
export default function HomePage() {
  return (
    <div className="mx-auto max-w-prose px-6 py-24">
      <h1 className="text-4xl">{SITE_NAME}</h1>
      <p className="mt-4 text-text-muted">The new site is being built.</p>
    </div>
  );
}
