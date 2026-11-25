import { describe, expect, it, vi } from "vitest";
import {
  affiliateClickParams,
  applyAnswer,
  nextQuestion,
  previousQuestion,
  quizProgress,
  rankBrands,
  scoreQuiz,
  numberedId,
  trackEvent,
} from "./quiz";

const sharedCreamPath = {
  prescriptions: "one",
  visit: "async",
  formulation: "compounded",
} as const;

describe("questions", () => {
  it("walks budget through extras, seven questions", () => {
    expect(previousQuestion("budget")).toBe("intro");
    expect(nextQuestion("budget")).toBe("labs");
    expect(previousQuestion("labs")).toBe("budget");
    expect(nextQuestion("extras")).toBe("results");
  });

  it("counts budget as question 1 of 7", () => {
    expect(quizProgress("budget")).toEqual({
      step: 1,
      total: 7,
      marks: [
        "current",
        "upcoming",
        "upcoming",
        "upcoming",
        "upcoming",
        "upcoming",
        "upcoming",
      ],
    });
    expect(quizProgress("labs")).toMatchObject({ step: 2, total: 7 });
    expect(quizProgress("extras")).toMatchObject({ step: 7, total: 7 });
  });

  it("ignores an option that is not on the question", () => {
    expect(applyAnswer({ budget: "mid" }, "budget", "yes")).toEqual({
      budget: "mid",
    });
  });
});

describe("scoreQuiz", () => {
  it("scores a mid budget without an insurance bonus", () => {
    const scores = scoreQuiz({ budget: "mid" });
    expect(scores.winona).toBe(5);
    expect(scores.alloy).toBe(5);
    expect(scores.joi).toBe(5);
    expect(scores.musely).toBe(1);
    expect(scores.menorx).toBe(0);
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
      page_path: "/provider-quiz",
      link_domain: "musely.com",
    });
  });

  it("puts the question or result place on an analytics id", () => {
    expect(numberedId("budget", 1)).toBe("budget_1");
    expect(numberedId("mid", 1)).toBe("mid_1");
    expect(numberedId("joi", 2)).toBe("joi_2");
    expect(numberedId("", 1)).toBe("");
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
