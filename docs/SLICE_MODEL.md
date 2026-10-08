# Slice model

Build reference for the homepage slices and the shared rules every later
slice uses. The broader document list lives in `docs/CONTENT_MODEL.md`.
Where this file gives a field an id, that id is the one to create.

The homepage mockup is the layout source. Peggy edits in Prismic. She is
used to WordPress and is not technical, so each slice is one visible
section, labels are plain, and a fact she reuses is edited on its own
document.

The article and the blog index are page types with fields and no slice
zone. They are specified below. The provider page and the
trusted-providers page are not specified yet. They follow the shared
rules below.

## Document kinds

A public page is a Prismic page type. A document other pages read is a
custom type. The clinic is a custom type, and it still has a public
page when its URL section is set.

| Document | Kind | Why |
| --- | --- | --- |
| Homepage | Page type, single | The `/` page |
| Blog | Page type, single | The `/blog` page |
| Provider | Custom type | The clinic every slice links to. File: `customtypes/provider` |
| Article | Page type | A blog post. File: `customtypes/article` |
| Provider review, Comparison, Page | Page type | Public pages |
| Offer | Custom type | A coupon has no page |
| Callout | Custom type | A reusable box inside a post has no page |

A content relationship points at a document so the page can show that
document's fields. A link only goes somewhere. It does not bring the
price, the title, or the coupon with it.

A slice that shows a clinic stores the relationship and nothing else
about that clinic. The slice names which provider fields it fills in.
She edits the price on the clinic, and every slice that fills in that
price shows the new number. A slice does not get its own price field,
coupon field, or logo field.

Relationship fields can include fields from the linked document, two
levels deep. They cannot include a slice zone. Facts that another page
must read live in the static zone, above any slices. A story cannot
hold a relationship inside a paragraph, so a clinic box in a story uses
the token described under Article. The token reads the same clinic
fields a slice would.

## Shared rules

Prismic does not inherit fields. The same field ids are copied onto each
slice. One component reads them. The section wrapper is
`src/components/slice-section.tsx`. The rich text renderer is
`src/components/rich-text.tsx`. The hero slice is `src/slices/hero`.

### Section

Every slice except the Divider starts with a non-repeatable group named
`section`, labeled **Section**. Groups cannot contain other groups, so
the slice's own repeatable groups sit beside it. The Divider lists
Background, Space above, and Space below on the slice itself.

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

### Divider

A line between slices. It does not use the Section group. Background,
Space above, and Space below are fields on the slice, with the same
choices as Section. Both spacing fields default to None, so the line does
not add a gap until she asks for one.

| Label | Id | Kind | Default |
| --- | --- | --- | --- |
| Line | `line` | Select | Squiggly |
| Color | `color` | Select | Accent |
| Background | `background` | Select | Same as the page |
| Space above | `space_above` | Select | None |
| Space below | `space_below` | Select | None |

Line is Squiggly or Straight. Those are the two rules in the mockups.
Color is Accent, Soft, Border, or Text. Soft is the lighter accent used
by the homepage wave. Accent, Border, and Text use those color tokens.
There is no free color picker.

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

One slice, four variations. Each variation includes the shared Section
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

A normal interior page. Section Small heading, Heading, Intro, and Link
are the kicker, the page title, the dek, and the text link.

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Image | `image` | Image, including its description | No |

Hide the photo when the image is empty. Image help: "Describe who is in
the photo and what they are doing."

#### Brands

Trusted providers. Section Small heading is "Providers". Section Heading
is the page title. Section Intro is the dek. Section Link is "Full price
chart".

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

The same slice is "Keep reading" on the trusted-providers page. Section
Heading and Section Link are the title and "All posts." An article does
not use this slice. Its "Keep reading" block reads the article's
Related posts field, and the heading and the "All posts" link are part
of that page's layout.

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Posts | `posts` | Repeatable group | Yes |

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

## Provider, Offer, and Callout

### Provider

Custom type, in `customtypes/provider`. One clinic, one document.
Peggy fills it in tabs. A tab is a group of fields in the editor.
Every tab is static, so a slice or a story token can read it. The
clinic page's slices are not in this type yet.

The UID is the id a story token uses, such as `inner-balance`.

Slices point at this document with a content relationship. Each slice
fills itself from the fields it lists. Monthly price is one field.
The comparison chart, a facts token, and any later slice that lists
`monthly_price` all show that same number.

| Place | Points with | Fills in |
| --- | --- | --- |
| Hero, brands | `clinic` | Name, logo |
| Hero, provider | `clinic` | Name, logo, formulation, visit, display price, display price note, top choice label, offer code, offer copy |
| Clinic comparison | `clinic` | Name, logo, best for, monthly price, price note, insurance, formulation, quote, extra note, tested seal, top choice label, review, visit, offer code, offer copy |
| Peggy's take | `clinic` | Logo, name, visit |
| Article sidebar | `clinic` | Name, logo, review |
| Story offer token | `{{provider:uid:offer}}` | Logo, name, visit, offer code, offer copy, plus the sentence in that paragraph |
| Story facts token | `{{provider:uid:facts}}` | Monthly price, price note, insurance, formulation |

#### Profile

Who the clinic is. The homepage, the offer box, and the sidebar read
this tab.

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Name | `name` | Text | Yes |
| Logo | `logo` | Image | Yes |
| Short description | `short_description` | Heading rich text | No |
| Best for | `best_for` | Text | No |
| Official website | `website` | Link, no display text | No |
| Visit | `visit` | Link, with display text, open in a new tab | No |
| Personally tested | `personally_tested` | Boolean | Yes |
| Testing notes | `testing_notes` | Heading rich text | No |
| Facts checked | `last_verified_date` | Date | No |
| Top choice label | `top_choice_label` | Text | No |
| Source notes | `source_notes` | Heading rich text | No |

An empty Visit link means the name is not a link. A blank Top choice
label means no badge. Facts checked is the date the prices and care
details were last confirmed. Nothing else writes that date.

#### Price

What she paid, and what the clinic page shows.

| Label | Id | Kind | Example |
| --- | --- | --- | --- |
| Monthly price | `monthly_price` | Number | What I paid per month |
| Price note | `price_note` | Text | Line under the chart price |
| Display price | `display_price` | Text | 199, on the clinic page |
| Display price note | `display_price_note` | Text | First six months, then $99. |
| Consultation fee | `consultation_fee` | Text | No visit, or $150 |
| Membership fee | `membership_fee` | Text | Blank when there is none |

The comparison chart uses Monthly price. The clinic page uses Display
price.

#### Care

How the clinic works. The clinic page reads this tab. The facts token
reads Formulation and Takes insurance from it, plus the price fields.

| Label | Id | Kind |
| --- | --- | --- |
| Typically prescribed | `formulation` | Text |
| Lab requirement | `lab_requirement` | Text |
| Lab notes | `lab_notes` | Heading rich text |
| Takes insurance | `insurance` | Boolean |
| HSA / FSA | `hsa_fsa` | Text |
| Shipping | `shipping` | Text |
| Eligibility | `eligibility` | Heading rich text |
| State availability | `state_availability` | Text |
| Treatments | `treatments` | Repeatable group |
| Weight support | `weight_support` | Text |

Each treatment row has one field, `treatment`, a content relationship
to Treatment.

#### Words

Short lines in Peggy's voice. The long review stays on the Provider
review document.

| Label | Id | Kind | Homepage use |
| --- | --- | --- | --- |
| In my words | `quote` | Heading rich text | The table quote |
| Extra note | `note` | Heading rich text | The line under the quote |
| Pros | `pros` | Repeatable group | |
| Cons | `cons` | Repeatable group | |

Each pro and each con is one Text field, `text`.

#### Offer

| Label | Id | Kind |
| --- | --- | --- |
| Offer | `offer` | Content relationship to Offer |

The homepage code line and the story offer box read `code` and
`display_copy` through this field. The visit address stays on Visit.

#### Links

| Label | Id | Kind |
| --- | --- | --- |
| Review | `review` | Content relationship to her review |
| Related | `related` | Repeatable group |

"Read review" uses a fixed label. Each related row has one field,
`item`, a content relationship limited to Article, Provider review,
and Comparison.

#### SEO

Meta title, meta description, and social image. URL section and
Indexing sit here too. URL section adds "No public page", and that is
the default. A clinic with no public page stays a document slices can
link to.

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
Callout, so a page that wants one between paragraphs needs a slice. The
article does not. Its personal note is a field. An offer box in the
story is a provider token, described under Article.

Nothing in the homepage or the article points at a Callout yet. The
fields stay as specified for a later page:

| Label | Id | Kind |
| --- | --- | --- |
| Name | `name` | Text. The name she sees in the picker |
| Style | `style` | Select: Note or Offer |
| Text | `text` | Content rich text |
| Clinic | `clinic` | Content relationship to Provider, optional |
| Offer | `offer` | Content relationship to Offer, optional |

An Offer box reads the code and the visit link from the linked Offer
and clinic. The sentence for that spot lives in Text.

## Article

Repeatable page type, in `customtypes/article`. No slice zone. One Wix
blog post becomes one Article. The layout is the blog post mockup. The card fields are the
same ids the Latest posts slice already reads: `title`, `image`,
`excerpt`, `published_date`, and `read_time`.

Use the page type's SEO tab for the meta title, meta description, and
social image. An empty meta title uses the post title. An empty social
image uses Image. An empty meta description uses Excerpt. On the live
site the meta description and the excerpt are different sentences, so
migration fills both.

Sampled from the live site in October 2026: the post sitemap lists 142
posts, the feed lists the latest 20, and 18 posts were read in full.
Categories are unused. The categories sitemap contains only `/blog`.
Every sampled post is by Peggy, has a cover image, a read time, and a
meta description that is not the excerpt. Tags are sparse and messy.
Confirm `relatedPostIds`, `featured`, and `commentingEnabled` when the
Wix API is available. The page does not use featured or comments.

### Fields

| Label | Id | Kind | Required | Comes from |
| --- | --- | --- | --- | --- |
| Title | `title` | Heading rich text | Yes | Wix title. The page title and the card |
| URL section | `url_section` | Select | Yes | Blog post, unless the manifest says otherwise |
| Excerpt | `excerpt` | Heading rich text | No | Wix excerpt. The card and the feed |
| Dek | `dek` | Heading rich text | No | Mockup only. Live posts have none |
| Image | `image` | Image, including its description | Yes | Wix cover |
| Caption | `caption` | Heading rich text | No | The line under the cover, when that photo has one |
| Author | `author` | Content relationship to Author | Yes | Peggy |
| Published | `published_date` | Date | Yes | Wix first published date |
| Updated | `updated_date` | Date | No | Wix last published date |
| Minutes to read | `read_time` | Number | Yes | Wix read time, in minutes |
| Category | `category` | Select | No | Mockup only. Wix posts have no category |
| Personal note | `note` | Heading rich text | No | Mockup only. The box above the story |
| Story | `body` | Content rich text | Yes | Wix rich content |
| Sources | `sources` | Repeatable group | No | Mockup only |
| Tags | `tags` | Repeatable group | No | Wix tags |
| Topics | `topics` | Repeatable group | No | Not in Wix. Peggy files the post |
| Treatments | `treatments` | Repeatable group | No | Not in Wix |
| Clinics | `clinics` | Repeatable group | No | Not in Wix. The sidebar |
| Related posts | `related` | Repeatable group | No | Wix related posts, when the API sends them |
| Canonical | `canonical` | Link, no display text | No | Only when the post should point elsewhere |
| Indexing | `indexing` | Select | Yes | Index. Change it only to hide a post |

URL section choices are "Blog post (/post/…)" and "Site page (/…)".
New posts default to Blog post. The UID is the Wix slug.

Category choices are Review, Comparison, My experience, and HRT 101.
Empty means no kicker. These are not Category documents and they are
not public pages. The `?type=` filter on the blog mockup stays off
the public site until an indexing decision says otherwise.

Indexing choices are Index and No index. Index is the default. The
site-wide noindex switch still hides every page until cutover.

Show Updated only when its calendar day differs from Published. Store
the Wix date either way. Nothing else writes this date. She changes
it when she revises the story.

Hide Dek, Caption, Personal note, Sources, Tags, and the clinics
sidebar when those fields are empty. The personal-note label
"Personal review note" is part of the layout. The field is the
sentence.

Image help: "Describe the photo. This is the text a screen reader
reads." Caption help: "The line under the photo. It can include a
link." Excerpt help: "The card and the feed. One or two sentences."
Minutes to read help: "Change this if the story gets much longer or
shorter."

### Story

One Content field. It allows the content toolbar: Heading 2, Heading
3, Heading 4, paragraphs, bold, italic, links, lists, image, video
embed, and the highlight and superscript labels.

"In this post" is the Heading 2 lines, in order. The rail uses that
heading text. The short labels in the mockup ("Age 52 to 59") are not
a field. A Heading 3 stays in the story and does not join the rail.
The section id is the heading, by the same rule as slices.

A photo in the story has a description and can be a link. Prismic
calls the other line on that photo Copyright, so the caption is not
stored there. The caption is the paragraph under the photo. If the
first photo is the same file as Image, move its caption into Caption
and do not repeat the photo.

| Wix block | Becomes |
| --- | --- |
| Paragraph | Paragraph |
| Heading | Heading 2, 3, or 4. A heading 1 in the story becomes Heading 2 |
| Bold, italic | Bold, italic |
| Underline | The words, without the underline |
| Link | Link. Keep the full address, including affiliate parameters |
| Image | Image, then its caption as the next paragraph |
| Two photos side by side | Two images, each with its caption |
| Button | A paragraph that is only that link |
| YouTube or other video | Video embed |
| List | List |
| Quote | A paragraph. The story has no quote block |
| Table | The same words, written out under the heading they sat under, and a migration flag |
| Empty line used as spacing | Dropped |
| File, custom HTML, poll, or code | Not dropped. The migration report lists the post for manual review |

Tables showed up in several of the 18 posts, usually a pricing or lab
grid in the middle of the story. One rich text field cannot hold a
table. Writing the cells out keeps the words. The flag is there so
Peggy can check that the grid still reads. A grid that is only one
clinic's current price and formulation can later be replaced with a
facts token. A grid that compares several clinics, or lists lab
markers, stays written out. Those words are not on the clinic.

### Clinic tokens

A paragraph can start with a token. The renderer loads that clinic and
replaces the token with a component. The component reads the tabs
above. Import does not write tokens. A caption or a link comes across
as itself, and Peggy adds a token when she wants the designed box.

```
{{provider:musely:offer}} Of all of the eye products I've tried, this one is my favorite.
```

```
{{provider:inner-balance:facts}}
```

The middle word is the clinic's UID. The last word is the part.

| Part | Renders | Reads |
| --- | --- | --- |
| `offer` | The offer box: logo, name, visit button, code | Profile and Offer. The sentence is the rest of the paragraph. If the paragraph is only the token, the sentence is the offer's display copy |
| `facts` | One clinic's price, price note, insurance, and formulation | Price and Care |

The token is the first thing in the paragraph. A facts token is the
whole paragraph. Any other last word is ordinary text. In preview, an
unknown clinic shows an error where the box would be. On the public
site that token is removed and the rest of the paragraph stays.

Story help: "To add a clinic's offer, start a paragraph with
{{provider:inner-balance:offer}} and use that clinic's id. Write your
sentence after it. {{provider:inner-balance:facts}} adds that clinic's
price and formulation."

A token does not add the clinic to the sidebar. The Clinics field does
that. Another part can be added later by teaching the renderer a new
word. It reads fields that are already on a tab. The story still has
no slices.

### Groups

Sources. The number is the row order. A superscript in the story links
to that number.

| Label | Id | Kind | Required | Example |
| --- | --- | --- | --- | --- |
| Link | `link` | Link, with display text | Yes | Journal of Clinical and Aesthetic Dermatology |
| Detail | `detail` | Text | No | PubMed Central |

Tags. One text field, `name`. These are the Wix tags, kept so the
import does not drop them. They are not Topics, and they are not links.
Public `/blog/tags/…` addresses still need a disposition in the URL
manifest. "Filed under" shows the names.

Topics. One field, `topic`, a content relationship to Topic.

Treatments. One field, `treatment`, a content relationship to Treatment.

Clinics. One field, `clinic`, a content relationship to Provider.
Help: "Add them in the order they should appear. The sidebar shows the
first four." The logo, the name, and the review link come from the
clinic. "Compare all clinics" is part of the layout, not a field.

Related posts. One field, `post`, a content relationship limited to
Article, Provider review, and Comparison. Help: "Add them in order.
Leave this empty to show the three newest posts." The card reads the
same five fields as Latest posts. "Keep reading" and "All posts" are
part of the layout.

### What the page derives

Breadcrumbs are Home, Blog, and the title. The byline and the author
block read the Author document: name, photo, and short bio. "Read my
whole story" and "How I review" are the about page and the editorial
standards page. The disclosure line is the site affiliate disclosure.
Share has no fields.

### Wix fields this page does not store

Commenting, featured, pinned, language, pricing plan, and the Wix
member id. Author replaces the member. Category is assigned here, not
imported. Keyword meta tags are not copied.

## Blog

Single page type for `/blog`. No slice zone. The path is `/blog`, the
same way the homepage path is `/`. It does not use URL section.

The post grid, the category filter, and the page numbers are not
fields. The grid is every Article whose URL section is Blog post,
newest first. The first post is the large card. Page addresses stay
`/blog` and `/blog/page/N`.

Use the SEO tab for the meta title, meta description, and social
image. The live meta title is "Blog Posts and information on
Bioidentical Hormone Replacement Therapies", which is not the visible
title.

| Label | Id | Kind | Required | Mockup |
| --- | --- | --- | --- | --- |
| Title | `title` | Heading rich text | Yes | Blog |
| Dek | `dek` | Heading rich text | No | Clinic reviews, pricing, and what I've learned using hormone therapy. |
| Heading | `heading` | Heading rich text | Yes | Why would I want to consider starting my HRT Journey… |
| Intro | `intro` | Heading rich text | No | There are several reasons why someone might consider buying Hormone Replacement Therapy (HRT) online: |
| Reasons | `reasons` | Repeatable group | Yes | Convenience, and the other four |

Each reason:

| Label | Id | Kind | Required | Example |
| --- | --- | --- | --- | --- |
| Label | `label` | Text | Yes | Convenience |
| Text | `text` | Heading rich text | Yes | The sentence under the label |
| Icon | `icon` | Select | Yes | Clock, Lock, Medicine, Wallet, or Location |

The five reasons are the copy at the bottom of the live `/blog` page.
