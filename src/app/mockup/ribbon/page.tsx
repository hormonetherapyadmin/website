import type { Metadata } from "next";
import type { LinkField, RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { Ribbon } from "@/slices/Ribbon";

export const metadata: Metadata = {
  title: "Ribbon slice",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyRich = [] as RichTextField;
const emptyLink = { link_type: "Any" } as LinkField;

function section(
  overrides: Partial<SliceSectionFields> = {},
): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: emptyRich,
    intro: emptyRich,
    link: emptyLink,
    background: "Transparent",
    space_above: "None",
    space_below: "None",
    ...overrides,
  };
}

const button = (
  text: string,
  url: string,
  variant: "Solid" | "Ghost" = "Solid",
): LinkField =>
  ({
    link_type: "Web",
    url,
    text,
    variant,
  }) as LinkField;

const templateCopy =
  "The comparison chart includes Midi Health too. Midi doesn’t pay me a commission, and I was a patient there as well.";

export default function RibbonPreview() {
  return (
    <main>
      <Ribbon
        primary={{
          ...section(),
          title: rich("Still lining the prices up?"),
          content: rich(templateCopy),
          box_background: "Pink",
          button: [
            button("Open the price chart", "/hrt-price-comparison-chart"),
            button("Tips for choosing", "/tipstofindprovider", "Ghost"),
          ],
        }}
      />
      <Ribbon
        primary={{
          ...section({ background: "Cream", space_above: "Medium" }),
          title: rich("Same ribbon, cream behind it"),
          content: rich(templateCopy),
          box_background: "Navy",
          button: [
            button("Open the price chart", "/hrt-price-comparison-chart"),
            button("Tips for choosing", "/tipstofindprovider", "Ghost"),
          ],
        }}
      />
      <Ribbon
        primary={{
          ...section({
            heading: rich("A heading above the box"),
            background: "Blue",
            space_above: "Medium",
          }),
          title: rich("Yellow box on a blue band"),
          content: rich(templateCopy),
          box_background: "Yellow",
          button: [
            button("Open the price chart", "/hrt-price-comparison-chart"),
          ],
        }}
      />
      <Ribbon
        primary={{
          ...section({ background: "Transparent", space_above: "Medium" }),
          title: rich("Raspberry box, light text"),
          content: rich(templateCopy),
          box_background: "Raspberry",
          button: [button("Tips for choosing", "/tipstofindprovider", "Ghost")],
        }}
      />
    </main>
  );
}
