import { asText, isFilled, type LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import Image from "next/image";
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  sectionAnchor,
  type SliceSectionFields,
} from "@/components/slice-section";
import styles from "./clinic-comparison.module.css";
import { Tip } from "./tip";

/** One clinic, already read off the Provider document. */
export type ComparisonClinic = {
  name: string;
  /** Visit link. Empty means the name is not a link. */
  href?: string;
  /** Visit opens in a new tab. */
  newTab?: boolean;
  logo?: { src: string };
  monogram?: string;
  tested?: boolean;
  /** Badge text. The star is part of the layout. */
  topChoice?: string;
  bestFor?: string;
  monthlyPrice?: number | null;
  priceNote?: string;
  insurance?: boolean;
  formulation?: string;
  quote?: string;
  note?: string;
  offerCode?: string;
  reviewHref?: string;
};

type ClinicComparisonPrimary = {
  section?: readonly SliceSectionFields[] | null;
  /** `YYYY-MM-DD`. Shown beside "What I paid per month". */
  prices_checked?: string | null;
  button?: LinkField | null;
  disclosure?: LinkField | null;
};

const AFFILIATE_REL = "sponsored nofollow noopener noreferrer";

export function formatCheckedDate(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatMonthly(value: number) {
  const amount = Number.isInteger(value) ? String(value) : value.toFixed(2);
  return `$${amount}`;
}

/** Share of the fullest bar. The highest price in the table is 100. */
export function priceBarWidth(price: number, max: number) {
  if (max <= 0) return 0;
  return Math.min(100, (price / max) * 100);
}

export function maxMonthly(clinics: readonly ComparisonClinic[]) {
  return clinics.reduce((max, clinic) => {
    if (typeof clinic.monthlyPrice !== "number") return max;
    return Math.max(max, clinic.monthlyPrice);
  }, 0);
}

function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function TestedIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      className={styles.testedIcon}
      aria-hidden="true"
    >
      <path
        d="M12 2l2.17 1.89 2.83-.55.94 2.72 2.72.94-.55 2.83L22 12l-1.89 2.17.55 2.83-2.72.94-.94 2.72-2.83-.55L12 22l-2.17-1.89-2.83.55-.94-2.72-2.72-.94.55-2.83L2 12l1.89-2.17-.55-2.83 2.72-.94.94-2.72 2.83.55z"
        fill="currentColor"
      />
      <path
        d="M8.5 12.2l2.4 2.4 4.6-4.8"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InsuranceYesIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      className={styles.insYes}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M7.5 12.3l3 3 6-6.3"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InsuranceNoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={styles.insNo}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" />
    </svg>
  );
}

function TextLink({
  field,
  className,
  chevron = false,
}: {
  field: LinkField | null | undefined;
  className: string;
  chevron?: boolean;
}) {
  if (!field || !isFilled.link(field) || !field.text) return null;

  return (
    <PrismicNextLink field={field} className={className}>
      {field.text}
      {chevron ? <Chevron /> : null}
    </PrismicNextLink>
  );
}

function ClinicName({ clinic }: { clinic: ComparisonClinic }) {
  if (!clinic.href) {
    return <span className={styles.clinicName}>{clinic.name}</span>;
  }

  return (
    <a
      href={clinic.href}
      className={styles.clinicName}
      target={clinic.newTab ? "_blank" : undefined}
      rel={clinic.newTab ? AFFILIATE_REL : undefined}
      data-provider={clinic.name}
      data-placement="homepage_comparison"
    >
      {clinic.name}
      {clinic.newTab ? (
        <span className="sr-only"> (affiliate link, opens in a new tab)</span>
      ) : null}
    </a>
  );
}

function Logo({ clinic }: { clinic: ComparisonClinic }) {
  const image = clinic.logo?.src ? (
    <Image src={clinic.logo.src} alt="" width={46} height={46} />
  ) : (
    <span className={styles.monogram} aria-hidden="true">
      {clinic.monogram || clinic.name.slice(0, 1)}
    </span>
  );

  if (!clinic.href) return <span className={styles.logoTile}>{image}</span>;

  return (
    <a
      href={clinic.href}
      className={styles.logoTile}
      tabIndex={-1}
      aria-hidden="true"
      target={clinic.newTab ? "_blank" : undefined}
      rel={clinic.newTab ? AFFILIATE_REL : undefined}
    >
      {image}
    </a>
  );
}

function Price({ clinic, max }: { clinic: ComparisonClinic; max: number }) {
  if (typeof clinic.monthlyPrice !== "number") return null;
  const width = priceBarWidth(clinic.monthlyPrice, max);

  return (
    <>
      <span className={styles.price}>{formatMonthly(clinic.monthlyPrice)}</span>
      <span className={styles.perMonth}>/mo</span>
      <span className={styles.bar} aria-hidden="true">
        <span className={styles.barFill} style={{ width: `${width}%` }} />
      </span>
      {clinic.priceNote ? (
        <span className={styles.priceNote}>{clinic.priceNote}</span>
      ) : null}
    </>
  );
}

/**
 * Eight clinics, side by side. The columns are fixed. Each row is a clinic,
 * and the price, quote, and coupon are that clinic's own fields.
 */
export function ClinicComparison({
  primary,
  clinics = [],
}: {
  primary: ClinicComparisonPrimary;
  clinics?: readonly ComparisonClinic[];
}) {
  const fields = primary.section?.[0];
  const heading = fields?.heading;
  const slug = sectionAnchor(heading ? asText(heading) : "");
  const titleId = slug ? `${slug}-title` : undefined;
  const checked = formatCheckedDate(primary.prices_checked);
  const rows = clinics.filter((clinic) => clinic.name);
  const max = maxMonthly(rows);

  return (
    <SliceSection
      section={primary.section}
      showHeader={false}
      labelId={titleId}
    >
      <div className={styles.head}>
        <RichText
          field={heading}
          as="h2"
          id={titleId}
          unstyled
          className={styles.heading}
        />
        <RichText
          field={fields?.intro}
          as="p"
          unstyled
          className={styles.intro}
        />
        <TextLink field={primary.button} className={styles.button} />
        <TextLink
          field={primary.disclosure}
          className={styles.disclosure}
          chevron
        />
      </div>

      {rows.length > 0 ? (
        <>
          <p className={styles.scrollHint} aria-hidden="true">
            Swipe to see more →
          </p>
          <div
            className={styles.wrap}
            role="region"
            aria-labelledby={titleId}
            tabIndex={0}
          >
            <table className={styles.table}>
              <caption className="sr-only">
                What each clinic is best for, what Peggy paid per month,
                insurance, typical formulation, and her notes
              </caption>
              <thead>
                <tr>
                  <th scope="col">Clinic</th>
                  <th scope="col">Best for</th>
                  <th scope="col" className={styles.priceHead}>
                    {checked ? (
                      <Tip label={`Checked ${checked}`} describe>
                        What I paid per month
                      </Tip>
                    ) : (
                      "What I paid per month"
                    )}
                  </th>
                  <th scope="col" className={styles.center}>
                    Insurance
                  </th>
                  <th scope="col">Typically prescribed</th>
                  <th scope="col">In my words</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((clinic) => (
                  <tr
                    key={clinic.name}
                    className={clinic.topChoice ? styles.topRow : undefined}
                  >
                    <th scope="row">
                      <span className={styles.clinic}>
                        <span className={styles.logoWrap}>
                          <Logo clinic={clinic} />
                          {clinic.tested ? (
                            <span className={styles.testedSeal}>
                              <Tip label="Tested by Peggy. I was a patient here.">
                                <TestedIcon />
                              </Tip>
                            </span>
                          ) : null}
                        </span>
                        <span>
                          <ClinicName clinic={clinic} />
                          {clinic.topChoice ? (
                            <span className={styles.badge}>
                              ★ {clinic.topChoice.replace(/^★\s*/, "")}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </th>
                    <td>
                      {clinic.bestFor ? (
                        <span className={styles.bestFor}>{clinic.bestFor}</span>
                      ) : null}
                    </td>
                    <td className={styles.priceCell}>
                      <Price clinic={clinic} max={max} />
                    </td>
                    <td className={styles.center}>
                      <Tip
                        label={
                          clinic.insurance
                            ? "Takes insurance"
                            : "Doesn’t take insurance"
                        }
                      >
                        {clinic.insurance ? (
                          <InsuranceYesIcon />
                        ) : (
                          <InsuranceNoIcon />
                        )}
                      </Tip>
                    </td>
                    <td className={styles.formulation}>{clinic.formulation}</td>
                    <td className={styles.noteCell}>
                      {clinic.quote ? (
                        <q className={styles.quote}>{clinic.quote}</q>
                      ) : null}
                      {clinic.note ? (
                        <span className={styles.note}>{clinic.note}</span>
                      ) : null}
                      {clinic.offerCode ? (
                        <span className={styles.offer}>
                          Code {clinic.offerCode}
                        </span>
                      ) : null}
                      {clinic.reviewHref ? (
                        <a href={clinic.reviewHref} className={styles.review}>
                          Read review
                          <Chevron />
                          <span className="sr-only"> of {clinic.name}</span>
                        </a>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </SliceSection>
  );
}

export default ClinicComparison;
