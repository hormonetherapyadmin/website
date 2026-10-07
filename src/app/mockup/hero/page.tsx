import type { Metadata } from "next";
import type { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { Hero } from "@/slices/hero";
import type { SliceSectionFields } from "@/components/slice-section";

export const metadata: Metadata = {
  title: "Hero slice",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;

function image(
  url: string,
  alt: string,
  width = 800,
  height = 800,
): ImageField {
  return {
    id: url,
    url,
    alt,
    copyright: null,
    dimensions: { width, height },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  };
}

function section(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields[] {
  return [
    {
      small_heading: emptyRich,
      heading: emptyRich,
      intro: emptyRich,
      link: emptyLink,
      background: null,
      space_above: "None",
      space_below: null,
      ...overrides,
    },
  ];
}

const logos = [
  ["Winona", "/mockup/logos/winona.png", "#winona"],
  ["Joi", "/mockup/logos/joi.png", "#joi"],
  ["Musely", "/mockup/logos/musely.png", "#musely"],
  ["Inner Balance", "/mockup/logos/inner-balance.png", "#inner-balance"],
  ["Alloy", "/mockup/logos/alloy.png", "#alloy"],
  ["Effecty", "/mockup/logos/effecty.png", "#effecty"],
  ["MyMenopauseRx", "/mockup/logos/mymenopauserx.png", "#mymenopauserx"],
] as const;

export default function HeroPreview() {
  return (
    <>
      <Hero
        variation="home"
        primary={{
          section: section({
            heading: rich("Hormone Therapy Replacement"),
            intro: rich(
              "My goal is to share honest platform reviews, pricing breakdowns, and practical patient insights so you can have more informed, confident conversations with your own prescribing doctor.",
            ),
          }),
          tagline: rich("Feel like you again."),
          benefits: [
            {
              link_type: "Web",
              url: "/copy-of-weight-gain",
              text: "Lose weight",
            },
            {
              link_type: "Web",
              url: "/ishrtforme",
              text: "Enhance mood and mental clarity",
            },
            {
              link_type: "Web",
              url: "/post/why-do-i-wake-up-hot-and-sweaty",
              text: "Diminish hot flashes/night sweats",
            },
            { link_type: "Web", url: "/ishrtforme", text: "Boost energy" },
            { link_type: "Web", url: "/sleep", text: "Improve sleep" },
          ],
          button: [
            {
              link_type: "Web",
              url: "#eight-online-hrt-clinics-side-by-side",
              text: "See what each clinic cost me",
              variant: "Solid",
            },
            {
              link_type: "Web",
              url: "/ishrtforme",
              text: "New to HRT? Start here",
              variant: "Ghost",
            },
          ],
          trust_lines: [
            { text: "Patient since 2019" },
            { text: "9+ telehealth platforms tested" },
            { text: "Independent & self-funded" },
          ],
          image: image(
            "/mockup/peggy-portrait.jpg",
            "Peggy, smiling, in a dark sweater",
            1389,
            1600,
          ),
          photo_greeting: "Hi, I’m Peggy!",
          caption: rich("An experienced HRT patient reviewer. Not a doctor."),
        }}
      />
      <Hero
        variation="subpage"
        primary={{
          section: section({
            small_heading: rich("Providers"),
            heading: rich("Trusted providers"),
            intro: rich(
              "Seven telehealth clinics I’ve been a patient at, and the specialty each one was best at for me.",
            ),
            link: {
              link_type: "Web",
              url: "/hrt-price-comparison-chart",
              text: "Full price chart",
            },
            background: null,
          }),
          clinics: logos.map(([name, url, href]) => ({
            clinic: { data: { name, logo: image(url, "") } },
            link: { link_type: "Web", url: href } as LinkField,
          })),
        }}
      />
      <Hero
        variation="provider"
        primary={{
          section: section(),
          clinic: {
            data: {
              name: "Inner Balance",
              formulation: "Oestra",
              logo: image("/mockup/logos/inner-balance.png", ""),
              top_choice_label: "My 2026 top choice",
              display_price: "199",
              display_price_note: "First six months, then $99.",
              visit: {
                link_type: "Web",
                url: "https://example.com",
                text: "Visit Inner Balance",
                target: "_blank",
              },
              offer: {
                data: {
                  code: "PEGGY10",
                  display_copy: rich("10% off your first order"),
                },
              },
            },
          },
          voted: rich("Voted best for sleep"),
          quote: rich(
            "No night sweats, hot flashes or brain fog, and the one big difference I notice with Oestra is my sleep. I go to sleep faster and stay asleep longer on this HRT, more so than any of the others.",
          ),
          links: [
            { link_type: "Web", url: "/post/oestra", text: "My 1-year review" },
            {
              link_type: "Web",
              url: "/post/inner-balance-hrt-review",
              text: "HRT review",
            },
            {
              link_type: "Web",
              url: "https://youtu.be/PuAekNT9ZvA",
              text: "Watch my review",
              target: "_blank",
            },
          ],
          product: image(
            "/mockup/products/oestra_rnieuz.webp",
            "Oestra cream jar",
          ),
        }}
      />
    </>
  );
}
