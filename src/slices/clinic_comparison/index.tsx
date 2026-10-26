import { asText, isFilled, type LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import Image from "next/image";
import { RichText } from "@/components/rich-text";
import {
  SliceSection,
  sectionAnchor,
  type SliceSectionFields,
} from "@/components/slice-section";
import { AFFILIATE_REL, visitLinkProps } from "@/lib/affiliate-link";
import styles from "./clinic-comparison.module.css";
import { Tip } from "./tip";

/** One clinic, already read off the Provider document. */
export type ComparisonClinic = {
  name: string;
  /** Visit link. Empty means the name is not a link. */
  href?: string;
  logo?: { src: string };
  monogram?: string;
  /** Badge text. The star is part of the layout. */
  topChoice?: string;
  shortDescription?: string;
  monthlyPrice?: number | null;
  priceNote?: string;
  insurance?: boolean;
  formulation?: string;
  quote?: string;
  note?: string;
  offerCode?: string;
  reviewHref?: string;
};

/** One row on the Chart variation. The cells are what Peggy types. */
export type ChartRow = {
  name: string;
  paid?: string;
  included?: string;
  code?: string;
  monogram?: string;
};

export function chartRows(
  rows: readonly {
    name?: string | null;
    paid?: string | null;
    included?: string | null;
    code?: string | null;
  }[],
): ChartRow[] {
  return rows.flatMap((row) => {
    const name = row.name?.trim() ?? "";
    if (!name) return [];
    return [
      {
        name,
        paid: row.paid?.trim() || undefined,
        included: row.included?.trim() || undefined,
        code: row.code?.trim() || undefined,
      },
    ];
  });
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

type ClinicComparisonPrimary = Partial<SliceSectionFields> & {
  /** `YYYY-MM-DD`. Shown beside "What I paid per month". */
  prices_checked?: string | null;
  button?: LinkField | null;
  disclosure?: LinkField | null;
};

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
      {...visitLinkProps(clinic.name, "homepage_comparison")}
    >
      {clinic.name}
      <span className="sr-only"> (affiliate link, opens in a new tab)</span>
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
      target="_blank"
      rel={AFFILIATE_REL}
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

function ChartTable({
  rows,
  titleId,
}: {
  rows: readonly ChartRow[];
  titleId?: string;
}) {
  return (
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
            What Peggy paid, what was included, and her code
          </caption>
          <thead>
            <tr>
              <th scope="col">Clinic</th>
              <th scope="col">What I paid</th>
              <th scope="col">What’s included</th>
              <th scope="col">My code</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <th scope="row">
                  <span className={styles.clinic}>
                    <span className={styles.logoWrap}>
                      <span className={styles.logoTile}>
                        <span className={styles.monogram}>
                          {row.monogram || initials(row.name)}
                        </span>
                      </span>
                    </span>
                    <span>
                      <span className={styles.clinicName}>{row.name}</span>
                    </span>
                  </span>
                </th>
                <td>{row.paid}</td>
                <td>{row.included}</td>
                <td>{row.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/**
 * Eight clinics, side by side. The columns are fixed. Each row is a clinic,
 * and the price, quote, and coupon are that clinic's own fields. Chart is
 * the same table with Clinic, What I paid, What’s included, and My code.
 */
export function ClinicComparison({
  primary,
  clinics = [],
  rows,
}: {
  primary: ClinicComparisonPrimary;
  clinics?: readonly ComparisonClinic[];
  /** Chart variation. The cells are typed on the slice. */
  rows?: readonly ChartRow[];
}) {
  const heading = primary.heading;
  const slug = sectionAnchor(heading ? asText(heading) : "");
  const titleId = slug ? `${slug}-title` : undefined;
  const checked = formatCheckedDate(primary.prices_checked);
  const clinicRows = clinics.filter((clinic) => clinic.name);
  const max = maxMonthly(clinicRows);

  return (
    <SliceSection section={primary} showHeader={false} labelId={titleId}>
      <div className={styles.head}>
        <RichText
          field={heading}
          as="h2"
          id={titleId}
          unstyled
          className={styles.heading}
        />
        <RichText
          field={primary.intro}
          as="p"
          unstyled
          className={styles.intro}
        />
        {rows ? null : (
          <TextLink field={primary.button} className={styles.button} />
        )}
        {rows ? null : (
          <TextLink
            field={primary.disclosure}
            className={styles.disclosure}
            chevron
          />
        )}
      </div>

      {rows ? (
        <ChartTable rows={rows} titleId={titleId} />
      ) : clinicRows.length > 0 ? (
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
                A short description of each clinic, what Peggy paid per month,
                insurance, typical formulation, and her notes
              </caption>
              <thead>
                <tr>
                  <th scope="col">Clinic</th>
                  <th scope="col">Description</th>
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
                {clinicRows.map((clinic) => (
                  <tr
                    key={clinic.name}
                    className={clinic.topChoice ? styles.topRow : undefined}
                  >
                    <th scope="row">
                      <span className={styles.clinic}>
                        <span className={styles.logoWrap}>
                          <Logo clinic={clinic} />
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
                      {clinic.shortDescription ? (
                        <span className={styles.description}>
                          {clinic.shortDescription}
                        </span>
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
