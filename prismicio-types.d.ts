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
  } & // Group
  {
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
  } & // Other fields
  {
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

type HomepageDocumentDataSlicesSlice = HeroSlice;

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

export type AllDocumentTypes = HomepageDocument;

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
   * - **Placeholder**: Providers
   * - **API ID Path**: hero.subpage.primary.section[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading field in *Hero → Subpage → Primary → Section*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Trusted providers
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
   * - **Placeholder**: Full price chart
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
 * Item in *Hero → Subpage → Primary → Clinics*
 */
export interface HeroSliceSubpagePrimaryClinicsItem {
  /**
   * Clinic field in *Hero → Subpage → Primary → Clinics*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.subpage.primary.clinics[].clinic
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  clinic: ContentRelationshipFieldWithData<
    [{ fields: ["name", "logo"]; id: "provider" }]
  >;

  /**
   * Link field in *Hero → Subpage → Primary → Clinics*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Where this logo goes, often a jump link like #inner-balance
   * - **API ID Path**: hero.subpage.primary.clinics[].link
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
   * Clinics field in *Hero → Subpage → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.subpage.primary.clinics[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  clinics: prismic.GroupField<Simplify<HeroSliceSubpagePrimaryClinicsItem>>;
}

/**
 * Subpage variation for Hero Slice
 *
 * - **API ID**: `subpage`
 * - **Description**: A page title, a short intro, one text link, and clinic logos.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceSubpage = prismic.SharedSliceVariation<
  "subpage",
  Simplify<HeroSliceSubpagePrimary>,
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
type HeroSliceVariation = HeroSliceHome | HeroSliceSubpage | HeroSliceProvider;

/**
 * Hero Shared Slice
 *
 * - **API ID**: `hero`
 * - **Description**: The top of the homepage, a subpage, or a clinic page.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSlice = prismic.SharedSlice<"hero", HeroSliceVariation>;

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
      HomepageDocument,
      HomepageDocumentData,
      HomepageDocumentDataSlicesSlice,
      AllDocumentTypes,
      HeroSlice,
      HeroSliceHomePrimarySectionItem,
      HeroSliceHomePrimaryTrustLinesItem,
      HeroSliceHomePrimary,
      HeroSliceSubpagePrimarySectionItem,
      HeroSliceSubpagePrimaryClinicsItem,
      HeroSliceSubpagePrimary,
      HeroSliceProviderPrimarySectionItem,
      HeroSliceProviderPrimary,
      HeroSliceVariation,
      HeroSliceHome,
      HeroSliceSubpage,
      HeroSliceProvider,
    };
  }
}
