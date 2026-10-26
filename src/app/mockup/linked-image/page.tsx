import type { Metadata } from "next";
import type { RichTextField } from "@prismicio/client";
import { SideBySide } from "@/slices/side_by_side";
import { MockupShell } from "../_shared/mockup-shell";
import { Reason } from "../proposed/reason";

export const metadata: Metadata = {
  title: "Side by side",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

export default async function LinkedPhotoMockup(
  props: PageProps<"/mockup/linked-image">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <Reason title="Side by side">
        <p>
          The vial does not need its own slice. Side by side already puts a
          photo beside the writing. This adds a link on that photo. The sample
          opens the Joi page. On the weight page the link would be the visit
          already stored on the Joi brand, so the address stays in one place.
          The weight page has no paragraph beside the vial, so this column is
          only the heading. The caption sits under the photo.
        </p>
      </Reason>
      <SideBySide
        variation="image"
        imageHref="/joiwommenswellness"
        image={{
          src: "/mockup/pages/weight-vial.jpg",
          alt: "A vial and an orange syringe on a counter",
        }}
        primary={{
          heading: rich(
            "GLP-1 & GIP-1 Meds can be very beneficial to add to your HRT Regimen for Stubborn Weight Loss",
          ),
          caption: rich("Joi + Blokes"),
          caption_on_photo: false,
          side: "Media right",
          background: "Transparent",
          space_above: "Medium",
          space_below: "Large",
        }}
      />
    </MockupShell>
  );
}
