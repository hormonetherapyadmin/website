import { Calendar01Icon, Timer01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import shared from "../../_shared/mockup.module.css";
import { clinicNamed, type Clinic } from "../../_shared/clinics";
import {
  AFFILIATE_REL,
  DISCLOSURE_HREF,
  MockupShell,
} from "../../_shared/mockup-shell";
import { POST_KINDS, PostCard, formatDate, postAt } from "../../_shared/posts";
import styles from "../blog.module.css";
import { InThisPost } from "../in-this-post";
import { Share } from "../share";

/*
  Blog post design mockup using a real article from the live Wix site:
  /post/hrt-skin-before-and-after-my-12-month-results-and-experience
  (October 2026). Body copy is kept as published. Offer callouts stand in
  for the captioned affiliate images on the live post, with small typo
  fixes to those captions.
*/

export const metadata: Metadata = {
  title: "Blog post mockup",
  robots: { index: false, follow: false },
};

const POST = postAt(
  "/post/hrt-skin-before-and-after-my-12-month-results-and-experience",
);

const SECTIONS = [
  {
    id: "journey",
    title: "My Journey from Age 52 to 59",
    label: "Age 52 to 59",
  },
  {
    id: "aging",
    title: "Do You Age Quicker Without HRT?",
    label: "Aging without HRT",
  },
  {
    id: "glp-1",
    title:
      "Combining HRT and a GLP-1: Did Hormone Therapy Protect My Skin from Ozempic Face?",
    label: "GLP-1 and skin",
  },
  {
    id: "estrogen",
    title:
      "What Does Estrogen Do for Women? Understanding Its Impact on Skin and Aging",
    label: "What estrogen does",
  },
  {
    id: "results",
    title: "HRT Skin Before and After: My Results and Experience",
    label: "My results",
  },
];

const MENTIONED = ["Inner Balance", "Musely", "Joi Women’s Wellness", "Alloy"];
const RAIL_CLINIC_LIMIT = 4;

// Tag URLs are the live Wix tag pages; labels are read from their slugs.
const TAGS = [
  { label: "Estrogen skincare", href: "/blog/tags/estrogen-skincare" },
  {
    label: "Estrogen face creams",
    href: "/blog/tags/estrogen-face-creams-2aaf3d6e",
  },
  { label: "Musely", href: "/blog/tags/musely" },
  { label: "Oestra", href: "/blog/tags/oestra" },
  { label: "Joi Women’s Wellness", href: "/blog/tags/joi-women-s-wellness" },
];

const RELATED = [
  "/post/musely-eye-serum-review-can-it-fix-menopausal-dark-circles-wrinkles",
  "/post/oestra-by-inner-balance-my-honest-1-year-review",
  "/post/ivim-review-hrt-glp-1-menopause-weight-gain",
].map(postAt);

function AffiliateLink({
  clinic,
  placement,
  className,
  children,
}: {
  clinic: Clinic;
  placement: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#affiliate-link"
      target="_blank"
      rel={AFFILIATE_REL}
      className={className}
      data-provider={clinic.name}
      data-placement={placement}
    >
      {children}
      <span className={shared.srOnly}>
        {" "}
        (affiliate link, opens in a new tab)
      </span>
    </a>
  );
}

function ClinicLogo({
  clinic,
  className,
}: {
  clinic: Clinic;
  className?: string;
}) {
  return (
    <span
      className={
        className ? `${shared.logoTile} ${className}` : shared.logoTile
      }
    >
      {clinic.logo ? (
        <Image src={clinic.logo} alt="" width={44} height={44} />
      ) : (
        <span className={shared.monogram} aria-hidden="true">
          {clinic.monogram}
        </span>
      )}
    </span>
  );
}

function OfferCallout({
  clinicName,
  code,
  children,
}: {
  clinicName: string;
  code?: string;
  children: ReactNode;
}) {
  const clinic = clinicNamed(clinicName);
  return (
    <aside className={styles.offerCallout} aria-label={`${clinic.name} offer`}>
      <ClinicLogo clinic={clinic} />
      <div>
        <p className={styles.offerText}>{children}</p>
        <div className={styles.offerActions}>
          <AffiliateLink
            clinic={clinic}
            placement="article_offer"
            className={shared.buttonPrimary}
          >
            Visit {clinic.name}
          </AffiliateLink>
          {code ? <span className={shared.offer}>Code {code}</span> : null}
        </div>
      </div>
    </aside>
  );
}

function SectionHeading({ index }: { index: number }) {
  const section = SECTIONS[index];
  return (
    <h2 id={section.id} tabIndex={-1}>
      {section.title}
    </h2>
  );
}

function Ref({ n }: { n: number }) {
  return (
    <sup className={styles.ref}>
      <a href={`#source-${n}`} id={`ref-${n}`}>
        <span className={shared.srOnly}>Source </span>
        {n}
      </a>
    </sup>
  );
}

export default async function BlogPostMockup(
  props: PageProps<"/mockup/blog/post">,
) {
  const searchParams = await props.searchParams;
  const innerBalance = clinicNamed("Inner Balance");
  const musely = clinicNamed("Musely");
  const topic = POST_KINDS.find((item) => item.label === POST.kind);

  return (
    <MockupShell searchParams={searchParams}>
      <nav aria-label="Breadcrumb" className={styles.crumbs}>
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
          <li aria-current="page">{POST.title}</li>
        </ol>
      </nav>

      <article>
        <header className={styles.articleHead}>
          <div>
            <p className={styles.kicker}>
              <a href={`/mockup/blog?type=${topic?.slug ?? ""}`}>{POST.kind}</a>
              <span className={styles.kickerMeta}>
                <time dateTime={POST.published}>
                  <HugeiconsIcon
                    icon={Calendar01Icon}
                    size={16}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {formatDate(POST.published)}
                </time>
                <span>
                  <HugeiconsIcon
                    icon={Timer01Icon}
                    size={16}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {POST.read} read
                </span>
              </span>
            </p>
            <h1 className={styles.title}>{POST.title}</h1>
            {/* Placeholder dek: the live post has none. Peggy would write it. */}
            <p className={styles.dek}>
              Seven years of HRT, estrogen face creams, and a GLP-1: what
              changed for my skin between age 52 and 59.
            </p>
            <div className={styles.byline}>
              <a href="/about" className={styles.bylineAuthor}>
                <Image
                  src="/mockup/peggy-portrait.jpg"
                  alt=""
                  width={56}
                  height={56}
                  className={styles.avatar}
                />
                <span className={styles.bylineName}>Peggy B.</span>
              </a>
            </div>
          </div>
          <figure className={styles.heroFigure}>
            <div className={styles.heroImage}>
              <Image
                src={POST.image}
                alt="A woman with blonde hair touching her cheeks while looking in a mirror"
                fill
                sizes="(max-width: 960px) 100vw, 560px"
                preload
              />
            </div>
            <figcaption>
              Many Telehealth HRT Platforms now also offer Skincare for both
              face and body in addition to systemic (whole body) Hormone
              Replacement Therapy Options.{" "}
              <a href="/hrt-price-comparison-chart">
                Telehealth HRT price comparison chart
              </a>
            </figcaption>
          </figure>
        </header>

        <div className={shared.divider} aria-hidden="true" />

        <div className={styles.articleGrid}>
          <div className={styles.body}>
            <aside className={styles.note} aria-label="Personal review note">
              <p>
                <strong>Personal review note:</strong> This post reflects my
                personal experience, individual setup, and skin response over 12
                months. Hormone therapy affects everyone differently depending
                on dosage, delivery method, starting skin baseline, and
                individual biology. Consult a medical provider for personalized
                healthcare advice.
              </p>
            </aside>

            <p>
              This blog is a personal reflection of my seven years on{" "}
              <a href="/copy-of-trusted-providers">
                Menopause Hormone Replacement Therapy.
              </a>{" "}
              For the first five years, I relied solely on systemic, whole-body
              HRT. It all started to troches that melt under your tongue. Then I
              tried topical estrogen/progesterone creams that you rub on your
              inner arms or thighs. Then the infamous estrogen patch +
              progesterone tablets + vaginal cream and then I eventually landed
              on{" "}
              <AffiliateLink clinic={innerBalance} placement="article_inline">
                Oestra by Inner Balance
              </AffiliateLink>
              . It’s my current regimen. It’s one Bioidentical HRT product that
              replaces the three prescription combo that many women are on.
            </p>
            <p>
              Then a few years ago, a telehealth provider I was using introduced
              an estriol face cream, followed by an estrogen-based eye cream.
              Out of curiosity, I decided to opt in—I wanted to see firsthand
              whether topical estrogen face creams could deliver results that
              traditional skincare simply couldn’t match.
            </p>

            <figure className={styles.beforeAfter}>
              <div>
                <Image
                  src="/mockup/posts/skin-before-2018.jpg"
                  alt="Peggy in 2018, age 52, smiling selfie with short blonde hair"
                  width={900}
                  height={1197}
                  sizes="(max-width: 640px) 50vw, 340px"
                />
                <p>
                  <strong>Before</strong> 2018 · Age 52
                </p>
              </div>
              <div>
                <Image
                  src="/mockup/posts/skin-after-2026.jpg"
                  alt="Peggy in 2026, age 59, close-up selfie with shoulder-length blonde hair"
                  width={900}
                  height={1200}
                  sizes="(max-width: 640px) 50vw, 340px"
                />
                <p>
                  <strong>After</strong> 2026 · Age 59
                </p>
              </div>
              <figcaption className={shared.srOnly}>
                Peggy B. in 2018 at age 52, and in 2026 at age 59
              </figcaption>
            </figure>

            <SectionHeading index={0} />
            <p>
              Looking back, HRT wasn’t the only major change I made during this
              period—but it was definitely the catalyst. The{" "}
              <a href="/post/bioidentical-hormone-reviews-my-story">
                positive impact that hormone therapy
              </a>{" "}
              had on my mind, body, and overall well-being helped me feel better
              than I had in years. That renewed energy empowered me to lose 40
              pounds, which you can clearly see in the close-up photos above
              (more on my weight loss journey below).
            </p>
            <p>
              While HRT transformed my skin and energy, it didn’t make much of a
              difference for my hair. So in 2024, I began experimenting with
              alternative hair. Today, I choose to wear a wig every single day.
              While some women find wigs frustrating, I find them empowering. My
              full-time corporate role in sales demands confidence, and since I
              started wearing wigs, my performance numbers have soared. Looking
              good and feeling confident changes how you carry yourself—and
              honestly, people respond to that energy.
            </p>
            <p>
              If you’ve followed my site, you know I’ve tested several online
              telehealth HRT providers over the years. I originally started my
              HRT journey back in December 2019 with a physician I fondly refer
              to as my “diet doc,” and I’ve never looked back. So when these
              same telehealth platforms began offering prescription estrogen
              skincare, I jumped right on board to put those creams to the test.
            </p>

            <OfferCallout clinicName="Musely" code="HTH20">
              Of all of the eye products I’ve tried, this one is my favorite.
              Use HTH20 for 20% off your order.
            </OfferCallout>

            <SectionHeading index={1} />
            <p>
              Looking at my photos today compared to 7 to 10 years ago, I
              honestly feel like I’ve aged in reverse. Combining systemic HRT
              with topical estriol (E3) skincare unlocked a whole new level of
              skin rejuvenation for me.
            </p>
            <p>
              Not every product was a home run, though. When{" "}
              <a href="/alloy-review-page">Alloy</a> released their M4 Estriol
              Eye Cream, I gave it a try, but to be completely candid, I didn’t
              see a noticeable difference. However, when I switched to{" "}
              <AffiliateLink clinic={musely} placement="article_inline">
                Musely’s prescription-grade eye serum
              </AffiliateLink>
              , everything changed. That was the breakthrough moment for
              smoothing out the{" "}
              <a href="/post/musely-eye-serum-review-can-it-fix-menopausal-dark-circles-wrinkles">
                fine lines and crow’s feet
              </a>{" "}
              that naturally creep up as we age.
            </p>

            <OfferCallout clinicName="Joi Women’s Wellness" code="BRONSON">
              Joi Women’s Wellness was who introduced me to GLP-1’s and boy am I
              glad they did. Use coupon code BRONSON for 50% off labs & 15% off
              HRT and GLP-1’s.
            </OfferCallout>

            <SectionHeading index={2} />
            <p>
              Systemic HRT helped me lose nearly 30 pounds, but I won’t pretend
              it was easy. I was constantly battling hunger and pushing through
              strict intermittent fasting schedules. Eventually, my progress
              stalled, leaving me with 10 to 15 stubborn pounds I still wanted
              to drop.
            </p>
            <p>
              That’s when my HRT clinician at{" "}
              <a href="/joiwommenswellness">Joi Women’s Wellness</a> suggested a
              GLP-1. I remember thinking, “Wait, is that something that they
              would agree to write a prescription for?” Combining a GLP-1 with
              HRT turned out to be the ultimate game-changer. While the GLP-1
              unlocked effortless weight loss, hormone therapy and great skin
              care protected my skin and collagen.
            </p>
            <p>
              Pairing HRT with a GLP-1 is honestly one of the best health
              decisions I’ve ever made. The proof is in the data: my recent lab
              work showed an A1C was a 5.0—down from over 7.0 before starting
              the GLP-1.
            </p>

            <SectionHeading index={3} />
            <p>
              Estrogen plays a central role in maintaining skin structure,
              hydration, and overall elasticity. As estrogen levels drop during
              perimenopause and menopause, skin undergoes noticeable
              changes—studies published in the Journal of Clinical and Aesthetic
              Dermatology
              <Ref n={1} /> show that women can lose up to 30% of their skin’s
              dermal collagen in the first five years following menopause, with
              an additional 2.1% loss each year thereafter.
            </p>
            <p>
              Estrogen stimulates collagen production, supports natural
              hyaluronic acid levels, and maintains skin thickness. When
              estrogen declines, the dermal layer thins, moisture retention
              drops, and deep fine lines, dry texture, and loss of firmness
              become much more pronounced.
            </p>
            <p>
              Integrating estrogen back into your routine—whether through
              systemic hormone therapy or targeted topical estriol (E3)
              creams—helps offset this natural drop by directly supporting
              dermal repair mechanisms.
            </p>
            <p>
              Clinical research from the Archives of Dermatology
              <Ref n={2} /> indicates that topical estrogen formulations
              significantly increase collagen synthesis, improve elastic fiber
              structure, and boost skin moisture content without altering
              systemic hormone balances.
            </p>
            <p>
              For women combining whole-body HRT with prescription topical
              creams, this double-pronged approach addresses both the internal
              metabolic shifts of menopause and the localized structural needs
              of the skin, creating a noticeable revitalizing effect on texture,
              plumpness, and hydration over time.
            </p>

            <OfferCallout clinicName="Inner Balance" code="PEGGY10">
              Oestra by Inner Balance is my current go-to for HRT. Use code
              PEGGY10 for 10% off your first order.
            </OfferCallout>

            <SectionHeading index={4} />
            <p>
              Now, I’m not saying any of this to brag—I didn’t invent Estrogen,
              Progesterone, and Testosterone; God did! But I can tell you that
              at least every other week, someone looks at me and says, “There is
              no way you are almost 60.”
            </p>
            <p>
              I’ll be the first to admit I’m not always as consistent as I
              should be with diet and exercise, but I am fiercely diligent about
              three things: my weekly GLP-1 injection, my morning and evening
              skincare routines every single day, and my daily HRT application.
            </p>
            <p>
              For me, this trio has made all the difference, and I’m deeply
              grateful I found them when I did. When I look back at late 2019— I
              felt so unhappy, fat, and insecure—I realize I am a completely
              transformed woman today.
            </p>
            <p>
              Finding the right balance of systemic and topical HRT, GLP-1
              therapy, and my go-to Raquel Welch wig collection didn’t just
              change my appearance; it gave me my life and confidence back.
            </p>

            <section className={styles.sources} aria-labelledby="sources">
              <h2 id="sources">Sources</h2>
              <ol>
                <li id="source-1">
                  <a
                    href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3772914/"
                    rel="noopener noreferrer"
                  >
                    Journal of Clinical and Aesthetic Dermatology
                  </a>{" "}
                  (PubMed Central){" "}
                  <a href="#ref-1" className={styles.backRef}>
                    <span aria-hidden="true">↑</span>
                    <span className={shared.srOnly}>Back to text</span>
                  </a>
                </li>
                <li id="source-2">
                  <a
                    href="https://pubmed.ncbi.nlm.nih.gov/15955089/"
                    rel="noopener noreferrer"
                  >
                    Archives of Dermatology
                  </a>{" "}
                  (PubMed){" "}
                  <a href="#ref-2" className={styles.backRef}>
                    <span aria-hidden="true">↑</span>
                    <span className={shared.srOnly}>Back to text</span>
                  </a>
                </li>
              </ol>
            </section>

            <nav aria-label="Tags" className={styles.tags}>
              <span>Filed under:</span>
              <ul>
                {TAGS.map((tag) => (
                  <li key={tag.href}>
                    <a href={tag.href}>{tag.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <section className={styles.author} aria-labelledby="author-title">
              <Image
                src="/mockup/peggy-portrait.jpg"
                alt=""
                width={96}
                height={96}
                className={styles.authorPhoto}
              />
              <div>
                <h2 id="author-title" className={styles.authorName}>
                  Written by Peggy B.
                </h2>
                <p>
                  An experienced HRT patient reviewer. Not a doctor. I began my
                  own hormone replacement therapy under the care of a medical
                  provider in 2019, and I’ve personally tested more than 9
                  different HRT telehealth providers.
                </p>
                <p className={styles.authorLinks}>
                  <a href="/about">Read my whole story</a>
                  <a href="#">How I review</a>
                </p>
              </div>
            </section>
            <p className={styles.disclosure}>
              Some links in this post are affiliate links.{" "}
              <a href={DISCLOSURE_HREF}>Affiliate disclosure</a>
            </p>
          </div>

          <aside className={styles.rail}>
            <Share />
            <InThisPost sections={SECTIONS} />
            <section aria-labelledby="rail-clinics">
              <p id="rail-clinics" className={styles.railHeading}>
                Clinics
              </p>
              <ul className={styles.mentioned}>
                {MENTIONED.slice(0, RAIL_CLINIC_LIMIT)
                  .map(clinicNamed)
                  .map((clinic) => (
                    <li key={clinic.name}>
                      <ClinicLogo clinic={clinic} className={styles.railLogo} />
                      <a href={clinic.reviewHref}>
                        {clinic.name}
                        <span className={styles.srOnly}> review</span>
                      </a>
                    </li>
                  ))}
              </ul>
              <a href="/hrt-price-comparison-chart" className={styles.railLink}>
                Compare all clinics
              </a>
            </section>
          </aside>
        </div>
      </article>

      <section className={styles.related} aria-labelledby="related-title">
        <div className={shared.sectionHead}>
          <h2 id="related-title">Keep reading</h2>
          <a href="/blog" className={shared.headLink}>
            All posts
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
          </a>
        </div>
        <div className={styles.cardGrid}>
          {RELATED.map((post) => (
            <PostCard
              key={post.href}
              post={post}
              className={styles.card}
              sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 400px"
            />
          ))}
        </div>
      </section>
    </MockupShell>
  );
}
