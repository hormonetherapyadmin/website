import type { Metadata } from "next";
import type { ImageField, LinkField, RichTextField } from "@prismicio/client";
import { BrandPromo } from "@/slices/BrandPromo";
import { Buttons } from "@/slices/Buttons";
import { ClinicFacts } from "@/slices/ClinicFacts";
import { Divider } from "@/slices/divider";
import { Hero } from "@/slices/hero";
import { MockupShell } from "../_shared/mockup-shell";
import { Reason } from "../proposed/reason";
import styles from "../proposed/proposed.module.css";

export const metadata: Metadata = {
  title: "HRT Doctors",
  robots: { index: false, follow: false },
};

const rich = (value: string) =>
  [{ type: "paragraph", text: value, spans: [] }] as RichTextField;

const emptyImage = {
  id: "",
  url: "",
  alt: null,
  copyright: null,
  dimensions: { width: 0, height: 0 },
  edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
} as ImageField;

const VISIT =
  "https://shareasale.com/r.cfm?b=2245796&u=4098145&m=135949&urllink=&afftrack=";

const visit = {
  link_type: "Web",
  url: VISIT,
  target: "_blank",
} as LinkField;

export default async function HrtDoctorsMockup(
  props: PageProps<"/mockup/hrt-doctors">,
) {
  const searchParams = await props.searchParams;

  return (
    <MockupShell searchParams={searchParams}>
      <Reason heading="h2" title="HRT Doctors">
        <p>
          This is not a new slice. Provider hero is the top of a clinic page.
          Brand promo is the card on Trusted providers. Both read the name, the
          price, the formulation, and the visit off the brand. Clinic facts
          still holds the states, the steps, and the specialties, because
          neither of those has those lists. There is no logo and no product
          photo yet, so those spots stay empty. The visit button is the
          ShareASale address on the Wix page. The price is the $229 a month
          written there.
        </p>
      </Reason>
      <div className={styles.choice}>
        <h2>Provider hero</h2>
        <p>The clinic page. Voted line, price, and visit, then Clinic facts.</p>
      </div>
      <Hero
        variation="provider"
        primary={{
          small_heading: rich("Voted Best For:"),
          voted: rich("Mobile Platform for Patient Portal"),
          quote: [],
          links: [],
          product: emptyImage,
          background: "Transparent",
          space_above: "Medium",
          space_below: "Medium",
          clinic: {
            data: {
              name: "HRT Doctors Group",
              formulation: "Bioidentical Hormone Therapy",
              monthly_price: 229,
              price_note: "Start any time and Stop anytime",
              visit,
            },
          },
        }}
      />
      <Divider
        primary={{
          line: "Squiggly",
          color: "Accent",
          background: "Transparent",
          space_above: "Medium",
          space_below: "None",
        }}
      />
      <ClinicFacts
        primary={{
          heading: rich("The facts"),
          background: "Transparent",
          space_above: "Large",
          space_below: "None",
        }}
        clinic={{
          name: "HRT Doctors Group",
          availability:
            "38 states. Not in CA, AK, ND, WY, WA, OK, AR, AL, NY, ME or HI.",
          formulation: "Creams, Patches and Gels",
          labs: "Yes. Hormonal Imbalance Blood Test, Comprehensive Lab Panel, at Quest Diagnostics. ($375 Value) for $89.95.",
          insurance: false,
          hsaFsa: true,
          steps: [
            {
              title:
                "Sign Up and pay for your initial Blood Test, Comprehensive Panel to be completed at a Quest Lab - $89.95.",
            },
            { title: "Complete Medical History" },
            { title: "Complete Blood Test a Quest Lab near you" },
            {
              title:
                "In-depth Hormone Consultation and Blood Work Assessment by a US Board Certified HRT Physician",
            },
            { title: "Home Treatment and Continued Care" },
          ],
          specialties: [
            "HRT for Women",
            "HRT for Menopause",
            "HRT for Post Menopausal",
            "BHRT for Women",
            "Natural BHRT",
          ],
          visitHref: VISIT,
          visitText: "Visit HRT Doctors",
        }}
      />
      <Buttons
        primary={{
          heading: rich("Trusted Providers"),
          background: "Transparent",
          space_above: "Large",
          space_below: "Large",
          layout: "Centered",
          button: [
            {
              link_type: "Web",
              url: "/trusted-providers",
              text: "Trusted HRT Docs/Clinics - Start my Journey",
              variant: "Solid",
            } as LinkField,
          ],
        }}
      />
      <div className={styles.choice}>
        <h2>Brand promo</h2>
        <p>
          The same brand as a card. No product photo, so the card is the price,
          the formulation, and the visit.
        </p>
      </div>
      <BrandPromo
        last
        primary={{
          small_heading: [],
          heading: [],
          intro: [],
          background: "Transparent",
          space_above: "Medium",
          space_below: "Large",
          first: false,
          overwrite: [
            {
              small_heading: rich("Voted Best For:"),
              intro: rich("Mobile Platform for Patient Portal"),
              style: "Card",
            },
          ],
        }}
        clinic={{
          uid: "hrt-doctors",
          name: "HRT Doctors Group",
          visitHref: VISIT,
          visitText: "Visit HRT Doctors Group",
          monthlyPrice: 229,
          priceNote: "Start any time and Stop anytime",
          insurance: false,
          formulation: "Bioidentical Hormone Therapy",
        }}
      />
    </MockupShell>
  );
}
