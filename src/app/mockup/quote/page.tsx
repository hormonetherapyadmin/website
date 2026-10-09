import type { Metadata } from "next";
import type { LinkField, RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { Quote } from "@/slices/quote";

export const metadata: Metadata = {
  title: "Quote",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;

function section(): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: rich("Peggy’s take: what I’m using now"),
    intro: emptyRich,
    link: { link_type: "Any" },
    background: "Dark",
    space_above: "None",
    space_below: "None",
  };
}

export default function QuotePreview() {
  return (
    <Quote
      primary={{
        ...section(),
        quote: rich(
          "No night sweats, hot flashes or brain fog, and the one big difference I notice with Oestra is my sleep. I go to sleep faster and stay asleep longer on this HRT, more so than any of the others.",
        ),
        name: "Oestra by Inner Balance",
        text: rich(
          "I only need the one product, where with other HRT regimens I was prescribed two or three. It’s $199 a month for the first six months, then $99 a month from month seven.",
        ),
        reminder: rich("This is my personal experience, not medical advice."),
        review_button: {
          link_type: "Web",
          url: "/post/oestra-by-inner-balance-my-honest-1-year-review",
          text: "Read my 1-year Oestra review",
        } as LinkField,
      }}
      clinic={{
        name: "Inner Balance",
        logo: { src: "/mockup/logos/inner-balance.png" },
        visitHref: "#affiliate-link",
        visitText: "Visit Inner Balance",
        newTab: true,
      }}
    />
  );
}
