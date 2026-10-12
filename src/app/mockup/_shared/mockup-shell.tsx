import type { ReactNode } from "react";
import { Besley, Newsreader, Young_Serif } from "next/font/google";
import { SiteFrame } from "@/components/site-frame";
import styles from "./mockup.module.css";

/*
  Header and footer shared by the design mockups.
  Palettes and heading fonts stay available through ?palette= and ?serif=
  for the brand designer. The footer does not show that switcher.
  Public pages use SiteShell, which does not read the address.
*/

export const AFFILIATE_REL = "sponsored nofollow noopener noreferrer";
export { DISCLOSURE_HREF } from "@/lib/site";

const besley = Besley({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--mock-serif-besley",
});

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--mock-serif-young",
  preload: false,
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--mock-serif-newsreader",
  preload: false,
});

const PALETTES = {
  raspberry: {
    label: "Navy & raspberry",
    className: styles.paletteNavyRaspberry,
  },
  navy: { label: "Navy & poppy", className: styles.paletteNavy },
  garden: { label: "Sage & raspberry", className: styles.paletteGarden },
  paper: { label: "Newsprint & marigold", className: styles.palettePaper },
};

const SERIFS = {
  besley: { label: "Besley", className: styles.serifBesley },
  young: { label: "Young Serif", className: styles.serifYoung },
  newsreader: { label: "Newsreader", className: styles.serifNewsreader },
};

type PaletteKey = keyof typeof PALETTES;
type SerifKey = keyof typeof SERIFS;
type SearchParams = Record<string, string | string[] | undefined>;

function pick<T extends string>(
  value: unknown,
  options: Record<T, unknown>,
  fallback: T,
): T {
  return typeof value === "string" && value in options
    ? (value as T)
    : fallback;
}

export function MockupShell({
  searchParams,
  children,
}: {
  searchParams: SearchParams;
  children: ReactNode;
}) {
  const palette = pick<PaletteKey>(searchParams.palette, PALETTES, "raspberry");
  const serif = pick<SerifKey>(searchParams.serif, SERIFS, "besley");

  const className = [
    PALETTES[palette].className,
    SERIFS[serif].className,
    besley.variable,
    youngSerif.variable,
    newsreader.variable,
  ].join(" ");

  return (
    <SiteFrame className={className} palette={palette}>
      {children}
    </SiteFrame>
  );
}
