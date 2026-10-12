import { SITE_NAME, SITE_URL } from "@/lib/site";

/*
  schema.org JSON-LD for the public pages. Each value here is something
  the page also shows. See docs/SEO_AEO_GEO.md, Structured Data.
*/

const CONTEXT = "https://schema.org";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export type OrganizationNode = {
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
};

export type WebSiteNode = {
  "@type": "WebSite";
  "@id": string;
  name: string;
  url: string;
  publisher: { "@id": string };
};

export type PersonNode = {
  "@type": "Person";
  name: string;
  description?: string;
  url?: string;
  image?: string;
};

export type ImageObjectNode = {
  "@type": "ImageObject";
  url: string;
  width?: number;
  height?: number;
};

export type BlogPostingNode = {
  "@type": "BlogPosting";
  "@id": string;
  url: string;
  mainEntityOfPage: { "@type": "WebPage"; "@id": string };
  headline: string;
  description?: string;
  datePublished?: string;
  image?: ImageObjectNode;
  author: PersonNode;
  publisher: OrganizationNode;
  isPartOf: { "@id": string };
  articleSection?: string;
  keywords?: string[];
  inLanguage: "en";
};

export type BreadcrumbListNode = {
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }[];
};

export type StructuredNode =
  OrganizationNode | WebSiteNode | BlogPostingNode | BreadcrumbListNode;

export type StructuredData = {
  "@context": typeof CONTEXT;
  "@graph": StructuredNode[];
};

/** A site path, such as `/post/x`, on the canonical origin. */
export function absoluteUrl(path: string) {
  if (path === "/") return SITE_URL;
  return new URL(path, SITE_URL).toString();
}

export function graph(...nodes: StructuredNode[]): StructuredData {
  return { "@context": CONTEXT, "@graph": nodes };
}

export function organization(): OrganizationNode {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function website(): WebSiteNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function person(input: {
  name: string;
  description?: string;
  path?: string;
  image?: string | null;
}): PersonNode {
  return {
    "@type": "Person",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.path ? { url: absoluteUrl(input.path) } : {}),
    ...(input.image ? { image: input.image } : {}),
  };
}

export function blogPosting(input: {
  path: string;
  headline: string;
  description?: string;
  datePublished?: string | null;
  image?: { url: string; width?: number; height?: number } | null;
  author: PersonNode;
  category?: string | null;
  tags?: readonly string[];
}): BlogPostingNode {
  const url = absoluteUrl(input.path);
  const tags = input.tags?.filter((tag) => tag.trim()) ?? [];

  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.image?.url
      ? {
          image: {
            "@type": "ImageObject",
            url: input.image.url,
            ...(input.image.width ? { width: input.image.width } : {}),
            ...(input.image.height ? { height: input.image.height } : {}),
          },
        }
      : {}),
    author: input.author,
    publisher: organization(),
    isPartOf: { "@id": WEBSITE_ID },
    ...(input.category ? { articleSection: input.category } : {}),
    ...(tags.length > 0 ? { keywords: tags } : {}),
    inLanguage: "en",
  };
}

/** The visible breadcrumb trail. The last crumb is the current page. */
export function breadcrumbList(
  crumbs: readonly { name: string; path?: string }[],
): BreadcrumbListNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
    })),
  };
}

/** JSON for a `<script type="application/ld+json">`, safe inside HTML. */
export function serializeStructuredData(data: StructuredData) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
