import type { RichTextField } from "@prismicio/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { TokenClinic } from "./content-blocks";
import { PostStory } from "./post-story";

const clinic: TokenClinic = {
  uid: "inner-balance",
  name: "Inner Balance",
  logo: { src: "/logos/inner-balance.png" },
  visitHref: "https://example.com/inner-balance",
  newTab: true,
  offerCode: "PEGGY10",
  offerCopy: "10% off your first order.",
  monthlyPrice: 199,
  priceNote: "First six months, then $99.",
  insurance: false,
  formulation: "Oestra vaginal cream",
  gettingStarted: "Free consults as needed.",
};

function story(text: string): RichTextField {
  return [{ type: "paragraph", text, spans: [] }];
}

describe("PostStory clinic tokens", () => {
  it("replaces an offer token with the clinic box", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={story(
          "{{provider:inner-balance:offer}} This cream helped my sleep.",
        )}
        clinics={[clinic]}
      />,
    );

    expect(markup).toContain("This cream helped my sleep.");
    expect(markup).toContain("Visit Inner Balance");
    expect(markup).toContain("Code PEGGY10");
    expect(markup).toContain('data-placement="story_offer"');
    expect(markup).toContain('href="https://example.com/inner-balance"');
    expect(markup).not.toContain("{{provider:");
  });

  it("uses the code line when the offer paragraph is only the token", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={story("{{provider:inner-balance:offer}}")}
        clinics={[clinic]}
      />,
    );

    expect(markup).toContain("10% off your first order.");
  });

  it("replaces a facts token with that clinic's price", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={story("{{provider:inner-balance:facts}}")}
        clinics={[clinic]}
      />,
    );

    expect(markup).toContain("Inner Balance");
    expect(markup).toContain("$199");
    expect(markup).toContain("/mo");
    expect(markup).toContain("First six months, then $99.");
    expect(markup).toContain("Doesn’t take insurance");
    expect(markup).toContain("Oestra vaginal cream");
    expect(markup).toContain("Free consults as needed.");
    expect(markup).toContain("Visit Inner Balance");
    expect(markup).toContain("Code PEGGY10");
    expect(markup).toContain('data-placement="story_facts"');
    expect(markup).not.toContain("{{provider:");
  });

  it("keeps the sentence when the public page has no matching clinic", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={story(
          "{{provider:inner-balance:offer}} This cream helped my sleep.",
        )}
      />,
    );

    expect(markup).toContain("This cream helped my sleep.");
    expect(markup).not.toContain("No clinic");
    expect(markup).not.toContain("Visit Inner Balance");
  });

  it("names a missing clinic in preview", () => {
    const markup = renderToStaticMarkup(
      <PostStory
        field={story("{{provider:missing:facts}}")}
        clinics={[clinic]}
        tokens="preview"
      />,
    );

    expect(markup).toContain("No clinic with id missing.");
  });
});
