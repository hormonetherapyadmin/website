import { describe, expect, it, vi } from "vitest";
import {
  affiliateClickParams,
  applyAnswer,
  nextQuestion,
  previousQuestion,
  quizQuestion,
  rankBrands,
  scoreQuiz,
  trackEvent,
} from "./quiz";

const sharedCreamPath = {
  prescriptions: "one",
  visit: "async",
  formulation: "compounded",
} as const;

describe("branching", () => {
  it("asks the carrier question only after a yes on insurance", () => {
    expect(nextQuestion("insurance", { insurance: "yes" })).toBe("carrier");
    expect(nextQuestion("insurance", { insurance: "no" })).toBe("budget");
    expect(
      nextQuestion("carrier", { insurance: "yes", carrier: "major" }),
    ).toBe("budget");
    expect(previousQuestion("budget", { insurance: "yes" })).toBe("carrier");
    expect(previousQuestion("budget", { insurance: "no" })).toBe("insurance");
    expect(previousQuestion("insurance", {})).toBe("intro");
  });

  it("drops a carrier answer when insurance is no longer the priority", () => {
    expect(
      applyAnswer(
        { insurance: "yes", carrier: "major", budget: "mid" },
        "insurance",
        "no",
      ),
    ).toEqual({ insurance: "no", budget: "mid" });
  });

  it("keeps the cash-consult note on the carrier question", () => {
    const note = quizQuestion("carrier").note ?? "";
    expect(note).toContain("Midi Health charges $250");
    expect(note).toContain("MyMenopauseRx charges $99");
  });
});

describe("scoreQuiz", () => {
  it("gives cash-pay clinics a head start and skips insurance points", () => {
    const scores = scoreQuiz({ insurance: "no" });
    expect(scores.alloy).toBe(2);
    expect(scores.winona).toBe(2);
    expect(scores.musely).toBe(2);
    expect(scores["inner-balance"]).toBe(2);
    expect(scores.effecty).toBe(2);
    expect(scores.joi).toBe(2);
    expect(scores.midi).toBe(0);
    expect(scores.menorx).toBe(0);
  });

  it("scores carriers differently", () => {
    expect(scoreQuiz({ insurance: "yes", carrier: "major" })).toMatchObject({
      midi: 5,
      menorx: 5,
    });
    expect(scoreQuiz({ insurance: "yes", carrier: "united" })).toMatchObject({
      midi: 5,
      menorx: 1,
    });
    expect(scoreQuiz({ insurance: "yes", carrier: "tricare" })).toMatchObject({
      menorx: 5,
      midi: 0,
    });
    expect(scoreQuiz({ insurance: "yes", carrier: "other" })).toMatchObject({
      menorx: 3,
      alloy: 3,
      winona: 3,
      musely: 3,
      midi: 0,
    });
  });

  it("awards MyMenopauseRx the mid-budget points only with insurance", () => {
    expect(scoreQuiz({ insurance: "yes", budget: "mid" }).menorx).toBe(5);
    expect(scoreQuiz({ insurance: "no", budget: "mid" }).menorx).toBe(0);
    expect(scoreQuiz({ insurance: "no", budget: "mid" }).winona).toBe(7);
  });

  it("lets budget separate Musely and Inner Balance", () => {
    const low = scoreQuiz({ ...sharedCreamPath, budget: "under-50" });
    const high = scoreQuiz({ ...sharedCreamPath, budget: "high" });
    expect(low.musely).toBeGreaterThan(low["inner-balance"]);
    expect(high["inner-balance"]).toBeGreaterThan(high.musely);
  });

  it("removes Joi when labs are skipped", () => {
    const ranked = rankBrands({
      labs: "skip",
      testosterone: "yes",
      visit: "async",
      extras: "both",
    });
    expect(ranked.map((item) => item.brand)).not.toContain("joi");
  });

  it("keeps Joi in the running when labs come first", () => {
    const ranked = rankBrands({
      insurance: "no",
      budget: "high",
      labs: "before",
      testosterone: "yes",
      prescriptions: "separate",
      visit: "video",
      formulation: "compounded",
      extras: "both",
    });
    expect(ranked[0]?.brand).toBe("joi");
    expect(ranked.map((item) => item.brand)).toContain("midi");
  });

  it("limits a video visit without labs to Midi and MyMenopauseRx", () => {
    const ranked = rankBrands({
      insurance: "no",
      budget: "under-50",
      labs: "skip",
      testosterone: "no",
      prescriptions: "one",
      visit: "video",
      formulation: "compounded",
      extras: "hrt",
    });
    expect(ranked.map((item) => item.brand)).toEqual(["menorx", "midi"]);
    expect(
      scoreQuiz({
        insurance: "no",
        budget: "under-50",
        labs: "skip",
        testosterone: "no",
        prescriptions: "one",
        visit: "video",
        formulation: "compounded",
        extras: "hrt",
      }).musely,
    ).toBeGreaterThan(ranked[0]?.score ?? 0);
  });
});

describe("events", () => {
  it("fills the affiliate click properties from the brand link", () => {
    expect(
      affiliateClickParams({
        provider: "Musely",
        href: "https://www.musely.com/start?code=peggy",
        offer: "PEGGY",
      }),
    ).toEqual({
      provider: "Musely",
      offer: "PEGGY",
      placement: "quiz_result",
      page_type: "quiz",
      page_path: "/find-your-clinic",
      link_domain: "musely.com",
    });
  });

  it("sends an event only when gtag is present", () => {
    const gtag = vi.fn();
    vi.stubGlobal("gtag", gtag);
    trackEvent("quiz_start", { quiz_id: "find-your-clinic" });
    expect(gtag).toHaveBeenCalledWith("event", "quiz_start", {
      quiz_id: "find-your-clinic",
    });
    vi.unstubAllGlobals();

    trackEvent("quiz_start", { quiz_id: "find-your-clinic" });
  });
});
