"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { DISCLOSURE_HREF, QUIZ_TITLE } from "@/lib/site";
import { visitLinkProps } from "@/lib/affiliate-link";
import { questionWording, type QuizWording } from "@/lib/quiz-copy";
import type { QuizBrandCard } from "@/lib/quiz-brands";
import {
  QUIZ_RESULT_COUNT,
  QUIZ_STEP_COUNT,
  affiliateClickParams,
  applyAnswer,
  nextQuestion,
  previousQuestion,
  quizQuestion,
  rankBrands,
  trackEvent,
  type QuizAnswers,
  type QuizQuestionId,
} from "@/lib/quiz";
import styles from "./clinic-quiz.module.css";

const QUIZ_ID = "find-your-clinic";

type Phase = "intro" | "results" | QuizQuestionId;

export function ClinicQuiz({
  brands,
  wording = { prompts: {} },
}: {
  brands: readonly QuizBrandCard[];
  wording?: QuizWording;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const started = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [phase]);

  function start() {
    if (!started.current) {
      started.current = true;
      trackEvent("quiz_start", { quiz_id: QUIZ_ID });
    }
    setPhase("insurance");
  }

  function choose(question: QuizQuestionId, optionId: string) {
    const nextAnswers = applyAnswer(answers, question, optionId);
    if (nextAnswers === answers) return;
    setAnswers(nextAnswers);
    const step = quizQuestion(question).step;
    trackEvent("quiz_answer", {
      quiz_id: QUIZ_ID,
      question_id: question,
      answer_id: optionId,
      step,
    });
    const next = nextQuestion(question, nextAnswers);
    if (next === "results") {
      const ranked = rankBrands(nextAnswers).slice(0, QUIZ_RESULT_COUNT);
      trackEvent("quiz_complete", {
        quiz_id: QUIZ_ID,
        top_provider: ranked[0]?.brand ?? "",
        providers: ranked.map((item) => item.brand).join(","),
      });
    }
    setPhase(next);
  }

  function back() {
    if (phase === "intro") return;
    if (phase === "results") {
      setPhase("extras");
      return;
    }
    setPhase(previousQuestion(phase, answers));
  }

  function restart() {
    started.current = false;
    setAnswers({});
    setPhase("intro");
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        {phase === "intro" ? (
          <Intro onStart={start} />
        ) : phase === "results" ? (
          <Results
            headingRef={headingRef}
            answers={answers}
            brands={brands}
            onBack={back}
            onRestart={restart}
          />
        ) : (
          <Question
            headingRef={headingRef}
            id={phase}
            answers={answers}
            wording={wording}
            onChoose={choose}
            onBack={back}
          />
        )}
      </div>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className={styles.intro}>
      <h1 className={styles.heading}>{QUIZ_TITLE}</h1>
      <p className={styles.lede}>
        Eight short questions. I’ll point you toward clinics I’ve used, based on
        insurance, budget, and how you want to get care. This is my experience,
        not medical advice.
      </p>
      <button type="button" className={styles.primary} onClick={onStart}>
        Start
      </button>
    </div>
  );
}

function Question({
  headingRef,
  id,
  answers,
  wording,
  onChoose,
  onBack,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  id: QuizQuestionId;
  answers: QuizAnswers;
  wording: QuizWording;
  onChoose: (question: QuizQuestionId, optionId: string) => void;
  onBack: () => void;
}) {
  const question = questionWording(wording, id);
  const selected = answers[id];

  return (
    <>
      <p className={styles.progress}>
        Question {question.step} of {QUIZ_STEP_COUNT}
      </p>
      <h1
        ref={headingRef}
        id="quiz-prompt"
        tabIndex={-1}
        className={styles.prompt}
      >
        {question.prompt}
      </h1>
      <div
        className={styles.options}
        role="group"
        aria-labelledby="quiz-prompt"
      >
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={styles.option}
            aria-pressed={selected === option.id}
            onClick={() => onChoose(id, option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {question.note ? <p className={styles.note}>{question.note}</p> : null}
      <button type="button" className={styles.back} onClick={onBack}>
        Back
      </button>
    </>
  );
}

function Results({
  headingRef,
  answers,
  brands,
  onBack,
  onRestart,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  answers: QuizAnswers;
  brands: readonly QuizBrandCard[];
  onBack: () => void;
  onRestart: () => void;
}) {
  const ranked = rankBrands(answers).slice(0, QUIZ_RESULT_COUNT);
  const cards = ranked.flatMap((item) => {
    const card = brands.find((brand) => brand.uid === item.brand);
    return card ? [card] : [];
  });
  const best = ranked[0]?.brand;
  const firstVisit = cards.find((card) => card.visitHref)?.uid;

  return (
    <>
      <h1 ref={headingRef} tabIndex={-1} className={styles.heading}>
        Clinics that fit
      </h1>
      <p className={styles.lede}>
        Based on what you told me, I’d start here. The first one is the closest
        fit. This is my experience, not medical advice.
      </p>
      {cards.length === 0 ? (
        <p className={styles.note}>
          I couldn’t load those clinics just now. Please try again in a minute.
        </p>
      ) : (
        <ol className={styles.results}>
          {cards.map((card) => (
            <li key={card.uid} className={styles.card}>
              {card.uid === best ? (
                <p className={styles.badge}>Best match</p>
              ) : null}
              <div className={styles.cardHead}>
                {card.logo ? (
                  <Image
                    src={card.logo.src}
                    alt={card.logo.alt}
                    width={card.logo.width}
                    height={card.logo.height}
                    className={styles.logo}
                  />
                ) : null}
                <h2 className={styles.cardName}>{card.name}</h2>
              </div>
              {card.description ? <p>{card.description}</p> : null}
              {card.price ? (
                <p className={styles.price}>
                  {card.price}
                  {card.priceNote ? (
                    <span className={styles.priceNote}>{card.priceNote}</span>
                  ) : null}
                </p>
              ) : null}
              {card.formulation ? <p>{card.formulation}</p> : null}
              {card.offerCode ? <p>Code {card.offerCode}</p> : null}
              <div className={styles.links}>
                {card.reviewHref ? (
                  <Link href={card.reviewHref}>My review</Link>
                ) : null}
                {card.pageHref ? (
                  <Link href={card.pageHref}>Products & pricing</Link>
                ) : null}
              </div>
              {card.visitHref ? (
                <>
                  {card.uid === firstVisit ? (
                    <p className={styles.disclosure}>
                      If you use a visit link, I may earn a commission, at no
                      extra cost to you.{" "}
                      <Link href={DISCLOSURE_HREF}>Affiliate disclosure</Link>
                    </p>
                  ) : null}
                  <a
                    href={card.visitHref}
                    className={styles.primary}
                    {...visitLinkProps(card.name, "quiz_result")}
                    onClick={() =>
                      trackEvent(
                        "affiliate_click",
                        affiliateClickParams({
                          provider: card.name,
                          href: card.visitHref ?? "",
                          offer: card.offerCode,
                        }),
                      )
                    }
                  >
                    {card.visitText ?? `Visit ${card.name}`}
                    <span className="sr-only">
                      {" "}
                      (affiliate link, opens in a new tab)
                    </span>
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      )}
      <div className={styles.actions}>
        <button type="button" className={styles.back} onClick={onBack}>
          Back
        </button>
        <button type="button" className={styles.back} onClick={onRestart}>
          Start over
        </button>
      </div>
    </>
  );
}
