import { CLINICS } from "./clinics";
import type { FooterColumn, NavItem, NavLink } from "@/lib/navigation";

/*
  Design stand-in used until a Navigation document is published.
  After that, the header and footer come from Prismic.
*/

const HRT_101_LINKS: NavLink[] = [
  { label: "Is HRT for me?", href: "/ishrtforme", icon: "Question" },
  { label: "Formulations", href: "/formuations", icon: "Medicine" },
  { label: "Cost & insurance", href: "/costandinsurance", icon: "Wallet" },
  { label: "Test kits", href: "/trackersandtesting", icon: "Test tube" },
  { label: "Men’s HRT", href: "/men-s-hrt", icon: "Person" },
  { label: "FAQ", href: "/faq", icon: "Chat" },
];

const SYMPTOM_LINKS: NavLink[] = [
  { label: "Weight & HRT", href: "/copy-of-weight-gain", icon: "Scale" },
  { label: "Sleep", href: "/sleep", icon: "Moon" },
  { label: "Hair loss", href: "/hair-loss", icon: "Hair" },
  { label: "Rx face creams", href: "/skincare", icon: "Drop" },
];

const COMPARE_LINKS: NavLink[] = [
  {
    label: "Price comparison chart",
    href: "/hrt-price-comparison-chart",
    icon: "Chart",
  },
  {
    label: "Tips to find a provider",
    href: "/tipstofindprovider",
    icon: "Idea",
  },
  {
    label: "Trusted providers",
    href: "/mockup/trusted-providers",
    icon: "Shield",
  },
];

export const FALLBACK_HEADER_BUTTON: NavLink = {
  label: "Trusted providers",
  href: "/mockup/trusted-providers",
  icon: "Shield",
};

export const FALLBACK_NAV: NavItem[] = [
  { label: "HRT 101", columns: [{ links: HRT_101_LINKS }] },
  { label: "Symptoms", columns: [{ links: SYMPTOM_LINKS }] },
  {
    label: "Providers",
    columns: [
      { heading: "Compare & choose", links: COMPARE_LINKS },
      {
        heading: "My reviews",
        links: CLINICS.map((clinic) => ({
          label: clinic.name,
          href: clinic.reviewHref,
          logo: clinic.logo,
          monogram: clinic.monogram,
        })),
      },
    ],
  },
  { label: "Blog", href: "/blog" },
];

export const FALLBACK_FOOTER: FooterColumn[] = [
  { heading: "HRT 101", links: HRT_101_LINKS },
  { heading: "Symptoms", links: SYMPTOM_LINKS },
  { heading: "Providers", links: COMPARE_LINKS },
  {
    heading: "About",
    links: [
      { label: "About Peggy", href: "/about" },
      { label: "How I review", href: "#" },
      { label: "Affiliate disclosure", href: "/affiliate-disclosures" },
      { label: "Blog", href: "/blog" },
    ],
  },
];
