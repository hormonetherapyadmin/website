# Slice model

Build reference for the homepage slices and the shared rules every later
slice uses. The broader document list lives in `docs/CONTENT_MODEL.md`.
Where this file gives a field an id, that id is the one to create.

The homepage mockup is the layout source. Peggy edits in Prismic. She is
used to WordPress and is not technical, so each slice is one visible
section, labels are plain, and a fact she reuses is edited on its own
document.

The post and the blog index are page types with fields and no slice
zone. They are specified below. A site page, such as the provider page
or the trusted-providers page, is a Page built from the shared slices.
Page is specified at the end of this file.

## Document kinds

A public page is a Prismic page type. A document other pages read is a
custom type. The clinic has no public page. A clinic page is a Page.

| Document | Kind | Why |
| --- | --- | --- |
| Homepage | Page type, single | The `/` page |
| Blog | Page type, single | The `/blog` page |
| Provider (labeled Brand) | Custom type | The clinic or product every slice links to. File: `customtypes/provider` |
| Post | Page type | A blog post. File: `customtypes/post` |
| Page | Page type | A site page at `/<uid>`. File: `customtypes/page` |
| Provider review, Comparison | Page type | Public pages |
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

Every slice except the Divider starts with these seven fields, directly
on the slice and before its own fields. They are not in a group. In the
Page Builder even a non-repeatable group starts empty, and she has to
add an item before she can type a heading, so the fields stay open
instead. The Divider has only Background, Space above, and Space below.
Brand promo keeps Heading, Background, Space above, and Space below
open, and puts Small heading, Intro, and Link in Overwrite.

| Label | Id | Kind | Default |
| --- | --- | --- | --- |
| Small heading | `small_heading` | Heading rich text | Empty |
| Heading | `heading` | Heading rich text | Empty |
| Intro | `intro` | Heading rich text | Empty |
| Link | `link` | Link, with display text | Empty |
| Background | `background` | Select | Transparent |
| Space above | `space_above` | Select | Medium |
| Space below | `space_below` | Select | None |

Small heading, Heading, Intro, and Link are the header. The link sits on
the heading's row, as "All posts" does. When all four are empty, the
slice has no header. Text and Ribbon can move that link with Layout.
Side by side is the exception: its Intro allows many paragraphs, and
that header sits in the writing column beside the media. See Side by
side.

The Hero slice renders Heading as the page title (`h1`). Every other
slice renders it as a section heading (`h2`). A card title is an `h3`.
The small heading is a line above the title. She does not pick the level.

**Background** choices are the site colors, by name. Each maps to a
color token:

- Transparent, the default. It paints nothing and adds no inner
  padding, so the slice sits on the page, which is cream
- Cream, the page color (`background`). It paints that color and adds
  no inner padding, so Space above and Space below are the only gap.
  A cream slice between two other colors is a cream band
- Pink (`card-1`)
- Blue (`card-2`)
- Yellow (`card-3`)
- Lavender (`card-4`)
- Raspberry (`accent`)
- Navy, the quote band (`panel`)

The four pastels are the Start here card colors. Raspberry and Navy use
light text. The small heading is raspberry on Transparent, Cream, and
the pastels,
light blue (`card-2`) on Raspberry, and pink (`panel-accent`) on Navy.
Slices that draw their own small heading (Hero, Side by side, Quote)
follow the same rule. Brand promo's small heading on Navy is light blue
(`card-2`) and sits close above the heading. A later palette
change to a token updates every section that uses it. A brand change
that makes a name wrong, such as a new accent that is not raspberry,
renames the choice, and pages that stored the old name fall back to
Transparent until they are set again. Do not use a free color picker.

Pieces a slice draws in raspberry, other than the small heading, are
not changed on a Raspberry band. A hero button is one example. Use Raspberry for writing and quotes.
A card keeps its own color on any band.

**Space above** and **Space below** are the gap outside the slice. Both
are None, Small, Medium, or Large. The gap between two slices is set by
the lower slice's Space above. Transparent and Cream add no inner
padding. Pink, Blue, Yellow, Lavender, Raspberry, and Navy paint the
slice and keep a fixed padding inside the color. That inner padding is
not a field.

**Section id.** Every section gets an id from its title, so a button on the
same page can scroll to it. "Feel like you again." becomes
`feel-like-you-again`. On the homepage that title is the tagline. On every
other slice it is the heading. An empty title leaves the section with no
id. A button uses that id with a hash, such as
`#eight-online-hrt-clinics-side-by-side` for the comparison heading
"Eight online HRT clinics, side by side." Changing the title changes the
id, so the button address has to change with it. Clicking that hash, or
any other anchor on the site, scrolls the page down to the target.
Someone who prefers reduced motion lands there without the scroll.

### Rich text

One `RichText` component renders every writing field. The field stores
Prismic structured text. The component turns it into HTML elements.
Imported Wix HTML is converted into that structure once, during
migration. Pages do not parse stored HTML.

Two toolbars share the component:

| Preset | Allows | Used for |
| --- | --- | --- |
| Heading | One block: paragraph, bold, italic, link | Titles, intros, quotes, captions, eyebrows. Side by side Intro allows many paragraphs |
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

Writing is one size everywhere. A post body and every slice's Text field
(Text, Side by side, Brand promo, Ribbon, and Quote) use the `--text-body`
token in `globals.css`, 1.3rem with a 1.7 line height, with 1.4rem
between paragraphs. The Ribbon box keeps the 1.3rem size with a 1.5
line height, so its short lines sit together under the title. Intros,
captions, card text, the closing line, and the note box keep their own
sizes.

A link in writing looks the same as a link in a post body: the accent
color, semibold, no underline, and a tint that grows under the words on
hover or keyboard focus. On a Raspberry or Navy section the color is
that section's small heading color, so the link stays readable.

Lists in writing look the same as lists in a post body. A bullet is a
navy dot (`marker`) with a pale navy ring. A number is a heading-font
numeral in navy inside a pale navy circle. Lists use navy, not
raspberry, so they do not compete with links. On a Raspberry or Navy
section, or a Ribbon box in those colors, they are light blue
(`card-2`).

Plain text stays in use for a name, a code, a price, and an icon choice.
Those values are data, not writing.

### Links

A button or text link is one link field with display text turned on. The
words and the destination are the same field. "Open in a new tab" is the
field's checkbox. A clinic's Visit link is the exception: every visit
button opens it in a new tab with the affiliate `rel`, checked or not.

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

A line between slices. It does not use the Section header. Background,
Space above, and Space below are fields on the slice, with the same
choices as Section. Both spacing fields default to None, so the line does
not add a gap until she asks for one. That gap is added around the line,
on top of the space on the slices beside it. A margin would collapse into
the neighbor's margin, and None and Small would look the same.

| Label | Id | Kind | Default |
| --- | --- | --- | --- |
| Line | `line` | Select | Squiggly |
| Color | `color` | Select | Accent |
| Background | `background` | Select | Transparent |
| Space above | `space_above` | Select | None |
| Space below | `space_below` | Select | None |

Line is Squiggly or Straight. Those are the two rules in the mockups.
Color is Accent, Soft, Border, or Text. Soft is the lighter accent used
by the homepage wave. Accent, Border, and Text use those color tokens.
There is no free color picker.

### Boxes

A row of small boxes, in `src/slices/boxes`. Each box is a clinic or
is written by hand. On trusted providers it is the jump band under the
hero, and each box goes to that clinic's section lower on the page.

| Label | Id | Kind | Default |
| --- | --- | --- | --- |
| Boxes across | `across` | Select: 2, 3, 4, 5, 6, 7 | 5 |
| Boxes | `boxes` | Repeatable group | Empty |

Each box:

| Label | Id | Kind | Required | Trusted providers |
| --- | --- | --- | --- | --- |
| Clinic | `clinic` | Content relationship to Provider | No | Inner Balance |
| Image | `image` | Image | No | Empty, so the clinic logo |
| Heading | `heading` | Heading rich text | No | Empty, so the top choice label, such as No appointment required |
| Text | `text` | Heading rich text | No | Empty, so the clinic name |
| Bottom line | `bottom_line` | Text | No | Empty, so the code PEGGY10. Winona's is "15% off" |
| Link | `link` | Link, no display text | No | `#inner-balance` |

A written field wins. An empty Image, Heading, Text, or Bottom line
uses the clinic's logo, top choice label, name, or code. A box with
no clinic is written by hand. A box with no heading, no top choice
label, no text, and no clinic name is hidden. A clinic
with no code and an empty Bottom line shows no bottom line, so write
"No code" when the box should say it. The relationship fetches `name`,
`logo`, `code`, and `top_choice_label`.

The whole box is the link. A box with an empty Link is not clickable.
A jump link is `#` and the id of a section lower on the page, made from
that section's title by the Section id rule. A Provider hero titled
Inner Balance is `#inner-balance`.

Boxes across is the most boxes in one row. When there are fewer boxes,
they share the row. A short last row starts on the left. Narrower
screens use fewer boxes per row:

| Boxes in the row | Over 1100px | 961–1100px | 641–960px | 640px and under |
| --- | --- | --- | --- | --- |
| 7 | 7 | 4 | 4 | 2 |
| 6 | 6 | 3 | 3 | 2 |
| 5 | 5 | 3 | 3 | 2 |
| 4 | 4 | 4 | 2 | 2 |
| 3 | 3 | 3 | 3 | 2 |
| 2 | 2 | 2 | 2 | 2 |

A box heading is an `h3` when Section Heading is filled. Without a
section heading it is a paragraph, so a jump band does not add
headings to the page outline.

### Brand promo

One clinic card, in `src/slices/BrandPromo`. Trusted providers stacks
one slice per clinic. The featured card is this slice with Background
Navy and Is this 1st? turned on. Each card under it is the same slice
on a transparent background, with Is this 1st? left off.

The open fields are the ones she fills on every card. Heading is the
specialty, such as "Improved sleep", and it is an `h2`. Clinic is the
brand. Background, Space above, and Space below are the section.
Is this 1st? shows the badge. Place is the words beside it.

Overwrite is one optional group. It starts empty. She adds it only when
this card should differ from the brand, or from the built-in line
"Voted best for". The card reads the first item. Small heading, Intro,
Quote, Text, the product photo, Photo and price, and the extra links
are in that group. The section Link is in the group and is not shown.
The section id is the clinic's UID, so a Boxes jump link of
`#inner-balance` lands on this card.

Small heading is "Voted best for" when Overwrite is off or that field
is blank. On a Navy card that line is light blue. On every other
background it uses the usual small-heading color. Intro is a short line
under the clinic name, such as Effecty's "Choose a consult or not, and
choose patch or gel." Leave Intro blank to hide it.

| Label | Id | Kind | Required | Trusted providers |
| --- | --- | --- | --- | --- |
| Heading | `heading` | Heading rich text | No | Improved sleep |
| Clinic | `clinic` | Content relationship to Provider | Yes | Inner Balance |
| Background | `background` | Select | No | Navy on the featured card. Transparent on the cards under it. |
| Space above | `space_above` | Select | No | None on the directory cards |
| Space below | `space_below` | Select | No | None on the directory cards |
| Is this 1st? | `first` | Boolean | No | On shows the 1st badge. Off hides it. |
| Place | `place` | Text | No | My 2026 top choice. Shown beside the badge. Blank hides the words. |
| Overwrite | `overwrite` | Non-repeatable group | No | Off. Add it to replace what the brand supplies. |

Overwrite fields:

| Label | Id | Kind | Required | Trusted providers |
| --- | --- | --- | --- | --- |
| Small heading | `small_heading` | Heading rich text | No | Blank still says Voted best for |
| Intro | `intro` | Heading rich text | No | Blank hides it |
| Link | `link` | Link, with display text | No | Not shown |
| Quote | `quote` | Heading rich text | No | Blank uses the clinic's In my words. Write a sentence here when this card should say something else. |
| Text | `text` | Content rich text | No | Empty. On test kits, the paragraphs about each kit |
| Product image | `product` | Image | No | Empty uses the brand's product image. A photo here replaces it. The description is the alt text. |
| Style | `style` | Select: Quote, Card | No | Card. Quote puts the logo, her words, and a visit link on the right. Card puts the product photo and price there. |
| Photo and price | `layout` | Select: Beside, Stacked | No | Beside. Used when Style is Card. Off the group, the card is Beside. |
| Links | `links` | Repeatable link, with display text | No | A second row under the brand buttons, such as a comparison |

Text is more writing under the quote, with the content toolbar. Leave
it blank to hide it. The test kits page uses it for the paragraphs
about each kit, because a product card has more to say than one line.

Style chooses the right side. Quote is a soft panel: the logo, the
brand name, her words, and a text link that reads "Visit" plus the
brand name. The logo tile has extra padding so the mark sits in a
clear margin. Card, the default, is the product photo and price. A
blank Style is Card, so a card saved before this field existed stays
a product card. Photo and price applies only when Style is Card.
Beside, the default, puts
the price box next to the product image, as on Trusted providers.
Stacked puts the image on top and the price box under it, as one
card centered in the right half, with no line. The
card stays in view while the writing scrolls on wide screens. Use Stacked when the card has a lot of writing, as on the
test kits page. On a phone both layouts stack.

The relationship fetches `name`, `kind`, `logo`, `visit`, `page`,
`review`, `comparison`, `youtube`, `product`, `monthly_price`, `price_unit`,
`price_note`,
`formulation`, `insurance`, `note`, `code`, `code_note`,
`top_choice_label`, and `quote`. A product leaves out the insurance
line, and a one-time price has no "/mo". A brand with no logo shows
its name without the logo tile. Page is the Products & pricing
button. My review is her post. Each My comparison link is one of her
comparison posts, and its button says the link's display text, such
as "Musely vs Winona cream". A blank display text says "My
comparison". Review video
is Watch my review. A
YouTube link plays in the site's video modal. The modal heading reads
"My review on", then the brand logo and name. Any other video link
opens in a new tab. A YouTube link written in the slice's extra links
also plays in the modal. A blank Page, My review, My comparison, or
Review video hides that button. The product photo is
the brand's, unless a photo is placed in Overwrite. When the clinic
has an affiliate link, that photo opens it in a new tab, with the same
sponsored rel as the visit button. Links written in
Overwrite sit on a second row under those buttons.

The logo, the name, the price, the three price-box lines, the visit
button, the coupon, the product photo, Products & pricing, My
review, My comparison, and Watch my review come from the clinic. A photo in
Overwrite replaces the
brand's product image. A filled Quote replaces the clinic's In my
words. On Quote style those words sit in the panel on the right. On
Card style they sit under the brand name. Is this 1st?, when on, shows the badge, and Place is the words
beside it, such as "My 2026 top choice". A clinic with a code shows
"Code PEGGY10" and the code line under it. A clinic with no code shows
the code line alone, such as Winona's "15% off your first order". The
brand buttons sit in this order: Products & pricing, My review,
each My comparison in editor order, then Watch my review. A YouTube or
Vimeo link gets a play icon. My review gets a page icon. My comparison gets a two-way
arrow icon. Page gets a tag icon. Links written on the
slice are a second row of text, in the body color on a
light card and white on Navy or Raspberry, each with a chevron. Set
Space above and Space below to None on the directory cards so they
stack. A light Beside card draws a rule across the bottom, in the
middle of the gap after the card, so that gap is even on both sides
of the line. The gap is Space below, or the next slice's Space above
when that is larger. Stacked draws no rule. The last card in a run
draws no rule either: when the next slice is not a Brand promo, or
nothing follows, the line is left off, so it never doubles up with a
Divider or trails the page. There is no field for this. Navy and Raspberry use the light text and the light visit
button.

### Ribbon

The close band from the trusted-providers mockup, in `src/slices/Ribbon`.
A rounded box sits on the section. Layout chooses where the words and
the buttons sit. On the right, the default, title and content are on
the left and buttons are on the right, in the order she adds them. An
empty choice is On the right, so a ribbon saved before this field keeps
that arrangement. Centered centers the title and content and stacks the
buttons under them. The section header centers too, and its link sits
under the heading instead of beside it.

Section is the seven shared fields. Background is the color behind the
box. Leave Small heading, Heading, Intro, and Link empty for the
template, which has no header above the box. Heading, when she fills
it, is the header above the box. Title is the line inside the box.

Box background uses the same choices as Background. The default is
Pink, the template. An empty choice is Pink. A retired color name falls
back to Transparent, the same rule as Background. Navy and Raspberry
use light text inside the box. A transparent box paints nothing, so its
text follows the section: light on Navy or Raspberry, dark on the
others. The filled button stays the raspberry button on every color.

The corner wave is the color behind the box. It is hidden when the box
is transparent, or when the box and the band are the same color. Cream
and Transparent are the same page color, so a cream box on a
transparent band has no wave.

| Label | Id | Kind | Required | Template |
| --- | --- | --- | --- | --- |
| Section | The seven Section fields | Shared, open on the slice | | Background is the color behind the box. Default Transparent |
| Layout | `layout` | Select: On the right, Centered. Default On the right | No | On the right |
| Title | `title` | Heading rich text | No | Still lining the prices up? |
| Content | `content` | Content rich text | No | The comparison chart includes Midi Health too. |
| Box background | `box_background` | Select. Same choices as Background. Default Pink | No | Pink |
| Buttons | `button` | Repeatable link, with display text and a style | No | Solid: Open the price chart. Ghost: Tips for choosing |

Title is an `h2`, and the section id, when Section Heading is empty.
Under a Section Heading it is an `h3`. Solid is the filled button.
Ghost is the text button, with an arrow. A button with no words is
hidden. A button to an affiliate address gets the affiliate `rel`, the
same as Side by side. An empty title, content, and button list hides the box. The
section header can still show.

### Text

Writing on its own, in `src/slices/Text`. Use it for a page that is
mostly words, such as `/costandinsurance`, `/formuations`, or `/faq`.
The writing sits in a column the width of a post story, 952 pixels on
a wide screen (`--container-story`). The column is centered on the
page. The section header sits in the same column. Layout chooses how
the words and the link sit in that column. On the right, the default,
the writing is left aligned and the link sits beside the heading. An
empty choice is On the right. Centered centers the heading, intro, and
writing, and puts the link under the writing. A Background color still
fills the full width, the same as every slice. On a narrow screen the
column is the screen, less the gutter.

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Section | The seven Section fields | Shared, open on the slice | |
| Layout | `layout` | Select: On the right, Centered. Default On the right | No |
| Text | `text` | Content rich text | No |

Text uses the content toolbar: Heading 2, Heading 3, Heading 4,
paragraphs, lists, photos, video, and the labels. Section Heading is
the `h2` and the section id. Headings inside Text are for the parts
under it, so use Heading 3 there when the slice has a heading. A
paragraph can start with a clinic token, the same
`{{provider:inner-balance:offer}}` and `{{provider:inner-balance:facts}}`
tokens as the post. Tables and the `{{photos}}` and `{{photo-text}}`
rows are post-only. An empty slice shows only its spacing.

Wix pages often fake a heading with a bold paragraph. In Prismic make
it a Heading 3. The words stay the same.

### Clinic facts

A clinic's fact sheet, in `src/slices/ClinicFacts`. The layout is the
fact sheet, How it works, and specialties on the Inner Balance
mockup. Everything in it comes from the Brand. She picks the clinic
and writes nothing else, so a fact changed on the Brand changes on
every clinic page.

| Label | Id | Kind | Required | Mockup |
| --- | --- | --- | --- | --- |
| Section | The seven Section fields | Shared, open on the slice | | Heading: The facts. Intro: What I confirmed on their page… |
| Clinic | `clinic` | Content relationship to Provider | Yes | Inner Balance |

The fact cards, in this order, each with a fixed icon:

| Card | Reads | Shows |
| --- | --- | --- |
| Availability | `state_availability` | The text |
| Typically prescribed | `formulation` | The text |
| Pre-testing | `lab_requirement` | The text |
| Insurance | `insurance` | Accepted or Not accepted. Not on a product |
| HSA / FSA | `hsa_fsa` | Yes, only when it is on |
| To get started | `note` | The text |

An empty field hides its card. A switch in Prismic is off until she
turns it on, so an HSA / FSA switch that is off hides the card instead
of saying No. Insurance follows the comparison chart and says Not
accepted when it is off. The cards are three across, two from 960
pixels, and one from 640 pixels.

How it works is the Brand's steps, numbered, three across. A step can
have a title, text, or both. Specialties they list is the Brand's
Specialties, one pill per line. Each part is hidden when the Brand has
none. With a Section Heading, the two part titles are `h3`. Without
one they are `h2`. A slice whose clinic is not published shows only its
header.

Facts on the Wix clinic pages that are not on the Brand, such as
"Voted Best For" and the product price list, are written in a Text
slice on that page. The provider Hero already shows "Voted best for".

### Pros and cons

Pros beside cons, in `src/slices/ProsAndCons`. `/ishrtforme` uses two
rows, HRT and BHRT. A review uses one row.

| Label | Id | Kind | Required | `/ishrtforme` |
| --- | --- | --- | --- | --- |
| Section | The seven Section fields | Shared, open on the slice | | Heading: Pros and Cons |
| Pros label | `pros_label` | Text | No | Blank, so Pros |
| Cons label | `cons_label` | Text | No | Blank, so Cons |
| Rows | `rows` | Repeatable group | Yes | HRT, then BHRT |

Each row:

| Label | Id | Kind | Required | Example |
| --- | --- | --- | --- | --- |
| Title | `title` | Text | No | HRT. Blank when there is one row |
| Pros | `pros` | Rich text: paragraph, bullet, bold, italic, link | No | FDA Approval, one per line |
| Cons | `cons` | Rich text: paragraph, bullet, bold, italic, link | No | Cost, one per line |

Each line or bullet is one item. A blank label says Pros or Cons, and
she can write her own, such as "What I liked". The Pros card is light
green (`--color-pros`) and the Cons card is white. Pros have a check
mark and Cons a minus sign, so the side does not depend on color. A row
with no pros and no cons is hidden. A row with only one side shows
that card alone. A row title is an `h3` under a Section Heading, and
the Pros and Cons labels are a level below the row title. The two
cards stack at 640 pixels.

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

One slice, five variations. Each variation includes the shared Section
fields and lays the heading out itself. Section supplies the spacing and
background. The homepage section id comes from the tagline. The homepage
variation also keeps the mockup's vertical padding, and Space above and
Space below add to it. The subpage, centered, brands, and provider
variations do not, so those fields are the whole gap.

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

#### Centered

A short page top with no photo. The Section Small heading, Heading,
Intro, and Link are centered, in the same type as Subpage. The heading
spans the container. The intro stays on the shorter measure. It has no
fields of its own. The test kits page uses it with one intro sentence
and moves Peggy's photo into the Side by side under it. Keep the intro
to a sentence or two, because a long centered paragraph is hard to read.

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

The top of a clinic page. The title is the clinic's name, and Section
Heading only when the clinic has no name. An empty Meta title, the
search result, and the sitemap entry use that same title, never the
kicker. The kicker is Section Small heading when that is filled,
otherwise the clinic's Top choice label. The price, visit button, logo,
and coupon come from the clinic. The visit button sits on the price
card, which shows only when the clinic has a price or a code, or the
slice has a Product image.

| Label | Id | Kind | Required | Mockup |
| --- | --- | --- | --- | --- |
| Clinic | `clinic` | Content relationship to Provider | Yes | Inner Balance |
| Voted best for | `voted` | Heading rich text | No | Voted best for sleep |
| Quote | `quote` | Heading rich text | No | The sleep quote |
| Links | `links` | Repeatable link, with display text | No | My 1-year review, Watch my review |
| Product image | `product` | Image | No | The Oestra jar |

The relationship fetches `name`, `kind`, `logo`, `formulation`,
`visit`, `monthly_price`, `price_unit`, `price_note`,
`top_choice_label`, `code`, and `code_note`. The price card shows the
formulation when that field is filled, and the clinic name otherwise.
The price is the clinic's one price, with "/mo" unless Price is says
One time. This variation still uses its own product
image and its own links, including "Watch my review".

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

The grid tabs are this Category: Telehealth brand reviews, Formulations
& dosages, My experience & results, Testing, labs & tracking, and
Cost, insurance & access. That is the label on the card. Topic
documents stay the browse links on the blog page.

| Variation | Id | What it shows |
| --- | --- | --- |
| Homepage | `home` | Five posts. The newest is the large card. |
| Featured | `featured` | One post. An empty Post uses the newest in Category. A picked Post is that post. |
| Grid | `grid` | A page of posts. An empty Posts per page means 12. All shows the category tabs and the page numbers. A chosen Category hides the tabs. |
| Row | `row` | Three posts across. This is Keep reading. |

| Label | Id | Kind | Variations |
| --- | --- | --- | --- |
| Section | The seven Section fields | Shared, open on the slice | All |
| Category | `category` | Select: All, then the five post categories. Default All | All |
| Post | `post` | Content relationship to Post, Provider review, and Comparison | Featured |
| Posts per page | `count` | Number. Empty means 12 | Grid |
| Hide the featured post | `hide_featured` | Boolean. Default No | Grid |

On the blog page, Featured shows the newest post, or the post it points
at. Hide the featured post leaves that post out of the grid. Yes leaves
it out. No repeats it under the feature. Empty leaves it out when
Featured is on the page. Yes, with no Featured slice on the page, shows
the newest post as the feature and leaves it out of the grid. A selected
category hides the featured card, and that post can appear in the grid.
Page addresses are `/blog` and `/blog/page/N`. The category tabs do not
get their own public URL until the indexing decision in
`docs/SEO_AEO_GEO.md`.

A post's Keep reading uses the row variation and three posts. Those
posts are the newest in the same category, then the newest in any
category. The current post is left out. There is no Related posts field.

The card reads these fields from a Post. Minutes to read is calculated
from the story. The subtitle on a card is at most three lines, on every
variation, including the large homepage card and the featured card. A
longer subtitle ends in an ellipsis. The post page still shows the full
subtitle under the title.

Every card image is one frame. Peggy can upload any shape. The picture
is centered in that frame and the rest is clipped. The homepage lead
and the featured post use a larger frame. The grid and the row use the
same frame, and those frames are the same size across the row.

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
Insurance, Typically prescribed, In my words. The chart compares
clinics. Do not add a product row: it would show "/mo" and an
insurance mark that do not apply. The relationship fetches
the Provider fields in the next section, including `code` and
`code_note`. The review link is the row's Review field.

### Quote

Section Heading in the mockup is "Peggy's take: what I'm using now."
Background is Navy.

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
story is the Image variation with the media on the left. The small
heading, the heading, and the intro sit in the writing column, beside
the media. Intro allows many paragraphs, with bold, italic, and links.
Enter starts another paragraph. A blank intro is hidden. Text continues
under the intro in that same column. Buttons sit under the writing.
Solid is the filled button, such as "Read my whole story." Ghost is the
quieter text button, with an arrow. A button with no words is hidden. A
button to an affiliate address, such as an Amazon link, gets the
affiliate `rel` by the same check as a link in post text.

Side is Media left or Media right. Media left matches the story photo.
On a narrow screen the media stacks above the writing either way.

Media position sets where the media sits beside the writing. Center,
the default, lines it up with the middle of the writing. Top lines it
up with the first line. Sticky starts at the top and keeps the media in
view while long writing scrolls, as on the homepage story. A slice
saved before this field existed has no value and shows as Center. On a
narrow screen the media stacks above the writing and never sticks.

| Variation | Id | The media side |
| --- | --- | --- |
| Image | `image` | Image and Caption. The description is the image's alt text. Caption on the photo, the default, puts the words on the picture. Off centers them under it. |
| Video | `video` | Video, a YouTube or Vimeo embed, and Caption |
| Quote | `quote` | Quote, and Attribution under it |
| Clinic | `clinic` | A clinic. Style chooses the panel. Quote, the default, is the logo, her words, and a visit link. Card is the product photo and price. |

| Label | Id | Kind | Variations |
| --- | --- | --- | --- |
| Section | The seven Section fields | Shared, open on the slice | All |
| Side | `side` | Select: Media left, Media right. Default Media left | All |
| Media position | `media_position` | Select: Center, Top, Sticky. Default Center | All |
| Text | `text` | Content rich text | All |
| Buttons | `button` | Repeatable link, with display text and a style | All |
| Image | `image` | Image | Image |
| Caption | `caption` | Heading rich text | Image, Video |
| Caption on the photo | `caption_on_photo` | Boolean. On the photo, or under the photo. Default On the photo | Image |
| Video | `video` | Embed | Video |
| Quote | `quote` | Heading rich text | Quote, Image |
| Attribution | `attribution` | Text | Quote |
| Clinic | `clinic` | Content relationship to Provider | Clinic |
| Style | `style` | Select: Quote, Card. Default Quote | Clinic |

On the Clinic variation, Style chooses the media. Quote, the default, is
the soft panel: the logo, the brand name, her words, and the visit link.
The logo tile has extra padding so the mark sits in a clear margin. A
blank Style is Quote, so a clinic panel saved before this field existed
stays a quote. Card replaces that panel with the product photo and the
price, the same card Brand promo uses when its Style is Card. The photo,
the price, and the visit button come from the clinic.

Text uses the content toolbar. A Signoff label on a whole paragraph is
the large closing line. A Note label on a whole paragraph is the tint
box. The story's note is "I am not a medical professional, and this site
does not provide medical advice or treatment plans." A paragraph can
start with a clinic token, the same `{{provider:inner-balance:offer}}`
and `{{provider:inner-balance:facts}}` tokens as the post.

Caption is the line about the photo, such as "Me and Winston, my
Bernedoodle." Caption on the photo is on by default. On draws those
words as a label on the lower left of the picture. Off centers the same
words under the photo. A blank Caption hides the line. Video captions
stay on the video.

On the Image variation, Quote is optional. A filled Quote is the large
line in the writing column, under the intro and above Text, with no box
and no attribution. The test kits page puts Peggy's photo on the left and
"From “I think something is wrong” to “Here is the evidence of my
hormonal shift.”" above the intro. On the Quote variation, Quote is
still the boxed sentence on the media side.

## Provider, Offer, and Callout

### Provider

Custom type, in `customtypes/provider`. One brand, one document. In
the editor the type is labeled Brand. The API id stays `provider`,
because Prismic cannot rename a type id and every slice relationship,
query, and story token uses it. A brand is a clinic or a product she
reviews, such as an at-home test kit. Kind says which. Below, "clinic"
means any brand unless a rule says Clinic or Product.
Peggy fills it in tabs. A tab is a group of fields in the editor.
Every tab is static, so a slice or a story token can read it.

The UID is the id a story token uses, such as `inner-balance`. A clinic
has no public page. A clinic page is a Page, and the slices on that
page point at this document.

Slices point at this document with a content relationship. Each slice
fills itself from the fields it lists. Price is one field. The
comparison chart, the clinic price card, a facts token, and any later
slice that lists `monthly_price` all show that same number. On the
Links tab, Affiliate (`visit`) is a web link. Review video
(`youtube`) is a web link. Page (`page`) is a Page document. My review
(`review`) is a Post. My comparison (`comparison`) is a repeatable
link to Posts, with display text. Those are the links a slice reads from the
clinic. Product image (`product`) is
the jar or
bottle a slice reads from the clinic. A slice lists the field on its
clinic relationship, the same way it lists `visit`.

| Place | Points with | Fills in |
| --- | --- | --- |
| Hero, brands | `clinic` | Name, logo |
| Hero, provider | `clinic` | Name, logo, formulation, visit, price, price is, price note, top choice label, code, code line |
| Clinic comparison | `clinic` | Name, logo, short description, price, price note, insurance, formulation, quote, getting started, top choice label, visit, code, code line. The review link is on the slice row |
| Quote | `clinic` | Logo, name, visit. A Name on the slice replaces the clinic name |
| Side by side, clinic | `clinic` | Logo, name, quote, visit, and, when Style is Card, kind, product image, price, price is, price note, formulation, insurance, getting started, code, code line. Style stays on the slice. Quote is the logo panel. Card is the product photo and price. |
| Boxes | `clinic` on each box | Logo, top choice label, name, code. A written Image, Heading, Text, or Bottom line replaces it |
| Brand promo | `clinic` | Name, kind, logo, visit, page, my review, my comparison, review video, product image, price, price is, price note, formulation, insurance, getting started, code, code line, quote. Page is Products & pricing. My review is her post. Each My comparison is a button with its display text. Review video is Watch my review. A photo in Overwrite replaces the product image. A written Quote replaces the clinic quote. Style on the slice chooses the quote panel or the product card. Is this 1st? and Place stay on the slice. Text and extra links are in Overwrite. Extra links are a second row of text |
| Clinic facts | `clinic` | Kind, state availability, typically prescribed, labs, insurance, HSA / FSA, getting started, how it works, specialties |
| Post sidebar | `clinic` | Name, logo. The name links to Page when that field is set |
| Story offer token | `{{provider:uid:offer}}` | Logo, name, visit, code, code line, plus the sentence in that paragraph |
| Story facts token | `{{provider:uid:facts}}` | Price, price is, price note, insurance (clinics only), formulation |

#### Profile

Who the clinic is. The homepage, the offer box, and the sidebar read
this tab.

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Name | `name` | Text | Yes |
| Kind | `kind` | Select: Clinic, Product. Default Clinic | Yes |
| Logo | `logo` | Image | Yes |
| Short description | `short_description` | Text | No |
| Top choice label | `top_choice_label` | Text | No |

Short description is the one line about the clinic. The comparison
chart's Description column reads it, and so does any other clinic
summary that needs a short line. A Boxes box with an empty Heading
shows the top choice label as its title. A blank Top choice label
means no badge, and that box has no title unless Heading is written.
A clinic on the site is one Peggy has tried. There is no tested
checkbox.

Kind is Clinic or Product. An empty Kind is a clinic. A product has
no insurance line: the Brand promo price box and the story facts
token leave out Takes insurance. The comparison chart is for clinics
and does not read Kind. Prismic pickers filter by type, not by a
field, so a product still appears in every brand picker.

#### Links

The second tab. The five links for this brand.

| Label | Id | Kind | Required |
| --- | --- | --- | --- |
| Affiliate | `visit` | Web link, with display text, open in a new tab | No |
| Review video | `youtube` | Web link, no display text | No |
| Page | `page` | Link to a Page document | No |
| My review | `review` | Link to a Post | No |
| My comparison | `comparison` | Repeatable link, with display text. Documents are Posts only | No |

An empty Affiliate link means a name that would go to the clinic's
site is not a link. The placeholder is "Affiliate link". Affiliate
only accepts a web address. The button still says "Visit" plus the
clinic name when she leaves the display text blank. Review video is
the YouTube link for her review. Slices say "Watch my review", and the
video plays in a modal on the page. A blank Review video hides that
link. Page is the site page about this clinic.
The sidebar name links there when Page is set, and a blank Page leaves
that name as text. My review is the post where she reviews this brand.
Brand promo says "My review". A blank My review hides that button.
My comparison holds her blog posts that compare this brand with
another. She adds one link per post. Brand promo shows each as a
button after My review, in editor order, and each button says its
display text, such as "Musely vs Winona cream". A blank display text
says "My comparison". An empty link is skipped, and an empty My
comparison shows no comparison buttons. The field allows any link
kind, which is the repeatable link the type generator supports. Its
document picker only lists Posts. A web address gets a button too.
A brand saved before the field was repeatable has a single link, and
the site reads it as a list of one.

#### Price

The one amount, whether it is per month, and the line under it.

| Label | Id | Kind | Example |
| --- | --- | --- | --- |
| Price | `monthly_price` | Number | What I paid |
| Price is | `price_unit` | Select: Per month, One time. Default Per month | One time for the Mira kit, $179 |
| Price note | `price_note` | Text | First six months, then $99. |
| Typically prescribed | `formulation` | Text | Oestra vaginal cream |
| Takes insurance | `insurance` | Boolean | No |
| Getting started | `note` | Text | Free consults as needed. |
| Code | `code` | Text | PEGGY10. Blank when there is no code. |
| Code line | `code_note` | Text | 10% off your first order. |

The comparison chart and the clinic price card show this same price.
Price is Per month shows "/mo" after the price. One time shows the
price alone, in the provider Hero, Brand promo, and the story facts
token. An empty Price is means per month. The comparison chart always
shows "/mo", because its column is "What I paid per month".
A step-down, such as $199 then $99, is written in Price note. A consult
fee goes there too, such as "+ $99 one-time consult."

Typically prescribed, Takes insurance, and Getting started are the
three bullets in the price box, in that order. The chart also uses
the first two as columns, and Getting started is the line under the
quote.

#### Care

Facts that are not in the price box. The Clinic facts slice reads
this tab.

| Label | Id | Kind |
| --- | --- | --- |
| Labs | `lab_requirement` | Text |
| HSA / FSA | `hsa_fsa` | Boolean |
| State availability | `state_availability` | Text |
| Specialties | `specialties` | Rich text: paragraph, bullet. One per line |
| How it works | `how_it_works` | Repeatable group: Step title (`title`), Step text (`text`), both Text |

Specialties and How it works are the "Specialities" and "How it Works"
blocks on the Wix clinic pages (owner decision, 2026-10-12: typed once
on the Brand).

#### Words

Her one sentence. The long review stays on the Provider review.

| Label | Id | Kind | Homepage use |
| --- | --- | --- | --- |
| In my words | `quote` | Heading rich text | The table quote |

#### Product

The jar or bottle. A slice that shows the product reads this image.
The description is the alt text.

| Label | Id | Kind |
| --- | --- | --- |
| Product image | `product` | Image |

Code and Code line sit on the Price tab. Visit is the only link to the
clinic's own site. Review video is the YouTube link slices share.
Slices say "Watch my review". "Read review" is a written link on the
slice that shows it.

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
contained only `/blog`. The API returned five Wix blog categories on
42 posts.

Checked again on 2026-10-15: all 144 posts have one of those five
categories, and the categories sitemap lists their pages. The select
uses the tightened labels in `docs/CONTENT_MODEL.md`.
`scripts/set-post-categories.mts` wrote those labels onto the 142
posts already in Prismic. On that same day the Wix label
"My Experience &  Results" was corrected to "My Experience & Results".
Its public path stayed `/blog/categories/patient-experience-results`.
The formulations category path changed from
`/blog/categories/comparisons-1-1` to
`/blog/categories/formulations-dosages`. The old path returns 404 and
still needs a redirect.

Every post has a cover image. One of the 142 excerpts
matches its meta description, so those stay separate fields. Tags are
sparse and messy. Migration writes each Wix tag label onto the
document's Prismic tags, once per post when two differ only in
capitals. Across posts the Wix capitals stay as they are, so Prismic
lists pairs such as `Inner Balance` and `inner balance` (9 pairs in
the 2026-10-08 export). Published is the date on the Wix article, the
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
| Tables | `tables` | Repeatable group of one Table field (`table`) | No | A `{{table}}` line in the story shows the first item, `{{table2}}` the second, and so on |
| Image | `image` | Image, including its description | Yes | Wix cover |
| Caption | `caption` | Heading rich text | No | The line under the cover, when that photo has one |
| Author | `author` | Content relationship to Author | No | Left empty. Empty means Peggy B. Two posts are corrected in Prismic |
| Published | `published_date` | Date | Yes | The date on the Wix article. Wix first published date |
| Category | `category` | Select | No | Peggy's five Wix categories, with the tightened labels. Set by `scripts/set-post-categories.mts` |
| Sources | `sources` | Repeatable group | No | Mockup only |
| Canonical | `canonical` | Link, no display text | No | Only when the post should point elsewhere |
| Indexing | `indexing` | Boolean | Yes | On. Turn it off only to hide a post |

Every post is `/post/<uid>`. There is no URL section field. The UID is
the Wix slug.

Category choices are Telehealth brand reviews, Formulations & dosages,
My experience & results, Testing, labs & tracking, and Cost, insurance
& access.
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
story with any words is at least one minute. A clinic token,
`{{photos}}`, and `{{photo-text}}` are not counted. Wix tags are the document tags at the top of the post, not a
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
and do not repeat the photo. The cover is not a link. A link Wix had
on that first photo is not kept (81 posts in the 2026-10-08 export,
17 of them affiliate links). Approved by the owner on 2026-10-09.

A photo on its own in the story is centered. It is never wider than
the story column or than the photo file itself, and never taller than
576 pixels; a photo that would be taller shows narrower, at its own
shape. In the 2026-10-08 export, 380 of 590 story photos were taller
than that at full column width on a 1440-pixel laptop, and 94 were
narrower than the column. Wix also kept a size on each photo (154 were
set to Small); that setting is not imported, and the cap replaces it.
Photos in a `{{photos}}` row or beside text keep their own layout.
Approved by the owner on 2026-10-12.

The paragraph directly under a photo on its own shows as its caption:
smaller and centered, in the body color. The caption is 75% of the story column,
whatever width the photo is. A heading, a
list, or a token under the photo is not a caption. Nothing in the
paragraph changes in Prismic, so this can be undone in the layout
alone. In the 2026-10-08 export, 13 of 590 story photos had no Wix
caption and were followed by story text, which now shows as a caption.
Most of those are lines about the photo ("See my YouTube video…"). To
keep a sentence as story text, move it above the photo.

| Wix block | Becomes |
| --- | --- |
| Paragraph | Paragraph |
| Heading | Heading 2, 3, or 4. The page title is the only Heading 1. A heading 1, 5, or 6 in the story becomes Heading 2 |
| Bold, italic | Bold, italic |
| Underline, text color, font size | The words, as a normal paragraph. A 10px number becomes the superscript label |
| Link | Link. Keep the full address, including affiliate parameters. A link Wix saved without `https://` (such as `winona.pxf.io/daBV57`) gets it. A link that is still not a web address stops the import |
| Jump link to a spot in the same post | The words, without the link, and a migration flag |
| Link Wix made out of a sentence ("product. It" → `http://product.It`) | The words, without the link. Listed under "changes" in the migration report. Approved by the owner on 2026-10-09 |
| Image | Image, then its caption as the next paragraph. A link on the photo stays on the photo. A linked photo with no description takes its caption as the description |
| Link to this site | The `www` address in lowercase. A redirected address goes straight to its destination, and a post that no longer exists goes to `/blog` (see `docs/MIGRATION_RUNBOOK.md`) |
| Two photos side by side | Two images, each with its caption. See Photo row |
| Button | A paragraph that is only that link |
| YouTube or other video | Video embed |
| List | List |
| Quote | A paragraph. The story has no quote block |
| Table | The next item in Tables, and a `{{table}}`, `{{table2}}`, … line where it sat. A first row that is all bold becomes the header row. A blank line inside a cell becomes a line break |
| Gallery | Its photos, full width, one after another, and a migration flag. There is no gallery piece (owner decision, 2026-10-09) |
| Empty line used as spacing | Dropped |
| Divider | Not imported. A horizontal line in the Wix story is left out |
| File, custom HTML, poll, or code | Not dropped. The migration report lists the post for manual review |

Tables show up in 21 of the 142 Wix posts (24 tables), usually a
pricing or lab grid in the middle of the story. One rich text field
cannot hold a table, so each grid is an item in Tables and a line that
is only its token places it. `{{table}}` (or `{{table1}}`) is the
first item, `{{table2}}` the second. A token with no matching item is
hidden on the public site and named in preview. To add a grid by hand,
add an item to Tables and the matching line to the story. Mark the
first row as the header. Repeat a name that spans several rows,
because a cell cannot merge. A grid that is only one clinic's current price
and formulation can later be replaced with a facts token. A grid that
compares several clinics, or lists lab markers, stays in Tables.
Those words are not on the clinic.

### Photo row

A paragraph that is only `{{photos}}` places the next two photos side
by side, in the same row as the mockup. The paragraph under each photo
is that photo's caption. Bold the first word for a label such as
Before or After. A photo with no token above it stays full width. One
photo after the token stays full width, and the token is not shown. A
heading or another token between the photos ends the row. Import does
not write the token.

### Photo beside text

A paragraph that is only `{{photo-text}}` places the next photo and the
one paragraph under it in one block. The photo takes a third of the
width and the paragraph sits to its right. On a phone the block is one
column, photo first. A photo with no paragraph under it stays full
width, and the token is not shown. A token with no photo after it is
not shown. A heading or another token under the photo is not taken as
its paragraph. Import does not write the token.

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

Story help: "Write the story readers will see. A line that is only {{table}} shows the first table from Tables there, {{table2}} the second, and so on."

The sidebar is not a field. It reads the story. Each clinic appears
once, in the order of its first token, and the sidebar shows the first
four. The logo and the name come from that clinic. The name links to
the clinic's Page field. A blank Page leaves the name as text. A review
link is written on the slice that shows Read review.
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

## Page

Repeatable page type, in `customtypes/page`. One site page, such as
`/inner-balance` or `/copy-of-trusted-providers`. Every Page is
`/<uid>`. There is no URL section field. The UID is the Wix slug,
unchanged.

The slice zone accepts every shared slice: Hero, Start here, Posts,
Clinic comparison, Quote, Side by side, Divider, Boxes, Brand promo,
Ribbon, Text, Clinic facts, and Pros and cons. A slice added to the
library later is connected to Page too.

| Label | Id | Kind | Required | Notes |
| --- | --- | --- | --- | --- |
| UID | `uid` | UID | Yes | The Wix slug |
| Slices | `slices` | Slice zone | No | Every shared slice |
| Meta title | `meta_title` | Text | No | Empty uses the Hero title, which is the clinic's name on a provider Hero. Also the `h1` when the first slice is not a Hero |
| Meta description | `meta_description` | Text | No | Empty leaves the description off |
| Social image | `meta_image` | Image | No | 2400 × 1260 |
| Indexing | `indexing` | Boolean | Yes | On. Turn it off only to hide a page |

The Hero heading is the page title on the page. A page whose first
slice is not a Hero shows the SEO title as the `h1` above the slices. A
second Hero lower on the page is a second `h1`, so a page uses one Hero,
at the top.

The canonical is `/<uid>`. Indexing is on by default. The site-wide
noindex switch still hides every page until cutover.

The page reads what its slices point at before it renders. A slice does
not fetch. A clinic a slice names is read from the published Clinic, by
the fields each slice lists under Provider. An unpublished clinic is
left out of the chart, and a Quote or Side by side without one shows
its writing only. A clinic token in Side by side or Text writing reads
the same fields as a story token. Posts loads every Post only when the page has
a Posts slice. Featured shows the post it points at, or the newest.
Grid reads `?page=` and `?category=` from the address. Those addresses
keep the page's canonical.
