import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-prose px-6 py-24">
      <h1 className="text-4xl">Page not found</h1>
      <p className="mt-4 text-text-muted">
        This page doesn&apos;t exist or has moved.{" "}
        <Link href="/" className="text-accent underline">
          Go to the homepage
        </Link>
        .
      </p>
    </div>
  );
}
