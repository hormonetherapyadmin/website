// Maps one Wix blog post onto the Prismic Post document.
// Images stay as source URLs. The importer turns them into Prismic assets.

import { createHash } from "node:crypto";

const SITE = "https://www.hormonetherapyhub.com";

export type MappedLink = { link_type: "Web"; url: string; target?: "_blank" };

type Span = {
  start: number;
  end: number;
  type: "strong" | "em" | "hyperlink" | "label";
  data?: MappedLink | { label: "superscript" };
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
  | { type: "image"; image: MappedImage; link?: MappedLink }
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

type MappedCell<Type extends "header" | "data"> = {
  key: string;
  type: Type;
  content: MappedText[];
};

export type MappedTable = {
  head?: { rows: { key: string; cells: MappedCell<"header">[] }[] };
  body: { rows: { key: string; cells: MappedCell<"data">[] }[] };
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
    tables: { table: MappedTable }[];
    image: MappedImage | null;
    caption: MappedText[];
    published_date: string | null;
    meta_title: string | null;
    meta_description: string | null;
    indexing: true;
  };
  /** Things Peggy checks in Prismic after import. */
  review: string[];
  /** Things that stop the import until the mapper handles them. */
  problems: string[];
  /** Wix content changed or left out on purpose, listed in the report. */
  changes: string[];
};

type WixLink = { url?: string; target?: string };

type Decoration = {
  type?: string;
  linkData?: { link?: WixLink };
  fontSizeData?: { value?: number };
};

type WixNode = {
  type?: string;
  id?: string;
  nodes?: WixNode[];
  textData?: { text?: string; decorations?: Decoration[] };
  headingData?: { level?: number };
  imageData?: {
    altText?: string;
    caption?: string;
    link?: WixLink;
    image?: {
      width?: number;
      height?: number;
      src?: { id?: string; url?: string };
    };
  };
  buttonData?: { text?: string; link?: WixLink };
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
  const value = url.trim();
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `${SITE}${value}`;
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) return value;
  // Wix stores some links without a scheme, such as "winona.pxf.io/daBV57".
  if (/^[\w-]+(\.[\w-]+)+([/?#]|$)/.test(value)) return `https://${value}`;
  return value;
}

function isWebAddress(url: string): boolean {
  try {
    return ["http:", "https:", "mailto:", "tel:"].includes(
      new URL(url).protocol,
    );
  } catch {
    return false;
  }
}

/**
 * Wix turned some sentences into links: "product. It" became
 * http://product.It on the text "I". A bare http host with an unusual
 * ending, on text that does not name it, is one of those.
 */
function isWordLink(url: string, text: string): boolean {
  const host = url.match(/^http:\/\/([^/?#]+)\/?$/i)?.[1];
  if (!host) return false;
  if (/\.(com|org|net|gov|edu|io|co|us|uk|health)$/i.test(host)) return false;
  return !text.toLowerCase().includes(host.toLowerCase());
}

/**
 * A link to this site, on the www host and in lowercase like every page
 * address. A redirected address points at its destination, and a post
 * that no longer exists points at the blog.
 */
function siteUrl(url: string, state: MapState): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  if (!/^(www\.)?hormonetherapyhub\.com$/i.test(parsed.hostname)) return url;

  const path = parsed.pathname.toLowerCase().replace(/(.)\/$/, "$1");
  let destination = state.redirects.get(path);
  const postSlug = path.match(/^\/post\/([^/]+)$/)?.[1];
  if (!destination && postSlug && state.postSlugs?.has(postSlug) === false) {
    destination = "/blog";
  }
  if (destination) {
    state.changes.add(`link to ${path} now goes to ${destination}`);
    return `${SITE}${destination}`;
  }
  return `${SITE}${path}${parsed.search}${parsed.hash}`;
}

function webLink(
  link: WixLink | undefined,
  state: MapState,
): MappedLink | null {
  if (!link?.url?.trim()) return null;
  const url = siteUrl(absoluteUrl(link.url), state);
  if (!isWebAddress(url)) {
    state.problems.add(`link that is not a web address: ${link.url}`);
  }
  return {
    link_type: "Web",
    url,
    ...(link.target === "BLANK" ? { target: "_blank" as const } : {}),
  };
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

function inline(
  nodes: WixNode[] | undefined,
  state: MapState,
): { text: string; spans: Span[] } {
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
        const link = webLink(decoration.linkData?.link, state);
        if (link && isWordLink(link.url, piece)) {
          state.changes.add(
            `removed a link Wix made from ordinary words: ${link.url}`,
          );
        } else if (link) {
          spans.push({ start, end, type: "hyperlink", data: link });
        }
      }
      if (decoration.type === "ANCHOR") state.review.add("jump link");
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
  problems: Set<string>;
  changes: Set<string>;
  redirects: ReadonlyMap<string, string>;
  postSlugs?: ReadonlySet<string>;
  postId: string;
  coverId?: string;
  skippedCover: boolean;
  caption: MappedText[];
  tables: { table: MappedTable }[];
};

/** Prismic wants a unique key on each row and cell. Wix node ids keep reruns identical. */
function tableKey(...parts: (string | number | undefined)[]): string {
  const hex = createHash("sha1").update(parts.join(":")).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/** One paragraph per cell. A blank Wix line becomes a line break. */
function cellContent(cell: WixNode, state: MapState): MappedText[] {
  let text = "";
  const spans: Span[] = [];
  for (const paragraph of cell.nodes ?? []) {
    const line = inline(paragraph.nodes, state);
    if (!line.text.trim()) continue;
    const offset = text ? text.length + 1 : 0;
    text = text ? `${text}\n${line.text}` : line.text;
    for (const span of line.spans) {
      spans.push({
        ...span,
        start: span.start + offset,
        end: span.end + offset,
      });
    }
  }
  return [{ type: "paragraph", text, spans }];
}

function isBoldCell(cell: MappedText[]): boolean {
  const [{ text, spans }] = cell;
  const strong = spans.filter((span) => span.type === "strong");
  return (
    text.trim() !== "" &&
    text
      .split("")
      .every(
        (unit, index) =>
          !unit.trim() ||
          strong.some((span) => span.start <= index && index < span.end),
      )
  );
}

function tableOf(node: WixNode, state: MapState, postId: string): MappedTable {
  const rows = (node.nodes ?? []).map((row, rowIndex) => ({
    key: tableKey(postId, row.id, rowIndex),
    cells: (row.nodes ?? []).map((cell, cellIndex) => ({
      key: tableKey(postId, row.id, cell.id, rowIndex, cellIndex),
      content: cellContent(cell, state),
    })),
  }));
  const [first, ...rest] = rows;
  const filled = first?.cells.filter(({ content }) => content[0].text.trim());
  const hasHead =
    rest.length > 0 &&
    !!filled?.length &&
    filled.every(({ content }) => isBoldCell(content));
  const asCells = <Type extends "header" | "data">(
    row: (typeof rows)[number],
    type: Type,
  ) => ({
    key: row.key,
    cells: row.cells.map((cell) => ({ ...cell, type })),
  });

  return {
    ...(hasHead ? { head: { rows: [asCells(first, "header")] } } : {}),
    body: {
      rows: (hasHead ? rest : rows).map((row) => asCells(row, "data")),
    },
  };
}

function imageOf(
  src: { id?: string; url?: string } | undefined,
  alt: string,
): MappedImage | null {
  const url = mediaUrl(src);
  if (!url) return null;
  return { url, alt, filename: filenameFrom(url, src?.id) };
}

function captionOf(node: WixNode, state: MapState): MappedText[] {
  const caption = (node.nodes ?? []).find((child) => child.type === "CAPTION");
  const inlineCaption = inline(caption?.nodes, state);
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
      const { text, spans } = inline(node.nodes, state);
      if (text.trim()) blocks.push({ type: "paragraph", text, spans });
      continue;
    }

    if (node.type === "HEADING") {
      const { text, spans } = inline(node.nodes, state);
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
      const caption = captionOf(node, state);
      const link = webLink(node.imageData?.link, state);
      // A linked photo is the link's only name for a screen reader, so it
      // takes the caption when Wix has no description.
      const alt =
        textOf(node.imageData?.altText).trim() ||
        (link ? caption.map((line) => line.text.trim()).join(" ") : "");
      const file = imageOf(node.imageData?.image?.src, alt);
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
      if (link && !alt) state.review.add("linked photo with no description");
      blocks.push({ type: "image", image: file, ...(link ? { link } : {}) });
      blocks.push(...caption);
      continue;
    }

    if (node.type === "BUTTON") {
      const link = webLink(node.buttonData?.link, state);
      const label = textOf(node.buttonData?.text).trim() || link?.url || "";
      if (!link || !label) continue;
      blocks.push({
        type: "paragraph",
        text: label,
        spans: [{ start: 0, end: label.length, type: "hyperlink", data: link }],
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
      state.tables.push({ table: tableOf(node, state, state.postId) });
      const number = state.tables.length;
      const token = number === 1 ? "{{table}}" : `{{table${number}}}`;
      blocks.push({ type: "paragraph", text: token, spans: [] });
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

export type MapContext = {
  /** Wix tag id → label. */
  tagLabels?: ReadonlyMap<string, string>;
  /** Approved redirects, old path → destination path. */
  redirects?: ReadonlyMap<string, string>;
  /** Every saved post slug. A link to any other post goes to the blog. */
  postSlugs?: ReadonlySet<string>;
};

export function mapWixPost(
  post: WixPostInput,
  { tagLabels = new Map(), redirects = new Map(), postSlugs }: MapContext = {},
): MappedPost {
  const title = textOf(post.title).trim();
  const excerpt = textOf(post.excerpt).trim();
  const metaTitle = seoValue(post, "title");
  const metaDescription = seoValue(post, "description");
  const cover = post.media?.wixMedia?.image;
  const review = new Set<string>();
  const problems = new Set<string>();
  const changes = new Set<string>();
  const state: MapState = {
    review,
    problems,
    changes,
    redirects,
    postSlugs,
    postId: textOf(post.id),
    coverId: cover?.id,
    skippedCover: false,
    caption: [],
    tables: [],
  };
  const body = blocksFrom(post.richContent?.nodes, state);
  const tags: string[] = [];
  for (const id of post.tagIds ?? []) {
    const label = tagLabels.get(id)?.trim();
    if (!label) review.add("tag without a label");
    else if (!tags.some((tag) => tag.toLowerCase() === label.toLowerCase())) {
      tags.push(label);
    }
  }

  return {
    sourceId: textOf(post.id),
    uid: textOf(post.slug),
    title,
    tags,
    data: {
      title: plain(title),
      sub_title: plain(excerpt),
      body,
      tables: state.tables,
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
    problems: [...problems],
    changes: [...changes],
  };
}
