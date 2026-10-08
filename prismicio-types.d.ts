import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };

type PickContentRelationshipFieldData<
  TRelationship extends
    | prismic.CustomTypeModelFetchCustomTypeLevel1
    | prismic.CustomTypeModelFetchCustomTypeLevel2
    | prismic.CustomTypeModelFetchGroupLevel1
    | prismic.CustomTypeModelFetchGroupLevel2,
  TData extends Record<
    string,
    | prismic.AnyRegularField
    | prismic.GroupField
    | prismic.NestedGroupField
    | prismic.SliceZone
  >,
  TLang extends string,
> =
  // Content relationship fields
  {
    [
      TSubRelationship in Extract<
        TRelationship["fields"][number],
        prismic.CustomTypeModelFetchContentRelationshipLevel1
      > as TSubRelationship["id"]
    ]: ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
  } & { // Group
    [
      TGroup in Extract<
        TRelationship["fields"][number],
        | prismic.CustomTypeModelFetchGroupLevel1
        | prismic.CustomTypeModelFetchGroupLevel2
      > as TGroup["id"]
    ]: TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
      ? prismic.GroupField<
          PickContentRelationshipFieldData<TGroup, TGroupData, TLang>
        >
      : never;
  } & { // Other fields
    [
      TFieldKey in Extract<TRelationship["fields"][number], string>
    ]: TFieldKey extends keyof TData ? TData[TFieldKey] : never;
  };

type ContentRelationshipFieldWithData<
  TCustomType extends
    | readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[]
    | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
  TLang extends string = string,
> = {
  [
    ID in Exclude<TCustomType[number], string>["id"]
  ]: prismic.ContentRelationshipField<
    ID,
    TLang,
    PickContentRelationshipFieldData<
      Extract<TCustomType[number], { id: ID }>,
      Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
      TLang
    >
  >;
}[Exclude<TCustomType[number], string>["id"]];

/**
 * Content for Author documents
 */
interface AuthorDocumentData {
  /**
   * Name field in *Author*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: author.name
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  name: prismic.KeyTextField;

  /**
   * About field in *Author*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: author.about
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  about: prismic.RichTextField;

  /**
   * Profile field in *Author*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: author.profile
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  profile: prismic.ImageField<never>;
}

/**
 * Author document from Prismic
 *
 * - **API ID**: `author`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type AuthorDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<Simplify<AuthorDocumentData>, "author", Lang>;

type HomepageDocumentDataSlicesSlice =
  | DividerSlice
  | HeroSlice
  | StartHereSlice
  | PostsSlice
  | ClinicComparisonSlice
  | QuoteSlice
  | SideBySideSlice;

/**
 * Content for Homepage documents
 */
interface HomepageDocumentData {
  /**
   * Slice Zone field in *Homepage*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: homepage.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/slices
   */
  slices: prismic.SliceZone<HomepageDocumentDataSlicesSlice>; /**
   * Meta Title field in *Homepage*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: homepage.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  meta_title: prismic.KeyTextField;

  /**
   * Meta Description field in *Homepage*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: homepage.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  meta_description: prismic.KeyTextField; /**
   * Copyright Text field in *Homepage*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: homepage.footer_copyright_text
   * - **Tab**: Footer
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  footer_copyright_text: prismic.KeyTextField;

  /**
   * Cookies Link field in *Homepage*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: homepage.footer_cookies_link
   * - **Tab**: Footer
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  footer_cookies_link: prismic.LinkField<
    string,
    string,
    unknown,
    prismic.FieldState,
    never
  >;

  /**
   * Social Links field in *Homepage*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: homepage.footer_social_links
   * - **Tab**: Footer
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  footer_social_links: prismic.Repeatable<
    prismic.LinkField<
      string,
      string,
      unknown,
      prismic.FieldState,
      "X" | "YouTube" | "GitHub" | "LinkedIn"
    >
  >;
}

/**
 * Homepage document from Prismic
 *
 * - **API ID**: `homepage`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomepageDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithoutUID<
    Simplify<HomepageDocumentData>,
    "homepage",
    Lang
  >;

/**
 * Item in *Blog post → Sources*
 */
export interface PostDocumentDataSourcesItem {
  /**
   * Link field in *Blog post → Sources*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: post.sources[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Detail field in *Blog post → Sources*
   *
   * - **Field Type**: Text
   * - **Placeholder**: PubMed Central
   * - **API ID Path**: post.sources[].detail
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  detail: prismic.KeyTextField;
}

/**
 * Item in *Blog post → Topics*
 */
export interface PostDocumentDataTopicsItem {
  /**
   * Topic field in *Blog post → Topics*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: post.topics[].topic
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  topic: prismic.ContentRelationshipField<"topic">;
}

/**
 * Content for Blog post documents
 */
interface PostDocumentData {
  /**
   * Title field in *Blog post*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: post.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  title: prismic.RichTextField;

  /**
   * Subtitle field in *Blog post*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The line under the title, and the card. The Wix excerpt goes here.
   * - **API ID Path**: post.sub_title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  sub_title: prismic.RichTextField;

  /**
   * Personal note field in *Blog post*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The box above the story. The label Personal review note is added for you.
   * - **API ID Path**: post.note
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  note: prismic.RichTextField;

  /**
   * Story field in *Blog post*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: To add a clinic's offer, start a paragraph with {{provider:inner-balance:offer}} and use that clinic's id. Write your sentence after it. {{provider:inner-balance:facts}} adds that clinic's price and formulation. The sidebar lists each clinic the first time a token names it.
   * - **API ID Path**: post.body
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  body: prismic.RichTextField;

  /**
   * Image field in *Blog post*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: post.image
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  image: prismic.ImageField<never>;

  /**
   * Caption field in *Blog post*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The line under the photo. It can include a link.
   * - **API ID Path**: post.caption
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  caption: prismic.RichTextField;

  /**
   * Author field in *Blog post*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: Leave empty for Peggy.
   * - **API ID Path**: post.author
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  author: ContentRelationshipFieldWithData<
    [{ fields: ["name", "about", "profile"]; id: "author" }]
  >;

  /**
   * Published field in *Blog post*
   *
   * - **Field Type**: Date
   * - **Placeholder**: *None*
   * - **API ID Path**: post.published_date
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/date
   */
  published_date: prismic.DateField;

  /**
   * Category field in *Blog post*
   *
   * - **Field Type**: Select
   * - **Placeholder**: Shown above the title. Leave blank if none of these fit.
   * - **API ID Path**: post.category
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  category: prismic.SelectField<
    "Review" | "Comparison" | "My experience" | "HRT 101"
  >;

  /**
   * Sources field in *Blog post*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: post.sources[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  sources: prismic.GroupField<Simplify<PostDocumentDataSourcesItem>>;

  /**
   * Topics field in *Blog post*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: post.topics[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  topics: prismic.GroupField<Simplify<PostDocumentDataTopicsItem>>; /**
   * Meta title field in *Blog post*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Leave empty to use the post title.
   * - **API ID Path**: post.meta_title
   * - **Tab**: SEO
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  meta_title: prismic.KeyTextField;

  /**
   * Meta description field in *Blog post*
   *
   * - **Field Type**: Text
   * - **Placeholder**: The search result. It is not the subtitle.
   * - **API ID Path**: post.meta_description
   * - **Tab**: SEO
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  meta_description: prismic.KeyTextField;

  /**
   * Social image field in *Blog post*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: post.meta_image
   * - **Tab**: SEO
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  meta_image: prismic.ImageField<never>;

  /**
   * Canonical field in *Blog post*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Leave empty unless this post should point at a different address.
   * - **API ID Path**: post.canonical
   * - **Tab**: SEO
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  canonical: prismic.LinkField<
    string,
    string,
    unknown,
    prismic.FieldState,
    never
  >;

  /**
   * Indexing field in *Blog post*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Index
   * - **API ID Path**: post.indexing
   * - **Tab**: SEO
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  indexing: prismic.SelectField<"Index" | "No index", "filled">;
}

/**
 * Blog post document from Prismic
 *
 * - **API ID**: `post`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PostDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<Simplify<PostDocumentData>, "post", Lang>;

/**
 * Item in *Clinic → Treatments*
 */
export interface ProviderDocumentDataTreatmentsItem {
  /**
   * Treatment field in *Clinic → Treatments*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.treatments[].treatment
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  treatment: prismic.ContentRelationshipField<"treatment">;
}

/**
 * Item in *Clinic → Pros*
 */
export interface ProviderDocumentDataProsItem {
  /**
   * Text field in *Clinic → Pros*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.pros[].text
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  text: prismic.KeyTextField;
}

/**
 * Item in *Clinic → Cons*
 */
export interface ProviderDocumentDataConsItem {
  /**
   * Text field in *Clinic → Cons*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.cons[].text
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  text: prismic.KeyTextField;
}

/**
 * Item in *Clinic → Related*
 */
export interface ProviderDocumentDataRelatedItem {
  /**
   * Item field in *Clinic → Related*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.related[].item
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  item:
    | prismic.ContentRelationshipField<"post">
    | prismic.ContentRelationshipField<"provider_review">
    | prismic.ContentRelationshipField<"comparison">;
}

/**
 * Content for Clinic documents
 */
interface ProviderDocumentData {
  /**
   * Name field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.name
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  name: prismic.KeyTextField;

  /**
   * Logo field in *Clinic*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.logo
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  logo: prismic.ImageField<never>;

  /**
   * Short description field in *Clinic*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.short_description
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  short_description: prismic.RichTextField;

  /**
   * Best for field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.best_for
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  best_for: prismic.KeyTextField;

  /**
   * Official website field in *Clinic*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.website
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  website: prismic.LinkField<
    string,
    string,
    unknown,
    prismic.FieldState,
    never
  >;

  /**
   * Visit field in *Clinic*
   *
   * - **Field Type**: Link
   * - **Placeholder**: The affiliate link. Opens in a new tab.
   * - **API ID Path**: provider.visit
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  visit: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Personally tested field in *Clinic*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: provider.personally_tested
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/boolean
   */
  personally_tested: prismic.BooleanField;

  /**
   * Testing notes field in *Clinic*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.testing_notes
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  testing_notes: prismic.RichTextField;

  /**
   * Facts checked field in *Clinic*
   *
   * - **Field Type**: Date
   * - **Placeholder**: The day you last confirmed the prices and care details.
   * - **API ID Path**: provider.last_verified_date
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/date
   */
  last_verified_date: prismic.DateField;

  /**
   * Top choice label field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Leave blank for no badge.
   * - **API ID Path**: provider.top_choice_label
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  top_choice_label: prismic.KeyTextField;

  /**
   * Source notes field in *Clinic*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.source_notes
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  source_notes: prismic.RichTextField; /**
   * Monthly price field in *Clinic*
   *
   * - **Field Type**: Number
   * - **Placeholder**: What I paid per month. The comparison chart uses this.
   * - **API ID Path**: provider.monthly_price
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/number
   */
  monthly_price: prismic.NumberField;

  /**
   * Price note field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: The line under the chart price.
   * - **API ID Path**: provider.price_note
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  price_note: prismic.KeyTextField;

  /**
   * Display price field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: The price on the clinic page, such as 199.
   * - **API ID Path**: provider.display_price
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  display_price: prismic.KeyTextField;

  /**
   * Display price note field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: First six months, then $99.
   * - **API ID Path**: provider.display_price_note
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  display_price_note: prismic.KeyTextField;

  /**
   * Consultation fee field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: No visit, or 150
   * - **API ID Path**: provider.consultation_fee
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  consultation_fee: prismic.KeyTextField;

  /**
   * Membership fee field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Leave blank when there is none.
   * - **API ID Path**: provider.membership_fee
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  membership_fee: prismic.KeyTextField; /**
   * Typically prescribed field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.formulation
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  formulation: prismic.KeyTextField;

  /**
   * Lab requirement field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.lab_requirement
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  lab_requirement: prismic.KeyTextField;

  /**
   * Lab notes field in *Clinic*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.lab_notes
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  lab_notes: prismic.RichTextField;

  /**
   * Takes insurance field in *Clinic*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: provider.insurance
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/boolean
   */
  insurance: prismic.BooleanField;

  /**
   * HSA / FSA field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.hsa_fsa
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  hsa_fsa: prismic.KeyTextField;

  /**
   * Shipping field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.shipping
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  shipping: prismic.KeyTextField;

  /**
   * Eligibility field in *Clinic*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.eligibility
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  eligibility: prismic.RichTextField;

  /**
   * State availability field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: All 50 states
   * - **API ID Path**: provider.state_availability
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  state_availability: prismic.KeyTextField;

  /**
   * Treatments field in *Clinic*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.treatments[]
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  treatments: prismic.GroupField<Simplify<ProviderDocumentDataTreatmentsItem>>;

  /**
   * Weight support field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.weight_support
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  weight_support: prismic.KeyTextField; /**
   * In my words field in *Clinic*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.quote
   * - **Tab**: Words
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  quote: prismic.RichTextField;

  /**
   * Extra note field in *Clinic*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The line under the quote.
   * - **API ID Path**: provider.note
   * - **Tab**: Words
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  note: prismic.RichTextField;

  /**
   * Pros field in *Clinic*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.pros[]
   * - **Tab**: Words
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  pros: prismic.GroupField<Simplify<ProviderDocumentDataProsItem>>;

  /**
   * Cons field in *Clinic*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.cons[]
   * - **Tab**: Words
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  cons: prismic.GroupField<Simplify<ProviderDocumentDataConsItem>>; /**
   * Offer field in *Clinic*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.offer
   * - **Tab**: Offer
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  offer: prismic.ContentRelationshipField<"offer">; /**
   * Review field in *Clinic*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.review
   * - **Tab**: Links
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  review: prismic.ContentRelationshipField<"provider_review">;

  /**
   * Related field in *Clinic*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.related[]
   * - **Tab**: Links
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  related: prismic.GroupField<Simplify<ProviderDocumentDataRelatedItem>>; /**
   * Meta title field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.meta_title
   * - **Tab**: SEO
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  meta_title: prismic.KeyTextField;

  /**
   * Meta description field in *Clinic*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.meta_description
   * - **Tab**: SEO
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  meta_description: prismic.KeyTextField;

  /**
   * Social image field in *Clinic*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.meta_image
   * - **Tab**: SEO
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  meta_image: prismic.ImageField<never>;

  /**
   * URL section field in *Clinic*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: No public page
   * - **API ID Path**: provider.url_section
   * - **Tab**: SEO
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  url_section: prismic.SelectField<
    "No public page" | "Blog post (/post/…)" | "Site page (/…)",
    "filled"
  >;

  /**
   * Indexing field in *Clinic*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Index
   * - **API ID Path**: provider.indexing
   * - **Tab**: SEO
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  indexing: prismic.SelectField<"Index" | "No index", "filled">;
}

/**
 * Clinic document from Prismic
 *
 * - **API ID**: `provider`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProviderDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<
    Simplify<ProviderDocumentData>,
    "provider",
    Lang
  >;

export type AllDocumentTypes =
  AuthorDocument | HomepageDocument | PostDocument | ProviderDocument;

/**
 * Item in *Clinic comparison → Default → Primary → Section*
 */
export interface ClinicComparisonSliceDefaultPrimarySectionItem {
  /**
   * Small heading field in *Clinic comparison → Default → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.default.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Clinic comparison → Default → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Eight online HRT clinics, side by side
   * - **API ID Path**: clinic_comparison.default.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Clinic comparison → Default → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.default.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Clinic comparison → Default → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.default.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Clinic comparison → Default → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: clinic_comparison.default.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Clinic comparison → Default → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: clinic_comparison.default.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Clinic comparison → Default → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: clinic_comparison.default.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Item in *Clinic comparison → Default → Primary → Clinics*
 */
export interface ClinicComparisonSliceDefaultPrimaryClinicsItem {
  /**
   * Clinic field in *Clinic comparison → Default → Primary → Clinics*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.default.primary.clinics[].clinic
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  clinic: prismic.ContentRelationshipField<"provider">;
}

/**
 * Primary content in *Clinic comparison → Default → Primary*
 */
export interface ClinicComparisonSliceDefaultPrimary {
  /**
   * Section field in *Clinic comparison → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.default.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<
    Simplify<ClinicComparisonSliceDefaultPrimarySectionItem>
  >;

  /**
   * Prices checked on field in *Clinic comparison → Default → Primary*
   *
   * - **Field Type**: Date
   * - **Placeholder**: Shown beside What I paid per month.
   * - **API ID Path**: clinic_comparison.default.primary.prices_checked
   * - **Documentation**: https://prismic.io/docs/fields/date
   */
  prices_checked: prismic.DateField;

  /**
   * Button field in *Clinic comparison → Default → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.default.primary.button
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  button: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Disclosure field in *Clinic comparison → Default → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.default.primary.disclosure
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  disclosure: prismic.LinkField<
    string,
    string,
    unknown,
    prismic.FieldState,
    never
  >;

  /**
   * Clinics field in *Clinic comparison → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.default.primary.clinics[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  clinics: prismic.GroupField<
    Simplify<ClinicComparisonSliceDefaultPrimaryClinicsItem>
  >;
}

/**
 * Default variation for Clinic comparison Slice
 *
 * - **API ID**: `default`
 * - **Description**: The homepage chart. Add clinics in order. Edit a price on the clinic.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ClinicComparisonSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<ClinicComparisonSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Clinic comparison*
 */
type ClinicComparisonSliceVariation = ClinicComparisonSliceDefault;

/**
 * Clinic comparison Shared Slice
 *
 * - **API ID**: `clinic_comparison`
 * - **Description**: Clinics side by side. Prices and quotes come from each clinic.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ClinicComparisonSlice = prismic.SharedSlice<
  "clinic_comparison",
  ClinicComparisonSliceVariation
>;

/**
 * Primary content in *Divider → Default → Primary*
 */
export interface DividerSliceDefaultPrimary {
  /**
   * Line field in *Divider → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Squiggly
   * - **API ID Path**: divider.default.primary.line
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  line: prismic.SelectField<"Squiggly" | "Straight", "filled">;

  /**
   * Color field in *Divider → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Accent
   * - **API ID Path**: divider.default.primary.color
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  color: prismic.SelectField<"Accent" | "Soft" | "Border" | "Text", "filled">;

  /**
   * Background field in *Divider → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: divider.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Divider → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: divider.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Divider → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: divider.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Default variation for Divider Slice
 *
 * - **API ID**: `default`
 * - **Description**: A squiggly or straight line.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type DividerSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<DividerSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Divider*
 */
type DividerSliceVariation = DividerSliceDefault;

/**
 * Divider Shared Slice
 *
 * - **API ID**: `divider`
 * - **Description**: A line between sections.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type DividerSlice = prismic.SharedSlice<
  "divider",
  DividerSliceVariation
>;

/**
 * Item in *Hero → Home → Primary → Section*
 */
export interface HeroSliceHomePrimarySectionItem {
  /**
   * Small heading field in *Hero → Home → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.home.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Hero → Home → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Hormone Therapy Replacement
   * - **API ID Path**: hero.home.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Hero → Home → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.home.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Hero → Home → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.home.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Hero → Home → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: hero.home.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Hero → Home → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: hero.home.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Hero → Home → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: hero.home.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Item in *Hero → Home → Primary → Trust lines*
 */
export interface HeroSliceHomePrimaryTrustLinesItem {
  /**
   * Text field in *Hero → Home → Primary → Trust lines*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Patient since 2019
   * - **API ID Path**: hero.home.primary.trust_lines[].text
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  text: prismic.KeyTextField;
}

/**
 * Item in *Hero → Subpage → Primary → Section*
 */
export interface HeroSliceSubpagePrimarySectionItem {
  /**
   * Small heading field in *Hero → Subpage → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Learn
   * - **API ID Path**: hero.subpage.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Hero → Subpage → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: New to hormone therapy
   * - **API ID Path**: hero.subpage.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Hero → Subpage → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.subpage.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Hero → Subpage → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Start here
   * - **API ID Path**: hero.subpage.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Hero → Subpage → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: hero.subpage.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Hero → Subpage → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: hero.subpage.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Hero → Subpage → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: hero.subpage.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Item in *Hero → Brands → Primary → Section*
 */
export interface HeroSliceBrandsPrimarySectionItem {
  /**
   * Small heading field in *Hero → Brands → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Providers
   * - **API ID Path**: hero.brands.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Hero → Brands → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Trusted providers
   * - **API ID Path**: hero.brands.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Hero → Brands → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.brands.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Hero → Brands → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Full price chart
   * - **API ID Path**: hero.brands.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Hero → Brands → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: hero.brands.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Hero → Brands → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: hero.brands.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Hero → Brands → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: hero.brands.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Item in *Hero → Brands → Primary → Clinics*
 */
export interface HeroSliceBrandsPrimaryClinicsItem {
  /**
   * Clinic field in *Hero → Brands → Primary → Clinics*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.brands.primary.clinics[].clinic
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  clinic: ContentRelationshipFieldWithData<
    [{ fields: ["name", "logo"]; id: "provider" }]
  >;

  /**
   * Link field in *Hero → Brands → Primary → Clinics*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Where this logo goes, often a jump link like #inner-balance
   * - **API ID Path**: hero.brands.primary.clinics[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *Hero → Provider → Primary → Section*
 */
export interface HeroSliceProviderPrimarySectionItem {
  /**
   * Small heading field in *Hero → Provider → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Optional. Otherwise the clinic's top choice label is used.
   * - **API ID Path**: hero.provider.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Hero → Provider → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Optional. The clinic name is the title.
   * - **API ID Path**: hero.provider.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Hero → Provider → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.provider.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Hero → Provider → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.provider.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Hero → Provider → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: hero.provider.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Hero → Provider → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: hero.provider.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Hero → Provider → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: hero.provider.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Primary content in *Hero → Home → Primary*
 */
export interface HeroSliceHomePrimary {
  /**
   * Section field in *Hero → Home → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.home.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<Simplify<HeroSliceHomePrimarySectionItem>>;

  /**
   * Tagline field in *Hero → Home → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Feel like you again.
   * - **API ID Path**: hero.home.primary.tagline
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  tagline: prismic.RichTextField;

  /**
   * Benefits field in *Hero → Home → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.home.primary.benefits
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  benefits: prismic.Repeatable<
    prismic.LinkField<string, string, unknown, prismic.FieldState, never>
  >;

  /**
   * Buttons field in *Hero → Home → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: See what each clinic cost me
   * - **API ID Path**: hero.home.primary.button
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  button: prismic.Repeatable<
    prismic.LinkField<
      string,
      string,
      unknown,
      prismic.FieldState,
      "Solid" | "Ghost"
    >
  >;

  /**
   * Trust lines field in *Hero → Home → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.home.primary.trust_lines[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  trust_lines: prismic.GroupField<Simplify<HeroSliceHomePrimaryTrustLinesItem>>;

  /**
   * Image field in *Hero → Home → Primary*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.home.primary.image
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  image: prismic.ImageField<never>;

  /**
   * Words on the photo field in *Hero → Home → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Hi, I'm Peggy!
   * - **API ID Path**: hero.home.primary.photo_greeting
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  photo_greeting: prismic.KeyTextField;

  /**
   * Caption field in *Hero → Home → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.home.primary.caption
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  caption: prismic.RichTextField;
}

/**
 * Home variation for Hero Slice
 *
 * - **API ID**: `home`
 * - **Description**: Homepage. Peggy's photo, the benefit links, and the two buttons.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceHome = prismic.SharedSliceVariation<
  "home",
  Simplify<HeroSliceHomePrimary>,
  never
>;

/**
 * Primary content in *Hero → Subpage → Primary*
 */
export interface HeroSliceSubpagePrimary {
  /**
   * Section field in *Hero → Subpage → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.subpage.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<Simplify<HeroSliceSubpagePrimarySectionItem>>;

  /**
   * Image field in *Hero → Subpage → Primary*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.subpage.primary.image
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  image: prismic.ImageField<never>;
}

/**
 * Subpage variation for Hero Slice
 *
 * - **API ID**: `subpage`
 * - **Description**: A page title, a short intro, one text link, and a photo.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceSubpage = prismic.SharedSliceVariation<
  "subpage",
  Simplify<HeroSliceSubpagePrimary>,
  never
>;

/**
 * Primary content in *Hero → Brands → Primary*
 */
export interface HeroSliceBrandsPrimary {
  /**
   * Section field in *Hero → Brands → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.brands.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<Simplify<HeroSliceBrandsPrimarySectionItem>>;

  /**
   * Clinics field in *Hero → Brands → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.brands.primary.clinics[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  clinics: prismic.GroupField<Simplify<HeroSliceBrandsPrimaryClinicsItem>>;
}

/**
 * Brands variation for Hero Slice
 *
 * - **API ID**: `brands`
 * - **Description**: A page title, a short intro, one text link, and clinic logos.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceBrands = prismic.SharedSliceVariation<
  "brands",
  Simplify<HeroSliceBrandsPrimary>,
  never
>;

/**
 * Primary content in *Hero → Provider → Primary*
 */
export interface HeroSliceProviderPrimary {
  /**
   * Section field in *Hero → Provider → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.provider.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<Simplify<HeroSliceProviderPrimarySectionItem>>;

  /**
   * Clinic field in *Hero → Provider → Primary*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.provider.primary.clinic
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  clinic: ContentRelationshipFieldWithData<
    [
      {
        fields: [
          "name",
          "logo",
          "formulation",
          "visit",
          "display_price",
          "display_price_note",
          "top_choice_label",
          {
            customtypes: [{ fields: ["code", "display_copy"]; id: "offer" }];
            id: "offer";
          },
        ];
        id: "provider";
      },
    ]
  >;

  /**
   * Voted best for field in *Hero → Provider → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Voted best for sleep
   * - **API ID Path**: hero.provider.primary.voted
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  voted: prismic.RichTextField;

  /**
   * Quote field in *Hero → Provider → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.provider.primary.quote
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  quote: prismic.RichTextField;

  /**
   * Links field in *Hero → Provider → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.provider.primary.links
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  links: prismic.Repeatable<
    prismic.LinkField<string, string, unknown, prismic.FieldState, never>
  >;

  /**
   * Product image field in *Hero → Provider → Primary*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.provider.primary.product
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  product: prismic.ImageField<never>;
}

/**
 * Provider variation for Hero Slice
 *
 * - **API ID**: `provider`
 * - **Description**: The top of a clinic page. The name, price, logo, and coupon come from the clinic.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceProvider = prismic.SharedSliceVariation<
  "provider",
  Simplify<HeroSliceProviderPrimary>,
  never
>;

/**
 * Slice variation for *Hero*
 */
type HeroSliceVariation =
  HeroSliceHome | HeroSliceSubpage | HeroSliceBrands | HeroSliceProvider;

/**
 * Hero Shared Slice
 *
 * - **API ID**: `hero`
 * - **Description**: The top of the homepage, a subpage, the brand logos, or a clinic page.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSlice = prismic.SharedSlice<"hero", HeroSliceVariation>;

/**
 * Item in *Posts → Homepage → Primary → Section*
 */
export interface PostsSliceHomePrimarySectionItem {
  /**
   * Small heading field in *Posts → Homepage → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.home.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Posts → Homepage → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Latest reviews and posts
   * - **API ID Path**: posts.home.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Posts → Homepage → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.home.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Posts → Homepage → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.home.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Posts → Homepage → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: posts.home.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Posts → Homepage → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: posts.home.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Posts → Homepage → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: posts.home.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Item in *Posts → Featured → Primary → Section*
 */
export interface PostsSliceFeaturedPrimarySectionItem {
  /**
   * Small heading field in *Posts → Featured → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.featured.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Posts → Featured → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Latest reviews and posts
   * - **API ID Path**: posts.featured.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Posts → Featured → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.featured.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Posts → Featured → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.featured.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Posts → Featured → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: posts.featured.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Posts → Featured → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: posts.featured.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Posts → Featured → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: posts.featured.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Item in *Posts → Grid → Primary → Section*
 */
export interface PostsSliceGridPrimarySectionItem {
  /**
   * Small heading field in *Posts → Grid → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.grid.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Posts → Grid → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Latest reviews and posts
   * - **API ID Path**: posts.grid.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Posts → Grid → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.grid.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Posts → Grid → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.grid.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Posts → Grid → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: posts.grid.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Posts → Grid → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: posts.grid.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Posts → Grid → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: posts.grid.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Item in *Posts → Row → Primary → Section*
 */
export interface PostsSliceRowPrimarySectionItem {
  /**
   * Small heading field in *Posts → Row → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.row.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Posts → Row → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Latest reviews and posts
   * - **API ID Path**: posts.row.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Posts → Row → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.row.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Posts → Row → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.row.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Posts → Row → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: posts.row.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Posts → Row → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: posts.row.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Posts → Row → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: posts.row.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Primary content in *Posts → Homepage → Primary*
 */
export interface PostsSliceHomePrimary {
  /**
   * Section field in *Posts → Homepage → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.home.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<Simplify<PostsSliceHomePrimarySectionItem>>;

  /**
   * Category field in *Posts → Homepage → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: All
   * - **API ID Path**: posts.home.primary.category
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  category: prismic.SelectField<
    "All" | "Review" | "Comparison" | "My experience" | "HRT 101",
    "filled"
  >;
}

/**
 * Homepage variation for Posts Slice
 *
 * - **API ID**: `home`
 * - **Description**: Five posts. The newest is the large card. Category limits the list.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PostsSliceHome = prismic.SharedSliceVariation<
  "home",
  Simplify<PostsSliceHomePrimary>,
  never
>;

/**
 * Primary content in *Posts → Featured → Primary*
 */
export interface PostsSliceFeaturedPrimary {
  /**
   * Section field in *Posts → Featured → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.featured.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<Simplify<PostsSliceFeaturedPrimarySectionItem>>;

  /**
   * Category field in *Posts → Featured → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: All
   * - **API ID Path**: posts.featured.primary.category
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  category: prismic.SelectField<
    "All" | "Review" | "Comparison" | "My experience" | "HRT 101",
    "filled"
  >;

  /**
   * Post field in *Posts → Featured → Primary*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.featured.primary.post
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  post:
    | prismic.ContentRelationshipField<"post">
    | prismic.ContentRelationshipField<"provider_review">
    | prismic.ContentRelationshipField<"comparison">;
}

/**
 * Featured variation for Posts Slice
 *
 * - **API ID**: `featured`
 * - **Description**: One post. Leave Post empty for the newest in Category, or pick a post.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PostsSliceFeatured = prismic.SharedSliceVariation<
  "featured",
  Simplify<PostsSliceFeaturedPrimary>,
  never
>;

/**
 * Primary content in *Posts → Grid → Primary*
 */
export interface PostsSliceGridPrimary {
  /**
   * Section field in *Posts → Grid → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.grid.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<Simplify<PostsSliceGridPrimarySectionItem>>;

  /**
   * Category field in *Posts → Grid → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: All
   * - **API ID Path**: posts.grid.primary.category
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  category: prismic.SelectField<
    "All" | "Review" | "Comparison" | "My experience" | "HRT 101",
    "filled"
  >;

  /**
   * Posts per page field in *Posts → Grid → Primary*
   *
   * - **Field Type**: Number
   * - **Placeholder**: 12
   * - **API ID Path**: posts.grid.primary.count
   * - **Documentation**: https://prismic.io/docs/fields/number
   */
  count: prismic.NumberField;
}

/**
 * Grid variation for Posts Slice
 *
 * - **API ID**: `grid`
 * - **Description**: A page of posts. Empty Posts per page means 12. All adds the category tabs.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PostsSliceGrid = prismic.SharedSliceVariation<
  "grid",
  Simplify<PostsSliceGridPrimary>,
  never
>;

/**
 * Primary content in *Posts → Row → Primary*
 */
export interface PostsSliceRowPrimary {
  /**
   * Section field in *Posts → Row → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.row.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<Simplify<PostsSliceRowPrimarySectionItem>>;

  /**
   * Category field in *Posts → Row → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: All
   * - **API ID Path**: posts.row.primary.category
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  category: prismic.SelectField<
    "All" | "Review" | "Comparison" | "My experience" | "HRT 101",
    "filled"
  >;
}

/**
 * Row variation for Posts Slice
 *
 * - **API ID**: `row`
 * - **Description**: Three posts across. Category limits the list.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PostsSliceRow = prismic.SharedSliceVariation<
  "row",
  Simplify<PostsSliceRowPrimary>,
  never
>;

/**
 * Slice variation for *Posts*
 */
type PostsSliceVariation =
  PostsSliceHome | PostsSliceFeatured | PostsSliceGrid | PostsSliceRow;

/**
 * Posts Shared Slice
 *
 * - **API ID**: `posts`
 * - **Description**: Recent posts, newest first.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PostsSlice = prismic.SharedSlice<"posts", PostsSliceVariation>;

/**
 * Item in *Quote → Default → Primary → Section*
 */
export interface QuoteSliceDefaultPrimarySectionItem {
  /**
   * Small heading field in *Quote → Default → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: quote.default.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Quote → Default → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Peggy's take: what I'm using now
   * - **API ID Path**: quote.default.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Quote → Default → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: quote.default.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Quote → Default → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: quote.default.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Quote → Default → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: quote.default.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Quote → Default → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: quote.default.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Quote → Default → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: quote.default.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Primary content in *Quote → Default → Primary*
 */
export interface QuoteSliceDefaultPrimary {
  /**
   * Section field in *Quote → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: quote.default.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<Simplify<QuoteSliceDefaultPrimarySectionItem>>;

  /**
   * Quote field in *Quote → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The large sentence.
   * - **API ID Path**: quote.default.primary.quote
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  quote: prismic.RichTextField;

  /**
   * Name field in *Quote → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Oestra by Inner Balance. Leave empty to use the clinic name.
   * - **API ID Path**: quote.default.primary.name
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  name: prismic.KeyTextField;

  /**
   * Clinic field in *Quote → Default → Primary*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: quote.default.primary.clinic
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  clinic: prismic.ContentRelationshipField<"provider">;

  /**
   * Text field in *Quote → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The note under the name.
   * - **API ID Path**: quote.default.primary.text
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  text: prismic.RichTextField;

  /**
   * Reminder field in *Quote → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: This is my personal experience, not medical advice.
   * - **API ID Path**: quote.default.primary.reminder
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  reminder: prismic.RichTextField;

  /**
   * Review button field in *Quote → Default → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: quote.default.primary.review_button
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  review_button: prismic.LinkField<
    string,
    string,
    unknown,
    prismic.FieldState,
    never
  >;
}

/**
 * Default variation for Quote Slice
 *
 * - **API ID**: `default`
 * - **Description**: A dark band. Quote on the left, the clinic on the right.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type QuoteSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<QuoteSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Quote*
 */
type QuoteSliceVariation = QuoteSliceDefault;

/**
 * Quote Shared Slice
 *
 * - **API ID**: `quote`
 * - **Description**: A quote beside a clinic. The clinic supplies the logo and the visit link.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type QuoteSlice = prismic.SharedSlice<"quote", QuoteSliceVariation>;

/**
 * Item in *Side by side → Image → Primary → Section*
 */
export interface SideBySideSliceImagePrimarySectionItem {
  /**
   * Small heading field in *Side by side → Image → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.image.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Side by side → Image → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Menopause isn't a dirty word.
   * - **API ID Path**: side_by_side.image.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Side by side → Image → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.image.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Side by side → Image → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.image.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Side by side → Image → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: side_by_side.image.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Side by side → Image → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: side_by_side.image.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Side by side → Image → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: side_by_side.image.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Item in *Side by side → Video → Primary → Section*
 */
export interface SideBySideSliceVideoPrimarySectionItem {
  /**
   * Small heading field in *Side by side → Video → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.video.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Side by side → Video → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.video.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Side by side → Video → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.video.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Side by side → Video → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.video.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Side by side → Video → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: side_by_side.video.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Side by side → Video → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: side_by_side.video.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Side by side → Video → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: side_by_side.video.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Item in *Side by side → Quote → Primary → Section*
 */
export interface SideBySideSliceQuotePrimarySectionItem {
  /**
   * Small heading field in *Side by side → Quote → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.quote.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Side by side → Quote → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.quote.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Side by side → Quote → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.quote.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Side by side → Quote → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.quote.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Side by side → Quote → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: side_by_side.quote.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Side by side → Quote → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: side_by_side.quote.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Side by side → Quote → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: side_by_side.quote.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Item in *Side by side → Clinic → Primary → Section*
 */
export interface SideBySideSliceClinicPrimarySectionItem {
  /**
   * Small heading field in *Side by side → Clinic → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.clinic.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Side by side → Clinic → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.clinic.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Side by side → Clinic → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.clinic.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Side by side → Clinic → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.clinic.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Side by side → Clinic → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: side_by_side.clinic.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Side by side → Clinic → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: side_by_side.clinic.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Side by side → Clinic → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: side_by_side.clinic.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Primary content in *Side by side → Image → Primary*
 */
export interface SideBySideSliceImagePrimary {
  /**
   * Section field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.image.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<Simplify<SideBySideSliceImagePrimarySectionItem>>;

  /**
   * Side field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: Media left puts the photo on the left.
   * - **Default Value**: Media left
   * - **API ID Path**: side_by_side.image.primary.side
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  side: prismic.SelectField<"Media left" | "Media right", "filled">;

  /**
   * Image field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.image.primary.image
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  image: prismic.ImageField<never>;

  /**
   * Caption field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Sits on the photo. Me and Winston, my Bernedoodle.
   * - **API ID Path**: side_by_side.image.primary.caption
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  caption: prismic.RichTextField;

  /**
   * Text field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Signoff on a whole paragraph is the large closing line. Note on a whole paragraph is the tint box. Start a paragraph with {{provider:inner-balance:offer}} or {{provider:inner-balance:facts}} to pull that clinic in.
   * - **API ID Path**: side_by_side.image.primary.text
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  text: prismic.RichTextField;

  /**
   * Buttons field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Read my whole story
   * - **API ID Path**: side_by_side.image.primary.button
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  button: prismic.Repeatable<
    prismic.LinkField<
      string,
      string,
      unknown,
      prismic.FieldState,
      "Solid" | "Ghost"
    >
  >;
}

/**
 * Image variation for Side by side Slice
 *
 * - **API ID**: `image`
 * - **Description**: A photo beside the writing. The homepage story uses this.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SideBySideSliceImage = prismic.SharedSliceVariation<
  "image",
  Simplify<SideBySideSliceImagePrimary>,
  never
>;

/**
 * Primary content in *Side by side → Video → Primary*
 */
export interface SideBySideSliceVideoPrimary {
  /**
   * Section field in *Side by side → Video → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.video.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<Simplify<SideBySideSliceVideoPrimarySectionItem>>;

  /**
   * Side field in *Side by side → Video → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Media left
   * - **API ID Path**: side_by_side.video.primary.side
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  side: prismic.SelectField<"Media left" | "Media right", "filled">;

  /**
   * Video field in *Side by side → Video → Primary*
   *
   * - **Field Type**: Embed
   * - **Placeholder**: Paste a YouTube or Vimeo link.
   * - **API ID Path**: side_by_side.video.primary.video
   * - **Documentation**: https://prismic.io/docs/fields/embed
   */
  video: prismic.EmbedField;

  /**
   * Caption field in *Side by side → Video → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Sits on the video.
   * - **API ID Path**: side_by_side.video.primary.caption
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  caption: prismic.RichTextField;

  /**
   * Text field in *Side by side → Video → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Signoff on a whole paragraph is the large closing line. Note on a whole paragraph is the tint box. Start a paragraph with {{provider:inner-balance:offer}} or {{provider:inner-balance:facts}} to pull that clinic in.
   * - **API ID Path**: side_by_side.video.primary.text
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  text: prismic.RichTextField;

  /**
   * Buttons field in *Side by side → Video → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Read my whole story
   * - **API ID Path**: side_by_side.video.primary.button
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  button: prismic.Repeatable<
    prismic.LinkField<
      string,
      string,
      unknown,
      prismic.FieldState,
      "Solid" | "Ghost"
    >
  >;
}

/**
 * Video variation for Side by side Slice
 *
 * - **API ID**: `video`
 * - **Description**: A YouTube or Vimeo video beside the writing.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SideBySideSliceVideo = prismic.SharedSliceVariation<
  "video",
  Simplify<SideBySideSliceVideoPrimary>,
  never
>;

/**
 * Primary content in *Side by side → Quote → Primary*
 */
export interface SideBySideSliceQuotePrimary {
  /**
   * Section field in *Side by side → Quote → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.quote.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<Simplify<SideBySideSliceQuotePrimarySectionItem>>;

  /**
   * Side field in *Side by side → Quote → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Media left
   * - **API ID Path**: side_by_side.quote.primary.side
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  side: prismic.SelectField<"Media left" | "Media right", "filled">;

  /**
   * Quote field in *Side by side → Quote → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The large sentence on the media side.
   * - **API ID Path**: side_by_side.quote.primary.quote
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  quote: prismic.RichTextField;

  /**
   * Attribution field in *Side by side → Quote → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Who said it. Peggy.
   * - **API ID Path**: side_by_side.quote.primary.attribution
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  attribution: prismic.KeyTextField;

  /**
   * Text field in *Side by side → Quote → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Signoff on a whole paragraph is the large closing line. Note on a whole paragraph is the tint box. Start a paragraph with {{provider:inner-balance:offer}} or {{provider:inner-balance:facts}} to pull that clinic in.
   * - **API ID Path**: side_by_side.quote.primary.text
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  text: prismic.RichTextField;

  /**
   * Buttons field in *Side by side → Quote → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Read my whole story
   * - **API ID Path**: side_by_side.quote.primary.button
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  button: prismic.Repeatable<
    prismic.LinkField<
      string,
      string,
      unknown,
      prismic.FieldState,
      "Solid" | "Ghost"
    >
  >;
}

/**
 * Quote variation for Side by side Slice
 *
 * - **API ID**: `quote`
 * - **Description**: A pull quote beside the writing.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SideBySideSliceQuote = prismic.SharedSliceVariation<
  "quote",
  Simplify<SideBySideSliceQuotePrimary>,
  never
>;

/**
 * Primary content in *Side by side → Clinic → Primary*
 */
export interface SideBySideSliceClinicPrimary {
  /**
   * Section field in *Side by side → Clinic → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.clinic.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<
    Simplify<SideBySideSliceClinicPrimarySectionItem>
  >;

  /**
   * Side field in *Side by side → Clinic → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Media right
   * - **API ID Path**: side_by_side.clinic.primary.side
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  side: prismic.SelectField<"Media left" | "Media right", "filled">;

  /**
   * Clinic field in *Side by side → Clinic → Primary*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.clinic.primary.clinic
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  clinic: prismic.ContentRelationshipField<"provider">;

  /**
   * Text field in *Side by side → Clinic → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Signoff on a whole paragraph is the large closing line. Note on a whole paragraph is the tint box. Start a paragraph with {{provider:inner-balance:offer}} or {{provider:inner-balance:facts}} to pull that clinic in.
   * - **API ID Path**: side_by_side.clinic.primary.text
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  text: prismic.RichTextField;

  /**
   * Buttons field in *Side by side → Clinic → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Read my whole story
   * - **API ID Path**: side_by_side.clinic.primary.button
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  button: prismic.Repeatable<
    prismic.LinkField<
      string,
      string,
      unknown,
      prismic.FieldState,
      "Solid" | "Ghost"
    >
  >;
}

/**
 * Clinic variation for Side by side Slice
 *
 * - **API ID**: `clinic`
 * - **Description**: A clinic beside the writing. The logo, name, quote, and visit link come from the clinic.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SideBySideSliceClinic = prismic.SharedSliceVariation<
  "clinic",
  Simplify<SideBySideSliceClinicPrimary>,
  never
>;

/**
 * Slice variation for *Side by side*
 */
type SideBySideSliceVariation =
  | SideBySideSliceImage
  | SideBySideSliceVideo
  | SideBySideSliceQuote
  | SideBySideSliceClinic;

/**
 * Side by side Shared Slice
 *
 * - **API ID**: `side_by_side`
 * - **Description**: Writing beside a photo, a video, a quote, or a clinic. The media can sit on either side.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SideBySideSlice = prismic.SharedSlice<
  "side_by_side",
  SideBySideSliceVariation
>;

/**
 * Item in *Start here → Default → Primary → Section*
 */
export interface StartHereSliceDefaultPrimarySectionItem {
  /**
   * Small heading field in *Start here → Default → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: start_here.default.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Start here → Default → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Where should I start?
   * - **API ID Path**: start_here.default.primary.section[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Intro field in *Start here → Default → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: start_here.default.primary.section[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link field in *Start here → Default → Primary → Section*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: start_here.default.primary.section[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Start here → Default → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Same as the page
   * - **API ID Path**: start_here.default.primary.section[].background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    "Same as the page" | "Soft" | "Highlight" | "Dark",
    "filled"
  >;

  /**
   * Space above field in *Start here → Default → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: start_here.default.primary.section[].space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Start here → Default → Primary → Section*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: start_here.default.primary.section[].space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Item in *Start here → Default → Primary → Cards*
 */
export interface StartHereSliceDefaultPrimaryCardsItem {
  /**
   * Small heading field in *Start here → Default → Primary → Cards*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Brand new to this
   * - **API ID Path**: start_here.default.primary.cards[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Start here → Default → Primary → Cards*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Is HRT for me?
   * - **API ID Path**: start_here.default.primary.cards[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Text field in *Start here → Default → Primary → Cards*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The sentence under the title
   * - **API ID Path**: start_here.default.primary.cards[].text
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  text: prismic.RichTextField;

  /**
   * Link field in *Start here → Default → Primary → Cards*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: start_here.default.primary.cards[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Icon field in *Start here → Default → Primary → Cards*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **API ID Path**: start_here.default.primary.cards[].icon
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  icon: prismic.SelectField<"Question" | "Lightbulb" | "Medicine" | "Wallet">;
}

/**
 * Primary content in *Start here → Default → Primary*
 */
export interface StartHereSliceDefaultPrimary {
  /**
   * Section field in *Start here → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: start_here.default.primary.section[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  section: prismic.GroupField<
    Simplify<StartHereSliceDefaultPrimarySectionItem>
  >;

  /**
   * Cards field in *Start here → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: start_here.default.primary.cards[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  cards: prismic.GroupField<Simplify<StartHereSliceDefaultPrimaryCardsItem>>;
}

/**
 * Default variation for Start here Slice
 *
 * - **API ID**: `default`
 * - **Description**: Cards that share the row. One is centered, four fill the row.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type StartHereSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<StartHereSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Start here*
 */
type StartHereSliceVariation = StartHereSliceDefault;

/**
 * Start here Shared Slice
 *
 * - **API ID**: `start_here`
 * - **Description**: Where should I start? A grid of cards.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type StartHereSlice = prismic.SharedSlice<
  "start_here",
  StartHereSliceVariation
>;

declare module "@prismicio/client" {
  interface CreateClient {
    (
      repositoryNameOrEndpoint: string,
      options?: prismic.ClientConfig,
    ): prismic.Client<AllDocumentTypes>;
  }

  interface CreateWriteClient {
    (
      repositoryNameOrEndpoint: string,
      options: prismic.WriteClientConfig,
    ): prismic.WriteClient<AllDocumentTypes>;
  }

  interface CreateMigration {
    (): prismic.Migration<AllDocumentTypes>;
  }

  namespace Content {
    export type {
      AuthorDocument,
      AuthorDocumentData,
      HomepageDocument,
      HomepageDocumentData,
      HomepageDocumentDataSlicesSlice,
      PostDocument,
      PostDocumentData,
      PostDocumentDataSourcesItem,
      PostDocumentDataTopicsItem,
      ProviderDocument,
      ProviderDocumentData,
      ProviderDocumentDataTreatmentsItem,
      ProviderDocumentDataProsItem,
      ProviderDocumentDataConsItem,
      ProviderDocumentDataRelatedItem,
      AllDocumentTypes,
      ClinicComparisonSlice,
      ClinicComparisonSliceDefaultPrimarySectionItem,
      ClinicComparisonSliceDefaultPrimaryClinicsItem,
      ClinicComparisonSliceDefaultPrimary,
      ClinicComparisonSliceVariation,
      ClinicComparisonSliceDefault,
      DividerSlice,
      DividerSliceDefaultPrimary,
      DividerSliceVariation,
      DividerSliceDefault,
      HeroSlice,
      HeroSliceHomePrimarySectionItem,
      HeroSliceHomePrimaryTrustLinesItem,
      HeroSliceHomePrimary,
      HeroSliceSubpagePrimarySectionItem,
      HeroSliceSubpagePrimary,
      HeroSliceBrandsPrimarySectionItem,
      HeroSliceBrandsPrimaryClinicsItem,
      HeroSliceBrandsPrimary,
      HeroSliceProviderPrimarySectionItem,
      HeroSliceProviderPrimary,
      HeroSliceVariation,
      HeroSliceHome,
      HeroSliceSubpage,
      HeroSliceBrands,
      HeroSliceProvider,
      PostsSlice,
      PostsSliceHomePrimarySectionItem,
      PostsSliceHomePrimary,
      PostsSliceFeaturedPrimarySectionItem,
      PostsSliceFeaturedPrimary,
      PostsSliceGridPrimarySectionItem,
      PostsSliceGridPrimary,
      PostsSliceRowPrimarySectionItem,
      PostsSliceRowPrimary,
      PostsSliceVariation,
      PostsSliceHome,
      PostsSliceFeatured,
      PostsSliceGrid,
      PostsSliceRow,
      QuoteSlice,
      QuoteSliceDefaultPrimarySectionItem,
      QuoteSliceDefaultPrimary,
      QuoteSliceVariation,
      QuoteSliceDefault,
      SideBySideSlice,
      SideBySideSliceImagePrimarySectionItem,
      SideBySideSliceImagePrimary,
      SideBySideSliceVideoPrimarySectionItem,
      SideBySideSliceVideoPrimary,
      SideBySideSliceQuotePrimarySectionItem,
      SideBySideSliceQuotePrimary,
      SideBySideSliceClinicPrimarySectionItem,
      SideBySideSliceClinicPrimary,
      SideBySideSliceVariation,
      SideBySideSliceImage,
      SideBySideSliceVideo,
      SideBySideSliceQuote,
      SideBySideSliceClinic,
      StartHereSlice,
      StartHereSliceDefaultPrimarySectionItem,
      StartHereSliceDefaultPrimaryCardsItem,
      StartHereSliceDefaultPrimary,
      StartHereSliceVariation,
      StartHereSliceDefault,
    };
  }
}
