import type { Metadata } from "next";
import type { RichTextField } from "@prismicio/client";
import { RichText } from "@/components/rich-text";
import {
  SECTION_BACKGROUNDS,
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";

export const metadata: Metadata = {
  title: "Shared slice components",
  robots: { index: false, follow: false },
};

const text = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const empty = [] as RichTextField;

const section = (
  overrides: Partial<SliceSectionFields>,
): SliceSectionFields => ({
  small_heading: empty,
  heading: empty,
  intro: empty,
  link: { link_type: "Any" },
  background: null,
  space_above: null,
  space_below: null,
  ...overrides,
});

const story = [
  {
    type: "heading2",
    text: "What estrogen does",
    spans: [],
  },
  {
    type: "paragraph",
    text: "A clear difference showed up in my sleep, source 1.",
    spans: [
      { type: "label", start: 2, end: 7, data: { label: "highlight" } },
      { type: "label", start: 49, end: 50, data: { label: "superscript" } },
    ],
  },
  {
    type: "list-item",
    text: "I fall asleep faster.",
    spans: [],
  },
] as RichTextField;

export default function SharedComponentsPreview() {
  return (
    <>
      <SliceSection
        headingLevel="h1"
        section={section({
          heading: text("Hormone Therapy Replacement"),
          intro: text(
            "My goal is to share honest platform reviews, pricing breakdowns, and practical patient insights.",
          ),
          space_above: "None",
        })}
      />
      <SliceSection
        section={section({
          heading: text("Latest reviews and posts"),
          link: { link_type: "Web", url: "/blog", text: "All posts" },
          space_above: "Small",
        })}
      >
        <p className="text-text-muted">The first post is the large card.</p>
      </SliceSection>
      <SliceSection
        section={section({
          heading: text("Eight online HRT clinics, side by side"),
          intro: text(
            "I paid out of pocket with my HSA card, or through my prescription insurance when I could.",
          ),
          background: "Blue",
        })}
      />
      <SliceSection
        section={section({
          small_heading: text("Peggy’s take"),
          heading: text("What I’m using now"),
          background: "Navy",
          space_above: "None",
        })}
      >
        <RichText field={story} />
      </SliceSection>
      {SECTION_BACKGROUNDS.map((background) => (
        <SliceSection
          key={background}
          section={section({
            small_heading: text("Background"),
            heading: text(background),
            link: { link_type: "Web", url: "/blog", text: "All posts" },
            background,
            space_above: "None",
          })}
        >
          <RichText field={story} />
        </SliceSection>
      ))}
    </>
  );
}
