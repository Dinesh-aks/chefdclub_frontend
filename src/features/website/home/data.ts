export interface StatItem {
  value: string;
  label: string;
}

export const heroStats: StatItem[] = [
  { value: "4–5 courses", label: "Every sitting" },
  { value: "From SGD 80++", label: "Per person, vegetarian" },
  { value: "100% halal", label: "Available on request" },
];

export interface PressLogo {
  name: string;
  src: string;
  width: number;
  height: number;
}

export const pressLogos: PressLogo[] = [
  { name: "Channel 8", src: "/images/brand/ch-8-logo.png", width: 360, height: 353 },
  { name: "CNA 938", src: "/images/brand/cna938-logo.jpeg", width: 370, height: 180 },
  { name: "Epicure", src: "/images/brand/epicure-logo.png", width: 2347, height: 757 },
];

export interface SpotlightDish {
  title: string;
  tag: string;
  /** Small tracked label pinned to the top-left corner of the photo. */
  badge?: string;
  /** Omit while real photography isn't available yet — CaptionedImage falls back to a placeholder. */
  src?: string;
}

export interface DiningFormat {
  name: string;
  title: string;
  description: string;
  action: string;
}

export const diningFormats: DiningFormat[] = [
  {
    name: "Chef's home",
    title: "Home Dining at Keppel Bay",
    description:
      "An intimate table in the chef's own residence. The closest thing to a private restaurant, minus the restaurant.",
    action: "Reserve",
  },
  {
    name: "Chef for hire",
    title: "Private Dining at Yours",
    description:
      "We bring the kitchen to you. Multi-course tasting menus cooked and plated in your home, condo or villa.",
    action: "Reserve",
  },
  {
    name: "Cocktails",
    title: "Canapé Catering",
    description:
      "Standing receptions with bite-sized versions of our signatures — plus the emulsions we're known for.",
    action: "Enquire",
  },
  {
    name: "Business",
    title: "Corporate Events",
    description:
      "Client dinners, leadership off-sites and celebrations, with 100% halal menus available on request.",
    action: "Enquire",
  },
];

export interface CourseStep {
  order: string;
  title: string;
  description: string;
}

export const courseStructure: CourseStep[] = [
  {
    order: "First",
    title: "A hearty appetiser",
    description:
      "Something to announce the evening — often a house emulsion, always a conversation.",
  },
  {
    order: "Second",
    title: "An entrée",
    description: "Usually a pure protein, cooked with a single technique done properly.",
  },
  {
    order: "Third",
    title: "The main course",
    description:
      "Served with rice and vegetables; the point where Modern Indian meets the rest of the world.",
  },
  {
    order: "Last",
    title: "A dessert to finish",
    description:
      "Dark chocolate mousse with Brazil-nut butter, or mango panna cotta with pistachio crumble.",
  },
];

export const galleryHighlights: SpotlightDish[] = [
  {
    title: "Layered baked cod & prawn biryani",
    tag: "Non-vegetarian",
    src: "/images/home/layered_baked_cod_and_prawn_biryani.png",
  },
  {
    title: "Green masala biryani, signature smoked",
    tag: "Vegetarian",
    src: "/images/home/green_masala_biryani.png",
  },
  {
    title: "Pan-fried salmon, lemon butter",
    tag: "Non-vegetarian",
    src: "/images/home/pan-fried_salmon_lemon_butter.png",
  },
  {
    title: "Mango panna cotta, pistachio crumble",
    tag: "Dessert",
    src: "/images/home/mango_panna_cotta_pistachio_crumble.png",
  },
];

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export const howItWorks: HowItWorksStep[] = [
  {
    step: "I",
    title: "Tell us the occasion",
    description:
      "Date, number of guests, the format you'd like, and anything the table can't or won't eat. We reply within two business days.",
  },
  {
    step: "II",
    title: "We write your menu",
    description:
      "A bespoke four- or five-course menu, vegetarian or non-vegetarian, with optional wine pairing. Revised until it's right.",
  },
  {
    step: "III",
    title: "We cook, plate and host",
    description:
      "At Keppel Bay or in your home. You sit down; everything else is handled — including the kitchen afterwards.",
  },
];
