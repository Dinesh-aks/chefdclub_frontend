const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SequentialValidationStep = {
  isValid: () => boolean;
  message: string;
  focus?: () => void;
};

export function firstSequentialValidationError(
  steps: SequentialValidationStep[],
): SequentialValidationStep | null {
  for (const step of steps) {
    if (!step.isValid()) {
      step.focus?.();
      return step;
    }
  }
  return null;
}

export function isNonEmptyString(value: string | undefined | null): boolean {
  return Boolean(value?.trim());
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}
