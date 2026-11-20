import type { RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import {
  questionWording,
  quizWordingFrom,
  type QuizWording,
} from "./quiz-copy";
import type { QuizDocument } from "../../prismicio-types";

const empty = [] as unknown as RichTextField;

function data(
  overrides: Partial<QuizDocument["data"]> = {},
): QuizDocument["data"] {
  return {
    insurance: empty,
    carrier: empty,
    carrier_note: empty,
    budget: empty,
    labs: empty,
    testosterone: empty,
    prescriptions: empty,
    visit: empty,
    formulation: empty,
    extras: empty,
    ...overrides,
  };
}

const paragraph = (text: string) =>
  [{ type: "paragraph", text, spans: [] }] as unknown as RichTextField;

describe("quizWordingFrom", () => {
  it("keeps a blank field out of the wording", () => {
    expect(quizWordingFrom(data())).toEqual({ prompts: {} });
  });

  it("reads a rewritten question and the carrier note", () => {
    const wording = quizWordingFrom(
      data({
        insurance: paragraph("Can you use insurance for the visits?"),
        carrier_note: paragraph("Out of network, the visit is cash."),
      }),
    );
    expect(wording.prompts.insurance).toBe(
      "Can you use insurance for the visits?",
    );
    expect(wording.carrierNote).toBe("Out of network, the visit is cash.");
    expect(wording.prompts.budget).toBeUndefined();
  });
});

describe("questionWording", () => {
  const wording: QuizWording = {
    prompts: { insurance: "Can you use insurance for the visits?" },
    carrierNote: "Out of network, the visit is cash.",
  };

  it("uses Peggy's question and leaves the answer choices alone", () => {
    const question = questionWording(wording, "insurance");
    expect(question.prompt).toBe("Can you use insurance for the visits?");
    expect(question.options.map((option) => option.id)).toEqual(["yes", "no"]);
    expect(question.options[0]?.label).toBe(
      "Yes, using my insurance is a top priority.",
    );
  });

  it("keeps the built-in question when she has not written one", () => {
    expect(questionWording({ prompts: {} }, "budget").prompt).toBe(
      "What is your monthly budget for HRT products and consultations?",
    );
  });

  it("replaces the carrier note and keeps it when the field is blank", () => {
    expect(questionWording(wording, "carrier").note).toBe(
      "Out of network, the visit is cash.",
    );
    expect(questionWording({ prompts: {} }, "carrier").note).toContain(
      "Midi Health charges $250",
    );
  });
});
