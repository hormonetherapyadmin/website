// The remaining October 2026 Wix site pages. Words are unchanged,
// including the typos. A link to this site is a relative path. A link
// to another site keeps its full address.
//
// Hair, skincare, and men's HRT use the photo gallery. The weight page
// links the vial photo to the Joi page and leaves the GLP chart empty.
// The price chart picks the posts that are already in Prismic. HRT
// Doctors should become a Brand so the clinic page can replace this
// Text composition.

type Span = {
  start: number;
  end: number;
  type: "hyperlink";
  data: { link_type: "Web"; url: string; target?: "_blank" };
};

type Block = {
  type: "paragraph" | "heading3" | "list-item";
  text: string;
  spans: Span[];
};

function paragraph(text: string, spans: Span[] = []): Block {
  return { type: "paragraph", text, spans };
}

function heading(text: string): Block {
  return { type: "heading3", text, spans: [] };
}

function item(text: string): Block {
  return { type: "list-item", text, spans: [] };
}

function rich(text: string): Block[] {
  return [paragraph(text)];
}

function linked(
  text: string,
  phrase: string,
  url: string,
  blank = false,
): Block {
  const start = text.indexOf(phrase);
  if (start < 0) throw new Error(`"${phrase}" is not in "${text}"`);
  return paragraph(text, [
    {
      start,
      end: start + phrase.length,
      type: "hyperlink",
      data: {
        link_type: "Web",
        url,
        ...(blank ? { target: "_blank" as const } : {}),
      },
    },
  ]);
}

function pairs(rows: [string, string][]): Block[] {
  return rows.flatMap(([title, body]) => [heading(title), paragraph(body)]);
}

function section(
  fields: {
    small_heading?: string;
    heading?: string;
    intro?: string;
    space_above?: "None" | "Small" | "Medium" | "Large";
    space_below?: "None" | "Small" | "Medium" | "Large";
  } = {},
) {
  return {
    ...(fields.small_heading
      ? { small_heading: rich(fields.small_heading) }
      : {}),
    ...(fields.heading ? { heading: rich(fields.heading) } : {}),
    ...(fields.intro ? { intro: rich(fields.intro) } : {}),
    background: "Transparent",
    space_above: fields.space_above ?? "Large",
    space_below: fields.space_below ?? "None",
  };
}

function slice(
  slice_type: string,
  variation: string,
  primary: Record<string, unknown>,
) {
  return { slice_type, variation, primary, items: [] as [] };
}

function divider() {
  return slice("divider", "default", {
    line: "Squiggly",
    color: "Accent",
    background: "Transparent",
    space_above: "Medium",
    space_below: "None",
  });
}

function hero(headingText: string, intro?: string) {
  return slice(
    "hero",
    "centered",
    section({
      heading: headingText,
      ...(intro ? { intro } : {}),
      space_above: "Medium",
    }),
  );
}

function writing(headingText: string | undefined, text: Block[]) {
  return slice("text", "default", {
    ...section(headingText ? { heading: headingText } : {}),
    layout: "On the right",
    text,
  });
}

function solid(text: string, url: string, blank = false) {
  return {
    link_type: "Web" as const,
    url,
    text,
    variant: "Solid" as const,
    ...(blank ? { target: "_blank" as const } : {}),
  };
}

const journey = solid(
  "Trusted HRT Docs/Clinics - Start my Journey",
  "/trusted-providers",
);

function buttons(
  links: ReturnType<typeof solid>[],
  space_below: "None" | "Large" = "Large",
) {
  return slice("buttons", "default", {
    ...section({ space_below }),
    layout: "Centered",
    button: links,
  });
}

function photo(path: string, alt: string, width: number, height: number) {
  const filename = path.split("/").at(-1);
  if (!filename) throw new Error(`Photo path has no filename: ${path}`);
  return {
    localImage: true as const,
    path,
    filename,
    alt,
    width,
    height,
  };
}

function web(url: string, text?: string) {
  return {
    link_type: "Web" as const,
    url,
    ...(text ? { text } : {}),
  };
}

function shot(
  path: string,
  alt: string,
  width: number,
  height: number,
  caption?: string,
  line?: string,
  link?: ReturnType<typeof web>,
) {
  return {
    image: photo(path, alt, width, height),
    ...(caption ? { caption: rich(caption) } : {}),
    ...(line ? { line } : {}),
    ...(link ? { link } : {}),
  };
}

const LA_WIG =
  "https://shareasale.com/r.cfm?b=1744268&u=4098145&m=98959&urllink=&afftrack=";
const UNIWIGS = "https://shrsl.com/4pnzy";
const ALLOY_CREAM = "http://alloy.sjv.io/q4MxVj";
const WINONA_CREAM = "http://winona.pxf.io/XYkMZ3";
const HRT_DOCTORS =
  "https://shareasale.com/r.cfm?b=2245796&u=4098145&m=135949&urllink=&afftrack=";

const journeyChange =
  "Trusted HRT Docs/Clinics - Start my Journey links to /trusted-providers. On Wix that button links to the homepage.";

export const GUIDE_PAGES = [
  {
    sourceId: "page:formuations",
    uid: "formuations",
    title: "Formulations of Bioidentical & conventional Hormone Therapies",
    meta_title: "Formulations of Bioidentical & conventional Hormone Therapies",
    meta_description:
      "Hormone Replacement Therapy can be prescribed in several formulations.  Learn how Bioidentical Hormone Replacement Therapy differs from conventional HRT",
    review: [
      "The Wix page has no separate title. The hero uses the document title, and the two best-known-for lines are boxes.",
      "Wix shows the formulation names as bold lines. Here they are Heading 3. The words are unchanged, including Theu, thatr, a extended, mange, and ad administration.",
      "The live page is one column, so the two formulation lists stay stacked.",
    ],
    changes: [journeyChange],
    slices: [
      hero("Formulations of Bioidentical & conventional Hormone Therapies"),
      divider(),
      slice("boxes", "default", {
        ...section(),
        across: "2",
        boxes: [
          {
            heading: rich("Bioidentical Hormones, best known for"),
            text: rich("Custom Formulations"),
          },
          {
            heading: rich("Conventional Hormones, best known for"),
            text: rich("Standardized Dosages"),
          },
        ],
      }),
      writing(undefined, [
        paragraph(
          "It's important to note that while conventional HRT (Hormone Replacement Therapy) formulations are mass-produced and available in standardized doses. BHRT (Bioidentical HRT) formulations often customized by compounding pharmacies based on an individual's specific hormonal needs. The choice of formulation is influenced by factors such as patient preference, the specific hormones being used, and the desired mode of administration. Individuals considering hormone therapy should work closely with their healthcare providers to determine the most appropriate formulation based on their health needs.",
        ),
      ]),
      writing(
        "Bioidentical Therapy Formulations",
        pairs([
          [
            "Compounded Creams",
            "Bioidentical hormones can be compounded into customized creams. These are applied to the skin, allowing for absorption.",
          ],
          [
            "Sublingual Tablets",
            "Some BHRT medications come in sublingual (under the tongue) tablet form, allowing for absorption through the mucous membranes.",
          ],
          [
            "Pellets",
            "Small pellets containing bioidentical hormones can be implanted under the skin. These pellets release a steady and controlled dose of hormones over a extended period. (on-line providers don't normally offer this to telehealth patients)",
          ],
          [
            "Troches/Lozenges",
            "These are small, dissolvable tablets placed under the tongue. Theu can contain various bioidentical hormones.",
          ],
          [
            "Capsules",
            "BHRT may also be available in capsule form, which is taken orally.",
          ],
          [
            "Nasal Spray",
            "In some cases, BHRT formulations can be administered as nasal sprays, allowing for absorption through the nasal mucosa.",
          ],
        ]),
      ),
      writing(
        "Bioidentical Personalization",
        pairs([
          [
            "Comprehensive Evaluation",
            "A healthcare provider conducts a detailed evaluation of your health history, symptoms, and overall well-being.",
          ],
          [
            "Hormone Testing",
            "Blood tests may be performed to measure your hormone levels, providing a baseline for treatment.",
          ],
          [
            "Individualized Compounding:",
            "BHRT involves the use of bioidentical hormones thatr are structurally identical to those naturally produced in the body. These hormones can be compounded into customized formulations to match your specific hormonal needs.",
          ],
          [
            "Symptom Assessment",
            "Discussion with your healthcare provider about specific symptoms and helps determine the areas that need targeted hormone support.",
          ],
          [
            "Customized Treatment Plan",
            "Based on the evaluation, hormone testing, and symptoms assessment, the healthcare provider creates a personalized treatment plan. This may involve adjusting the type, dosage, and delivery method of hormones.",
          ],
          [
            "Monitoring and Adjustments",
            "Regular follow-up appointments are crucial for monitoring your response to treatment. Adjustments to the treatment plan may be made as needed to optimize the effectiveness and mange any potential side effects.",
          ],
        ]),
      ),
      writing(
        "Conventional Therapy Formulations",
        pairs([
          [
            "Oral Tablets",
            "Many HRT medications are available in oral tablet form, providing a convenient and familiar method of administration.",
          ],
          [
            "Transdermal Patches",
            "Patches are applied to the skin, delivering hormones directly into the bloodstream. They are commonly used for estrogen and in some cases, testosterone replacement.",
          ],
          [
            "Topical Creams and Gels",
            "Creams and gels containing hormones are applied to the skin, allowing for absorption. This method is often used for testosterone replacement.",
          ],
          [
            "Intramuscular Injections",
            "Injections, typically administered into the muscle, are another form of delivering hormones. Testosterone replacement therapy often uses intramuscular injections.",
          ],
          [
            "Vaginal Products",
            "For women experiencing symptoms related to vaginal atrophy, estrogen-based vaginal creams, rings or tablets may be prescribed.",
          ],
        ]),
      ),
      writing(
        "Conventional Personalization",
        pairs([
          [
            "Comprehensive Evaluation",
            "Similar to BHRT, HRT begins with a comprehensive evaluation of your health status, medical history, and symptoms.",
          ],
          [
            "Hormone Testing",
            "Hormone levels may be assessed through blood tests to establish a baseline for treatment.",
          ],
          [
            "Standardized Formulations",
            "While HRT often uses standardized doses of hormones, adjustments can still be made based on individual needs. For example, the type of estrogen or progestin, as well as the dosage, can be personalized.",
          ],
          [
            "Customized Treatment Plan",
            "The healthcare provider tailors the treatment plan by adjusting the type, dosage, ad administration method of hormones to address your unique needs.",
          ],
          [
            "Monitoring and Adjustments",
            "Regular follow-up appointments are essential for ongoing assessment, allowing for adjustments to the treatment plan as needed.",
          ],
        ]),
      ),
      buttons([journey]),
    ],
  },
  {
    sourceId: "page:costandinsurance",
    uid: "costandinsurance",
    title: "Cost and Insurance",
    meta_title: "Cost and  Insurance | Hormone Therapy Hub",
    meta_description:
      "Discover the expected out of pocket costs for hormone replacement therapy, learn if your insurance may cover some of the costs and if your preferred provider accepts HSA cards.",
    review: [
      "Wix has a second h1, Bioidentical Hormone Replacement Therapy. Here that line is a Heading 3 under Cost of Hormone Replacement Therapy, so the page keeps one h1.",
      "The words are unchanged, including informtion and the period in Before starting hormone replacement therapy.",
    ],
    changes: [journeyChange],
    slices: [
      hero(
        "Will my Hormone Replacement be covered by insurance?",
        "It's crucial to have open communication with both your healthcare provider and your insurance company to understand the financial aspects of bioidentical hormone replacement therapy. Additionally, it's important to keep in mind that insurance coverage policies may change, so it's advisable to check with your insurance provider for the most up-to-date informtion.",
      ),
      divider(),
      writing("Cost of Hormone Replacement Therapy", [
        heading("Bioidentical Hormone Replacement Therapy"),
        paragraph(
          "BHRT may involve compounded medications that are customized for individual patients. The cost can vary based on the pharmacy, the specific hormones used, and the formulation. Compounded medications may be more expensive than mass-produced, standardized medications.",
        ),
        heading("Conventional Hormone Replacement Therapy"),
        paragraph(
          "The cost of traditional HRT can vary depending on the type of hormones prescribed, the formulation (pills, patches, injections, etc) and whether generic or brand-name medications are used.",
        ),
      ]),
      writing(
        "Consultation and Monitoring Fees",
        rich(
          "In addition to the cost of medications, healthcare providers may charge consultation fees for initial assessments, follow-up appointments and monitoring.",
        ),
      ),
      writing("Insurance Coverage:", [
        heading("Private Insurance"),
        paragraph(
          "Some private insurance plans may cover the cost of hormone replacement therapy, but coverage varies widely. Insurance providers may have specific criteria for coverage, and they may require documentation of medical necessity.",
        ),
        heading("Verification of Coverage"),
        paragraph(
          "Before starting hormone replacement therapy. it is advisable to contact your insurance provider to verify coverage and understand any out-of-pocket costs. Your healthcare provider's office may also assist in verifying insurance coverage.",
        ),
        heading("Prior Authorization"),
        paragraph(
          "In some cases, insurance companies may require prior authorization before covering certain medications or treatments. This involves obtaining approval from the insurance company based on medical necessity.",
        ),
        heading("Prescription Drug Coverage"),
        paragraph(
          "Insurance coverage of medications is typically outlined in your prescription drug benefits. Check your plan's formulary to see which hormones are covered at what cost.",
        ),
        heading("Out-of-Pocket Costs"),
        paragraph(
          "Even with insurance coverage, individuals may have out-of-pocket costs such as copayments, deductibles, or coinsurance.",
        ),
        heading("HSA Cards"),
        paragraph(
          "Some Hormone Replacement Therapy clinics and providers accept HSA credit cards. Be sure to check their website, our review pages or with the practice directly to confirm they'll accept your HSA Card for payment.",
        ),
      ]),
      buttons([journey]),
    ],
  },
  {
    sourceId: "page:sleep",
    uid: "sleep",
    title: "Sleep",
    meta_title: "Sleep | Hormone Therapy Hub",
    review: [
      "The live Wix page has no writing under the title. The hero and the journey button are the whole page.",
    ],
    changes: [journeyChange],
    slices: [hero("Sleep"), divider(), buttons([journey])],
  },
  {
    sourceId: "page:hair-loss",
    uid: "hair-loss",
    title: "Hair Loss",
    meta_title: "Hair Loss | Hormone Therapy Hub",
    meta_description:
      "Hair loss during menopause sometimes happens.  See trusted providers for Hair Toppers and Wigs.",
    review: [
      "The three hair photos and the four wig photos are a photo gallery, centered. Simmer Elite and Kelly had no photo, so their names stay in the writing.",
      "The words are unchanged, including before I starting, experiementing, handband, alot, and it become.",
    ],
    changes: [
      journeyChange,
      "Take me to The LA Wig Company uses the ShareASale address on the Wix page.",
    ],
    slices: [
      hero("Get your Confidence Back!"),
      divider(),
      buttons([solid("Take me to The LA Wig Company", LA_WIG, true)], "None"),
      writing(undefined, [
        paragraph(
          "These pictures are before I starting wearing alternative hair.",
        ),
        paragraph(
          "As if Mother Nature didn't already do a number on us during Perimenopause and Menopause with the hot-flashes, night sweats and brain fog, now I'm starting to see more scalp! Yikes! What's a menopause lady to do, she considers alternative hair of course!! Yes, it's a thing. Alternative hair can be a topper, wig or extensions.",
        ),
        paragraph(
          'I have never had "GREAT" hair and as time went on, my hair became more and more thin. I couldn\'t really do much with it, so I wore it in a clip most of the time. I had a significant bald area on my crown, so pulling it back allowed me to camouflage that area and then I used tons of hairspray to make it big on top!',
        ),
      ]),
      slice("photo_gallery", "default", {
        ...section({ space_above: "Medium" }),
        center: true,
        photos: [
          shot(
            "public/mockup/proposed/hair-thin.jpg",
            "Peggy, before she started wearing alternative hair",
            815,
            1400,
            "Before alternative hair",
          ),
          shot(
            "public/mockup/proposed/hair-topper.jpg",
            "Peggy wearing a hair topper",
            1136,
            1400,
            "With a topper",
          ),
          shot(
            "public/mockup/proposed/hair-shaved.jpg",
            "Peggy with a shaved head",
            1377,
            1400,
            "Me today, no wig",
          ),
        ],
      }),
      writing(
        "Hair Toppers",
        rich(
          "My first alternative hair piece was a topper, but I eventually learned that a topper wasn't the right choice for me. The clips that hold the topper to your hair are in the area where my hair is the thinnest, and I could feel the clips pulling even more hair out. I think I should have been advised to get a topper that was large enough for the clips to be in the areas where I do have hair or looking back, I should have gone with a wig from the beginning!",
        ),
      ),
      writing("Me Today, no wig!", [
        paragraph(
          'My initial journey with wigs took me from a topper to a full-on wig in about 4 weeks. Once I started experiementing with wigs, I soon realized that having to pull my bio-hair back with a wig grip handband was alot of work, so when joking with my husband one evening I said, "I feel like it would be easier if I just shaved my head!"',
        ),
        paragraph(
          "He immediately responded with, let's do it now! It was a shock at first, but the buzzed hair is like human velcro and I don't have to wear anything under my wigs! I'm also working with my stylist to get it grown out enough to have a decent pixie cut by summer so I can swim with my grandkids when we go to Orlando, Florida.",
        ),
      ]),
      slice("photo_gallery", "default", {
        ...section({ heading: "Some of my favorite Wigs!" }),
        center: true,
        photos: [
          shot(
            "public/mockup/proposed/wig-portrait.jpg",
            "Peggy in the Raquel Welch Portrait Mode wig, Shaded Biscuit",
            1353,
            1400,
            "Raquel Welch - Portrait Mode",
            "Color: RL 19/23SS (Shaded Biscuit)",
          ),
          shot(
            "public/mockup/proposed/wig-directors.jpg",
            "Peggy in the Raquel Welch Director's Pick wig, Shaded Biscuit",
            1400,
            1050,
            "Raquel Welch - Director's Pick",
            "Color: RL 19/23SS (Shaded Biscuit)",
          ),
          shot(
            "public/mockup/proposed/wig-flirt.jpg",
            "Peggy in the Raquel Welch Flirt Alert wig, Shaded Biscuit",
            1353,
            1400,
            "Raquel Welch - Flirt Alert",
            "Color: RL 19/23SS (Shaded Biscuit)",
          ),
          shot(
            "public/mockup/proposed/wig-julianne.jpg",
            "Peggy in the Jon Reneau Julianne Lite wig, Palm Springs Blonde",
            1166,
            1400,
            "Jon Reneau - Julianne Lite",
            "Color: FS17/101S18 (Palm Springs Blonde)",
          ),
        ],
      }),
      buttons([solid("Take me to The LA Wig Company", LA_WIG, true)], "None"),
      writing(undefined, [
        paragraph(
          "To date, I have purchased seven wigs. They have ranged in price from around $275 to $400. I've learned to shop around and pay attention when online wig companies have sales, you can sometimes get a really good bargain, if you know what to look for. Two of the seven wigs have been ruined by hot tools because I didn't pay attention to the heat setting per manufacturer.",
        ),
        paragraph(
          "It's definitely a journey. I've been at it for five months and am finally comfortable with the idea that I'm wearing a wig. My brain and eyes had to get on the same page. At first, it just looked and felt like too much hair. But in time, after I asked enough people for their opinion and found the best options for me, it's no different than getting my nails done. They are fake and I don't think twice about it, but for hair it felt different and more personal until I finally realized, it's just hair. I have also found most people notice I look different, but they have ZERO clue it's a wig!",
        ),
        paragraph(
          "For me, once I found a brand I liked and then a color or two that works for me, it become much easier to shop online. I have always gravitated toward wavy bobs. I'm not crazy about the straight bob, but some of my friends like this one the best and it's actually my least favorite.",
        ),
        ...pairs([
          [
            "Raquel Welch - Simmer Elite",
            "Color: 17/23SS - (Iced Latte Macchiato)",
          ],
          ["Jon Reneau - Kelly", "Color: FS17/101S18 (Palm Springs Blonde)"],
        ]),
      ]),
      buttons([solid("Take me to The LA Wig Company", LA_WIG, true), journey]),
    ],
  },
  {
    sourceId: "page:skincare",
    uid: "skincare",
    title: "Rx Face Cream",
    meta_title: "Rx Face Cream | Hormone Therapy Hub",
    meta_description:
      "Are you looking for cream appropriate for a woman in her 50's then look at the creams I've tried and my before and afters.",
    review: [
      "Alloy and Winona are before-and-after pairs. Each pair links to that cream's review. Inner Balance has one photo, and it links to /inner-balance.",
      "The Alloy button uses the Alloy visit address already on that brand. The Winona button uses a different address from the brand visit, so it is stored on this page.",
      "The Inner Balance coupon links to /inner-balance. The Wix page has no separate affiliate address on that button.",
    ],
    changes: [journeyChange],
    slices: [
      hero("Menopause SkinCare"),
      divider(),
      writing(undefined, [
        paragraph(
          "Before menopause, my skin was something I barely thought about. It had its moments—sometimes dry, sometimes oily—but it was generally pretty predictable.",
        ),
        paragraph(
          "During menopause, the changes in my skin were even more pronounced. As my estrogen levels dropped, it was like my skin was slowly losing its ability to hold moisture. I became more sensitive to things like harsh soaps and even the weather. My once smooth, plump skin started to sag a little, especially around my jawline, and I noticed more age spots appearing out of nowhere. Even though I tried using more hydrating creams, I still felt like something was missing. The skin on my face seemed thinner, and I became hyper-aware of every new line or dark spot. It felt like I was watching my skin age in fast forward.",
        ),
        paragraph(
          "After menopause, the changes continued. My skin felt even more delicate, and I had to be more careful about what I applied. That's when I heard about creams with estriol a form of estrogen, and honestly, they’ve been a game changer for me. Estrogen creams have helped restore some of the moisture my skin had lost, and they seem to plump things up a little, making my skin feel smoother and more hydrated. It’s like the elasticity I had in my younger years has returned in small ways, especially in areas where I used to feel dry or saggy. I still use my usual moisturizer, but I’ve found that adding estrogen-based products has made a noticeable difference in reducing the dullness and increasing my skin's resilience. It’s not a miracle cure, but it’s definitely helped me feel like my skin is being taken care of during this time of transition.",
        ),
        paragraph(
          "The first Face Cream I tried that had Estrogen in it was Alloy's M4 Estriol Face Cream. The cost was $ 149.97 for a 3-month supply. It made a big difference in the darkness under my eyes.",
        ),
      ]),
      slice("photo_gallery", "pair", {
        ...section({ heading: "Alloy M4 Estriol Face Cream" }),
        before: photo(
          "public/mockup/proposed/skin-alloy-before.jpg",
          "Peggy before Alloy M4 face cream",
          1047,
          1400,
        ),
        before_caption: rich("Before"),
        after: photo(
          "public/mockup/proposed/skin-alloy-after.jpg",
          "Peggy after Alloy M4 face cream",
          957,
          1400,
        ),
        after_caption: rich("After"),
        link: web("/post/alloy-m4-face-cream-review", "Read the review"),
      }),
      writing(undefined, [
        paragraph(
          "The second Face Cream I tried that had Estrogen in it was Winona's Estriol Skin Cream with Tretinoin. The cost was $150 for a 3-month supply. This was immediately after my experience with Alloy so it makes sense that I'm not seeing as much of difference because I started in a better place than I did with Alloy. I love the feel of Winona's Cream as it's super smooth and goes on with very little tugging. I think it's the Tretinoin that makes it so smooth. However, this was to be a 3-month supply and I barely got 30 days out of it.",
        ),
      ]),
      slice("photo_gallery", "pair", {
        ...section({ heading: "Winona Estriol Skin Cream" }),
        before: photo(
          "public/mockup/proposed/skin-winona-before.jpg",
          "Peggy before Winona estriol cream",
          1152,
          1400,
        ),
        before_caption: rich("Before"),
        after: photo(
          "public/mockup/proposed/skin-winona-after.jpg",
          "Peggy after Winona estriol cream",
          1400,
          1210,
        ),
        after_caption: rich("After"),
        link: web(
          "/post/winona-estriol-cream-with-tretinoin-review",
          "Read the review",
        ),
      }),
      writing(undefined, [
        paragraph(
          "Then once Inner Balance came out with their Estriol Face Cream, I had to try that as I'm a huge fan of the Oestra HRT cream.",
        ),
        paragraph(
          "The cost of the Inner Balance cream (if you subscribe to 3 months) is $93 for a bottle and I actually got 38 days rather than 30 out of my cream as they suggested.",
        ),
        paragraph(
          "The cost per day is $2.44 for Inner Balance, compared to Alloy at $2.66 per day and Winona being at $3.33 per day.",
        ),
      ]),
      slice("photo_gallery", "default", {
        ...section({ heading: "Inner Balance" }),
        center: true,
        photos: [
          shot(
            "public/mockup/proposed/skin-inner-balance.jpg",
            "Peggy with the Inner Balance face cream",
            745,
            1400,
            "Inner Balance",
            undefined,
            web("/inner-balance", "Inner Balance page"),
          ),
        ],
      }),
      buttons([
        solid(
          "Use Code HormoneHub for $10 off first order!",
          ALLOY_CREAM,
          true,
        ),
        solid("Click for 15% off your first Winona Order", WINONA_CREAM, true),
        solid(
          "Use Coupon Code PEGGY10 for 10% off your Inner Balance order!!",
          "/inner-balance",
        ),
        journey,
      ]),
    ],
  },
  {
    sourceId: "page:copy-of-weight-gain",
    uid: "weight-gain",
    title: "Weight & HRT",
    meta_title: "Weight & HRT | Hormone Therapy Hub",
    meta_description:
      "Want to know the Holy grail of weight loss for menopause? Learn about how you can combine HRT  and Semaglutide for the most effective weight loss results.",
    review: [
      "The public address is /weight-gain. /copy-of-weight-gain is the Wix address and redirects here.",
      "The vial photo links to /joiwommenswellness. The visit address stays on the Joi brand.",
      "The comparison under Which Telehealth Platform is a Common Ninja embed. Its rows are not on this page, so the chart is empty.",
    ],
    changes: [journeyChange],
    slices: [
      hero(
        "GLP-1 & GIP-1 Meds can be very beneficial to add to your HRT Regimen for Stubborn Weight Loss",
      ),
      divider(),
      slice("side_by_side", "image", {
        ...section({
          heading:
            "The HOLY Grail of Weight Loss for Women in Menopause or Perimenopause!",
        }),
        image: photo(
          "public/mockup/pages/weight-vial.jpg",
          "A vial and an orange syringe on a counter",
          1050,
          1400,
        ),
        image_link: web("/joiwommenswellness"),
        caption: rich("Joi + Blokes"),
        caption_on_photo: false,
        side: "Media right",
        media_position: "Center",
      }),
      slice("full_width_image", "default", {
        image: photo(
          "public/mockup/pages/weight-chalkboard.png",
          "Chalkboard equation: HRT plus GLP-1 (compound semaglutide, Ozempic or Wegovy) equals real weight loss for perimenopause and menopause",
          1000,
          500,
        ),
        edge_to_edge: false,
        background: "Transparent",
        space_above: "Medium",
        space_below: "None",
      }),
      slice("clinic_comparison", "chart", {
        ...section({
          heading:
            "Which Telehealth Platform offers the Best Value for GLP-1 Medications?",
        }),
        rows: [],
      }),
      buttons([journey]),
    ],
  },
  {
    sourceId: "page:hrt-price-comparison-chart",
    uid: "hrt-price-comparison-chart",
    title: "Pricing",
    meta_title: "Pricing | Hormone Therapy Hub",
    meta_description: "Online HRT Price Comparison Chart",
    review: [
      "The live page is these three posts, not a price table. The homepage comparison is the price chart.",
      "The Joi testing post is not in Prismic yet, so it stays a link. The other two are the hand-picked row, in the same order.",
    ],
    changes: [journeyChange],
    slices: [
      slice(
        "hero",
        "centered",
        section({
          small_heading: "HRT Provider",
          heading: "Price Comparison Chart",
          space_above: "Medium",
        }),
      ),
      divider(),
      writing(undefined, [
        linked(
          "My Experience with Joi Women’s Wellness Menopause Hormone Testing: What’s Included & Is It Worth It?",
          "My Experience with Joi Women’s Wellness Menopause Hormone Testing: What’s Included & Is It Worth It?",
          "/post/my-experience-with-joi-women-s-wellness-menopause-hormone-testing-what-s-included-is-it-worth-it",
        ),
      ]),
      slice("posts", "picked", {
        ...section(),
        posts: [
          {
            post: {
              link_type: "Document",
              id: "atGcfxIAAC4AAHHR",
              type: "post",
              uid: "how-does-online-hrt-work-doctors-costs-and-insurance-explained",
              url: "/post/how-does-online-hrt-work-doctors-costs-and-insurance-explained",
            },
          },
          {
            post: {
              link_type: "Document",
              id: "atGcfRIAACkAAHHM",
              type: "post",
              uid: "joi-vs-midi-health-which-offers-1-on-1-consults-testing",
              url: "/post/joi-vs-midi-health-which-offers-1-on-1-consults-testing",
            },
          },
        ],
      }),
      buttons([journey]),
    ],
  },
  {
    sourceId: "page:tipstofindprovider",
    uid: "tipstofindprovider",
    title: "HRT Doc Tips",
    meta_title: "HRT Doc Tips | Hormone Therapy Hub",
    meta_description:
      "What to consider when you are shopping for online, telehealth HRT providers and clinics.  Learn how to find a online Hormone Therapy Doctor that's just right for you.",
    review: [
      "Click for HRT Options and Formulations is a picture on Wix. Here it is a button to /formuations.",
    ],
    changes: [journeyChange],
    slices: [
      hero(
        "You want menopause symptom relief; you deserve exquisite care.",
        "When looking for an online Hormone Replacement Therapy (HRT) or Bioidentical Hormone Replacement Therapy (BHRT) doctor in your state, it's essential to prioritize factors that ensure safety, privacy, credibility, and quality of care.",
      ),
      divider(),
      writing("Hormone Replacement Online", [
        paragraph(
          "Hormone Replacement Specialist near me (as close as your personal computer)",
        ),
        heading(
          "What to look for when shopping for an online Doctor and Clinic?",
        ),
        heading("Medical Credentials"),
        paragraph(
          "Ensure that the provider is a licensed healthcare professional with the appropriate medical credentials.",
        ),
        paragraph(
          "Verify that the provider has experience and expertise in hormone replacement therapy or Bioidentical Hormone Replacement Therapy.",
        ),
        heading("Telemedicine Compliance"),
        paragraph(
          "Confirm that the online provider complies with telemedicine regulations and laws in your state.",
        ),
        paragraph(
          "Check if the provider requires an initial in-person consultation, which might be a legal requirement in some regions.",
        ),
        ...pairs([
          [
            "Patient Reviews and Testimonials",
            "Look for reviews and testimonials from other patients who have used the services. This can provide insights into the provider's reputation and patient satisfaction.",
          ],
          [
            "Privacy and Security",
            "Verify that the online platform follows strict privacy and security measures to protect your personal and health information.",
          ],
          [
            "Customization of Treatment Plans",
            "For Bioidentical Hormone Replacement Therapy, inquire about the customization of treatment plans based on individual hormone needs. Understand how the provider tailors treatments to your specific health profile.",
          ],
          [
            "Transparent Pricing",
            "Ensure that the pricing structure is transparent and clearly outlined. Be aware of any hidden fees or unexpected charges.",
          ],
          [
            "Communication Channels",
            "Evaluate the communication channels available for interacting with healthcare professionals. Look for platforms that offer secure messaging, video consultations, or phone calls. Are they HIPAA compliant?",
          ],
          [
            "Pharmacy Partnerships",
            "Check if the online provider works with reputable pharmacies to ensure the quality and safety of medications. If you are interested in bioidentical hormone replacement therapy, ask if they have a compounding pharmacy they work with and the lead time on prescriptions.",
          ],
          [
            "Follow-up and Monitoring",
            "Inquire about the provider's follow-up procedures and monitoring of treatment. Regular check-ins and adjustments to the treatment plan may be necessary.",
          ],
          [
            "Educational Resources",
            "A reliable provider should offer educational resources about hormone replacement therapy, potential side effects, and lifestyle considerations.",
          ],
          [
            "Emergency Protocols",
            "Understand the provider's emergency protocols and how they handle urgent situations or adverse reactions.",
          ],
          [
            "State Regulations Compliance",
            "Confirm that the provider adheres to state-specific regulations governing hormone therapy and telemedicine in your location.",
          ],
          [
            "Insurance Coverage",
            "Inquire in advance with the provider if they accept insurance and specifically, the insurance you have. If they don't, understand the costs involved.",
          ],
          [
            "Patient Support",
            "Assess the level of patient support offered, including access to health care professionals for questions or concerns.",
          ],
        ]),
      ]),
      buttons([
        solid("Click for HRT Options and Formulations", "/formuations"),
        journey,
      ]),
    ],
  },
  {
    sourceId: "page:hrt-doctors-review-costs-services",
    uid: "hrt-doctors-review-costs-services",
    title: "HRT+Doctors Review Page",
    meta_title: "HRT+Doctors Review Page | Hormone Therapy Hub",
    meta_description:
      "Overview HRT Doctors+ pricing, process., plans and insurance accepted",
    review: [
      "This is a clinic overview. It should become a Brand, and then this page can use the provider hero, Clinic facts, and the ribbon. The words are in Text until that brand exists.",
      "The prices, states, and steps are the October 2026 Wix page. They are not a new Brand yet.",
    ],
    changes: [
      journeyChange,
      "Start Your HRT+Doctors Journey Here uses the ShareASale address on the Wix page.",
    ],
    slices: [
      hero("HRT Doctors Group"),
      divider(),
      writing("HRT Provider Overview", []),
      buttons(
        [solid("Start Your HRT+Doctors Journey Here", HRT_DOCTORS, true)],
        "None",
      ),
      writing("Availability", [
        paragraph("HRT Doctors is available in 38 states."),
        paragraph("(not in: CA, AK, ND, WY, WA, OK, AR, AL, NY, ME or HI)"),
      ]),
      writing("Specialities", [
        item("HRT for Women"),
        item("HRT for Menopause"),
        item("HRT for Post Menopausal"),
        item("BHRT for Women"),
        item("Natural BHRT"),
      ]),
      writing("How it Works", [
        paragraph(
          "1. Sign Up and pay for your initial Blood Test, Comprehensive Panel to be completed at a Quest Lab - $89.95.",
        ),
        paragraph("2. Complete Medical History"),
        paragraph("3. Complete Blood Test a Quest Lab near you"),
        paragraph(
          "4. In-depth Hormone Consultation and Blood Work Assessment by a US Board Certified HRT Physician",
        ),
        paragraph("5. Home Treatment and Continued Care"),
      ]),
      writing("Formulations Offered", [
        heading("Bioidentical Hormone Therapy"),
        paragraph("(Creams, Patches and Gels)"),
      ]),
      writing("Voted Best For:", rich("Mobile Platform for Patient Portal")),
      writing("Pricing", [
        heading("Transparent Pricing"),
        paragraph("$229/Month - Start any time and Stop anytime"),
        heading("Includes"),
        item("In-Depth Doctor Consultation"),
        item("On-going Comprehensive Blood Work at Quest Diagnostics Included"),
        item(
          "$229 Flat-Fee includes any female bioidentical cream-based protocol",
        ),
        item("2nd Day Air Shipping of Meds at no cost"),
        item("US Board Certified Doctors"),
        item("Family Telemedicine Service access included 24x7, 365 days"),
        item(
          "Unlimited Access to HRT Doctors, and Patient Care team is available at no charge",
        ),
        item("HIPAA-Compliant Patient Portal"),
      ]),
      writing(
        "Pre-Testing",
        rich(
          "Yes - Through your local Quest Diagnostics: Hormonal Imbalance Blood Test, Comprehensive Lab Panel - ($375 Value) for $89.95",
        ),
      ),
      writing("Private Insurance", rich("Private Insurance not accepted")),
      writing("HSA Card Accepted", rich("Yes")),
      writing("Trusted Providers", []),
      buttons([journey]),
    ],
  },
  {
    sourceId: "page:men-s-hrt",
    uid: "men-s-hrt",
    title: "Men's HRT",
    meta_title: "Men's HRT | Hormone Therapy Hub",
    review: [
      "The three photos are a photo gallery. The files are not labeled, so the captions are blank.",
      "The page is Peggy's hair topper story. The words are unchanged, including anthing and less roots.",
      "There is no men's hormone copy on the live page.",
    ],
    changes: [
      journeyChange,
      "Take me to UniWigs uses the shrsl.com address on the Wix page.",
    ],
    slices: [
      hero("Get your Confidence Back!"),
      divider(),
      buttons([solid("Take me to UniWigs", UNIWIGS, true)], "None"),
      writing(undefined, [
        paragraph(
          "Use Coupon Code Welcome15 for 15% off your first order and then",
        ),
        paragraph("Blog10 for 10% off your orders after the first."),
        paragraph(
          "As if Mother Nature didn't already do a number on us during Perimenopause and Menopause, with the hot-flashes, night sweats and brain fog, now I'm really starting to see more scalp! Yikes! What's a menopause lady to do, she buys a hair topper of course!!",
        ),
        paragraph(
          "To be honest, it was such a drastic change, at least to me at first that it took a week or so to be confident enough to wear it in public. Now, a few weeks into having the hair topper, I wear it every day. It's been fun to experience with different hair styles. It's been so long since I've been able to do anthing with my hair!",
        ),
        paragraph(
          "This is my first topper; I already have a 2nd and 3rd on order. This one has less roots, than the 2nd I've ordered, has more roots and the 3rd will be synthetic hair, as I wanted to try those out as well. I'll keep you posted on how it goes.",
        ),
      ]),
      slice("photo_gallery", "default", {
        ...section({ space_above: "Medium" }),
        center: true,
        photos: [
          shot(
            "public/mockup/proposed/men-1.jpg",
            "Peggy, a photo from the men's HRT page",
            1211,
            1400,
          ),
          shot(
            "public/mockup/proposed/men-2.jpg",
            "Peggy, a second photo from the men's HRT page",
            1225,
            1400,
          ),
          shot(
            "public/mockup/proposed/men-3.jpg",
            "Peggy, a third photo from the men's HRT page",
            1168,
            1400,
          ),
        ],
      }),
      writing("Hair Loss is a side-effect of Perimenopause and Menopause", [
        paragraph(
          "During perimenopause and menopause, many women experience hair loss, which can be attributed to a combination of hormonal changes, genetics, and environmental factors. One of the primary hormonal shifts involves a decrease in estrogen levels. Estrogen plays a crucial role in the hair growth cycle; it helps to prolong the growth phase and maintain hair density. As estrogen levels drop, the balance between hair growth and shedding can be disrupted, leading to increased hair thinning and loss.",
        ),
        paragraph(
          "Additionally, progesterone levels also fluctuate during this transitional period. Progesterone has a protective effect on hair follicles, and its decline can exacerbate the effects of testosterone, which may convert to dihydrotestosterone (DHT). Elevated DHT levels can shrink hair follicles, leading to finer hair strands and a reduction in overall hair volume. This hormonal interplay often results in a condition known as androgenetic alopecia, which is characterized by thinning hair along the crown and temples.",
        ),
        paragraph(
          "Stress is another contributing factor during this time, as women may face emotional and physical stressors related to aging, health changes, and life transitions. Stress can trigger telogen effluvium, a condition where hair follicles prematurely enter the shedding phase. Additionally, nutritional deficiencies that may arise during menopause, such as lower iron or vitamin D levels, can further compromise hair health. Together, these factors can lead to noticeable changes in hair density and texture, prompting many women to seek solutions to manage this common but distressing aspect of aging.",
        ),
      ]),
      buttons([solid("Take me to UniWigs", UNIWIGS, true), journey]),
    ],
  },
];
