# Slice model

Build reference for the homepage slices and the shared rules every later
slice uses. The broader document list lives in `docs/CONTENT_MODEL.md`.
Where this file gives a field an id, that id is the one to create.

The homepage mockup is the layout source. Peggy edits in Prismic. She is
used to WordPress and is not technical, so each slice is one visible
section, labels are plain, and a fact she reuses is edited on its own
document.

The post and the blog index are page types with fields and no slice
zone. They are specified below. The provider page and the
trusted-providers page are not specified yet. They follow the shared
rules below.

## Document kinds

A public page is a Prismic page type. A document other pages read is a
custom type. The clinic has no public page. A clinic page is a Page.

| Document | Kind | Why |
| --- | --- | --- |
| Homepage | Page type, single | The `/` page |
| Blog | Page type, single | The `/blog` page |
| Provider | Custom type | The clinic every slice links to. File: `customtypes/provider` |
| Post | Page type | A blog post. File: `customtypes/post` |
| Provider review, Comparison, Page | Page type | Public pages |
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
the token described under Post. The token reads the same clinic
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
- Dark, the quote band (`panel`)

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
| Content | Many blocks: Heading 2, Heading 3, Heading 4, paragraphs, bold, italic, links, lists, image, video embed, labels | Story body and post body |

Heading 1 is not on the content toolbar. The slice chooses the heading
tag for a Heading field, so a section title cannot become a second page
title.

Labels are extra formatting on selected words. Register them on the
content field's JSON (`labels`), not in the Type Builder. Handle them in
`RichText`.

| Label | Renders as |
| --- | --- |
| `highlight` | A phrase that stands out |
| `superscript` | A source number. Registered on every rich text field |
| `signoff` | The large closing line, when the label covers the whole paragraph |
| `note` | The tint box, when the label covers the whole paragraph |

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
5. Quote
6. Side by side

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
`monthly_price`, `price_note`, `top_choice_label`, `code`, and
`code_note`. The price card shows the formulation when
that field is filled, and the clinic name otherwise. The price is the
clinic's one monthly price.

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

A row holds at most four cards. One card is half the row, centered.
Two cards are halves. Three are thirds. Four are quarters. Five or
more fill rows of four, and the leftover row follows the same rule.

### Latest posts

One slice, four variations, in `src/slices/posts`. The page loads the
posts and passes them in. The slice does not store a hand-picked list.
Every variation lists them newest first by Published. Category limits
that list. All uses every post.

The grid tabs are this Category: Review, Comparison, My experience, and
HRT 101. That is the label on the card. Topic documents stay the browse
links on the blog page.

| Variation | Id | What it shows |
| --- | --- | --- |
| Homepage | `home` | Five posts. The newest is the large card. |
| Featured | `featured` | One post. An empty Post uses the newest in Category. A picked Post is that post. |
| Grid | `grid` | A page of posts. An empty Posts per page means 12. All shows the category tabs and the page numbers. A chosen Category hides the tabs. |
| Row | `row` | Three posts across. This is Keep reading. |

| Label | Id | Kind | Variations |
| --- | --- | --- | --- |
| Section | `section` | The shared group | All |
| Category | `category` | Select: All, Review, Comparison, My experience, HRT 101. Default All | All |
| Post | `post` | Content relationship to Post, Provider review, and Comparison | Featured |
| Posts per page | `count` | Number. Empty means 12 | Grid |

On the blog page, the featured post is left out of the grid. A selected
category hides the featured card, and that post can appear in the grid.
Page addresses are `/blog` and `/blog/page/N`. The category tabs do not
get their own public URL until the indexing decision in
`docs/SEO_AEO_GEO.md`.

A post's Keep reading uses the row variation and three posts. Those
posts are the newest in the same category, then the newest in any
category. The current post is left out. There is no Related posts field.

The card reads these fields from a Post. Minutes to read is calculated
from the story.

| Label | Id | Kind |
| --- | --- | --- |
| Title | `title` | Heading rich text |
| Image | `image` | Image |
| Subtitle | `sub_title` | Heading rich text |
| Published | `published_date` | Date |
| Category | `category` | Select on the post |

### Clinic comparison

Section Heading and Section Intro are the title and the HSA sentence.
The section id is the heading, and the hero button scrolls to it.

| Label | Id | Kind | Required | Mockup |
| --- | --- | --- | --- | --- |
| Prices checked on | `prices_checked` | Date | Yes | Sep 9, 2026, beside "What I paid per month" |
| Button | `button` | Link, with display text | No | Trusted providers |
| Disclosure | `disclosure` | Link, with display text | No | Affiliate disclosure |
| Clinics | `clinics` | Repeatable group | Yes | The clinics, in table order |

Each row has `clinic`, a content relationship limited to Provider, and
`review`, the link behind "Read review." Help: "Add the clinics in the
order they should appear. To change a price, a quote, or a code, edit
that clinic. Pick the review on this row."

The slice is in `src/slices/clinic_comparison`. The page resolves each
clinic and passes the fields this table reads.

The columns stay fixed: Clinic, Description, What I paid per month,
Insurance, Typically prescribed, In my words. The relationship fetches
the Provider fields in the next section, including `code` and
`code_note`. The review link is the row's Review field.

### Quote

Section Heading in the mockup is "Peggy's take: what I'm using now."
Background is Dark.

The slice is in `src/slices/quote`. The page resolves the clinic.

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Quote | `quote` | Heading rich text | Yes |
| Name | `name` | Text | No |
| Clinic | `clinic` | Content relationship to Provider | Yes |
| Text | `text` | Heading rich text | Yes |
| Reminder | `reminder` | Heading rich text | Yes |
| Review button | `review_button` | Link, with display text | No |

The logo and the visit button come from the clinic. The visit button is
the clinic's `visit` link, including its display text. She changes the
affiliate address on the clinic. Name is the line beside the logo. Leave
it empty to use the clinic name. The chart says "Inner Balance." This
band says "Oestra by Inner Balance."

The reminder in the mockup is "This is my personal experience, not
medical advice."

### Side by side

One slice, four variations, in `src/slices/side_by_side`. The homepage
story is the Image variation with the media on the left. Section holds
the small heading, the title, and the lead sentence. Buttons sit under
the writing. Solid is the filled button, such as "Read my whole story."
Ghost is the quieter text button, with an arrow. A button with no words
is hidden.

Side is Media left or Media right. Media left matches the story photo.
On a narrow screen the media stacks above the writing either way.

| Variation | Id | The media side |
| --- | --- | --- |
| Image | `image` | Image and Caption. The description is the image's alt text. Caption sits on the photo. |
| Video | `video` | Video, a YouTube or Vimeo embed, and Caption |
| Quote | `quote` | Quote, and Attribution under it |
| Clinic | `clinic` | A clinic. Logo, name, quote, and the visit link come from the clinic |

| Label | Id | Kind | Variations |
| --- | --- | --- | --- |
| Section | `section` | The shared group | All |
| Side | `side` | Select: Media left, Media right. Default Media left | All |
| Text | `text` | Content rich text | All |
| Buttons | `button` | Repeatable link, with display text and a style | All |
| Image | `image` | Image | Image |
| Caption | `caption` | Heading rich text | Image, Video |
| Video | `video` | Embed | Video |
| Quote | `quote` | Heading rich text | Quote |
| Attribution | `attribution` | Text | Quote |
| Clinic | `clinic` | Content relationship to Provider | Clinic |

Text uses the content toolbar. A Signoff label on a whole paragraph is
the large closing line. A Note label on a whole paragraph is the tint
box. The story's note is "I am not a medical professional, and this site
does not provide medical advice or treatment plans." A paragraph can
start with a clinic token, the same `{{provider:inner-balance:offer}}`
and `{{provider:inner-balance:facts}}` tokens as the post.

## Provider, Offer, and Callout

### Provider

Custom type, in `customtypes/provider`. One clinic, one document.
Peggy fills it in tabs. A tab is a group of fields in the editor.
Every tab is static, so a slice or a story token can read it.

The UID is the id a story token uses, such as `inner-balance`. A clinic
has no public page. A clinic page is a Page, and the slices on that
page point at this document.

Slices point at this document with a content relationship. Each slice
fills itself from the fields it lists. Price is one field. The
comparison chart, the clinic price card, a facts token, and any later
slice that lists `monthly_price` all show that same number.

| Place | Points with | Fills in |
| --- | --- | --- |
| Hero, brands | `clinic` | Name, logo |
| Hero, provider | `clinic` | Name, logo, formulation, visit, price, price note, top choice label, code, code line |
| Clinic comparison | `clinic` | Name, logo, short description, price, price note, insurance, formulation, quote, getting started, top choice label, visit, code, code line. The review link is on the slice row |
| Quote | `clinic` | Logo, name, visit. A Name on the slice replaces the clinic name |
| Side by side, clinic | `clinic` | Logo, name, quote, visit |
| Post sidebar | `clinic` | Name, logo |
| Story offer token | `{{provider:uid:offer}}` | Logo, name, visit, code, code line, plus the sentence in that paragraph |
| Story facts token | `{{provider:uid:facts}}` | Price, price note, insurance, formulation |

#### Profile

Who the clinic is. The homepage, the offer box, and the sidebar read
this tab.

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Name | `name` | Text | Yes |
| Logo | `logo` | Image | Yes |
| Short description | `short_description` | Text | No |
| Visit | `visit` | Link, with display text, open in a new tab | No |
| Top choice label | `top_choice_label` | Text | No |

Short description is the one line about the clinic. The comparison
chart's Description column reads it, and so does any other clinic
summary that needs a short line. An empty Visit link means the name is
not a link. A blank Top choice label means no badge. A clinic on the
site is one Peggy has tried. There is no tested checkbox.

#### Price

The one monthly amount, and the line under it.

| Label | Id | Kind | Example |
| --- | --- | --- | --- |
| Price | `monthly_price` | Number | What I paid per month |
| Price note | `price_note` | Text | First six months, then $99. |
| Typically prescribed | `formulation` | Text | Oestra vaginal cream |
| Takes insurance | `insurance` | Boolean | No |
| Getting started | `note` | Text | Free consults as needed. |
| Code | `code` | Text | PEGGY10. Blank when there is no code. |
| Code line | `code_note` | Text | 10% off your first order. |

The comparison chart and the clinic price card show this same price.
A step-down, such as $199 then $99, is written in Price note. A consult
fee goes there too, such as "+ $99 one-time consult."

Typically prescribed, Takes insurance, and Getting started are the
three bullets in the price box, in that order. The chart also uses
the first two as columns, and Getting started is the line under the
quote.

#### Care

Facts that are not in the price box. A clinic page fact list reads
this tab.

| Label | Id | Kind |
| --- | --- | --- |
| Labs | `lab_requirement` | Text |
| HSA / FSA | `hsa_fsa` | Boolean |
| State availability | `state_availability` | Text |

#### Words

Her one sentence. The long review stays on the Provider review.

| Label | Id | Kind | Homepage use |
| --- | --- | --- | --- |
| In my words | `quote` | Heading rich text | The table quote |

Code and Code line sit on the Price tab. Visit is the only link to the
clinic. "Read review" is a link on the slice that shows it.

### Callout

Custom type. A rich text field cannot contain a Provider or a
Callout, so a page that wants one between paragraphs needs a slice. The
post does not. Its personal note is a field. An offer box in the
story is a provider token, described under Post.

Nothing in the homepage or the post points at a Callout yet. The
fields stay as specified for a later page:

| Label | Id | Kind |
| --- | --- | --- |
| Name | `name` | Text. The name she sees in the picker |
| Style | `style` | Select: Note or Offer |
| Text | `text` | Content rich text |
| Clinic | `clinic` | Content relationship to Provider, optional |

An Offer box reads the code and the visit link from the clinic. The
sentence for that spot lives in Text.

## Post

Repeatable page type, in `customtypes/post`. No slice zone. One Wix
blog post becomes one Post. The layout is the blog post mockup. The card reads `title`, `image`, `sub_title`, `published_date`, and `category`. Minutes to read is calculated from the story.

Use the page type's SEO tab for the meta title, meta description, and
social image. An empty meta title uses the post title. An empty meta
description uses the subtitle. An empty social image uses Image. On the
live site the meta description is its own sentence, so migration fills
it from the Wix meta description when Wix has one. The Wix excerpt goes
in Subtitle.

Sampled from the live site in October 2026, then checked against the
Wix API on 2026-10-08: the post sitemap lists 142 posts, the feed lists
the latest 20, and 18 posts were read in full. The categories sitemap
contains only `/blog`. The API also returns five Wix blog categories
on 42 posts. Those are not the Category select, and migration leaves
Category empty. Every post has a cover image. One of the 142 excerpts
matches its meta description, so those stay separate fields. Tags are
sparse and messy. Migration writes each Wix tag label onto the
document's Prismic tags. Published is the date on the Wix article, the
first published date. One hundred twenty posts also have a later last
published date. That later date and `relatedPostIds` are not stored.
Comments are turned on in Wix and are not imported. One post is
featured. Featured, pinned, and comments are not stored. Author is
left empty. Two posts use a different Wix member id. Those two are
corrected in Prismic.

### Fields

| Label | Id | Kind | Required | Comes from |
| --- | --- | --- | --- | --- |
| Title | `title` | Heading rich text | Yes | Wix title. The page title and the card |
| Subtitle | `sub_title` | Heading rich text | No | Wix excerpt. The line under the title, and the card |
| Personal note | `note` | Heading rich text | No | Mockup only. The box above the story |
| Story | `body` | Content rich text | Yes | Wix rich content |
| Image | `image` | Image, including its description | Yes | Wix cover |
| Caption | `caption` | Heading rich text | No | The line under the cover, when that photo has one |
| Author | `author` | Content relationship to Author | No | Left empty. Empty means Peggy B. Two posts are corrected in Prismic |
| Published | `published_date` | Date | Yes | The date on the Wix article. Wix first published date |
| Category | `category` | Select | No | Left empty. Wix blog categories are not this select |
| Sources | `sources` | Repeatable group | No | Mockup only |
| Canonical | `canonical` | Link, no display text | No | Only when the post should point elsewhere |
| Indexing | `indexing` | Boolean | Yes | On. Turn it off only to hide a post |

Every post is `/post/<uid>`. There is no URL section field. The UID is
the Wix slug.

Category choices are Review, Comparison, My experience, and HRT 101.
Empty means no kicker. These are not Category documents and they are
not public pages. The `?type=` filter on the blog mockup stays off
the public site until an indexing decision says otherwise.

Indexing is on by default. Turn it off only to hide a post. The
site-wide noindex switch still hides every page until cutover.

Hide Subtitle, Caption, Personal note, and Sources when those fields
are empty. Hide the clinics sidebar when the story names no clinic. The
personal-note label "Personal review note" is part of the layout. The
field is the sentence.

Image help: "Describe the photo. This is the text a screen reader
reads." Caption help: "The line under the photo. It can include a
link."

Published is the day the post first went live, the date shown on the
Wix article. There is no updated date. A later Wix "last published"
date is not copied. A revision she wants readers to see is written in
the story.

Minutes to read is not a field. The build counts the words in the
story, at 250 words a minute, and rounds to the nearest minute. A
story with any words is at least one minute. A clinic token and
`{{photos}}` are not counted. Wix tags are the document tags at the top of the post, not a
group on this type. Public `/blog/tags/…` addresses still need a
disposition in the URL manifest.

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
| Heading | Heading 2, 3, or 4. The page title is the only Heading 1. A heading 1, 5, or 6 in the story becomes Heading 2 |
| Bold, italic | Bold, italic |
| Underline, text color, font size | The words, as a normal paragraph. A 10px number becomes the superscript label |
| Link | Link. Keep the full address, including affiliate parameters |
| Image | Image, then its caption as the next paragraph |
| Two photos side by side | Two images, each with its caption. See Photo row |
| Button | A paragraph that is only that link |
| YouTube or other video | Video embed |
| List | List |
| Quote | A paragraph. The story has no quote block |
| Table | The same words, written out under the heading they sat under, and a migration flag |
| Empty line used as spacing | Dropped |
| Divider | Not imported. A horizontal line in the Wix story is left out |
| File, custom HTML, poll, or code | Not dropped. The migration report lists the post for manual review |

Tables showed up in several of the 18 posts, usually a pricing or lab
grid in the middle of the story. One rich text field cannot hold a
table. Writing the cells out keeps the words. The flag is there so
Peggy can check that the grid still reads. A grid that is only one
clinic's current price and formulation can later be replaced with a
facts token. A grid that compares several clinics, or lists lab
markers, stays written out. Those words are not on the clinic.

### Photo row

A paragraph that is only `{{photos}}` places the next two photos side
by side, in the same row as the mockup. The paragraph under each photo
is that photo's caption. Bold the first word for a label such as
Before or After. A photo with no token above it stays full width. One
photo after the token stays full width, and the token is not shown. A
heading or another token between the photos ends the row. Import does
not write the token.

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
| `offer` | The offer box: logo, name, visit button, code | Profile and Price. The sentence is the rest of the paragraph. If the paragraph is only the token, the sentence is the code line |
| `facts` | One clinic's price, price note, insurance, and formulation | Price |

The token is the first thing in the paragraph. A facts token is the
whole paragraph. Any other last word is ordinary text. In preview, an
unknown clinic shows an error where the box would be. On the public
site that token is removed and the rest of the paragraph stays.

Story help: "Write the story readers will see."

The sidebar is not a field. It reads the story. Each clinic appears
once, in the order of its first token, and the sidebar shows the first
four. The logo and the name come from that clinic. A review link is
written on the slice that shows Read review.
"Compare all clinics" is part of the layout. A clinic named only in
ordinary sentences stays out of the sidebar until a token names it.
Another part can be added later by teaching the renderer a new word.
It reads fields that are already on a tab. The story still has no
slices.

### Groups

Sources. The number is the row order. A superscript in the story links
to that number, and each source has an arrow back to its superscript.
The link uses the same hover as a link in the story. A story that ends
with "Resources:" and a list uses that list when this group is empty.

| Label | Id | Kind | Required | Example |
| --- | --- | --- | --- | --- |
| Link | `link` | Link, with display text | Yes | Journal of Clinical and Aesthetic Dermatology |
| Detail | `detail` | Text | No | PubMed Central |

Keep reading is three posts. The same category comes first, newest
first. If that is fewer than three, the rest are the newest posts in
any category. The current post is left out. A post with no category
uses the newest posts. The row variation is the layout: its heading is
"Keep reading" and its link is "All posts." There is no Related posts
field.

### What the page derives

Breadcrumbs are Home, Blog, and the title. Minutes to read and Keep
reading are calculated, as above. An empty Author field uses Peggy B.
The byline and the author block read that document: name, profile,
and about. "Read my
whole story" and "How I review" are the about page and the editorial
standards page. The disclosure line is the site affiliate disclosure.
Share has no fields.

### Wix fields this page does not store

Comments, featured, pinned, language, pricing plan, and the Wix
member id. Author is left empty. Category is left empty. Keyword meta
tags are not copied. The date on the Wix article is Published. The
later last published date and the Wix related-post list are not
stored. The Wix excerpt is Subtitle. Tag labels are the document tags.
Read time and Keep reading are calculated.

## Blog

Single page type for `/blog`. No slice zone. The path is `/blog`, the
same way the homepage path is `/`. It does not use URL section.

The post grid, the category filter, and the page numbers are not
fields. The grid is every Post, newest first. The first post is the
large card. Page addresses stay `/blog` and `/blog/page/N`. Each post
is `/post/<uid>`.

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
