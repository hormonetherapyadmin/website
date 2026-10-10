import {
  isFilled,
  NotFoundError,
  type ContentRelationshipField,
  type ImageField,
  type LinkField,
} from "@prismicio/client";
import { createClient } from "@/prismicio";

export const NAV_ICON_OPTIONS = [
  "Question",
  "Medicine",
  "Wallet",
  "Test tube",
  "Person",
  "Chat",
  "Scale",
  "Moon",
  "Hair",
  "Drop",
  "Chart",
  "Idea",
  "Shield",
] as const;

export type NavIconName = (typeof NAV_ICON_OPTIONS)[number];

export type NavLink = {
  label: string;
  href: string;
  /** Uploaded icon URL, or a design-preview icon name. */
  icon?: string;
  logo?: string;
  monogram?: string;
  newTab?: boolean;
};

export type NavColumn = {
  heading?: string;
  links: NavLink[];
};

export type NavGroup = {
  label: string;
  columns: NavColumn[];
};

export type NavItem = NavLink | NavGroup;

export type FooterColumn = {
  heading: string;
  links: NavLink[];
};

export type SiteNavigation = {
  main: NavItem[];
  footer: FooterColumn[];
  /** Top-right header button. Absent when the label or link is blank. */
  button?: NavLink;
};

export type NavigationMenuLink = {
  label: string | null;
  link: LinkField;
  clinic?: ContentRelationshipField;
  column_heading?: string | null;
  icon?: ImageField | null;
};

export type NavigationMenuItem = {
  label: string | null;
  link: LinkField;
  links?: readonly NavigationMenuLink[] | null;
};

export type NavigationFooterColumn = {
  heading: string | null;
  links?: readonly NavigationMenuLink[] | null;
};

type BuiltLink = NavLink & { columnHeading?: string };

function text(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function hrefOf(link: LinkField | null | undefined) {
  if (!link || !isFilled.link(link)) return undefined;
  if (link.link_type !== "Document" && link.link_type !== "Web")
    return undefined;
  return link.url || undefined;
}

function opensNewTab(link: LinkField | null | undefined) {
  if (!link || !isFilled.link(link) || !("target" in link)) return false;
  return link.target === "_blank";
}

function imageUrl(value: unknown) {
  if (!value || typeof value !== "object") return undefined;
  const image = value as ImageField;
  if (!isFilled.image(image) || !image.url) return undefined;
  return image.url;
}

function clinicOf(field: ContentRelationshipField | undefined) {
  if (!field || !isFilled.contentRelationship(field)) return undefined;
  const data = field.data;
  if (!data || typeof data !== "object") return { linked: true as const };
  const record = data as { name?: unknown; logo?: unknown };
  const name = typeof record.name === "string" ? text(record.name) : undefined;
  return { linked: true as const, name, logo: imageUrl(record.logo) };
}

function monogram(name: string) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0] ?? "");
  const mark = letters.join("").toUpperCase();
  return mark || undefined;
}

function menuLink(item: NavigationMenuLink): BuiltLink | null {
  const clinic = clinicOf(item.clinic);
  const label = text(item.label) || clinic?.name;
  const href = hrefOf(item.link);
  if (!label || !href) return null;

  const logo = clinic?.logo;
  const built: BuiltLink = { label, href };
  const columnHeading = text(item.column_heading);
  if (columnHeading) built.columnHeading = columnHeading;
  if (opensNewTab(item.link)) built.newTab = true;
  if (logo) built.logo = logo;
  else if (clinic?.linked) built.monogram = monogram(label);
  else {
    const icon = imageUrl(item.icon);
    if (icon) built.icon = icon;
  }
  return built;
}

function columnsFrom(links: readonly NavigationMenuLink[]): NavColumn[] {
  const columns: NavColumn[] = [];

  for (const source of links) {
    const link = menuLink(source);
    if (!link) continue;
    const heading = link.columnHeading;
    const view = toNavLink(link);
    const current = columns[columns.length - 1];
    if (current && current.heading === heading) {
      current.links.push(view);
    } else {
      columns.push(heading ? { heading, links: [view] } : { links: [view] });
    }
  }

  return columns;
}

function toNavLink(link: BuiltLink, includeIcon = true): NavLink {
  const view: NavLink = { label: link.label, href: link.href };
  if (link.newTab) view.newTab = true;
  if (link.logo) view.logo = link.logo;
  if (link.monogram) view.monogram = link.monogram;
  if (includeIcon && link.icon) view.icon = link.icon;
  return view;
}

function footerLinks(links: readonly NavigationMenuLink[] | null | undefined) {
  const items: NavLink[] = [];
  for (const source of links ?? []) {
    const link = menuLink(source);
    if (!link) continue;
    items.push(toNavLink(link, false));
  }
  return items;
}

function headerButtonFrom(data: {
  header_button_label?: string | null;
  header_button_icon?: ImageField | null;
  header_button_link?: LinkField | null;
}): NavLink | undefined {
  const label = text(data.header_button_label);
  const href = hrefOf(data.header_button_link);
  if (!label || !href) return undefined;

  const button: NavLink = { label, href };
  if (opensNewTab(data.header_button_link)) button.newTab = true;
  const icon = imageUrl(data.header_button_icon);
  if (icon) button.icon = icon;
  return button;
}

/** The header and footer menus Peggy edits on the Navigation document. */
export function siteNavigationFrom(data: {
  main_items?: readonly NavigationMenuItem[] | null;
  footer_columns?: readonly NavigationFooterColumn[] | null;
  header_button_label?: string | null;
  header_button_icon?: ImageField | null;
  header_button_link?: LinkField | null;
}): SiteNavigation {
  const main: NavItem[] = [];

  for (const item of data.main_items ?? []) {
    const label = text(item.label);
    if (!label) continue;

    const columns = columnsFrom(item.links ?? []);
    if (columns.length > 0) {
      main.push({ label, columns });
      continue;
    }

    const href = hrefOf(item.link);
    if (!href) continue;
    main.push(
      opensNewTab(item.link) ? { label, href, newTab: true } : { label, href },
    );
  }

  const footer: FooterColumn[] = [];
  for (const column of data.footer_columns ?? []) {
    const heading = text(column.heading);
    const links = footerLinks(column.links);
    if (!heading || links.length === 0) continue;
    footer.push({ heading, links });
  }

  const button = headerButtonFrom(data);
  return button ? { main, footer, button } : { main, footer };
}

/**
 * The published Navigation document, or null when it does not exist yet.
 * A published empty menu is empty. The design menu is only the fallback
 * for a missing document.
 */
export async function loadSiteNavigation(): Promise<SiteNavigation | null> {
  try {
    const document = await createClient().getSingle("navigation", {
      fetchLinks: ["provider.name", "provider.logo"],
    });
    return siteNavigationFrom(document.data);
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
}
