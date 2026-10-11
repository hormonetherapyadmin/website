import type { Metadata } from "next";
import type { ImageField, LinkField, RichTextField } from "@prismicio/client";
import type { SliceSectionFields } from "@/components/slice-section";
import { Divider } from "@/slices/divider";
import { Hero } from "@/slices/hero";
import { Ribbon } from "@/slices/Ribbon";
import { SideBySide } from "@/slices/side_by_side";
import { MockupShell } from "../_shared/mockup-shell";

/*
  Test kits mockup for the live URL /trackersandtesting, built only from
  page slices. Copy and photos are from that Wix page (October 2026).
  The kit headings, kickers, buttons, and pull quote are layout added
  here. The Amazon links use the shared #affiliate-link placeholder.
*/

export const metadata: Metadata = {
  title: "Test kits mockup",
  robots: { index: false, follow: false },
};

const POST =
  "/post/beyond-standard-blood-work-using-proov-and-mira-tests-for-insights-into-perimenopause";

const emptyRich = [] as RichTextField;

type Span = { start: number; end: number; type: string; data?: object };

function paragraph(text: string, spans: Span[] = []) {
  return { type: "paragraph" as const, text, spans };
}

function rich(text: string) {
  return [paragraph(text)] as unknown as RichTextField;
}

function linked(text: string, phrase: string, url: string) {
  const start = text.indexOf(phrase);
  return paragraph(text, [
    {
      start,
      end: start + phrase.length,
      type: "hyperlink",
      data: { link_type: "Web", url, target: "_blank" },
    },
  ]);
}

function image(
  url: string,
  alt: string,
  width: number,
  height: number,
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
): SliceSectionFields {
  return {
    small_heading: emptyRich,
    heading: emptyRich,
    intro: emptyRich,
    link: { link_type: "Any" },
    background: "Transparent",
    space_above: "Large",
    space_below: "None",
    ...overrides,
  };
}

const button = (
  text: string,
  url: string,
  variant: "Solid" | "Ghost" = "Solid",
  blank = false,
): LinkField =>
  ({
    link_type: "Web",
    url,
    text,
    variant,
    target: blank ? "_blank" : undefined,
  }) as LinkField;

const intro = [
  paragraph(
    "Using at-home perimenopause trackers and hormone test kits empowers you to move from guesswork to data-driven insights. By consistently recording symptoms like night sweats, brain fog, and irregular periods, you create a comprehensive health profile that bridges the gap between how you feel and what your biology is doing. These tools provide a clear window into your endocrine health, helping you determine if your symptoms are related to declining ovarian reserve or other hormonal imbalances.",
  ),
  paragraph(
    "Proactive tracking is the ultimate tool for advocacy in the doctor’s office. When you show up with a detailed log of your basal body temperature, LH surges, or FSH levels from an at-home urine or saliva test, you transform the conversation from “I think something is wrong” to “Here is the evidence of my hormonal shift.”",
  ),
  paragraph(
    "Whether you are looking to start hormone replacement therapy (HRT) or simply want to manage your symptoms through lifestyle and nutrition, starting your journey with accurate at-home testing is the first step toward regaining control over your well-being.",
  ),
] as unknown as RichTextField;

const mira = [
  linked(
    "The Mira Hormone Monitor (Perimenopause Kit $179 is a powerful ally for women navigating perimenopause. Mira excels at mapping the hormonal chaos of the perimenopause transition by providing quantitative numerical data for Estradiol (E3G), LH, and Progesterone (PdG).",
    "Mira Hormone Monitor (Perimenopause Kit $179",
    "#affiliate-link",
  ),
  paragraph(
    "Instead of guessing why you’re experiencing sudden mood swings or sleep disruptions, Mira allows you to see exactly how your hormones are fluctuating in real-time. By using Mira, you’re not just tracking a cycle; you’re gathering a “hormone map” to bring to your doctor to fast-track your path to starting the conversation around whether it’s time to discuss Hormone Replacement Therapy.",
  ),
] as unknown as RichTextField;

const proov = [
  linked(
    "The Proov Empower Hormone Test Kit is specifically designed to strip away the mystery of “feeling off” in your 40s. The Empower kit is tailored for the perimenopause transition, measuring four critical hormones—FSH, LH, E1G (estrogen marker), and PdG (progesterone marker)—across multiple days to capture the full picture of your shifting cycle.",
    "Proov Empower Hormone Test Kit",
    "#affiliate-link",
  ),
  paragraph(
    "To get your results, you simply scan the Proov urine test strips with your smartphone’s camera, allowing the app’s optical technology to translate the color lines into precise numerical data and personalized insights about your hormone levels. The Proov Insight app automatically compiles your daily readings into a comprehensive hormonal report card that you can download and share with your HRT specialist to provide the clinical evidence needed to customize your treatment plan.",
  ),
] as unknown as RichTextField;

export default async function TrackersAndTestingMockup(
  props: PageProps<"/mockup/trackers-and-testing">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <Hero
        variation="subpage"
        primary={{
          ...section({
            small_heading: rich("At-Home"),
            heading: rich("Perimenopause & Menopause Trackers & Testing"),
            intro: rich(
              "Navigating the transition into perimenopause can feel like trying to solve a puzzle with missing pieces. For many women, the first signs aren’t always obvious; they often manifest as subtle shifts in mood, unexpected changes in sleep quality, or cycles that suddenly lose their predictability. Understanding your body during this phase is about more than just identifying hot flashes—it’s about monitoring the delicate fluctuations in hormone levels, specifically estrogen and progesterone, which begin to shift years before clinical menopause.",
            ),
            link: {
              link_type: "Web",
              url: POST,
              text: "Read my Proov vs. Mira comparison",
            } as LinkField,
            space_above: "Medium",
          }),
          image: image(
            "/mockup/test-kits/peggy-standing.jpg",
            "Peggy standing in her living room with her arms crossed, smiling",
            1000,
            1500,
          ),
        }}
      />

      <SideBySide
        variation="quote"
        primary={{
          ...section(),
          side: "Media left",
          quote: rich(
            "From “I think something is wrong” to “Here is the evidence of my hormonal shift.”",
          ),
          text: intro,
        }}
      />

      <Divider
        primary={{
          line: "Squiggly",
          color: "Soft",
          background: "Transparent",
          space_above: "Large",
          space_below: "None",
        }}
      />

      <SideBySide
        variation="image"
        primary={{
          ...section({
            small_heading: rich("At-home monitor"),
            heading: rich("Mira Hormone Monitor"),
          }),
          side: "Media right",
          text: mira,
          button: [
            button(
              "See the Mira kit on Amazon",
              "#affiliate-link",
              "Solid",
              true,
            ),
            button("Affiliate disclosure", "/affiliate-disclosures", "Ghost"),
          ],
        }}
        image={{
          src: "/mockup/test-kits/mira-monitor.jpg",
          alt: "Mira hormone monitor on a counter, its screen reading Ready to test",
        }}
      />

      <SideBySide
        variation="image"
        primary={{
          ...section({
            small_heading: rich("At-home test kit"),
            heading: rich("Proov Empower Hormone Test Kit"),
          }),
          side: "Media left",
          text: proov,
          button: [
            button(
              "See the Proov kit on Amazon",
              "#affiliate-link",
              "Solid",
              true,
            ),
          ],
        }}
        image={{
          src: "/mockup/test-kits/proov-empower.jpg",
          alt: "Proov Empower perimenopause test box beside test strips and two foil pouches",
        }}
      />

      <Ribbon
        primary={{
          ...section({ space_below: "Large" }),
          content: rich(
            "While at-home hormone testing provides invaluable personal data and insights into your cycle, it is intended for educational and informational purposes and does not constitute a formal medical diagnosis. We always recommend reviewing your Proov or Mira reports with a qualified healthcare provider or HRT specialist to ensure your results are interpreted accurately within the context of your overall health history.",
          ),
          box_background: "Blue",
          button: [
            button(
              "Trusted HRT Docs/Clinics - Start my Journey",
              "/mockup/homepage",
            ),
          ],
        }}
      />
    </MockupShell>
  );
}
