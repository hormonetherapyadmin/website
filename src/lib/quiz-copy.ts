import {
  asText,
  NotFoundError,
  ParsingError,
  type RichTextField,
} from "@prismicio/client";
import type { QuizDocument } from "../../prismicio-types";
import { quizQuestion, type QuizQuestionId } from "@/lib/quiz";
import { createClient } from "@/prismicio";

/**
 * Question wording from the Clinic quiz singleton. Answer choices and
 * scores stay in quiz.ts. A blank field keeps that question's built-in
 * wording.
 */
export type QuizWording = {
  prompts: Partial<Record<QuizQuestionId, string>>;
};

const QUESTION_FIELDS: readonly QuizQuestionId[] = [
  "budget",
  "labs",
  "testosterone",
  "prescriptions",
  "visit",
  "formulation",
  "extras",
];

export function plainQuizText(field: RichTextField | null | undefined) {
  const value = asText(field ?? [])
    .replace(/\s+/g, " ")
    .trim();
  return value || undefined;
}

export function quizWordingFrom(
  data: QuizDocument["data"] | null | undefined,
): QuizWording {
  if (!data) return { prompts: {} };
  const prompts: QuizWording["prompts"] = {};
  for (const id of QUESTION_FIELDS) {
    const text = plainQuizText(data[id]);
    if (text) prompts[id] = text;
  }
  return { prompts };
}

/** The question visitors see: Peggy's wording when she has written it. */
export function questionWording(wording: QuizWording, id: QuizQuestionId) {
  const question = quizQuestion(id);
  return {
    ...question,
    prompt: wording.prompts[id] || question.prompt,
  };
}

/** Published Clinic quiz wording, or blanks when that document is absent. */
export async function loadQuizWording(): Promise<QuizWording> {
  try {
    const document = await createClient().getSingle("quiz");
    return quizWordingFrom(document.data);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ParsingError) {
      return { prompts: {} };
    }
    throw error;
  }
}
