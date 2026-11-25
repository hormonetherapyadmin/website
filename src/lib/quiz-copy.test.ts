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

  it("reads a rewritten question", () => {
    const wording = quizWordingFrom(
      data({
        budget: paragraph("What can you spend each month?"),
      }),
    );
    expect(wording.prompts.budget).toBe("What can you spend each month?");
    expect(wording.prompts.labs).toBeUndefined();
  });
});

describe("questionWording", () => {
  const wording: QuizWording = {
    prompts: { budget: "What can you spend each month?" },
  };

  it("uses Peggy's question and leaves the answer choices alone", () => {
    const question = questionWording(wording, "budget");
    expect(question.prompt).toBe("What can you spend each month?");
    expect(question.options.map((option) => option.id)).toEqual([
      "under-50",
      "mid",
      "high",
    ]);
    expect(question.options[0]?.label).toBe("Less than $50");
  });

  it("keeps the built-in question when she has not written one", () => {
    expect(questionWording({ prompts: {} }, "budget").prompt).toBe(
      "What is your monthly budget for HRT products and consultations?",
    );
  });
});
