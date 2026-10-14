import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { LinkField, RichTextField } from "@prismicio/client";
import { describe, expect, it, vi } from "vitest";
import type { TokenClinic } from "@/components/content-blocks";
import { Content } from "@/components/content";
import type { SliceSectionFields } from "@/components/slice-section";
import { SideBySide } from "./index";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) =>
    createElement("img", { alt: props.alt ?? "", src: props.src }),
}));

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const labeled = (value: string, label: "signoff" | "note") =>
  [
    {
      type: "paragraph",
      text: value,
      spans: [{ start: 0, end: value.length, type: "label", data: { label } }],
    },
  ] as RichTextField;

function section(): SliceSectionFields {
  return {
    small_heading: rich("My hormone replacement story"),
    heading: rich("Menopause isn’t a dirty word."),
    intro: rich("I’ll say that again."),
    link: { link_type: "Any" },
    background: "Transparent",
    space_above: "None",
    space_below: "None",
  };
}

const button = {
  link_type: "Web",
  url: "/about",
  text: "Read my whole story",
  variant: "Solid",
} as LinkField;

const clinic: TokenClinic = {
  uid: "inner-balance",
  name: "Inner Balance",
  logo: { src: "/mockup/logos/inner-balance.png" },
  visitHref: "https://example.com/inner-balance",
  visitText: "Visit Inner Balance",
  offerCode: "PEGGY",
  monthlyPrice: 150,
  insurance: false,
  formulation: "Oestra vaginal cream",
};

describe("SideBySide", () => {
  it("puts the photo on the left with the story, the closing line, and the note", () => {
    const markup = renderToStaticMarkup(
      <SideBySide
        variation="image"
        primary={{
          ...section(),
          side: "Media left",
          text: [
            ...rich("I’ve personally tested more than 9 providers."),
            ...labeled(
              "I created HormoneTherapyHub to offer transparent telemetry.",
              "signoff",
            ),
            ...labeled(
              "I am not a medical professional, and this site does not provide medical advice.",
              "note",
            ),
          ] as RichTextField,
          button: [
            button,
            {
              link_type: "Web",
              url: "/blog",
              text: "See the reviews",
              variant: "Ghost",
            } as LinkField,
            { link_type: "Web", url: "/about", text: "" } as LinkField,
          ],
          caption: rich("Me and Winston, my Bernedoodle."),
        }}
        image={{
          src: "/mockup/peggy-winston.jpg",
          alt: "Peggy on a wooded trail holding her Bernedoodle puppy, Winston",
        }}
      />,
    );

    expect(markup).toContain('id="menopause-isnt-a-dirty-word"');
    expect(markup).toContain('data-side="left"');
    expect(markup).toContain('data-media="true"');
    expect(markup.indexOf("Menopause isn’t a dirty word.")).toBeLessThan(
      markup.indexOf('alt="Peggy on a wooded trail'),
    );
    expect(markup).toContain("My hormone replacement story");
    expect(markup).toContain("Menopause isn’t a dirty word.");
    expect(markup).toContain("/mockup/peggy-winston.jpg");
    expect(markup).toContain(
      "Peggy on a wooded trail holding her Bernedoodle puppy, Winston",
    );
    expect(markup).toContain("Me and Winston, my Bernedoodle.");
    expect(markup).toContain('data-caption="on"');
    expect(markup).toContain("I’ve personally tested more than 9 providers.");
    expect(markup).toContain(
      "I created HormoneTherapyHub to offer transparent telemetry.",
    );
    expect(markup).toContain("I am not a medical professional");
    expect(markup).toContain('href="/about"');
    expect(markup).toContain("Read my whole story");
    expect(markup).toContain('href="/blog"');
    expect(markup).toContain("See the reviews");
  });

  it("centers a caption under the photo when the choice is off", () => {
    const markup = renderToStaticMarkup(
      <SideBySide
        variation="image"
        primary={{
          ...section(),
          text: rich("Hi."),
          caption: rich("Peggy, at home."),
          caption_on_photo: false,
        }}
        image={{ src: "/photo.jpg", alt: "Peggy" }}
      />,
    );
    expect(markup).toContain('data-caption="under"');
    expect(markup).toContain("Peggy, at home.");
  });

  it("hides an empty caption", () => {
    const markup = renderToStaticMarkup(
      <SideBySide
        variation="image"
        primary={{ ...section(), text: rich("Hi."), caption: [] }}
        image={{ src: "/photo.jpg", alt: "Peggy" }}
      />,
    );
    expect(markup).not.toContain("<figcaption");
    expect(markup).not.toContain("data-caption");
  });

  it("moves the media to the right", () => {
    const markup = renderToStaticMarkup(
      <SideBySide
        variation="image"
        primary={{ ...section(), side: "Media right", text: rich("Hi.") }}
        image={{ src: "/photo.jpg", alt: "Peggy" }}
      />,
    );
    expect(markup).toContain('data-side="right"');
  });

  it("centers the media unless Top or Sticky is chosen", () => {
    const render = (media_position?: string) =>
      renderToStaticMarkup(
        <SideBySide
          variation="image"
          primary={{ ...section(), media_position, text: rich("Hi.") }}
          image={{ src: "/photo.jpg", alt: "Peggy" }}
        />,
      );
    expect(render()).toContain('data-position="center"');
    expect(render("Unknown")).toContain('data-position="center"');
    expect(render("Top")).toContain('data-position="top"');
    expect(render("Sticky")).toContain('data-position="sticky"');
  });

  it("renders every intro paragraph in the writing column", () => {
    const markup = renderToStaticMarkup(
      <SideBySide
        variation="image"
        primary={{
          ...section(),
          intro: [
            ...rich("First signs aren’t always obvious."),
            ...rich("Proactive tracking is the tool for advocacy."),
          ] as RichTextField,
        }}
        image={{ src: "/photo.jpg", alt: "Peggy standing" }}
      />,
    );
    expect(markup).toContain("First signs aren’t always obvious.");
    expect(markup).toContain("Proactive tracking is the tool for advocacy.");
    expect(markup.indexOf("First signs")).toBeLessThan(
      markup.indexOf("Proactive tracking"),
    );
    expect(markup.indexOf("Proactive tracking")).toBeLessThan(
      markup.indexOf('alt="Peggy standing"'),
    );
  });

  it("uses one column when the slice has no media", () => {
    const markup = renderToStaticMarkup(
      <SideBySide
        variation="image"
        primary={{ ...section(), intro: rich("Only the writing.") }}
      />,
    );
    expect(markup).toContain('data-media="false"');
    expect(markup).toContain("Only the writing.");
  });

  it("puts a quote above the writing beside the photo", () => {
    const markup = renderToStaticMarkup(
      <SideBySide
        variation="image"
        primary={{
          ...section(),
          quote: rich("Here is the evidence of my hormonal shift."),
          text: rich("For many women, the first signs aren’t always obvious."),
        }}
        image={{ src: "/photo.jpg", alt: "Peggy" }}
      />,
    );
    expect(markup).toContain('alt="Peggy"');
    expect(markup).not.toContain("<blockquote");
    expect(markup.indexOf("Here is the evidence")).toBeLessThan(
      markup.indexOf("For many women"),
    );
  });

  it("marks a button to an affiliate address as sponsored", () => {
    const markup = renderToStaticMarkup(
      <SideBySide
        variation="image"
        primary={{
          ...section(),
          text: rich("Hi."),
          button: [
            {
              link_type: "Web",
              url: "https://amzn.to/4cW6sUq",
              text: "See the Mira kit on Amazon",
              target: "_blank",
              variant: "Solid",
            } as LinkField,
            {
              link_type: "Web",
              url: "https://example.com/about",
              text: "About",
              variant: "Ghost",
            } as LinkField,
          ],
        }}
        image={{ src: "/photo.jpg", alt: "Mira monitor" }}
      />,
    );
    const links = [...markup.matchAll(/<a [^>]*>/g)].map(([tag]) => tag);
    const amazon = links.find((tag) => tag.includes("amzn.to"));
    const about = links.find((tag) => tag.includes("example.com/about"));
    expect(amazon).toContain('rel="sponsored nofollow noopener noreferrer"');
    expect(amazon).toContain('target="_blank"');
    expect(about).toContain('rel="noreferrer"');
  });

  it("renders a quote with its attribution", () => {
    const markup = renderToStaticMarkup(
      <SideBySide
        variation="quote"
        primary={{
          ...section(),
          text: rich("Why this line stayed with me."),
          quote: rich("Menopause isn’t something to be ashamed of."),
          attribution: "Peggy",
        }}
      />,
    );
    expect(markup).toContain("<blockquote");
    expect(markup).toContain("Menopause isn’t something to be ashamed of.");
    expect(markup).toContain("Peggy");
    expect(markup).not.toContain("/mockup/peggy-winston.jpg");
  });

  it("reads the clinic card from the clinic", () => {
    const markup = renderToStaticMarkup(
      <SideBySide
        variation="clinic"
        primary={{ ...section(), text: rich("What I use now.") }}
        clinic={{
          name: "Inner Balance",
          logo: { src: "/mockup/logos/inner-balance.png" },
          quote:
            "Finding a product that treats my symptoms was a clear winner.",
          visitHref: "https://example.com/inner-balance",
        }}
      />,
    );
    expect(markup).toContain("Inner Balance");
    expect(markup).toContain("Finding a product that treats my symptoms");
    expect(markup).toContain("Visit Inner Balance");
    expect(markup).toContain('data-placement="side_by_side"');
    expect(markup).toContain('target="_blank"');
  });

  it("embeds a video only when the markup is an iframe", () => {
    const markup = renderToStaticMarkup(
      <SideBySide
        variation="video"
        primary={{
          ...section(),
          text: rich("Watch with me."),
          caption: rich("On the video."),
        }}
        video={{
          html: '<iframe src="https://www.youtube.com/embed/example"></iframe>',
        }}
      />,
    );
    expect(markup).toContain("<iframe");
    expect(markup).toContain('data-caption="on"');
    expect(markup).toContain("On the video.");
    expect(markup).not.toContain("Watch video");
  });

  it("links a video that is not an embed", () => {
    const markup = renderToStaticMarkup(
      <SideBySide
        variation="video"
        primary={{ ...section(), text: rich("Watch with me.") }}
        video={{ url: "https://example.com/watch", title: "My HRT story" }}
      />,
    );
    expect(markup).toContain('href="https://example.com/watch"');
    expect(markup).toContain("My HRT story");
    expect(markup).not.toContain("<iframe");
  });
});

describe("Content tokens", () => {
  const field = [
    {
      type: "paragraph",
      text: "{{provider:inner-balance:offer}} This one helped my sleep.",
      spans: [],
    },
    {
      type: "paragraph",
      text: "{{provider:missing:facts}}",
      spans: [],
    },
  ] as RichTextField;

  it("fills an offer from the clinic and names a missing clinic in preview", () => {
    const markup = renderToStaticMarkup(
      <Content field={field} clinics={[clinic]} tokens="preview" />,
    );
    expect(markup).toContain("Inner Balance");
    expect(markup).toContain("This one helped my sleep.");
    expect(markup).toContain("Code PEGGY");
    expect(markup).toContain('data-placement="story_offer"');
    expect(markup).toContain("No clinic with id missing.");
  });

  it("drops an unknown token on the public page and keeps a facts card", () => {
    const markup = renderToStaticMarkup(
      <Content
        field={
          [
            {
              type: "paragraph",
              text: "{{provider:missing:offer}} Still here.",
              spans: [],
            },
            {
              type: "paragraph",
              text: "{{provider:inner-balance:facts}}",
              spans: [],
            },
          ] as RichTextField
        }
        clinics={[clinic]}
      />,
    );
    expect(markup).not.toContain("No clinic");
    expect(markup).toContain("Still here.");
    expect(markup).toContain("$150/mo");
    expect(markup).toContain("Doesn’t take insurance");
    expect(markup).toContain("Oestra vaginal cream");
  });
});
