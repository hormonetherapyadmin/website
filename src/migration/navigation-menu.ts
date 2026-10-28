// The header and footer Peggy edits on the Navigation document.
// Archived pages stay off the menu. Links are documents, so an address
// follows the page. Icons are left empty for Peggy to upload.

export type MenuPage = { id: string; uid: string };

export type MenuLink = {
  label?: string;
  pageUid?: string;
  /** When the page is still published under an older uid. */
  legacyUid?: string;
  providerId?: string;
  providerUid?: string;
  columnHeading?: string;
};

export type MenuItem = {
  label: string;
  pageUid?: string;
  legacyUid?: string;
  links?: MenuLink[];
};

export type FooterColumnPlan = {
  heading: string;
  links: MenuLink[];
};

const hrt101: MenuLink[] = [
  { label: "Is HRT for me?", pageUid: "ishrtforme" },
  { label: "Formulations", pageUid: "formuations" },
  { label: "Cost & insurance", pageUid: "costandinsurance" },
  { label: "Test kits", pageUid: "trackers-and-testing" },
  { label: "FAQ", pageUid: "faq" },
];

const symptoms: MenuLink[] = [
  {
    label: "Weight & HRT",
    pageUid: "weight-gain",
    legacyUid: "copy-of-weight-gain",
  },
  { label: "Rx face creams", pageUid: "skincare" },
];

const compare: MenuLink[] = [
  {
    label: "Price comparison chart",
    pageUid: "hrt-price-comparison-chart",
    columnHeading: "Compare & choose",
  },
  { label: "Tips to find a provider", pageUid: "tipstofindprovider" },
  { label: "Trusted providers", pageUid: "trusted-providers" },
];

const reviews: MenuLink[] = [
  {
    providerId: "asf4zhEAAC4AYFel",
    providerUid: "inner-balance",
    pageUid: "inner-balance",
    columnHeading: "My reviews",
  },
  {
    providerId: "asvI_BcAADMAeME-",
    providerUid: "winona",
    pageUid: "winona-review-page",
  },
  { providerId: "asz2AxcAADAAeqH0", providerUid: "musely", pageUid: "musely" },
  {
    providerId: "asz9cxcAADEAer1m",
    providerUid: "alloy",
    pageUid: "alloy-review-page",
  },
  {
    providerId: "asvUERcAAC0AeNI_",
    providerUid: "joi",
    pageUid: "joiwommenswellness",
  },
  {
    providerId: "asz-gRcAADMAesHD",
    providerUid: "effecty",
    pageUid: "effecty",
  },
  {
    providerId: "as0AwRcAADMAeslp",
    providerUid: "menorx",
    pageUid: "mymenopauserx",
  },
  {
    providerId: "as0CfhcAADIAes6P",
    providerUid: "midi",
    pageUid: "midi-health-review-page",
  },
];

export const NAVIGATION_MENU = {
  button: { label: "Trusted providers", pageUid: "trusted-providers" },
  main: [
    { label: "HRT 101", links: hrt101 },
    { label: "Symptoms", links: symptoms },
    { label: "Providers", links: [...compare, ...reviews] },
    { label: "Blog", pageUid: "blog" },
  ] satisfies MenuItem[],
  footer: [
    { heading: "HRT 101", links: hrt101 },
    { heading: "Symptoms", links: symptoms },
    {
      heading: "Providers",
      links: compare.map(({ columnHeading: _heading, ...link }) => link),
    },
    {
      heading: "About",
      links: [
        { label: "About Peggy", pageUid: "about" },
        { label: "How I review", pageUid: "how-i-review" },
        { label: "Blog", pageUid: "blog" },
      ],
    },
  ] satisfies FooterColumnPlan[],
};

type BuiltPageLink = {
  link_type: "Document";
  id: string;
  type: "page";
  uid: string;
  url: string;
};

type BuiltMenuLink = {
  label?: string;
  link: BuiltPageLink;
  clinic?: {
    link_type: "Document";
    id: string;
    type: "provider";
    uid: string | undefined;
  };
  column_heading?: string;
};

type BuiltMainItem = {
  label: string;
  link?: BuiltPageLink;
  links?: BuiltMenuLink[];
};

function pageDocument(
  link: MenuLink,
  pages: ReadonlyMap<string, MenuPage>,
): BuiltPageLink {
  const uid = link.pageUid;
  if (!uid) throw new Error("A menu link has no page");
  const page =
    pages.get(uid) ?? (link.legacyUid ? pages.get(link.legacyUid) : undefined);
  if (!page) throw new Error(`No published page for /${uid}`);
  return {
    link_type: "Document" as const,
    id: page.id,
    type: "page" as const,
    uid: page.uid,
    url: `/${page.uid}`,
  };
}

function linkFields(
  link: MenuLink,
  pages: ReadonlyMap<string, MenuPage>,
): BuiltMenuLink {
  return {
    ...(link.label ? { label: link.label } : {}),
    link: pageDocument(link, pages),
    ...(link.providerId
      ? {
          clinic: {
            link_type: "Document" as const,
            id: link.providerId,
            type: "provider" as const,
            uid: link.providerUid,
          },
        }
      : {}),
    ...(link.columnHeading ? { column_heading: link.columnHeading } : {}),
  };
}

export function navigationData(pages: ReadonlyMap<string, MenuPage>) {
  return {
    header_button_label: NAVIGATION_MENU.button.label,
    header_button_link: pageDocument(NAVIGATION_MENU.button, pages),
    main_items: NAVIGATION_MENU.main.map((item): BuiltMainItem => ({
      label: item.label,
      ...(item.pageUid
        ? { link: pageDocument(item, pages) }
        : { links: (item.links ?? []).map((link) => linkFields(link, pages)) }),
    })),
    footer_columns: NAVIGATION_MENU.footer.map((column) => ({
      heading: column.heading,
      links: column.links.map((link) => linkFields(link, pages)),
    })),
  };
}
