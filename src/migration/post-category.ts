/** Peggy's Wix category label → the post Category select. */
export const WIX_CATEGORY_LABELS: Record<string, string> = {
  "Telehealth BHRT Brand Reviews": "Telehealth brand reviews",
  "Formulations & Dosages": "Formulations & dosages",
  "My Experience & Results": "My experience & results",
  "Testing, Labs & Tracking": "Testing, labs & tracking",
  "Cost, Insurance & Access": "Cost, insurance & access",
};

export function categoryFromWix(label: string): string | undefined {
  return WIX_CATEGORY_LABELS[label];
}
