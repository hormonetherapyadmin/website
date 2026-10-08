// Maps one Wix blog post onto the Prismic Post document.
// Images stay as source URLs. The importer turns them into Prismic assets.

const SITE = "https://www.hormonetherapyhub.com";

type Span = {
  start: number;
  end: number;
  type: "strong" | "em" | "hyperlink" | "label";
  data?:
    | { link_type: "Web"; url: string; target?: "_blank" }
    | { label: "superscript" };
};

export type MappedText = {
  type:
    | "paragraph"
    | "heading2"
    | "heading3"
    | "heading4"
    | "list-item"
    | "o-list-item";
  text: string;
  spans: Span[];
};

export type MappedImage = {
  url: string;
  alt: string;
  filename: string;
};

export type MappedBlock =
  | MappedText
  | { type: "image"; image: MappedImage }
  | {
      type: "embed";
      oembed: {
        type: "video";
        embed_url: string;
        provider_name: "YouTube" | "Vimeo";
        title?: string;
        html: string;
      };
    };

export type MappedPost = {
  sourceId: string;
  uid: string;
  title: string;
  tags: string[];
  data: {
    title: MappedText[];
    sub_title: MappedText[];
    body: MappedBlock[];
    image: MappedImage | null;
    caption: MappedText[];
    published_date: string | null;
    meta_title: string | null;
    meta_description: string | null;
    indexing: true;
  };
  review: string[];
};

type Decoration = {
  type?: string;
  linkData?: { link?: { url?: string; target?: string } };
  fontSizeData?: { value?: number };
};

type WixNode = {
  type?: string;
  nodes?: WixNode[];
  textData?: { text?: string; decorations?: Decoration[] };
  headingData?: { level?: number };
  imageData?: {
    altText?: string;
    caption?: string;
    image?: {
      width?: number;
      height?: number;
      src?: { id?: string; url?: string };
    };
  };
  buttonData?: { text?: string; link?: { url?: string; target?: string } };
  videoData?: { title?: string; video?: { src?: { url?: string } } };
  galleryData?: {
    items?: Array<{
      image?: { media?: { src?: { id?: string; url?: string } } };
    }>;
  };
};

export type WixPostInput = {
  id?: string;
  title?: string;
  excerpt?: string;
  slug?: string;
  firstPublishedDate?: string;
  tagIds?: string[];
  media?: {
    altText?: string;
    wixMedia?: {
      image?: {
        id?: string;
        url?: string;
        altText?: string;
        filename?: string;
      };
    };
  };
  seoData?: {
    tags?: Array<{
      type?: string;
      disabled?: boolean;
      children?: string;
      props?: { name?: string; content?: string };
    }>;
  };
  richContent?: { nodes?: WixNode[] };
};

function textOf(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function absoluteUrl(url: string): string {
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${SITE}${url}`;
  return url;
}

function mediaUrl(
  src: { id?: string; url?: string } | undefined,
): string | null {
  if (!src) return null;
  if (src.url) return src.url;
  if (src.id) return `https://static.wixstatic.com/media/${src.id}`;
  return null;
}

function filenameFrom(url: string, id?: string): string {
  if (id) return id;
  const name = url.split("/").pop()?.split("?")[0];
  return name || "image";
}

function plain(text: string): MappedText[] {
  const value = text.replace(/\s+/g, " ").trim();
  if (!value) return [];
  return [{ type: "paragraph", text: value, spans: [] }];
}

function publishedDay(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function seoValue(post: WixPostInput, name: "title" | "description"): string {
  for (const tag of post.seoData?.tags ?? []) {
    if (tag.disabled) continue;
    if (
      name === "description" &&
      tag.type === "meta" &&
      tag.props?.name === "description"
    ) {
      return textOf(tag.props.content).trim();
    }
    if (name === "title" && tag.type === "title") {
      return textOf(tag.children).trim() || textOf(tag.props?.content).trim();
    }
  }
  return "";
}

function inline(nodes: WixNode[] | undefined): { text: string; spans: Span[] } {
  let text = "";
  const spans: Span[] = [];
  for (const node of nodes ?? []) {
    if (node.type !== "TEXT") continue;
    const piece = textOf(node.textData?.text);
    if (!piece) continue;
    const start = text.length;
    text += piece;
    const end = text.length;
    const decorations = node.textData?.decorations ?? [];
    const fontSize = decorations.find(
      (decoration) => decoration.type === "FONT_SIZE",
    )?.fontSizeData?.value;
    const citation = piece.trim();
    if (fontSize !== undefined && fontSize <= 10 && /^\d+$/.test(citation)) {
      const numberAt = piece.indexOf(citation);
      spans.push({
        start: start + numberAt,
        end: start + numberAt + citation.length,
        type: "label",
        data: { label: "superscript" },
      });
      continue;
    }
    for (const decoration of decorations) {
      if (decoration.type === "BOLD")
        spans.push({ start, end, type: "strong" });
      if (decoration.type === "ITALIC") spans.push({ start, end, type: "em" });
      if (decoration.type === "LINK") {
        const url = decoration.linkData?.link?.url;
        if (!url) continue;
        spans.push({
          start,
          end,
          type: "hyperlink",
          data: {
            link_type: "Web",
            url: absoluteUrl(url),
            ...(decoration.linkData?.link?.target === "BLANK"
              ? { target: "_blank" as const }
              : {}),
          },
        });
      }
    }
  }
  return { text, spans };
}

function headingType(level: number | undefined): MappedText["type"] {
  if (level === 3) return "heading3";
  if (level === 4) return "heading4";
  return "heading2";
}

type MapState = {
  review: Set<string>;
  coverId?: string;
  skippedCover: boolean;
  caption: MappedText[];
};

function imageOf(
  src: { id?: string; url?: string } | undefined,
  alt: string,
): MappedImage | null {
  const url = mediaUrl(src);
  if (!url) return null;
  return { url, alt, filename: filenameFrom(url, src?.id) };
}

function captionOf(node: WixNode): MappedText[] {
  const caption = (node.nodes ?? []).find((child) => child.type === "CAPTION");
  const inlineCaption = inline(caption?.nodes);
  if (inlineCaption.text.trim()) {
    return [
      {
        type: "paragraph",
        text: inlineCaption.text,
        spans: inlineCaption.spans,
      },
    ];
  }
  return plain(textOf(node.imageData?.caption));
}

function blocksFrom(
  nodes: WixNode[] | undefined,
  state: MapState,
): MappedBlock[] {
  const blocks: MappedBlock[] = [];
  for (const node of nodes ?? []) {
    if (node.type === "DIVIDER") continue;

    if (node.type === "PARAGRAPH" || node.type === "BLOCKQUOTE") {
      if (node.type === "BLOCKQUOTE") {
        blocks.push(...blocksFrom(node.nodes, state));
        continue;
      }
      const { text, spans } = inline(node.nodes);
      if (text.trim()) blocks.push({ type: "paragraph", text, spans });
      continue;
    }

    if (node.type === "HEADING") {
      const { text, spans } = inline(node.nodes);
      if (text.trim())
        blocks.push({
          type: headingType(node.headingData?.level),
          text,
          spans,
        });
      continue;
    }

    if (
      node.type === "BULLETED_LIST" ||
      node.type === "ORDERED_LIST" ||
      node.type === "CHECKBOX_LIST"
    ) {
      const itemType =
        node.type === "ORDERED_LIST" ? "o-list-item" : "list-item";
      for (const item of node.nodes ?? []) {
        for (const block of blocksFrom(item.nodes, state)) {
          blocks.push(
            block.type === "paragraph" ? { ...block, type: itemType } : block,
          );
        }
      }
      continue;
    }

    if (node.type === "IMAGE") {
      const file = imageOf(
        node.imageData?.image?.src,
        textOf(node.imageData?.altText),
      );
      const caption = captionOf(node);
      const isFirst = !state.skippedCover;
      state.skippedCover = true;
      if (
        isFirst &&
        state.coverId &&
        node.imageData?.image?.src?.id === state.coverId
      ) {
        if (state.caption.length === 0) state.caption = caption;
        continue;
      }
      if (!file) {
        state.review.add("image without a file");
        continue;
      }
      blocks.push({ type: "image", image: file });
      blocks.push(...caption);
      continue;
    }

    if (node.type === "BUTTON") {
      const url = node.buttonData?.link?.url;
      const label = textOf(node.buttonData?.text).trim() || url || "";
      if (!url || !label) continue;
      blocks.push({
        type: "paragraph",
        text: label,
        spans: [
          {
            start: 0,
            end: label.length,
            type: "hyperlink",
            data: {
              link_type: "Web",
              url: absoluteUrl(url),
              ...(node.buttonData?.link?.target === "BLANK"
                ? { target: "_blank" }
                : {}),
            },
          },
        ],
      });
      continue;
    }

    if (node.type === "VIDEO") {
      const url = node.videoData?.video?.src?.url;
      if (!url) {
        state.review.add("video without an address");
        continue;
      }
      const youtube = url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/);
      const vimeo = url.match(/vimeo\.com\/(\d+)/);
      const provider = vimeo ? "Vimeo" : "YouTube";
      const id = youtube?.[1] ?? vimeo?.[1];
      const html = id
        ? provider === "Vimeo"
          ? `<iframe src="https://player.vimeo.com/video/${id}"></iframe>`
          : `<iframe src="https://www.youtube.com/embed/${id}"></iframe>`
        : "";
      blocks.push({
        type: "embed",
        oembed: {
          type: "video",
          embed_url: url,
          provider_name: provider,
          ...(node.videoData?.title ? { title: node.videoData.title } : {}),
          html,
        },
      });
      continue;
    }

    if (node.type === "TABLE") {
      state.review.add("table");
      for (const row of node.nodes ?? []) {
        const cells = (row.nodes ?? [])
          .map((cell) =>
            inline(
              cell.nodes?.flatMap((child) => child.nodes ?? []),
            ).text.trim(),
          )
          .filter(Boolean);
        if (cells.length)
          blocks.push({
            type: "paragraph",
            text: cells.join(" · "),
            spans: [],
          });
      }
      continue;
    }

    if (node.type === "GALLERY") {
      state.review.add("gallery");
      for (const item of node.galleryData?.items ?? []) {
        const file = imageOf(item.image?.media?.src, "");
        if (file) blocks.push({ type: "image", image: file });
      }
      continue;
    }

    if (
      node.type &&
      node.type !== "TEXT" &&
      node.type !== "LIST_ITEM" &&
      node.type !== "CAPTION"
    ) {
      state.review.add(node.type.toLowerCase());
      blocks.push(...blocksFrom(node.nodes, state));
    }
  }
  return blocks;
}

export function mapWixPost(
  post: WixPostInput,
  tagLabels: ReadonlyMap<string, string> = new Map(),
): MappedPost {
  const title = textOf(post.title).trim();
  const excerpt = textOf(post.excerpt).trim();
  const metaTitle = seoValue(post, "title");
  const metaDescription = seoValue(post, "description");
  const cover = post.media?.wixMedia?.image;
  const review = new Set<string>();
  const state: MapState = {
    review,
    coverId: cover?.id,
    skippedCover: false,
    caption: [],
  };
  const tags: string[] = [];
  for (const id of post.tagIds ?? []) {
    const label = tagLabels.get(id);
    if (label) tags.push(label);
    else review.add("tag without a label");
  }

  return {
    sourceId: textOf(post.id),
    uid: textOf(post.slug),
    title,
    tags,
    data: {
      title: plain(title),
      sub_title: plain(excerpt),
      body: blocksFrom(post.richContent?.nodes, state),
      image: imageOf(
        cover?.url || cover?.id
          ? { id: cover?.id, url: cover?.url }
          : undefined,
        textOf(cover?.altText) || textOf(post.media?.altText),
      ),
      caption: state.caption,
      published_date: publishedDay(post.firstPublishedDate),
      meta_title: metaTitle && metaTitle !== title ? metaTitle : null,
      meta_description: metaDescription || null,
      indexing: true,
    },
    review: [...review],
  };
}
