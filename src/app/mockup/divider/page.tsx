import type { Metadata } from "next";
import { Divider } from "@/slices/divider";

export const metadata: Metadata = {
  title: "Divider slice",
  robots: { index: false, follow: false },
};

const samples = [
  {
    line: "Squiggly",
    color: "Accent",
    background: "Transparent",
    space_above: "None",
    space_below: "None",
  },
  {
    line: "Straight",
    color: "Accent",
    background: "Transparent",
    space_above: "None",
    space_below: "None",
  },
  {
    line: "Squiggly",
    color: "Soft",
    background: "Blue",
    space_above: "Small",
    space_below: "Small",
  },
  {
    line: "Straight",
    color: "Border",
    background: "Transparent",
    space_above: "None",
    space_below: "None",
  },
  {
    line: "Squiggly",
    color: "Text",
    background: "Pink",
    space_above: "Medium",
    space_below: "None",
  },
] as const;

export default function DividerPreview() {
  return (
    <main>
      {samples.map((sample) => (
        <div key={`${sample.line}-${sample.color}-${sample.background}`}>
          <p className="mx-auto mt-10 w-full max-w-wrap px-gutter text-sm text-text-muted">
            {sample.line}, {sample.color}, {sample.background}
          </p>
          <Divider primary={sample} />
        </div>
      ))}
    </main>
  );
}
