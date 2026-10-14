import {
  Appointment01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CreditCardIcon,
  Globe02Icon,
  Medicine02Icon,
  TestTube01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { asText, type LinkField } from "@prismicio/client";
import type { BrandKind } from "@/components/content-blocks";
import {
  SliceSection,
  type SliceSectionFields,
} from "@/components/slice-section";
import styles from "./clinic-facts.module.css";

/** The Brand fields this slice shows. The page reads them off the Brand. */
export type FactsClinic = {
  name: string;
  kind?: BrandKind;
  availability?: string;
  formulation?: string;
  labs?: string;
  insurance?: boolean;
  hsaFsa?: boolean;
  gettingStarted?: string;
  steps?: { title?: string; text?: string }[];
  specialties?: string[];
};

type ClinicFactsPrimary = Partial<SliceSectionFields> & {
  clinic?: LinkField | null;
};

type Fact = { label: string; value: string; icon: IconSvgElement };

/**
 * The fact cards, in a fixed order. An empty fact is left out. A product
 * has no insurance card. HSA / FSA shows only when it is on, because an
 * unset switch reads as off.
 */
export function clinicFacts(clinic: FactsClinic): Fact[] {
  const facts: (Fact | null)[] = [
    clinic.availability
      ? {
          label: "Availability",
          value: clinic.availability,
          icon: Globe02Icon,
        }
      : null,
    clinic.formulation
      ? {
          label: "Typically prescribed",
          value: clinic.formulation,
          icon: Medicine02Icon,
        }
      : null,
    clinic.labs
      ? { label: "Pre-testing", value: clinic.labs, icon: TestTube01Icon }
      : null,
    clinic.kind !== "Product" && typeof clinic.insurance === "boolean"
      ? {
          label: "Insurance",
          value: clinic.insurance ? "Accepted" : "Not accepted",
          icon: clinic.insurance ? CheckmarkCircle02Icon : Cancel01Icon,
        }
      : null,
    clinic.hsaFsa === true
      ? { label: "HSA / FSA", value: "Yes", icon: CreditCardIcon }
      : null,
    clinic.gettingStarted
      ? {
          label: "To get started",
          value: clinic.gettingStarted,
          icon: Appointment01Icon,
        }
      : null,
  ];
  return facts.filter((fact): fact is Fact => fact !== null);
}

function Icon({ icon, size }: { icon: IconSvgElement; size: number }) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={1.75}
      aria-hidden="true"
    />
  );
}

/**
 * A clinic's fact sheet: the fact cards, How it works, and the
 * specialties. Everything comes from the Brand.
 */
export function ClinicFacts({
  primary,
  clinic,
}: {
  primary: ClinicFactsPrimary;
  clinic?: FactsClinic | null;
}) {
  const facts = clinic ? clinicFacts(clinic) : [];
  const steps = (clinic?.steps ?? []).filter((step) => step.title || step.text);
  const specialties = clinic?.specialties ?? [];
  const Part = asText(primary.heading ?? []).trim() ? "h3" : "h2";

  return (
    <SliceSection section={primary}>
      {facts.length ? (
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt>
                <span className={styles.icon}>
                  <Icon icon={fact.icon} size={20} />
                </span>
                {fact.label}
              </dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {steps.length ? (
        <div className={styles.part}>
          <Part className={styles.partTitle}>How it works</Part>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={index}>
                <span className={styles.number} aria-hidden="true">
                  {index + 1}
                </span>
                {step.title ? (
                  <p className={styles.stepTitle}>{step.title}</p>
                ) : null}
                {step.text ? <p>{step.text}</p> : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {specialties.length ? (
        <div className={styles.part}>
          <Part className={styles.partTitle}>Specialties they list</Part>
          <ul className={styles.pills}>
            {specialties.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </SliceSection>
  );
}

export default ClinicFacts;
