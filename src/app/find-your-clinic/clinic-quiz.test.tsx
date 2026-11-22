import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ClinicQuiz } from "./clinic-quiz";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) =>
    createElement("img", { alt: props.alt ?? "", src: props.src }),
}));

describe("ClinicQuiz", () => {
  it("starts with the intro and keeps the questions off the first screen", () => {
    const html = renderToStaticMarkup(
      createElement(ClinicQuiz, { brands: [] }),
    );
    expect(html).toContain("Find a clinic that fits");
    expect(html).toContain("not medical advice");
    expect(html).toContain("I won’t ask for your name or email");
    expect(html).toContain("Start");
    expect(html).not.toContain("Which insurance carrier");
    expect(html).not.toContain("Best match");
  });
});
