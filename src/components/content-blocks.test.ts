import type { RichTextField } from "@prismicio/client";
import { describe, expect, it } from "vitest";
import { contentPieces, parseProviderToken } from "./content-blocks";

const paragraph = (text: string, spans: object[] = []) => ({
  type: "paragraph" as const,
  text,
  spans,
});

describe("parseProviderToken", () => {
  it("reads an offer or facts token at the start of a paragraph", () => {
    expect(
      parseProviderToken(
        "{{provider:inner-balance:offer}} This cream helped my sleep.",
      ),
    ).toEqual({
      uid: "inner-balance",
      part: "offer",
      sentence: "This cream helped my sleep.",
    });
    expect(parseProviderToken("{{provider:musely:facts}}")).toEqual({
      uid: "musely",
      part: "facts",
      sentence: "",
    });
  });

  it("leaves ordinary sentences alone", () => {
    expect(parseProviderToken("I tried {{provider:musely:offer}} later.")).toBe(
      null,
    );
    expect(parseProviderToken("{{provider:Musely:price}}")).toBeNull();
  });
});

describe("contentPieces", () => {
  it("splits a closing line, a note, and a clinic token out of the writing", () => {
    const signoff = "I created this for patients like me.";
    const note = "I am not a medical professional.";
    const pieces = contentPieces([
      paragraph("The first paragraph."),
      paragraph(signoff, [
        {
          start: 0,
          end: signoff.length,
          type: "label",
          data: { label: "signoff" },
        },
        { start: 0, end: 1, type: "strong" },
      ]),
      paragraph(note, [
        { start: 0, end: note.length, type: "label", data: { label: "note" } },
      ]),
      paragraph("{{provider:inner-balance:facts}} Still my top pick."),
    ] as RichTextField);

    expect(pieces.map((piece) => piece.kind)).toEqual([
      "rich",
      "signoff",
      "note",
      "token",
    ]);
    expect(pieces[1]).toMatchObject({
      kind: "signoff",
      field: [{ spans: [{ type: "strong" }] }],
    });
    expect(pieces[3]).toMatchObject({
      uid: "inner-balance",
      part: "facts",
      sentence: "Still my top pick.",
    });
  });

  it("keeps a label that covers only part of a paragraph in the writing", () => {
    const text = "A short signoff inside a longer paragraph.";
    const pieces = contentPieces([
      paragraph(text, [
        { start: 0, end: 14, type: "label", data: { label: "signoff" } },
      ]),
    ] as RichTextField);

    expect(pieces).toHaveLength(1);
    expect(pieces[0]?.kind).toBe("rich");
  });
});
