import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { isIndexingAllowed } from "@/lib/env";
import { loadQuizWording } from "@/lib/quiz-copy";
import { loadQuizBrands } from "@/lib/quiz-brands";
import { QUIZ_PATH, QUIZ_TITLE } from "@/lib/site";
import { ClinicQuiz } from "./clinic-quiz";

export async function generateMetadata(): Promise<Metadata> {
  const index = isIndexingAllowed();
  return {
    title: QUIZ_TITLE,
    description:
      "Answer seven questions and I’ll point you to HRT clinics I’ve used, based on budget and how you want to get care.",
    alternates: { canonical: QUIZ_PATH },
    robots: { index, follow: index },
  };
}

export default async function FindYourClinicPage() {
  const [brands, wording] = await Promise.all([
    loadQuizBrands(),
    loadQuizWording(),
  ]);

  return (
    <SiteShell>
      <ClinicQuiz brands={brands} wording={wording} />
    </SiteShell>
  );
}
