import type { Metadata } from "next";
import type { LinkField, RichTextField } from "@prismicio/client";
import { StartHere } from "@/slices/start_here";
import type { SliceSectionFields } from "@/components/slice-section";

export const metadata: Metadata = {
  title: "Start here slice",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;

const ICONS = ["Question", "Lightbulb", "Medicine", "Wallet"] as const;

const SAMPLES = [
  {
    small_heading: "Brand new to this",
    heading: "Is HRT for me?",
    text: "Perimenopause, menopause, and whether hormone therapy is worth asking about.",
    href: "/ishrtforme",
  },
  {
    small_heading: "Ready to pick a clinic",
    heading: "Providers",
    text: "What are the important features when looking for an online provider?",
    href: "/tipstofindprovider",
  },
  {
    small_heading: "Weighing your options",
    heading: "Formulations",
    text: "What formulations are available, and how will a doctor personalize them?",
    href: "/formuations",
  },
  {
    small_heading: "Watching the budget",
    heading: "Cost & insurance",
    text: "Will therapy be covered, and can an HSA card be used?",
    href: "/costandinsurance",
  },
  {
    small_heading: "Comparing clinics",
    heading: "Side by side",
    text: "The prices Peggy actually paid, in one chart.",
    href: "/hrt-price-comparison-chart",
  },
  {
    small_heading: "A longer path",
    heading: "Weight and HRT",
    text: "How hormone therapy and weight showed up in Peggy's own care.",
    href: "/copy-of-weight-gain",
  },
];

function section(): SliceSectionFields[] {
  return [
    {
      small_heading: emptyRich,
      heading: rich("Where should I start?"),
      intro: emptyRich,
      link: emptyLink,
      background: "Same as the page",
      space_above: "Medium",
      space_below: "None",
    },
  ];
}

function cards(count: number) {
  return SAMPLES.slice(0, count).map((sample, index) => ({
    small_heading: rich(sample.small_heading),
    heading: rich(sample.heading),
    text: rich(sample.text),
    link: { link_type: "Web", url: sample.href } as LinkField,
    icon: ICONS[index % ICONS.length],
  }));
}

export default function StartHerePreview() {
  return (
    <main>
      {[1, 2, 3, 4, 5, 6].map((count) => (
        <div key={count}>
          <p className="mx-auto w-full max-w-wrap px-gutter pt-10 text-sm text-text-muted">
            {count} {count === 1 ? "card" : "cards"}
          </p>
          <StartHere primary={{ section: section(), cards: cards(count) }} />
        </div>
      ))}
    </main>
  );
}
