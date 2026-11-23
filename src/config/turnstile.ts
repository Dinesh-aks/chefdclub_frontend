export const turnstileSiteKeys = {
  contact: process.env.NEXT_PUBLIC_TURNSTILE_CONTACT_SITE_KEY ?? "",
  reservation: process.env.NEXT_PUBLIC_TURNSTILE_RESERVATION_SITE_KEY ?? "",
} as const;

export function isTurnstileRequired(form: keyof typeof turnstileSiteKeys): boolean {
  return turnstileSiteKeys[form].length > 0;
}

/** Shown above the submit button when Turnstile fails or needs another attempt. */
export const turnstileUserMessages = {
  incomplete: "Please complete the security check before sending.",
  widgetFailed:
    "Security check could not load. Refresh the page, allow this site in your ad blocker, or try another browser. You can also contact us by phone or email on this page.",
  expired: "Security check expired. Please complete it again before sending.",
  submitFailed:
    "Security verification failed. Complete the check again, then resubmit your message.",
  reservationSubmitFailed:
    "Security verification failed. Complete the check again, then resubmit your request.",
} as const;
