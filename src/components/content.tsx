import type { RichTextField } from "@prismicio/client";
import Image from "next/image";
import { visitLinkProps } from "@/lib/affiliate-link";
import { PeggyTip } from "./peggy-tip";
import {
  contentPieces,
  type TokenClinic,
  type TokenPart,
} from "./content-blocks";
import styles from "./content.module.css";
import { RichText } from "./rich-text";

function money(value: number) {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

function findClinic(clinics: readonly TokenClinic[] | undefined, uid: string) {
  return clinics?.find((clinic) => clinic.uid === uid);
}

function Offer({
  clinic,
  sentence,
}: {
  clinic: TokenClinic;
  sentence: string;
}) {
  const line = sentence || clinic.offerCopy || "";

  return (
    <aside className={styles.offer}>
      <div className={styles.offerBrand}>
        {clinic.logo?.src ? (
          <span className={styles.logo}>
            <Image src={clinic.logo.src} alt="" width={44} height={44} />
          </span>
        ) : null}
        {clinic.visitHref ? (
          <a
            href={clinic.visitHref}
            className={styles.offerName}
            {...visitLinkProps(clinic.name, "story_offer")}
          >
            {clinic.name}
            <span className="sr-only">
              {" "}
              (affiliate link, opens in a new tab)
            </span>
          </a>
        ) : (
          <span className={styles.offerName}>{clinic.name}</span>
        )}
      </div>
      {line ? <p className={styles.offerLine}>{line}</p> : null}
      {clinic.offerCode ? (
        <p className={styles.code}>Code {clinic.offerCode}</p>
      ) : null}
    </aside>
  );
}

function Facts({ clinic }: { clinic: TokenClinic }) {
  const oneTime = clinic.priceUnit === "One time";
  const product = clinic.kind === "Product";
  const rows = [
    typeof clinic.monthlyPrice === "number"
      ? oneTime
        ? ["What I paid", money(clinic.monthlyPrice)]
        : ["What I paid per month", `${money(clinic.monthlyPrice)}/mo`]
      : null,
    clinic.priceNote ? ["Price note", clinic.priceNote] : null,
    product
      ? null
      : clinic.insurance === true
        ? ["Insurance", "Takes insurance"]
        : clinic.insurance === false
          ? ["Insurance", "Doesn’t take insurance"]
          : null,
    clinic.formulation ? ["Typically prescribed", clinic.formulation] : null,
  ].filter((row): row is [string, string] => row !== null);

  return (
    <aside className={styles.facts} aria-label={clinic.name}>
      <p className={styles.factsName}>{clinic.name}</p>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

function Token({
  part,
  clinic,
  sentence,
  missing,
}: {
  part: TokenPart;
  clinic: TokenClinic | undefined;
  sentence: string;
  missing: string | null;
}) {
  return (
    <>
      {missing ? <p className={styles.missing}>{missing}</p> : null}
      {clinic && part === "offer" ? (
        <Offer clinic={clinic} sentence={sentence} />
      ) : null}
      {clinic && part === "facts" ? (
        <>
          <Facts clinic={clinic} />
          {sentence ? <p>{sentence}</p> : null}
        </>
      ) : null}
      {!clinic && sentence ? <p>{sentence}</p> : null}
    </>
  );
}

/**
 * Content rich text. Highlight and superscript style words. A Signoff or
 * Note label on a whole paragraph becomes the closing line or the tint box.
 * A paragraph can start with a clinic token or {{tip}}.
 */
export function Content({
  field,
  clinics,
  tokens = "public",
  align = "start",
}: {
  field: RichTextField | null | undefined;
  clinics?: readonly TokenClinic[];
  /** Preview names a missing clinic. The public page drops the token. */
  tokens?: "preview" | "public";
  /** Centered centers the writing. Cards and lists stay in their own blocks. */
  align?: "start" | "center";
}) {
  const pieces = contentPieces(field);
  if (!pieces.length) return null;

  return (
    <div
      className={styles.body}
      data-align={align === "center" ? "center" : undefined}
    >
      {pieces.map((piece, index) => {
        if (
          piece.kind === "rich" ||
          piece.kind === "signoff" ||
          piece.kind === "note"
        ) {
          return (
            <div
              key={index}
              className={piece.kind === "rich" ? undefined : styles[piece.kind]}
            >
              <RichText field={piece.field} />
            </div>
          );
        }

        if (piece.kind === "tip") {
          return (
            <PeggyTip key={index} place="story">
              <RichText field={piece.field} />
            </PeggyTip>
          );
        }

        const clinic = findClinic(clinics, piece.uid);
        const missing =
          !clinic && tokens === "preview"
            ? `No clinic with id ${piece.uid}.`
            : null;

        return (
          <Token
            key={index}
            part={piece.part}
            clinic={clinic}
            sentence={piece.sentence}
            missing={missing}
          />
        );
      })}
    </div>
  );
}
