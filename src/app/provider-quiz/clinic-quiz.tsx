"use client";

import { Medicine02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { DISCLOSURE_HREF, QUIZ_TITLE } from "@/lib/site";
import { visitLinkProps } from "@/lib/affiliate-link";
import { questionWording, type QuizWording } from "@/lib/quiz-copy";
import type { QuizBrandCard } from "@/lib/quiz-brands";
import {
  QUIZ_RESULT_COUNT,
  affiliateClickParams,
  applyAnswer,
  nextQuestion,
  numberedId,
  previousQuestion,
  quizProgress,
  QUIZ_QUESTIONS,
  rankBrands,
  trackEvent,
  type QuizAnswers,
  type QuizQuestionId,
} from "@/lib/quiz";
import { Fireworks } from "./fireworks";
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
    const first = QUIZ_QUESTIONS[0];
    if (first) setPhase(first.id);
  }

  function choose(question: QuizQuestionId, optionId: string) {
    const nextAnswers = applyAnswer(answers, question, optionId);
    if (nextAnswers === answers) return;
    setAnswers(nextAnswers);
    const step = quizProgress(question).step;
    trackEvent("quiz_answer", {
      quiz_id: QUIZ_ID,
      question_id: numberedId(question, step),
      answer_id: numberedId(optionId, step),
      step,
    });
    const next = nextQuestion(question);
    if (next === "results") {
      const ranked = rankBrands(nextAnswers).slice(0, QUIZ_RESULT_COUNT);
      trackEvent("quiz_complete", {
        quiz_id: QUIZ_ID,
        top_provider: numberedId(ranked[0]?.brand ?? "", 1),
        providers: ranked
          .map((item, index) => numberedId(item.brand, index + 1))
          .join(","),
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
    setPhase(previousQuestion(phase));
  }

  function restart() {
    started.current = false;
    setAnswers({});
    setPhase("intro");
  }

  return (
    <div className={styles.wrap}>
      <div
        className={
          phase === "results"
            ? `${styles.panel} ${styles.panelWide}`
            : styles.panel
        }
      >
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

function BackArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className={styles.intro}>
      <h1 className={styles.heading}>{QUIZ_TITLE}</h1>
      <p className={styles.lede}>
        Seven short questions. I’ll point you toward clinics I’ve used, based on
        budget and how you want to get care. This is my experience, not medical
        advice.
      </p>
      <p className={styles.privacy}>
        I won’t ask for your name or email. Nothing personal.
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
  const progress = quizProgress(id);

  return (
    <>
      <div className={styles.progressRow}>
        <p className={styles.progress}>
          Question {progress.step} of {progress.total}
        </p>
        <ol className={styles.track} aria-hidden="true">
          {progress.marks.map((mark, index) => (
            <li key={index} className={styles.bubble} data-state={mark} />
          ))}
        </ol>
      </div>
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
        <BackArrow />
        Back
      </button>
    </>
  );
}

function ResultCard({
  card,
  featured,
}: {
  card: QuizBrandCard;
  featured: boolean;
}) {
  const Title = featured ? "h2" : "h3";
  const identity = (
    <div className={styles.cardHead}>
      {card.logo ? (
        <span className={styles.logoTile}>
          <Image
            src={card.logo.src}
            alt={card.logo.alt}
            width={card.logo.width}
            height={card.logo.height}
            className={styles.logo}
          />
        </span>
      ) : null}
      <div>
        <Title className={styles.cardName}>{card.name}</Title>
        {card.description ? (
          <p className={styles.description}>{card.description}</p>
        ) : null}
      </div>
    </div>
  );
  const price = card.priceAmount ? (
    <p className={styles.price}>
      <span className={styles.amount}>{card.priceAmount}</span>
      {card.perMonth ? <span className={styles.per}>/mo</span> : null}
      {card.priceNote ? (
        <span className={styles.priceNote}>{card.priceNote}</span>
      ) : null}
    </p>
  ) : null;
  const facts = card.formulation ? (
    <ul className={styles.facts}>
      <li>
        <HugeiconsIcon
          icon={Medicine02Icon}
          size={16}
          strokeWidth={1.75}
          className={styles.factIcon}
          aria-hidden="true"
        />
        {card.formulation}
      </li>
    </ul>
  ) : null;
  const code =
    card.offerCode || card.offerNote ? (
      <p className={styles.dealCode}>
        {card.offerCode ? (
          <span className={styles.code}>Code {card.offerCode}</span>
        ) : null}
        {card.offerNote ? (
          <span className={styles.codeNote}>{card.offerNote}</span>
        ) : null}
      </p>
    ) : null;
  const links =
    card.reviewHref || card.pageHref ? (
      <div className={styles.links}>
        {card.reviewHref ? <Link href={card.reviewHref}>My review</Link> : null}
        {card.pageHref ? (
          <Link href={card.pageHref}>Products & pricing</Link>
        ) : null}
      </div>
    ) : null;
  const visit = card.visitHref ? (
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
      <span className="sr-only"> (affiliate link, opens in a new tab)</span>
    </a>
  ) : null;

  if (featured) {
    return (
      <article className={`${styles.card} ${styles.cardBest}`}>
        <div className={styles.bestCopy}>
          <p className={styles.badge}>Best match</p>
          {identity}
          {code}
          {links}
        </div>
        <div className={styles.bestOffer}>
          {price}
          {facts}
          {visit}
        </div>
      </article>
    );
  }

  return (
    <article className={styles.card}>
      {identity}
      {price}
      {facts}
      {code}
      {links}
      {visit}
    </article>
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
  const disclosure = cards.some((card) => card.visitHref) ? (
    <p className={styles.resultsNote}>
      If you use a visit link, I may earn a commission, at no extra cost to you.{" "}
      <Link href={DISCLOSURE_HREF}>Affiliate disclosure</Link>
    </p>
  ) : null;

  return (
    <>
      <Fireworks />
      <div className={styles.resultsHead}>
        <h1 ref={headingRef} tabIndex={-1} className={styles.heading}>
          Clinics that fit
        </h1>
        <button type="button" className={styles.restart} onClick={onRestart}>
          Start over
        </button>
      </div>
      <p className={styles.lede}>
        Based on what you told me, I’d start with the best match. This is my
        experience, not medical advice.
      </p>
      {cards.length === 0 ? (
        <p className={styles.note}>
          I couldn’t load those clinics just now. Please try again in a minute.
        </p>
      ) : (
        <div className={styles.results}>
          {cards[0] ? (
            <ResultCard card={cards[0]} featured={cards[0].uid === best} />
          ) : null}
          {cards.length > 1 ? (
            <div className={styles.also}>
              <p className={styles.alsoLabel}>Also close</p>
              <ol className={styles.alsoList}>
                {cards.slice(1).map((card) => (
                  <li key={card.uid}>
                    <ResultCard card={card} featured={false} />
                  </li>
                ))}
              </ol>
              {disclosure}
            </div>
          ) : (
            disclosure
          )}
        </div>
      )}
      <div className={styles.actions}>
        <button type="button" className={styles.back} onClick={onBack}>
          <BackArrow />
          Back
        </button>
      </div>
    </>
  );
}
