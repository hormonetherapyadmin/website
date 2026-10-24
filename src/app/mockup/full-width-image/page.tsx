import type { Metadata } from "next";
import type { ImageField } from "@prismicio/client";
import { FullWidthImage } from "@/slices/FullWidthImage";
import { MockupShell } from "../_shared/mockup-shell";

export const metadata: Metadata = {
  title: "Full width image slice",
  robots: { index: false, follow: false },
};

function image(
  url: string,
  alt: string,
  width: number,
  height: number,
): ImageField {
  return {
    id: url,
    url,
    alt,
    copyright: null,
    dimensions: { width, height },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  };
}

export default async function FullWidthImageMockup(
  props: PageProps<"/mockup/full-width-image">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <p className="mx-auto w-full max-w-wrap px-gutter pt-slice text-lg">
        This line is the writing column. The photo below is the same width.
      </p>
      <FullWidthImage
        primary={{
          image: image(
            "/mockup/posts/oestra-vs-winona.jpg",
            "Oestra and Winona boxes side by side",
            800,
            500,
          ),
          edge_to_edge: false,
          background: "Transparent",
          space_above: "Medium",
          space_below: "None",
        }}
      />
      <p className="mx-auto w-full max-w-wrap px-gutter pt-slice text-lg">
        Edge to edge is on. This photo runs to the edges of the window.
      </p>
      <FullWidthImage
        primary={{
          image: image(
            "/mockup/posts/oestra-vs-winona.jpg",
            "Oestra and Winona boxes, edge to edge",
            800,
            500,
          ),
          edge_to_edge: true,
          background: "Transparent",
          space_above: "Medium",
          space_below: "None",
        }}
      />
      <FullWidthImage
        primary={{
          image: image(
            "/mockup/peggy-winston.jpg",
            "Peggy sitting with Winston",
            1200,
            1600,
          ),
          edge_to_edge: false,
          background: "Pink",
          space_above: "Medium",
          space_below: "None",
        }}
      />
      <FullWidthImage
        primary={{
          image: image(
            "/mockup/peggy-winston.jpg",
            "Peggy sitting with Winston, edge to edge",
            1200,
            1600,
          ),
          edge_to_edge: true,
          background: "Pink",
          space_above: "Medium",
          space_below: "Large",
        }}
      />
    </MockupShell>
  );
}
