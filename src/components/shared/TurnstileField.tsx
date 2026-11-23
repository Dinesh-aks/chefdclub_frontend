"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { isTurnstileRequired, turnstileSiteKeys } from "@/config/turnstile";

export type TurnstileFieldHandle = {
  reset: () => void;
};

type TurnstileForm = "contact" | "reservation";

type TurnstileFieldProps = {
  form: TurnstileForm;
  onTokenChange: (token: string | undefined) => void;
  onWidgetError?: () => void;
  onWidgetExpire?: () => void;
};

export const TurnstileField = forwardRef<TurnstileFieldHandle, TurnstileFieldProps>(
  function TurnstileField({ form, onTokenChange, onWidgetError, onWidgetExpire }, ref) {
    const turnstileRef = useRef<TurnstileInstance | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        onTokenChange(undefined);
        turnstileRef.current?.reset();
      },
    }));

    if (!isTurnstileRequired(form)) {
      return null;
    }

    return (
      <div className="min-h-[65px]">
        <Turnstile
          ref={turnstileRef}
          siteKey={turnstileSiteKeys[form]}
          options={{ theme: "auto", size: "flexible" }}
          onSuccess={(token) => onTokenChange(token)}
          onExpire={() => {
            onTokenChange(undefined);
            onWidgetExpire?.();
          }}
          onError={() => {
            onTokenChange(undefined);
            onWidgetError?.();
          }}
        />
      </div>
    );
  },
);
