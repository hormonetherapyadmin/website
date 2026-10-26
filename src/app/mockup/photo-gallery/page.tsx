import type { Metadata } from "next";
import type { RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { PhotoGallery, type GalleryPair } from "@/slices/PhotoGallery";
import type { GalleryShot } from "@/slices/PhotoGallery/lightbox";
import { MockupShell } from "../_shared/mockup-shell";
import { Reason } from "../proposed/reason";

export const metadata: Metadata = {
  title: "Photo gallery",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const empty = [] as RichTextField;

function section(heading: string): SliceSectionFields {
  return {
    small_heading: empty,
    heading: rich(heading),
    intro: empty,
    background: "Transparent",
    space_above: "Medium",
    space_below: "None",
  };
}

const STORY: GalleryShot[] = [
  {
    src: "/mockup/proposed/hair-thin.jpg",
    alt: "Peggy, before she started wearing alternative hair",
    width: 815,
    height: 1400,
    caption: "Before alternative hair",
  },
  {
    src: "/mockup/proposed/hair-topper.jpg",
    alt: "Peggy wearing a hair topper",
    width: 1136,
    height: 1400,
    caption: "With a topper",
  },
  {
    src: "/mockup/proposed/hair-shaved.jpg",
    alt: "Peggy with a shaved head",
    width: 1377,
    height: 1400,
    caption: "Me today, no wig",
  },
];

const WIGS: GalleryShot[] = [
  {
    src: "/mockup/proposed/wig-portrait.jpg",
    alt: "Peggy in the Raquel Welch Portrait Mode wig, Shaded Biscuit",
    width: 1353,
    height: 1400,
    caption: "Raquel Welch - Portrait Mode",
    line: "Color: RL 19/23SS (Shaded Biscuit)",
  },
  {
    src: "/mockup/proposed/wig-directors.jpg",
    alt: "Peggy in the Raquel Welch Director's Pick wig, Shaded Biscuit",
    width: 1400,
    height: 1050,
    caption: "Raquel Welch - Director's Pick",
    line: "Color: RL 19/23SS (Shaded Biscuit)",
  },
  {
    src: "/mockup/proposed/wig-flirt.jpg",
    alt: "Peggy in the Raquel Welch Flirt Alert wig, Shaded Biscuit",
    width: 1353,
    height: 1400,
    caption: "Raquel Welch - Flirt Alert",
    line: "Color: RL 19/23SS (Shaded Biscuit)",
  },
  {
    src: "/mockup/proposed/wig-julianne.jpg",
    alt: "Peggy in the Jon Reneau Julianne Lite wig, Palm Springs Blonde",
    width: 1166,
    height: 1400,
    caption: "Jon Reneau - Julianne Lite",
    line: "Color: FS17/101S18 (Palm Springs Blonde)",
  },
];

const MEN: GalleryShot[] = [
  {
    src: "/mockup/proposed/men-1.jpg",
    alt: "Peggy, a photo from the men's HRT page",
    width: 1211,
    height: 1400,
    caption: "From the page",
  },
  {
    src: "/mockup/proposed/men-2.jpg",
    alt: "Peggy, a second photo from the men's HRT page",
    width: 1225,
    height: 1400,
    caption: "From the page",
  },
  {
    src: "/mockup/proposed/men-3.jpg",
    alt: "Peggy, a third photo from the men's HRT page",
    width: 1168,
    height: 1400,
    caption: "From the page",
  },
];

function pair(
  href: string,
  before: GalleryShot,
  after: GalleryShot,
): GalleryPair {
  return {
    before: { ...before, caption: "Before" },
    after: { ...after, caption: "After" },
    href,
    linkLabel: "Read the review",
  };
}

export default async function PhotoGalleryMockup(
  props: PageProps<"/mockup/photo-gallery">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <Reason title="Photo gallery">
        <p>
          Click a photo and it opens in the same dark frame as a YouTube video.
          Close it with Escape, the close button, or the dark area around it.
          The before-and-after photos open the same way. “Read the review” under
          each pair is the link to her post. Two wig names on the page, Simmer
          Elite and Kelly, had no photo I could match, so they are not in this
          row. The men’s photos are the three on that page. The files are not
          labeled, so the captions do not guess which moment each one is.
        </p>
      </Reason>
      <PhotoGallery
        primary={section("Get your Confidence Back!")}
        photos={STORY}
      />
      <PhotoGallery
        primary={section("Some of my favorite Wigs!")}
        photos={WIGS}
      />
      <PhotoGallery
        primary={section("Menopause SkinCare")}
        photos={[
          {
            src: "/mockup/proposed/skin-inner-balance.jpg",
            alt: "Peggy with the Inner Balance face cream",
            width: 745,
            height: 1400,
            caption: "Inner Balance",
            href: "/inner-balance",
            linkLabel: "Inner Balance page",
          },
        ]}
      />
      <PhotoGallery
        variation="pair"
        primary={section("Alloy M4 Estriol Face Cream")}
        pair={pair(
          "/post/alloy-m4-face-cream-review",
          {
            src: "/mockup/proposed/skin-alloy-before.jpg",
            alt: "Peggy before Alloy M4 face cream",
            width: 1047,
            height: 1400,
            caption: "Before",
          },
          {
            src: "/mockup/proposed/skin-alloy-after.jpg",
            alt: "Peggy after Alloy M4 face cream",
            width: 957,
            height: 1400,
            caption: "After",
          },
        )}
      />
      <PhotoGallery
        variation="pair"
        primary={section("Winona Estriol Skin Cream")}
        pair={pair(
          "/post/winona-estriol-cream-with-tretinoin-review",
          {
            src: "/mockup/proposed/skin-winona-before.jpg",
            alt: "Peggy before Winona estriol cream",
            width: 1152,
            height: 1400,
            caption: "Before",
          },
          {
            src: "/mockup/proposed/skin-winona-after.jpg",
            alt: "Peggy after Winona estriol cream",
            width: 1400,
            height: 1210,
            caption: "After",
          },
        )}
      />
      <PhotoGallery
        primary={section("Get your Confidence Back!")}
        photos={MEN}
      />
    </MockupShell>
  );
}
