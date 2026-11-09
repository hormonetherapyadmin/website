import type { Metadata } from "next";
import { Besley } from "next/font/google";
import { PrismicPreview } from "@prismicio/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { repositoryName } from "@/prismicio";
import "./globals.css";

const besley = Besley({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-besley",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={besley.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="describedby" href={`${SITE_URL}/llms.txt`} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={SITE_NAME}
          href={`${SITE_URL}/blog-feed.xml`}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded-control focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to main content
        </a>
        <main id="main">{children}</main>
        <SpeedInsights />
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
