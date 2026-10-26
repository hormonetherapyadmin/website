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
  } & {
    // Group
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
  } & {
    // Other fields
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
   * Name title field in *Author*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: author.name_title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  name_title: prismic.KeyTextField;

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

  /**
   * Author link field in *Author*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: author.author_link
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  author_link: prismic.LinkField<
    string,
    string,
    unknown,
    prismic.FieldState,
    never
  >;
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
 * Item in *Navigation → Menu items → Menu links*
 */
export interface NavigationDocumentDataMainItemsLinksItem {
  /**
   * Label field in *Navigation → Menu items → Menu links*
   *
   * - **Field Type**: Text
   * - **Placeholder**: What readers see. Leave blank to use the clinic name.
   * - **API ID Path**: navigation.main_items[].links[].label
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  label: prismic.KeyTextField;

  /**
   * Link field in *Navigation → Menu items → Menu links*
   *
   * - **Field Type**: Link
   * - **Placeholder**: The page this opens.
   * - **API ID Path**: navigation.main_items[].links[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Clinic field in *Navigation → Menu items → Menu links*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: Optional. Uses this clinic's name and logo, and updates when the clinic changes.
   * - **API ID Path**: navigation.main_items[].links[].clinic
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  clinic: prismic.ContentRelationshipField<"provider">;

  /**
   * Column heading field in *Navigation → Menu items → Menu links*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Leave blank for the first column. A new heading starts the next column, such as My reviews.
   * - **API ID Path**: navigation.main_items[].links[].column_heading
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  column_heading: prismic.KeyTextField;

  /**
   * Icon field in *Navigation → Menu items → Menu links*
   *
   * - **Field Type**: Image
   * - **Placeholder**: Any icon on a transparent background. Shown in raspberry.
   * - **API ID Path**: navigation.main_items[].links[].icon
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  icon: prismic.ImageField<never>;
}

/**
 * Item in *Navigation → Menu items*
 */
export interface NavigationDocumentDataMainItemsItem {
  /**
   * Label field in *Navigation → Menu items*
   *
   * - **Field Type**: Text
   * - **Placeholder**: HRT 101
   * - **API ID Path**: navigation.main_items[].label
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  label: prismic.KeyTextField;

  /**
   * Link field in *Navigation → Menu items*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Leave blank when this item opens a menu. Otherwise where it goes, such as /blog.
   * - **API ID Path**: navigation.main_items[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Menu links field in *Navigation → Menu items*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: navigation.main_items[].links[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  links: prismic.NestedGroupField<
    Simplify<NavigationDocumentDataMainItemsLinksItem>
  >;
}

/**
 * Item in *Navigation → Footer columns → Links*
 */
export interface NavigationDocumentDataFooterColumnsLinksItem {
  /**
   * Label field in *Navigation → Footer columns → Links*
   *
   * - **Field Type**: Text
   * - **Placeholder**: What readers see. Leave blank to use the clinic name.
   * - **API ID Path**: navigation.footer_columns[].links[].label
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  label: prismic.KeyTextField;

  /**
   * Link field in *Navigation → Footer columns → Links*
   *
   * - **Field Type**: Link
   * - **Placeholder**: The page this opens.
   * - **API ID Path**: navigation.footer_columns[].links[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Clinic field in *Navigation → Footer columns → Links*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: Optional. Uses this clinic's name, and updates when the clinic changes.
   * - **API ID Path**: navigation.footer_columns[].links[].clinic
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  clinic: prismic.ContentRelationshipField<"provider">;
}

/**
 * Item in *Navigation → Footer columns*
 */
export interface NavigationDocumentDataFooterColumnsItem {
  /**
   * Heading field in *Navigation → Footer columns*
   *
   * - **Field Type**: Text
   * - **Placeholder**: HRT 101
   * - **API ID Path**: navigation.footer_columns[].heading
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  heading: prismic.KeyTextField;

  /**
   * Links field in *Navigation → Footer columns*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: navigation.footer_columns[].links[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  links: prismic.NestedGroupField<
    Simplify<NavigationDocumentDataFooterColumnsLinksItem>
  >;
}

/**
 * Content for Navigation documents
 */
interface NavigationDocumentData {
  /**
   * Header button label field in *Navigation*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Trusted providers
   * - **API ID Path**: navigation.header_button_label
   * - **Tab**: Main menu
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  header_button_label: prismic.KeyTextField;

  /**
   * Header button icon field in *Navigation*
   *
   * - **Field Type**: Image
   * - **Placeholder**: Any icon on a transparent background. Shown in the button color.
   * - **API ID Path**: navigation.header_button_icon
   * - **Tab**: Main menu
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  header_button_icon: prismic.ImageField<never>;

  /**
   * Header button link field in *Navigation*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Where the button goes, such as /trusted-providers. Leave the label or this link blank to hide the button.
   * - **API ID Path**: navigation.header_button_link
   * - **Tab**: Main menu
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  header_button_link: prismic.LinkField<
    string,
    string,
    unknown,
    prismic.FieldState,
    never
  >;

  /**
   * Menu items field in *Navigation*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: navigation.main_items[]
   * - **Tab**: Main menu
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  main_items: prismic.GroupField<
    Simplify<NavigationDocumentDataMainItemsItem>
  >; /**
   * Footer columns field in *Navigation*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: navigation.footer_columns[]
   * - **Tab**: Footer
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  footer_columns: prismic.GroupField<
    Simplify<NavigationDocumentDataFooterColumnsItem>
  >;
}

/**
 * Navigation document from Prismic
 *
 * - **API ID**: `navigation`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type NavigationDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithoutUID<
    Simplify<NavigationDocumentData>,
    "navigation",
    Lang
  >;

type PageDocumentDataSlicesSlice =
  | HeroSlice
  | StartHereSlice
  | PostsSlice
  | ClinicComparisonSlice
  | QuoteSlice
  | SideBySideSlice
  | DividerSlice
  | BoxesSlice
  | BrandPromoSlice
  | RibbonSlice
  | TextSlice
  | ClinicFactsSlice
  | ProsConsSlice
  | FaqSlice
  | ButtonsSlice
  | FullWidthImageSlice
  | PhotoGallerySlice;

/**
 * Content for Page documents
 */
interface PageDocumentData {
  /**
   * Slice Zone field in *Page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/slices
   */
  slices: prismic.SliceZone<PageDocumentDataSlicesSlice>; /**
   * Meta title field in *Page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Leave empty to use the Hero heading.
   * - **API ID Path**: page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  meta_title: prismic.KeyTextField;

  /**
   * Meta description field in *Page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: The sentence search results show under the title.
   * - **API ID Path**: page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  meta_description: prismic.KeyTextField;

  /**
   * Social image field in *Page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  meta_image: prismic.ImageField<never>;

  /**
   * Indexing field in *Page*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: true
   * - **API ID Path**: page.indexing
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/fields/boolean
   */
  indexing: prismic.BooleanField;
}

/**
 * Page document from Prismic
 *
 * - **API ID**: `page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PageDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<Simplify<PageDocumentData>, "page", Lang>;

/**
 * Item in *Blog post → Tables*
 */
export interface PostDocumentDataTablesItem {
  /**
   * Table field in *Blog post → Tables*
   *
   * - **Field Type**: Table
   * - **Placeholder**: *None*
   * - **API ID Path**: post.tables[].table
   * - **Documentation**: https://prismic.io/docs/fields/table
   */
  table: prismic.TableField;
}

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
   * - **Placeholder**: The line under the title, and the card.
   * - **API ID Path**: post.sub_title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  sub_title: prismic.RichTextField;

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
   * Image caption field in *Blog post*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The line under the photo. It can include a link.
   * - **API ID Path**: post.caption
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  caption: prismic.RichTextField;

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
   * - **Placeholder**: Write the story readers will see. A line that is only {{table}} shows the first table from Tables there, {{table2}} the second, and so on.
   * - **API ID Path**: post.body
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  body: prismic.RichTextField;

  /**
   * Tables field in *Blog post*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: post.tables[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  tables: prismic.GroupField<Simplify<PostDocumentDataTablesItem>>;

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
    | "Telehealth brand reviews"
    | "Formulations & dosages"
    | "My experience & results"
    | "Testing, labs & tracking"
    | "Cost, insurance & access"
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
  sources: prismic.GroupField<Simplify<PostDocumentDataSourcesItem>>; /**
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
   * - **Placeholder**: Leave empty to use the subtitle.
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
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: true
   * - **API ID Path**: post.indexing
   * - **Tab**: SEO
   * - **Documentation**: https://prismic.io/docs/fields/boolean
   */
  indexing: prismic.BooleanField;
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
 * Item in *Brand → How it works*
 */
export interface ProviderDocumentDataHowItWorksItem {
  /**
   * Step title field in *Brand → How it works*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Health quiz
   * - **API ID Path**: provider.how_it_works[].title
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  title: prismic.KeyTextField;

  /**
   * Step text field in *Brand → How it works*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Complete their 5-minute health quiz.
   * - **API ID Path**: provider.how_it_works[].text
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  text: prismic.KeyTextField;
}

/**
 * Content for Brand documents
 */
interface ProviderDocumentData {
  /**
   * Name field in *Brand*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.name
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  name: prismic.KeyTextField;

  /**
   * Kind field in *Brand*
   *
   * - **Field Type**: Select
   * - **Placeholder**: Clinic for a telehealth clinic. Product for something I buy, such as a test kit.
   * - **Default Value**: Clinic
   * - **API ID Path**: provider.kind
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  kind: prismic.SelectField<"Clinic" | "Product", "filled">;

  /**
   * Logo field in *Brand*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.logo
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  logo: prismic.ImageField<never>;

  /**
   * Short description field in *Brand*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Better sleep. The comparison chart and other summaries use this.
   * - **API ID Path**: provider.short_description
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  short_description: prismic.KeyTextField;

  /**
   * Top choice label field in *Brand*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Leave blank for no badge.
   * - **API ID Path**: provider.top_choice_label
   * - **Tab**: Profile
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  top_choice_label: prismic.KeyTextField; /**
   * Affiliate field in *Brand*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Affiliate link
   * - **API ID Path**: provider.visit
   * - **Tab**: Links
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  visit: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Review video field in *Brand*
   *
   * - **Field Type**: Link
   * - **Placeholder**: The YouTube link for my review.
   * - **API ID Path**: provider.youtube
   * - **Tab**: Links
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  youtube: prismic.LinkField<
    string,
    string,
    unknown,
    prismic.FieldState,
    never
  >;

  /**
   * Page field in *Brand*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: The site page about this brand. Leave blank until that page exists.
   * - **API ID Path**: provider.page
   * - **Tab**: Links
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  page: prismic.ContentRelationshipField<"page">;

  /**
   * My review field in *Brand*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: The post where I review this brand.
   * - **API ID Path**: provider.review
   * - **Tab**: Links
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  review: prismic.ContentRelationshipField<"post">;

  /**
   * My comparison field in *Brand*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Posts where I compare this brand with another. Add one for each. The display text is the button, such as Musely vs Winona cream.
   * - **API ID Path**: provider.comparison
   * - **Tab**: Links
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  comparison: prismic.Repeatable<
    prismic.LinkField<string, string, unknown, prismic.FieldState, never>
  >; /**
   * Price field in *Brand*
   *
   * - **Field Type**: Number
   * - **Placeholder**: What I paid. The chart and the brand page use this.
   * - **API ID Path**: provider.monthly_price
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/number
   */
  monthly_price: prismic.NumberField;

  /**
   * Price is field in *Brand*
   *
   * - **Field Type**: Select
   * - **Placeholder**: Per month shows /mo after the price. One time shows the price alone.
   * - **Default Value**: Per month
   * - **API ID Path**: provider.price_unit
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  price_unit: prismic.SelectField<"Per month" | "One time", "filled">;

  /**
   * Price note field in *Brand*
   *
   * - **Field Type**: Text
   * - **Placeholder**: The line under the price, such as First six months, then $99.
   * - **API ID Path**: provider.price_note
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  price_note: prismic.KeyTextField;

  /**
   * Typically prescribed field in *Brand*
   *
   * - **Field Type**: Text
   * - **Placeholder**: First bullet in the price box. Oestra vaginal cream.
   * - **API ID Path**: provider.formulation
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  formulation: prismic.KeyTextField;

  /**
   * Takes insurance field in *Brand*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: provider.insurance
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/boolean
   */
  insurance: prismic.BooleanField;

  /**
   * Getting started field in *Brand*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Third bullet in the price box. No visit.
   * - **API ID Path**: provider.note
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  note: prismic.KeyTextField;

  /**
   * Code field in *Brand*
   *
   * - **Field Type**: Text
   * - **Placeholder**: PEGGY10. Leave blank when there is no code.
   * - **API ID Path**: provider.code
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  code: prismic.KeyTextField;

  /**
   * Code line field in *Brand*
   *
   * - **Field Type**: Text
   * - **Placeholder**: 10% off your first order.
   * - **API ID Path**: provider.code_note
   * - **Tab**: Price
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  code_note: prismic.KeyTextField; /**
   * Labs field in *Brand*
   *
   * - **Field Type**: Text
   * - **Placeholder**: None, or $150 labs up front.
   * - **API ID Path**: provider.lab_requirement
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  lab_requirement: prismic.KeyTextField;

  /**
   * HSA / FSA field in *Brand*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: provider.hsa_fsa
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/boolean
   */
  hsa_fsa: prismic.BooleanField;

  /**
   * State availability field in *Brand*
   *
   * - **Field Type**: Text
   * - **Placeholder**: All 50 states
   * - **API ID Path**: provider.state_availability
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  state_availability: prismic.KeyTextField;

  /**
   * Specialties field in *Brand*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: One per line, such as Menopause or PCOS. Each line is one pill.
   * - **API ID Path**: provider.specialties
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  specialties: prismic.RichTextField;

  /**
   * How it works field in *Brand*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.how_it_works[]
   * - **Tab**: Care
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  how_it_works: prismic.GroupField<
    Simplify<ProviderDocumentDataHowItWorksItem>
  >; /**
   * In my words field in *Brand*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: provider.quote
   * - **Tab**: Words
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  quote: prismic.RichTextField; /**
   * Product image field in *Brand*
   *
   * - **Field Type**: Image
   * - **Placeholder**: The jar or bottle. The description is the alt text.
   * - **API ID Path**: provider.product
   * - **Tab**: Product
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  product: prismic.ImageField<never>;
}

/**
 * Brand document from Prismic
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
  | AuthorDocument
  | HomepageDocument
  | NavigationDocument
  | PageDocument
  | PostDocument
  | ProviderDocument;

/**
 * Item in *Boxes → Default → Primary → Boxes*
 */
export interface BoxesSliceDefaultPrimaryBoxesItem {
  /**
   * Clinic field in *Boxes → Default → Primary → Boxes*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: boxes.default.primary.boxes[].clinic
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  clinic: ContentRelationshipFieldWithData<
    [{ fields: ["name", "logo", "code", "top_choice_label"]; id: "provider" }]
  >;

  /**
   * Image field in *Boxes → Default → Primary → Boxes*
   *
   * - **Field Type**: Image
   * - **Placeholder**: Empty uses the clinic logo
   * - **API ID Path**: boxes.default.primary.boxes[].image
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  image: prismic.ImageField<never>;

  /**
   * Heading field in *Boxes → Default → Primary → Boxes*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Empty uses the clinic top choice label, such as No appointment required
   * - **API ID Path**: boxes.default.primary.boxes[].heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Line under the heading field in *Boxes → Default → Primary → Boxes*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Empty uses the clinic name
   * - **API ID Path**: boxes.default.primary.boxes[].text
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  text: prismic.RichTextField;

  /**
   * Bottom line field in *Boxes → Default → Primary → Boxes*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Empty uses the clinic code, such as PEGGY10
   * - **API ID Path**: boxes.default.primary.boxes[].bottom_line
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  bottom_line: prismic.KeyTextField;

  /**
   * Link field in *Boxes → Default → Primary → Boxes*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: boxes.default.primary.boxes[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Primary content in *Boxes → Default → Primary*
 */
export interface BoxesSliceDefaultPrimary {
  /**
   * Eyebrow field in *Boxes → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: boxes.default.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Boxes → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: boxes.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Boxes → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: boxes.default.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Boxes across field in *Boxes → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: 5
   * - **API ID Path**: boxes.default.primary.across
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  across: prismic.SelectField<"2" | "3" | "4" | "5" | "6" | "7", "filled">;

  /**
   * Boxes field in *Boxes → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: boxes.default.primary.boxes[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  boxes: prismic.GroupField<Simplify<BoxesSliceDefaultPrimaryBoxesItem>>;

  /**
   * Background field in *Boxes → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: boxes.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Boxes → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: boxes.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Boxes → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: boxes.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Default variation for Boxes Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BoxesSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<BoxesSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Boxes*
 */
type BoxesSliceVariation = BoxesSliceDefault;

/**
 * Boxes Shared Slice
 *
 * - **API ID**: `boxes`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BoxesSlice = prismic.SharedSlice<"boxes", BoxesSliceVariation>;

/**
 * Item in *Brand promo → Default → Primary → Overwrite*
 */
export interface BrandPromoSliceDefaultPrimaryOverwriteItem {
  /**
   * Eyebrow field in *Brand promo → Default → Primary → Overwrite*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Voted best for
   * - **API ID Path**: brand_promo.default.primary.overwrite[].small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Line under the name field in *Brand promo → Default → Primary → Overwrite*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: A short line under the clinic name. Leave blank to hide it.
   * - **API ID Path**: brand_promo.default.primary.overwrite[].intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Quote field in *Brand promo → Default → Primary → Overwrite*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Leave blank to use the clinic's In my words.
   * - **API ID Path**: brand_promo.default.primary.overwrite[].quote
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  quote: prismic.RichTextField;

  /**
   * Text under the quote field in *Brand promo → Default → Primary → Overwrite*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: More about this brand, such as what a test kit measures. Leave blank to hide it.
   * - **API ID Path**: brand_promo.default.primary.overwrite[].text
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  text: prismic.RichTextField;

  /**
   * Product image field in *Brand promo → Default → Primary → Overwrite*
   *
   * - **Field Type**: Image
   * - **Placeholder**: Empty uses the brand's product image. Describe the product.
   * - **API ID Path**: brand_promo.default.primary.overwrite[].product
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  product: prismic.ImageField<never>;

  /**
   * Style field in *Brand promo → Default → Primary → Overwrite*
   *
   * - **Field Type**: Select
   * - **Placeholder**: Quote puts the logo, her words, and a visit link on the right. Card puts the product photo and price there.
   * - **Default Value**: Card
   * - **API ID Path**: brand_promo.default.primary.overwrite[].style
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  style: prismic.SelectField<"Quote" | "Card", "filled">;

  /**
   * Photo and price field in *Brand promo → Default → Primary → Overwrite*
   *
   * - **Field Type**: Select
   * - **Placeholder**: Beside puts the price next to the photo. Stacked puts the photo on top and the price under it, as one card. Use Stacked when the card has a lot of writing.
   * - **Default Value**: Beside
   * - **API ID Path**: brand_promo.default.primary.overwrite[].layout
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  layout: prismic.SelectField<"Beside" | "Stacked", "filled">;

  /**
   * Links field in *Brand promo → Default → Primary → Overwrite*
   *
   * - **Field Type**: Link
   * - **Placeholder**: A comparison or another link. Shown under the buttons.
   * - **API ID Path**: brand_promo.default.primary.overwrite[].links
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  links: prismic.Repeatable<
    prismic.LinkField<string, string, unknown, prismic.FieldState, never>
  >;
}

/**
 * Primary content in *Brand promo → Default → Primary*
 */
export interface BrandPromoSliceDefaultPrimary {
  /**
   * Heading (H2) field in *Brand promo → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Improved sleep
   * - **API ID Path**: brand_promo.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Clinic field in *Brand promo → Default → Primary*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: brand_promo.default.primary.clinic
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  clinic: ContentRelationshipFieldWithData<
    [
      {
        fields: [
          "name",
          "kind",
          "logo",
          "visit",
          "page",
          "review",
          "comparison",
          "youtube",
          "product",
          "monthly_price",
          "price_unit",
          "price_note",
          "formulation",
          "insurance",
          "note",
          "code",
          "code_note",
          "top_choice_label",
          "quote",
        ];
        id: "provider";
      },
    ]
  >;

  /**
   * Is this 1st? field in *Brand promo → Default → Primary*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: brand_promo.default.primary.first
   * - **Documentation**: https://prismic.io/docs/fields/boolean
   */
  first: prismic.BooleanField;

  /**
   * Place field in *Brand promo → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: My 2026 top choice. Shown beside the 1st badge.
   * - **API ID Path**: brand_promo.default.primary.place
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  place: prismic.KeyTextField;

  /**
   * Overwrite field in *Brand promo → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: brand_promo.default.primary.overwrite[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  overwrite: prismic.GroupField<
    Simplify<BrandPromoSliceDefaultPrimaryOverwriteItem>
  >;

  /**
   * Background field in *Brand promo → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: brand_promo.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Brand promo → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: brand_promo.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Brand promo → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: brand_promo.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Default variation for Brand promo Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BrandPromoSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<BrandPromoSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Brand promo*
 */
type BrandPromoSliceVariation = BrandPromoSliceDefault;

/**
 * Brand promo Shared Slice
 *
 * - **API ID**: `brand_promo`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BrandPromoSlice = prismic.SharedSlice<
  "brand_promo",
  BrandPromoSliceVariation
>;

/**
 * Primary content in *Buttons → Default → Primary*
 */
export interface ButtonsSliceDefaultPrimary {
  /**
   * Eyebrow field in *Buttons → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: buttons.default.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Buttons → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: buttons.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Buttons field in *Buttons → Default → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Start my journey
   * - **API ID Path**: buttons.default.primary.button
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
   * Layout field in *Buttons → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: On the left lines the buttons up with the writing. Centered centers them.
   * - **Default Value**: On the left
   * - **API ID Path**: buttons.default.primary.layout
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  layout: prismic.SelectField<"On the left" | "Centered", "filled">;

  /**
   * Background field in *Buttons → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: The color behind the buttons.
   * - **Default Value**: Transparent
   * - **API ID Path**: buttons.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Buttons → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: buttons.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Buttons → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: buttons.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Default variation for Buttons Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ButtonsSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<ButtonsSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Buttons*
 */
type ButtonsSliceVariation = ButtonsSliceDefault;

/**
 * Buttons Shared Slice
 *
 * - **API ID**: `buttons`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ButtonsSlice = prismic.SharedSlice<
  "buttons",
  ButtonsSliceVariation
>;

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

  /**
   * Review field in *Clinic comparison → Default → Primary → Clinics*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Read review. This page chooses the review.
   * - **API ID Path**: clinic_comparison.default.primary.clinics[].review
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  review: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *Clinic comparison → Chart → Primary → Rows*
 */
export interface ClinicComparisonSliceChartPrimaryRowsItem {
  /**
   * Clinic field in *Clinic comparison → Chart → Primary → Rows*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.chart.primary.rows[].name
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  name: prismic.KeyTextField;

  /**
   * What I paid field in *Clinic comparison → Chart → Primary → Rows*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.chart.primary.rows[].paid
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  paid: prismic.KeyTextField;

  /**
   * What's included field in *Clinic comparison → Chart → Primary → Rows*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.chart.primary.rows[].included
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  included: prismic.KeyTextField;

  /**
   * My code field in *Clinic comparison → Chart → Primary → Rows*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.chart.primary.rows[].code
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  code: prismic.KeyTextField;
}

/**
 * Primary content in *Clinic comparison → Default → Primary*
 */
export interface ClinicComparisonSliceDefaultPrimary {
  /**
   * Eyebrow field in *Clinic comparison → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.default.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Clinic comparison → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Eight online HRT clinics, side by side
   * - **API ID Path**: clinic_comparison.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Clinic comparison → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.default.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

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

  /**
   * Background field in *Clinic comparison → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: clinic_comparison.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Clinic comparison → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: clinic_comparison.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Clinic comparison → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: clinic_comparison.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
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
 * Primary content in *Clinic comparison → Chart → Primary*
 */
export interface ClinicComparisonSliceChartPrimary {
  /**
   * Eyebrow field in *Clinic comparison → Chart → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.chart.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Clinic comparison → Chart → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.chart.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Clinic comparison → Chart → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.chart.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Rows field in *Clinic comparison → Chart → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_comparison.chart.primary.rows[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  rows: prismic.GroupField<Simplify<ClinicComparisonSliceChartPrimaryRowsItem>>;

  /**
   * Background field in *Clinic comparison → Chart → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: clinic_comparison.chart.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Clinic comparison → Chart → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: clinic_comparison.chart.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Clinic comparison → Chart → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: clinic_comparison.chart.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Chart variation for Clinic comparison Slice
 *
 * - **API ID**: `chart`
 * - **Description**: Chart
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ClinicComparisonSliceChart = prismic.SharedSliceVariation<
  "chart",
  Simplify<ClinicComparisonSliceChartPrimary>,
  never
>;

/**
 * Slice variation for *Clinic comparison*
 */
type ClinicComparisonSliceVariation =
  ClinicComparisonSliceDefault | ClinicComparisonSliceChart;

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
 * Primary content in *Clinic facts → Default → Primary*
 */
export interface ClinicFactsSliceDefaultPrimary {
  /**
   * Eyebrow field in *Clinic facts → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_facts.default.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Clinic facts → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The facts
   * - **API ID Path**: clinic_facts.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Clinic facts → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: What I confirmed on their page. This is my experience as a patient, not a medical review.
   * - **API ID Path**: clinic_facts.default.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Clinic field in *Clinic facts → Default → Primary*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: clinic_facts.default.primary.clinic
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  clinic: ContentRelationshipFieldWithData<
    [
      {
        fields: [
          "name",
          "kind",
          "logo",
          "short_description",
          "visit",
          "code",
          "code_note",
          "state_availability",
          "formulation",
          "lab_requirement",
          "insurance",
          "hsa_fsa",
          "note",
          "specialties",
          { fields: ["title", "text"]; id: "how_it_works" },
        ];
        id: "provider";
      },
    ]
  >;

  /**
   * Image field in *Clinic facts → Default → Primary*
   *
   * - **Field Type**: Image
   * - **Placeholder**: Describe what is in the photo.
   * - **API ID Path**: clinic_facts.default.primary.image
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  image: prismic.ImageField<never>;

  /**
   * Background field in *Clinic facts → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: clinic_facts.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Clinic facts → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: clinic_facts.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Clinic facts → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: clinic_facts.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Default variation for Clinic facts Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ClinicFactsSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<ClinicFactsSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Clinic facts*
 */
type ClinicFactsSliceVariation = ClinicFactsSliceDefault;

/**
 * Clinic facts Shared Slice
 *
 * - **API ID**: `clinic_facts`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ClinicFactsSlice = prismic.SharedSlice<
  "clinic_facts",
  ClinicFactsSliceVariation
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
   * - **Default Value**: Transparent
   * - **API ID Path**: divider.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Divider → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
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
   * - **Default Value**: Medium
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
 * Item in *FAQ → Default → Primary → Questions*
 */
export interface FaqSliceDefaultPrimaryQuestionsItem {
  /**
   * Question field in *FAQ → Default → Primary → Questions*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The question readers see.
   * - **API ID Path**: faq.default.primary.questions[].question
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  question: prismic.RichTextField;

  /**
   * Answer field in *FAQ → Default → Primary → Questions*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The answer. It stays on the page when this question starts closed.
   * - **API ID Path**: faq.default.primary.questions[].answer
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  answer: prismic.RichTextField;

  /**
   * Start opened field in *FAQ → Default → Primary → Questions*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: faq.default.primary.questions[].open
   * - **Documentation**: https://prismic.io/docs/fields/boolean
   */
  open: prismic.BooleanField;
}

/**
 * Primary content in *FAQ → Default → Primary*
 */
export interface FaqSliceDefaultPrimary {
  /**
   * Eyebrow field in *FAQ → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: faq.default.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *FAQ → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: faq.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *FAQ → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: faq.default.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Questions field in *FAQ → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: faq.default.primary.questions[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  questions: prismic.GroupField<Simplify<FaqSliceDefaultPrimaryQuestionsItem>>;

  /**
   * Background field in *FAQ → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: faq.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *FAQ → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: faq.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *FAQ → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: faq.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Default variation for FAQ Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FaqSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<FaqSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *FAQ*
 */
type FaqSliceVariation = FaqSliceDefault;

/**
 * FAQ Shared Slice
 *
 * - **API ID**: `faq`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FaqSlice = prismic.SharedSlice<"faq", FaqSliceVariation>;

/**
 * Primary content in *Full width image → Default → Primary*
 */
export interface FullWidthImageSliceDefaultPrimary {
  /**
   * Image field in *Full width image → Default → Primary*
   *
   * - **Field Type**: Image
   * - **Placeholder**: Describe what is in the photo.
   * - **API ID Path**: full_width_image.default.primary.image
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  image: prismic.ImageField<never>;

  /**
   * Edge to edge field in *Full width image → Default → Primary*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: full_width_image.default.primary.edge_to_edge
   * - **Documentation**: https://prismic.io/docs/fields/boolean
   */
  edge_to_edge: prismic.BooleanField;

  /**
   * Background field in *Full width image → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: The color behind the image.
   * - **Default Value**: Transparent
   * - **API ID Path**: full_width_image.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Full width image → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: full_width_image.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Full width image → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: full_width_image.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Default variation for Full width image Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FullWidthImageSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<FullWidthImageSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Full width image*
 */
type FullWidthImageSliceVariation = FullWidthImageSliceDefault;

/**
 * Full width image Shared Slice
 *
 * - **API ID**: `full_width_image`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FullWidthImageSlice = prismic.SharedSlice<
  "full_width_image",
  FullWidthImageSliceVariation
>;

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
 * Primary content in *Hero → Home → Primary*
 */
export interface HeroSliceHomePrimary {
  /**
   * Eyebrow field in *Hero → Home → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Hormone Therapy Replacement
   * - **API ID Path**: hero.home.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H1) field in *Hero → Home → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Feel like you again.
   * - **API ID Path**: hero.home.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

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
   * Content field in *Hero → Home → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.home.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

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

  /**
   * Background field in *Hero → Home → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: hero.home.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Hero → Home → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: hero.home.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Hero → Home → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: hero.home.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
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
   * Eyebrow field in *Hero → Subpage → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Learn
   * - **API ID Path**: hero.subpage.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H1) field in *Hero → Subpage → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: New to hormone therapy
   * - **API ID Path**: hero.subpage.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Hero → Subpage → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.subpage.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link under content field in *Hero → Subpage → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Start here
   * - **API ID Path**: hero.subpage.primary.link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Image field in *Hero → Subpage → Primary*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.subpage.primary.image
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  image: prismic.ImageField<never>;

  /**
   * Background field in *Hero → Subpage → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: hero.subpage.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Hero → Subpage → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: hero.subpage.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Hero → Subpage → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: hero.subpage.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
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
   * Eyebrow field in *Hero → Brands → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Providers
   * - **API ID Path**: hero.brands.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H1) field in *Hero → Brands → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Trusted providers
   * - **API ID Path**: hero.brands.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Hero → Brands → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.brands.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link under content field in *Hero → Brands → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Full price chart
   * - **API ID Path**: hero.brands.primary.link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Clinics field in *Hero → Brands → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.brands.primary.clinics[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  clinics: prismic.GroupField<Simplify<HeroSliceBrandsPrimaryClinicsItem>>;

  /**
   * Background field in *Hero → Brands → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: hero.brands.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Hero → Brands → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: hero.brands.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Hero → Brands → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: hero.brands.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
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
   * Eyebrow field in *Hero → Provider → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Optional. Otherwise the clinic's top choice label is used.
   * - **API ID Path**: hero.provider.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H1) field in *Hero → Provider → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Optional. The clinic name is the title.
   * - **API ID Path**: hero.provider.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Hero → Provider → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.provider.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

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
          "kind",
          "logo",
          "formulation",
          "visit",
          "monthly_price",
          "price_unit",
          "price_note",
          "top_choice_label",
          "code",
          "code_note",
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

  /**
   * Background field in *Hero → Provider → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: hero.provider.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Hero → Provider → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: hero.provider.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Hero → Provider → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: hero.provider.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
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
 * Primary content in *Hero → Centered → Primary*
 */
export interface HeroSliceCenteredPrimary {
  /**
   * Eyebrow field in *Hero → Centered → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Learn
   * - **API ID Path**: hero.centered.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H1) field in *Hero → Centered → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: New to hormone therapy
   * - **API ID Path**: hero.centered.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Hero → Centered → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.centered.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link under content field in *Hero → Centered → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Start here
   * - **API ID Path**: hero.centered.primary.link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Hero → Centered → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: hero.centered.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Hero → Centered → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: hero.centered.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Hero → Centered → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: hero.centered.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Centered variation for Hero Slice
 *
 * - **API ID**: `centered`
 * - **Description**: Centered
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceCentered = prismic.SharedSliceVariation<
  "centered",
  Simplify<HeroSliceCenteredPrimary>,
  never
>;

/**
 * Slice variation for *Hero*
 */
type HeroSliceVariation =
  | HeroSliceHome
  | HeroSliceSubpage
  | HeroSliceBrands
  | HeroSliceProvider
  | HeroSliceCentered;

/**
 * Hero Shared Slice
 *
 * - **API ID**: `hero`
 * - **Description**: The top of the homepage, a subpage, the brand logos, or a clinic page.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSlice = prismic.SharedSlice<"hero", HeroSliceVariation>;

/**
 * Item in *Photo gallery → Gallery → Primary → Photos*
 */
export interface PhotoGallerySliceDefaultPrimaryPhotosItem {
  /**
   * Photo field in *Photo gallery → Gallery → Primary → Photos*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.default.primary.photos[].image
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  image: prismic.ImageField<never>;

  /**
   * Caption field in *Photo gallery → Gallery → Primary → Photos*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.default.primary.photos[].caption
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  caption: prismic.RichTextField;

  /**
   * Line under the caption field in *Photo gallery → Gallery → Primary → Photos*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A color, such as Dark brown
   * - **API ID Path**: photo_gallery.default.primary.photos[].line
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  line: prismic.KeyTextField;

  /**
   * Link field in *Photo gallery → Gallery → Primary → Photos*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.default.primary.photos[].link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Primary content in *Photo gallery → Gallery → Primary*
 */
export interface PhotoGallerySliceDefaultPrimary {
  /**
   * Eyebrow field in *Photo gallery → Gallery → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.default.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Photo gallery → Gallery → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: My hair story
   * - **API ID Path**: photo_gallery.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Photo gallery → Gallery → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.default.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Photos field in *Photo gallery → Gallery → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.default.primary.photos[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  photos: prismic.GroupField<
    Simplify<PhotoGallerySliceDefaultPrimaryPhotosItem>
  >;

  /**
   * Center the photos field in *Photo gallery → Gallery → Primary*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: true
   * - **API ID Path**: photo_gallery.default.primary.center
   * - **Documentation**: https://prismic.io/docs/fields/boolean
   */
  center: prismic.BooleanField;

  /**
   * Background field in *Photo gallery → Gallery → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: photo_gallery.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Photo gallery → Gallery → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: photo_gallery.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Photo gallery → Gallery → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: photo_gallery.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Gallery variation for Photo gallery Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PhotoGallerySliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<PhotoGallerySliceDefaultPrimary>,
  never
>;

/**
 * Primary content in *Photo gallery → Pair → Primary*
 */
export interface PhotoGallerySlicePairPrimary {
  /**
   * Eyebrow field in *Photo gallery → Pair → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.pair.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Photo gallery → Pair → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.pair.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Photo gallery → Pair → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.pair.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Before field in *Photo gallery → Pair → Primary*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.pair.primary.before
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  before: prismic.ImageField<never>;

  /**
   * Before caption field in *Photo gallery → Pair → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.pair.primary.before_caption
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  before_caption: prismic.RichTextField;

  /**
   * After field in *Photo gallery → Pair → Primary*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.pair.primary.after
   * - **Documentation**: https://prismic.io/docs/fields/image
   */
  after: prismic.ImageField<never>;

  /**
   * After caption field in *Photo gallery → Pair → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.pair.primary.after_caption
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  after_caption: prismic.RichTextField;

  /**
   * Link under the photos field in *Photo gallery → Pair → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: photo_gallery.pair.primary.link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Background field in *Photo gallery → Pair → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: photo_gallery.pair.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Photo gallery → Pair → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: photo_gallery.pair.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Photo gallery → Pair → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: photo_gallery.pair.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Pair variation for Photo gallery Slice
 *
 * - **API ID**: `pair`
 * - **Description**: Pair
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PhotoGallerySlicePair = prismic.SharedSliceVariation<
  "pair",
  Simplify<PhotoGallerySlicePairPrimary>,
  never
>;

/**
 * Slice variation for *Photo gallery*
 */
type PhotoGallerySliceVariation =
  PhotoGallerySliceDefault | PhotoGallerySlicePair;

/**
 * Photo gallery Shared Slice
 *
 * - **API ID**: `photo_gallery`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PhotoGallerySlice = prismic.SharedSlice<
  "photo_gallery",
  PhotoGallerySliceVariation
>;

/**
 * Item in *Posts → Picked → Primary → Posts*
 */
export interface PostsSlicePickedPrimaryPostsItem {
  /**
   * Post field in *Posts → Picked → Primary → Posts*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: Add up to three, in the order they should appear.
   * - **API ID Path**: posts.picked.primary.posts[].post
   * - **Documentation**: https://prismic.io/docs/fields/content-relationship
   */
  post:
    | prismic.ContentRelationshipField<"post">
    | prismic.ContentRelationshipField<"provider_review">
    | prismic.ContentRelationshipField<"comparison">;
}

/**
 * Primary content in *Posts → Homepage → Primary*
 */
export interface PostsSliceHomePrimary {
  /**
   * Eyebrow field in *Posts → Homepage → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.home.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Posts → Homepage → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Latest reviews and posts
   * - **API ID Path**: posts.home.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Posts → Homepage → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.home.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link right of heading field in *Posts → Homepage → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.home.primary.link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

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
    | "All"
    | "Telehealth brand reviews"
    | "Formulations & dosages"
    | "My experience & results"
    | "Testing, labs & tracking"
    | "Cost, insurance & access",
    "filled"
  >;

  /**
   * Background field in *Posts → Homepage → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: posts.home.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Posts → Homepage → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: posts.home.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Posts → Homepage → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: posts.home.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
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
   * Eyebrow field in *Posts → Featured → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.featured.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Posts → Featured → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Latest reviews and posts
   * - **API ID Path**: posts.featured.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Posts → Featured → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.featured.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link right of heading field in *Posts → Featured → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.featured.primary.link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

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
    | "All"
    | "Telehealth brand reviews"
    | "Formulations & dosages"
    | "My experience & results"
    | "Testing, labs & tracking"
    | "Cost, insurance & access",
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

  /**
   * Background field in *Posts → Featured → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: posts.featured.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Posts → Featured → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: posts.featured.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Posts → Featured → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: posts.featured.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
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
   * Eyebrow field in *Posts → Grid → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.grid.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Posts → Grid → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Latest reviews and posts
   * - **API ID Path**: posts.grid.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Posts → Grid → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.grid.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link right of heading field in *Posts → Grid → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.grid.primary.link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

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
    | "All"
    | "Telehealth brand reviews"
    | "Formulations & dosages"
    | "My experience & results"
    | "Testing, labs & tracking"
    | "Cost, insurance & access",
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

  /**
   * Hide the featured post field in *Posts → Grid → Primary*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: false
   * - **API ID Path**: posts.grid.primary.hide_featured
   * - **Documentation**: https://prismic.io/docs/fields/boolean
   */
  hide_featured: prismic.BooleanField;

  /**
   * Background field in *Posts → Grid → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: posts.grid.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Posts → Grid → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: posts.grid.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Posts → Grid → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: posts.grid.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
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
   * Eyebrow field in *Posts → Row → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.row.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Posts → Row → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Latest reviews and posts
   * - **API ID Path**: posts.row.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Posts → Row → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.row.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link right of heading field in *Posts → Row → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.row.primary.link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

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
    | "All"
    | "Telehealth brand reviews"
    | "Formulations & dosages"
    | "My experience & results"
    | "Testing, labs & tracking"
    | "Cost, insurance & access",
    "filled"
  >;

  /**
   * Background field in *Posts → Row → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: posts.row.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Posts → Row → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: posts.row.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Posts → Row → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: posts.row.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
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
 * Primary content in *Posts → Picked → Primary*
 */
export interface PostsSlicePickedPrimary {
  /**
   * Eyebrow field in *Posts → Picked → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.picked.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Posts → Picked → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Latest reviews and posts
   * - **API ID Path**: posts.picked.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Posts → Picked → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.picked.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Link right of heading field in *Posts → Picked → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.picked.primary.link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Posts field in *Posts → Picked → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: posts.picked.primary.posts[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  posts: prismic.GroupField<Simplify<PostsSlicePickedPrimaryPostsItem>>;

  /**
   * Background field in *Posts → Picked → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: posts.picked.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Posts → Picked → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: posts.picked.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Posts → Picked → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: posts.picked.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Picked variation for Posts Slice
 *
 * - **API ID**: `picked`
 * - **Description**: Picked
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PostsSlicePicked = prismic.SharedSliceVariation<
  "picked",
  Simplify<PostsSlicePickedPrimary>,
  never
>;

/**
 * Slice variation for *Posts*
 */
type PostsSliceVariation =
  | PostsSliceHome
  | PostsSliceFeatured
  | PostsSliceGrid
  | PostsSliceRow
  | PostsSlicePicked;

/**
 * Posts Shared Slice
 *
 * - **API ID**: `posts`
 * - **Description**: Recent posts, newest first.
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PostsSlice = prismic.SharedSlice<"posts", PostsSliceVariation>;

/**
 * Item in *Pros and cons → Default → Primary → Rows*
 */
export interface ProsConsSliceDefaultPrimaryRowsItem {
  /**
   * Title field in *Pros and cons → Default → Primary → Rows*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Such as HRT. Leave blank when there is one row.
   * - **API ID Path**: pros_cons.default.primary.rows[].title
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  title: prismic.KeyTextField;

  /**
   * Pros field in *Pros and cons → Default → Primary → Rows*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: One per line.
   * - **API ID Path**: pros_cons.default.primary.rows[].pros
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  pros: prismic.RichTextField;

  /**
   * Cons field in *Pros and cons → Default → Primary → Rows*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: One per line.
   * - **API ID Path**: pros_cons.default.primary.rows[].cons
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  cons: prismic.RichTextField;
}

/**
 * Primary content in *Pros and cons → Default → Primary*
 */
export interface ProsConsSliceDefaultPrimary {
  /**
   * Eyebrow field in *Pros and cons → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: pros_cons.default.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Pros and cons → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Pros and Cons
   * - **API ID Path**: pros_cons.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Pros and cons → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: pros_cons.default.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Pros label field in *Pros and cons → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Blank says Pros. Or write your own, such as What I liked.
   * - **API ID Path**: pros_cons.default.primary.pros_label
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  pros_label: prismic.KeyTextField;

  /**
   * Cons label field in *Pros and cons → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Blank says Cons. Or write your own, such as What I didn’t like.
   * - **API ID Path**: pros_cons.default.primary.cons_label
   * - **Documentation**: https://prismic.io/docs/fields/text
   */
  cons_label: prismic.KeyTextField;

  /**
   * Rows field in *Pros and cons → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: pros_cons.default.primary.rows[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  rows: prismic.GroupField<Simplify<ProsConsSliceDefaultPrimaryRowsItem>>;

  /**
   * Background field in *Pros and cons → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: pros_cons.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Pros and cons → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: pros_cons.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Pros and cons → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: pros_cons.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Default variation for Pros and cons Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProsConsSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<ProsConsSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Pros and cons*
 */
type ProsConsSliceVariation = ProsConsSliceDefault;

/**
 * Pros and cons Shared Slice
 *
 * - **API ID**: `pros_cons`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProsConsSlice = prismic.SharedSlice<
  "pros_cons",
  ProsConsSliceVariation
>;

/**
 * Primary content in *Quote → Default → Primary*
 */
export interface QuoteSliceDefaultPrimary {
  /**
   * Eyebrow field in *Quote → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: quote.default.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Quote → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Peggy's take: what I'm using now
   * - **API ID Path**: quote.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Quote → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: quote.default.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

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
   * Note under the name field in *Quote → Default → Primary*
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

  /**
   * Background field in *Quote → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: quote.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Quote → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: quote.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Quote → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: quote.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
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
 * Primary content in *Ribbon → Default → Primary*
 */
export interface RibbonSliceDefaultPrimary {
  /**
   * Eyebrow field in *Ribbon → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: ribbon.default.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Ribbon → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: ribbon.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Line above the box field in *Ribbon → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: ribbon.default.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Layout field in *Ribbon → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: On the right keeps the words on the left and the buttons beside them. Centered centers the words and puts the buttons under them.
   * - **Default Value**: On the right
   * - **API ID Path**: ribbon.default.primary.layout
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  layout: prismic.SelectField<"On the right" | "Centered", "filled">;

  /**
   * Title field in *Ribbon → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Still lining the prices up?
   * - **API ID Path**: ribbon.default.primary.title
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  title: prismic.RichTextField;

  /**
   * Content field in *Ribbon → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The comparison chart includes Midi Health too.
   * - **API ID Path**: ribbon.default.primary.content
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  content: prismic.RichTextField;

  /**
   * Box background field in *Ribbon → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: The color of the ribbon. Same choices as Background.
   * - **Default Value**: Pink
   * - **API ID Path**: ribbon.default.primary.box_background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  box_background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Buttons field in *Ribbon → Default → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Open the price chart
   * - **API ID Path**: ribbon.default.primary.button
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
   * Background field in *Ribbon → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: The color behind the ribbon.
   * - **Default Value**: Transparent
   * - **API ID Path**: ribbon.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Ribbon → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: ribbon.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Ribbon → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: ribbon.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Default variation for Ribbon Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RibbonSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<RibbonSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Ribbon*
 */
type RibbonSliceVariation = RibbonSliceDefault;

/**
 * Ribbon Shared Slice
 *
 * - **API ID**: `ribbon`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RibbonSlice = prismic.SharedSlice<"ribbon", RibbonSliceVariation>;

/**
 * Primary content in *Side by side → Image → Primary*
 */
export interface SideBySideSliceImagePrimary {
  /**
   * Eyebrow field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.image.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Menopause isn't a dirty word.
   * - **API ID Path**: side_by_side.image.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Signoff on a whole paragraph is the large closing line. Note on a whole paragraph is the tint box. Start a paragraph with {{provider:inner-balance:offer}} or {{provider:inner-balance:facts}} to pull that clinic in.
   * - **API ID Path**: side_by_side.image.primary.text
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  text: prismic.RichTextField;

  /**
   * Quote field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: A large sentence at the top of the writing side. Leave blank to hide it.
   * - **API ID Path**: side_by_side.image.primary.quote
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  quote: prismic.RichTextField;

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
   * Photo link field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.image.primary.image_link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  image_link: prismic.LinkField<
    string,
    string,
    unknown,
    prismic.FieldState,
    never
  >;

  /**
   * Caption field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The line about this photo. Me and Winston, my Bernedoodle.
   * - **API ID Path**: side_by_side.image.primary.caption
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  caption: prismic.RichTextField;

  /**
   * Caption on the photo field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: true
   * - **API ID Path**: side_by_side.image.primary.caption_on_photo
   * - **Documentation**: https://prismic.io/docs/fields/boolean
   */
  caption_on_photo: prismic.BooleanField;

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
   * Media position field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: Center lines the media up with the middle of the writing. Top lines it up with the first line. Sticky keeps it in view while long writing scrolls.
   * - **Default Value**: Center
   * - **API ID Path**: side_by_side.image.primary.media_position
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  media_position: prismic.SelectField<"Center" | "Top" | "Sticky", "filled">;

  /**
   * Background field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: side_by_side.image.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: side_by_side.image.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Side by side → Image → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: side_by_side.image.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
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
   * Eyebrow field in *Side by side → Video → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.video.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Side by side → Video → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.video.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Side by side → Video → Primary*
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
   * Media position field in *Side by side → Video → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: Center lines the media up with the middle of the writing. Top lines it up with the first line. Sticky keeps it in view while long writing scrolls.
   * - **Default Value**: Center
   * - **API ID Path**: side_by_side.video.primary.media_position
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  media_position: prismic.SelectField<"Center" | "Top" | "Sticky", "filled">;

  /**
   * Background field in *Side by side → Video → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: side_by_side.video.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Side by side → Video → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: side_by_side.video.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Side by side → Video → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: side_by_side.video.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
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
   * Eyebrow field in *Side by side → Quote → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.quote.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Side by side → Quote → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.quote.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Side by side → Quote → Primary*
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
   * Media position field in *Side by side → Quote → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: Center lines the media up with the middle of the writing. Top lines it up with the first line. Sticky keeps it in view while long writing scrolls.
   * - **Default Value**: Center
   * - **API ID Path**: side_by_side.quote.primary.media_position
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  media_position: prismic.SelectField<"Center" | "Top" | "Sticky", "filled">;

  /**
   * Background field in *Side by side → Quote → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: side_by_side.quote.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Side by side → Quote → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: side_by_side.quote.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Side by side → Quote → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: side_by_side.quote.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
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
   * Eyebrow field in *Side by side → Clinic → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.clinic.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Side by side → Clinic → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: side_by_side.clinic.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Side by side → Clinic → Primary*
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
   * Style field in *Side by side → Clinic → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: Quote puts the logo, her words, and a visit link on this side. Card puts the product photo and price there.
   * - **Default Value**: Quote
   * - **API ID Path**: side_by_side.clinic.primary.style
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  style: prismic.SelectField<"Quote" | "Card", "filled">;

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
   * Media position field in *Side by side → Clinic → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: Center lines the media up with the middle of the writing. Top lines it up with the first line. Sticky keeps it in view while long writing scrolls.
   * - **Default Value**: Center
   * - **API ID Path**: side_by_side.clinic.primary.media_position
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  media_position: prismic.SelectField<"Center" | "Top" | "Sticky", "filled">;

  /**
   * Background field in *Side by side → Clinic → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: side_by_side.clinic.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Side by side → Clinic → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: side_by_side.clinic.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Side by side → Clinic → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: side_by_side.clinic.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
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
   * Sentence field in *Start here → Default → Primary → Cards*
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
   * Eyebrow field in *Start here → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: start_here.default.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Start here → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: Where should I start?
   * - **API ID Path**: start_here.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Content field in *Start here → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: start_here.default.primary.intro
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  intro: prismic.RichTextField;

  /**
   * Cards field in *Start here → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: start_here.default.primary.cards[]
   * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
   */
  cards: prismic.GroupField<Simplify<StartHereSliceDefaultPrimaryCardsItem>>;

  /**
   * Background field in *Start here → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: start_here.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Start here → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: start_here.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Start here → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: start_here.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
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

/**
 * Primary content in *Text → Default → Primary*
 */
export interface TextSliceDefaultPrimary {
  /**
   * Eyebrow field in *Text → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: text.default.primary.small_heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  small_heading: prismic.RichTextField;

  /**
   * Heading (H2) field in *Text → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: text.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  heading: prismic.RichTextField;

  /**
   * Link right of heading field in *Text → Default → Primary*
   *
   * - **Field Type**: Link
   * - **Placeholder**: Centered layout puts this under the writing.
   * - **API ID Path**: text.default.primary.link
   * - **Documentation**: https://prismic.io/docs/fields/link
   */
  link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;

  /**
   * Content field in *Text → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: The writing. Headings, lists, photos, and videos are allowed.
   * - **API ID Path**: text.default.primary.text
   * - **Documentation**: https://prismic.io/docs/fields/rich-text
   */
  text: prismic.RichTextField;

  /**
   * Layout field in *Text → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: On the right keeps the writing on the left and the link beside the heading. Centered centers the writing and puts the link under it.
   * - **Default Value**: On the right
   * - **API ID Path**: text.default.primary.layout
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  layout: prismic.SelectField<"On the right" | "Centered", "filled">;

  /**
   * Background field in *Text → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Transparent
   * - **API ID Path**: text.default.primary.background
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  background: prismic.SelectField<
    | "Transparent"
    | "Cream"
    | "Pink"
    | "Blue"
    | "Yellow"
    | "Lavender"
    | "Raspberry"
    | "Navy",
    "filled"
  >;

  /**
   * Space above field in *Text → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: Medium
   * - **API ID Path**: text.default.primary.space_above
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_above: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;

  /**
   * Space below field in *Text → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: None
   * - **API ID Path**: text.default.primary.space_below
   * - **Documentation**: https://prismic.io/docs/fields/select
   */
  space_below: prismic.SelectField<
    "None" | "Small" | "Medium" | "Large",
    "filled"
  >;
}

/**
 * Default variation for Text Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TextSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<TextSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Text*
 */
type TextSliceVariation = TextSliceDefault;

/**
 * Text Shared Slice
 *
 * - **API ID**: `text`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TextSlice = prismic.SharedSlice<"text", TextSliceVariation>;

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
      NavigationDocument,
      NavigationDocumentData,
      NavigationDocumentDataMainItemsLinksItem,
      NavigationDocumentDataMainItemsItem,
      NavigationDocumentDataFooterColumnsLinksItem,
      NavigationDocumentDataFooterColumnsItem,
      PageDocument,
      PageDocumentData,
      PageDocumentDataSlicesSlice,
      PostDocument,
      PostDocumentData,
      PostDocumentDataTablesItem,
      PostDocumentDataSourcesItem,
      ProviderDocument,
      ProviderDocumentData,
      ProviderDocumentDataHowItWorksItem,
      AllDocumentTypes,
      BoxesSlice,
      BoxesSliceDefaultPrimaryBoxesItem,
      BoxesSliceDefaultPrimary,
      BoxesSliceVariation,
      BoxesSliceDefault,
      BrandPromoSlice,
      BrandPromoSliceDefaultPrimaryOverwriteItem,
      BrandPromoSliceDefaultPrimary,
      BrandPromoSliceVariation,
      BrandPromoSliceDefault,
      ButtonsSlice,
      ButtonsSliceDefaultPrimary,
      ButtonsSliceVariation,
      ButtonsSliceDefault,
      ClinicComparisonSlice,
      ClinicComparisonSliceDefaultPrimaryClinicsItem,
      ClinicComparisonSliceDefaultPrimary,
      ClinicComparisonSliceChartPrimaryRowsItem,
      ClinicComparisonSliceChartPrimary,
      ClinicComparisonSliceVariation,
      ClinicComparisonSliceDefault,
      ClinicComparisonSliceChart,
      ClinicFactsSlice,
      ClinicFactsSliceDefaultPrimary,
      ClinicFactsSliceVariation,
      ClinicFactsSliceDefault,
      DividerSlice,
      DividerSliceDefaultPrimary,
      DividerSliceVariation,
      DividerSliceDefault,
      FaqSlice,
      FaqSliceDefaultPrimaryQuestionsItem,
      FaqSliceDefaultPrimary,
      FaqSliceVariation,
      FaqSliceDefault,
      FullWidthImageSlice,
      FullWidthImageSliceDefaultPrimary,
      FullWidthImageSliceVariation,
      FullWidthImageSliceDefault,
      HeroSlice,
      HeroSliceHomePrimaryTrustLinesItem,
      HeroSliceHomePrimary,
      HeroSliceSubpagePrimary,
      HeroSliceBrandsPrimaryClinicsItem,
      HeroSliceBrandsPrimary,
      HeroSliceProviderPrimary,
      HeroSliceCenteredPrimary,
      HeroSliceVariation,
      HeroSliceHome,
      HeroSliceSubpage,
      HeroSliceBrands,
      HeroSliceProvider,
      HeroSliceCentered,
      PhotoGallerySlice,
      PhotoGallerySliceDefaultPrimaryPhotosItem,
      PhotoGallerySliceDefaultPrimary,
      PhotoGallerySlicePairPrimary,
      PhotoGallerySliceVariation,
      PhotoGallerySliceDefault,
      PhotoGallerySlicePair,
      PostsSlice,
      PostsSliceHomePrimary,
      PostsSliceFeaturedPrimary,
      PostsSliceGridPrimary,
      PostsSliceRowPrimary,
      PostsSlicePickedPrimaryPostsItem,
      PostsSlicePickedPrimary,
      PostsSliceVariation,
      PostsSliceHome,
      PostsSliceFeatured,
      PostsSliceGrid,
      PostsSliceRow,
      PostsSlicePicked,
      ProsConsSlice,
      ProsConsSliceDefaultPrimaryRowsItem,
      ProsConsSliceDefaultPrimary,
      ProsConsSliceVariation,
      ProsConsSliceDefault,
      QuoteSlice,
      QuoteSliceDefaultPrimary,
      QuoteSliceVariation,
      QuoteSliceDefault,
      RibbonSlice,
      RibbonSliceDefaultPrimary,
      RibbonSliceVariation,
      RibbonSliceDefault,
      SideBySideSlice,
      SideBySideSliceImagePrimary,
      SideBySideSliceVideoPrimary,
      SideBySideSliceQuotePrimary,
      SideBySideSliceClinicPrimary,
      SideBySideSliceVariation,
      SideBySideSliceImage,
      SideBySideSliceVideo,
      SideBySideSliceQuote,
      SideBySideSliceClinic,
      StartHereSlice,
      StartHereSliceDefaultPrimaryCardsItem,
      StartHereSliceDefaultPrimary,
      StartHereSliceVariation,
      StartHereSliceDefault,
      TextSlice,
      TextSliceDefaultPrimary,
      TextSliceVariation,
      TextSliceDefault,
    };
  }
}
