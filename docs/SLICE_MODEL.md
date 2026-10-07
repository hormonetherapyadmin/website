# Slice model

Build reference for the homepage slices and the shared rules every later
slice uses. The broader document list lives in `docs/CONTENT_MODEL.md`.
Where this file gives a field an id, that id is the one to create.

The homepage mockup is the layout source. Peggy edits in Prismic. She is
used to WordPress and is not technical, so each slice is one visible
section, labels are plain, and a fact she reuses is edited on its own
document.

Article body slices, the provider page, and the trusted-providers page
are not specified yet. They follow the shared rules below.

## Document kinds

A public page is a Prismic page type. Something with no page of its own
is a custom type.

| Document | Kind | Why |
| --- | --- | --- |
| Homepage | Page type, single | The `/` page |
| Provider | Page type | Each clinic has a public page, and other pages read its facts |
| Article, Provider review, Comparison, Page | Page type | Public pages |
| Offer | Custom type | A coupon has no page |
| Callout | Custom type | A reusable box inside a post has no page |

A content relationship points at a document so the page can show that
document's fields. A link only goes somewhere. It does not bring the
price, the title, or the coupon with it.

Relationship fields can include fields from the linked document, two
levels deep. They cannot include a slice zone. Facts that another page
must read live in the static zone, above any slices.

## Shared rules

Prismic does not inherit fields. The same field ids are copied onto each
slice. One component reads them. The section wrapper is
`src/components/slice-section.tsx`. The rich text renderer is
`src/components/rich-text.tsx`. The hero slice is `src/slices/hero`.

### Section

Every slice starts with a non-repeatable group named `section`, labeled
**Section**. Groups cannot contain other groups, so the slice's own
repeatable groups sit beside it.

| Label | Id | Kind | Default |
| --- | --- | --- | --- |
| Small heading | `small_heading` | Heading rich text | Empty |
| Heading | `heading` | Heading rich text | Empty |
| Intro | `intro` | Heading rich text | Empty |
| Link | `link` | Link, with display text | Empty |
| Background | `background` | Select | Same as the page |
| Space above | `space_above` | Select | Medium |
| Space below | `space_below` | Select | None |

Small heading, Heading, Intro, and Link are the header. The link sits on
the heading's row, as "All posts" does. When all four are empty, the
slice has no header.

The Hero slice renders Heading as the page title (`h1`). Every other
slice renders it as a section heading (`h2`). A card title is an `h3`.
The small heading is a line above the title. She does not pick the level.

**Background** choices map to site color tokens:

- Same as the page
- Soft, the comparison band (`surface`)
- Highlight (`tint`)
- Dark, the "Peggy's take" band (`panel`)

A Dark section uses light text. These are token names, so a later palette
change updates every section. Do not use a free color picker.

**Space above** and **Space below** are the gap outside the slice. Both
are None, Small, Medium, or Large. The gap between two slices is set by
the lower slice's Space above. A background paints the slice itself and
keeps a fixed padding inside the color. That inner padding is not a
field.

**Section id.** Every section gets an id from its title, so a button on the
same page can scroll to it. "Feel like you again." becomes
`feel-like-you-again`. On the homepage that title is the tagline. On every
other slice it is the heading. An empty title leaves the section with no
id. A button uses that id with a hash, such as
`#eight-online-hrt-clinics-side-by-side` for the comparison heading
"Eight online HRT clinics, side by side." Changing the title changes the
id, so the button address has to change with it.

### Rich text

One `RichText` component renders every writing field. The field stores
Prismic structured text. The component turns it into HTML elements.
Imported Wix HTML is converted into that structure once, during
migration. Pages do not parse stored HTML.

Two toolbars share the component:

| Preset | Allows | Used for |
| --- | --- | --- |
| Heading | One block: paragraph, bold, italic, link | Titles, intros, quotes, captions, eyebrows |
| Content | Many blocks: Heading 2, Heading 3, Heading 4, paragraphs, bold, italic, links, lists, image, video embed, labels | Story body and article body |

Heading 1 is not on the content toolbar. The slice chooses the heading
tag for a Heading field, so a section title cannot become a second page
title.

Labels are extra formatting on selected words. Register them on the
content field's JSON (`labels`), not in the Type Builder. Handle them in
`RichText`.

| Label | Renders as |
| --- | --- |
| `highlight` | A phrase that stands out |
| `superscript` | A source number |

A label styles words. It does not insert a document.

Plain text stays in use for a name, a code, a price, and an icon choice.
Those values are data, not writing.

### Links

A button or text link is one link field with display text turned on. The
words and the destination are the same field. "Open in a new tab" is the
field's checkbox, used on affiliate visit links.

A list of links with no other fields is a repeatable link. Benefit links
and topic links are this.

A link whose words come from somewhere else, such as a card title or the
fixed "Start here" and "Read review" labels, does not use display text.

A link list with more than one look uses variants. The homepage buttons
are Solid, the filled button, or Ghost, the quieter text button. Other
links leave variants off.

### Lists of documents

A row with several fields is a repeatable group. A list of clinics or
posts is a repeatable group with one content relationship in each row.

## Homepage

Single page type. Use the page type's built-in metadata for the SEO
title, meta description, and social image.

Slices, in mockup order:

1. Hero
2. Start here
3. Latest posts
4. Clinic comparison
5. Peggy's take
6. My story

Each slice below lists only its own fields. Section is on all of them.

### Hero

One slice, three variations. Each variation includes the shared Section
group and lays the heading out itself. Section supplies the spacing and
background. The homepage section id comes from the tagline.

#### Home

The homepage. Section Heading is the page title. Section Intro is "My
goal is to share honest platform reviews…" The large line is Tagline,
not the title.

| Label | Id | Kind | Required | Mockup |
| --- | --- | --- | --- | --- |
| Tagline | `tagline` | Heading rich text | Yes | Feel like you again. |
| Benefits | `benefits` | Repeatable link, with display text | Yes | Lose weight, and the other four |
| Buttons | `button` | Repeatable link, with display text and a style | Yes | Solid: See what each clinic cost me. Ghost: New to HRT? Start here |
| Trust lines | `trust_lines` | Repeatable group | Yes | Patient since 2019, and the other two |
| Image | `image` | Image, including its description | Yes | Peggy's portrait |
| Words on the photo | `photo_greeting` | Text | No | Hi, I'm Peggy! |
| Caption | `caption` | Heading rich text | Yes | An experienced HRT patient reviewer. Not a doctor. |

Each trust line is one Text field, `text`. Hide Words on the photo when
it is empty. Add the buttons in the order they should appear. Solid is
the filled button. Ghost is the quieter text button, with an arrow. A
button with no words is hidden.

Image help: "Describe who is in the photo and what they are doing."

#### Subpage

Trusted providers, and later pages with the same shape. Section Small
heading is "Providers". Section Heading is the page title. Section Intro
is the dek. Section Link is "Full price chart".

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Clinics | `clinics` | Repeatable group | No |

Each clinic row:

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Clinic | `clinic` | Content relationship to Provider | Yes |
| Link | `link` | Link, no display text | Yes |

The logo and its name come from the clinic. The link is where the logo
goes. On trusted providers that is a jump link such as `#inner-balance`.

#### Provider

The top of a clinic page. The title is the clinic's name. The kicker is
Section Small heading when that is filled, otherwise the clinic's Top
choice label. The price, visit button, logo, and coupon come from the
clinic.

| Label | Id | Kind | Required | Mockup |
| --- | --- | --- | --- | --- |
| Clinic | `clinic` | Content relationship to Provider | Yes | Inner Balance |
| Voted best for | `voted` | Heading rich text | No | Voted best for sleep |
| Quote | `quote` | Heading rich text | No | The sleep quote |
| Links | `links` | Repeatable link, with display text | No | My 1-year review, Watch my review |
| Product image | `product` | Image | No | The Oestra jar |

The relationship fetches `name`, `logo`, `formulation`, `visit`,
`display_price`, `display_price_note`, `top_choice_label`, and the
offer's `code` and `display_copy`. The price card shows the formulation
when that field is filled, and the clinic name otherwise. `display_price`
is the price on the clinic page, such as 199. The comparison chart still
uses `monthly_price`.

### Start here

Section Heading is "Where should I start?"

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Cards | `cards` | Repeatable group | Yes |

Each card:

| Label | Id | Kind | Required | Example |
| --- | --- | --- | --- | --- |
| Small heading | `small_heading` | Heading rich text | Yes | Brand new to this |
| Heading | `heading` | Heading rich text | Yes | Is HRT for me? |
| Text | `text` | Heading rich text | Yes | The sentence under the title |
| Link | `link` | Link, no display text | Yes | `/ishrtforme` |
| Icon | `icon` | Select | Yes | Question, Lightbulb, Medicine, or Wallet |

The card is the link. The label "Start here" is part of the design.

### Latest posts

The same slice is "Keep reading" on the trusted-providers page and on a
blog post. Section Heading and Section Link are the title and "All
posts."

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Posts | `posts` | Repeatable group | Yes |
| Topic links | `topic_links` | Repeatable link, with display text | No |

Each post row has one field, `post`, a content relationship limited to
Article, Provider review, and Comparison. The first post is the large
card. Help: "Add them in order. The first one is the big card."

The card reads these fields. Use the same ids on all three page types:

| Label | Id | Kind |
| --- | --- | --- |
| Title | `title` | Heading rich text |
| Image | `image` | Image |
| Excerpt | `excerpt` | Heading rich text |
| Published | `published_date` | Date |
| Minutes to read | `read_time` | Number |

### Clinic comparison

Section Heading and Section Intro are the title and the HSA sentence.
The section id is the heading, and the hero button scrolls to it.

| Label | Id | Kind | Required | Mockup |
| --- | --- | --- | --- | --- |
| Prices checked on | `prices_checked` | Date | Yes | Sep 9, 2026, beside "What I paid per month" |
| Button | `button` | Link, with display text | No | Trusted providers |
| Disclosure | `disclosure` | Link, with display text | No | Affiliate disclosure |
| Clinics | `clinics` | Repeatable group | Yes | The clinics, in table order |

Each row has one field, `clinic`, a content relationship limited to
Provider. Help: "Add the clinics in the order they should appear. To
change a price, a quote, or a coupon, edit that clinic."

The columns stay fixed: Clinic, Best for, What I paid per month,
Insurance, Typically prescribed, In my words. The relationship fetches
the Provider fields in the next section, including `offer.code` and
`offer.display_copy`.

### Peggy's take

Section Heading is "Peggy's take: what I'm using now." Background is
Dark.

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Quote | `quote` | Heading rich text | Yes |
| Clinic | `clinic` | Content relationship to Provider | Yes |
| Text | `text` | Heading rich text | Yes |
| Reminder | `reminder` | Heading rich text | Yes |
| Review button | `review_button` | Link, with display text | No |

The logo, the clinic name, and the visit button come from the clinic.
The visit button is the clinic's `visit` link. She changes the affiliate
address on the clinic.

The reminder in the mockup is "This is my personal experience, not
medical advice."

### My story

Section holds the small heading, "Menopause isn't a dirty word," and the
lead sentence.

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Image | `image` | Image, including its description | Yes |
| Caption | `caption` | Heading rich text | No |
| Text | `text` | Content rich text | Yes |
| Closing line | `closing_line` | Heading rich text | No |
| Reminder | `reminder` | Heading rich text | Yes |
| Button | `button` | Link, with display text | No |

Text allows the content toolbar, including the link to her reviews. The
reminder in the mockup is "I am not a medical professional, and this site
does not provide medical advice or treatment plans."

## Documents the homepage reads

### Provider

Page type. The fields below are the static-zone facts the homepage
reads. The rest of the provider model in `docs/CONTENT_MODEL.md` stays,
and any fact another page must read also lives in the static zone. The
provider page's slices are the layout of that page only.

| Label | Id | Kind | Homepage use |
| --- | --- | --- | --- |
| Name | `name` | Text | Table, Peggy's take |
| Logo | `logo` | Image | Table, Peggy's take |
| Best for | `best_for` | Text | Table |
| Monthly price | `monthly_price` | Number | What I paid per month |
| Price note | `price_note` | Text | Line under the chart price |
| Display price | `display_price` | Text | Price on the clinic page, such as 199 |
| Display price note | `display_price_note` | Text | First six months, then $99. |
| Takes insurance | `insurance` | Boolean | Yes or no icon |
| Typically prescribed | `formulation` | Text | Table |
| In my words | `quote` | Heading rich text | Table quote |
| Extra note | `note` | Heading rich text | Line under the quote |
| Review | `review` | Content relationship to her review | "Read review" uses a fixed label |
| Visit | `visit` | Link, with display text, open in a new tab | Clinic name links out. Peggy's take uses this as the visit button |
| Personally tested | `personally_tested` | Boolean | The tested seal |
| Top choice label | `top_choice_label` | Text | Star badge. Blank means no badge |
| Offer | `offer` | Content relationship to Offer | Code line |

An empty Visit link means the name is not a link.

### Offer

Custom type. The full field list is in `docs/CONTENT_MODEL.md`. The
homepage reads two of them through the clinic:

| Label | Id | Kind | Example |
| --- | --- | --- | --- |
| Code | `code` | Text | PEGGY10 |
| Display copy | `display_copy` | Heading rich text | 10% off your first order |

The visit address stays on the clinic's `visit` link.

### Callout

Custom type. A rich text field cannot contain a Provider, an Offer, or a
Callout. In a post, she writes in a content field, then inserts a Callout
slice between those blocks. The slice's only field is `callout`, a
content relationship to this type. Changing the callout updates every
post that uses it.

| Label | Id | Kind |
| --- | --- | --- |
| Name | `name` | Text. The name she sees in the picker |
| Style | `style` | Select: Note or Offer |
| Text | `text` | Content rich text |
| Clinic | `clinic` | Content relationship to Provider, optional |
| Offer | `offer` | Content relationship to Offer, optional |

A Note is the personal-review box at the top of a post. An Offer is a
box like the Musely and Joi callouts: the code and the visit link come
from the linked Offer and clinic, and the sentence for that post lives
in Text.

The Callout slice is not on the homepage. It is the pattern for article
body slices, which are still to be specified.
