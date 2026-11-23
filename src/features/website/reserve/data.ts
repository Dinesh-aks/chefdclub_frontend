export interface SelectOption {
  value: string;
  label: string;
}

export const formatOptions: SelectOption[] = [
  { value: "home-dining", label: "Home Dining (Chef's home)" },
  { value: "private-dining-your-home", label: "Private Dining at your home" },
  { value: "canape-catering", label: "Canapé Catering" },
  { value: "corporate", label: "Corporate Event" },
  { value: "private-dining-space", label: "Private Dining Space" },
  { value: "others", label: "Others" },
];

export const menuOptions: SelectOption[] = [
  { value: "non-vegetarian", label: "Non-vegetarian (from SGD 120++)" },
  { value: "vegetarian", label: "Vegetarian (from SGD 80++)" },
  { value: "mixed", label: "Mixed table" },
  { value: "halal", label: "100% halal" },
];

export const winePairingOptions: SelectOption[] = [
  { value: "please-advise", label: "Please advise" },
  { value: "yes", label: "Yes, please" },
  { value: "no", label: "No, thank you" },
];

export interface BeforeYouBookItem {
  label: string;
  value: string;
}

export const beforeYouBook: BeforeYouBookItem[] = [
  { label: "Days", value: "Weekends. Exceptions on best efforts." },
  { label: "Courses", value: "Minimum four; five available." },
  {
    label: "Pricing",
    value: "Vegetarian from SGD 80++, non-vegetarian from SGD 120++ per person.",
  },
  { label: "Dietary", value: "Halal, vegetarian, allergies — all accommodated." },
  { label: "Where", value: "Chef's home at Keppel Bay, or yours." },
];
