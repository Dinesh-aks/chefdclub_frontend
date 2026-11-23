"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRightIcon } from "lucide-react";
import type { Value as PhoneValue } from "react-phone-number-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "@/components/shared/FieldLabel";
import { PhoneField } from "@/components/shared/PhoneField";
import { ThankYouDialog } from "@/components/shared/ThankYouDialog";
import {
  TurnstileField,
  type TurnstileFieldHandle,
} from "@/components/shared/TurnstileField";
import { isTurnstileRequired, turnstileUserMessages } from "@/config/turnstile";
import { ApiError } from "@/lib/api/core/client";
import { submitContactMessage } from "@/lib/api/contact";
import {
  firstSequentialValidationError,
  isNonEmptyString,
  isValidEmail,
} from "@/lib/validation/sequential";

export function ContactForm() {
  const [phone, setPhone] = useState<PhoneValue>();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const [turnstileNotice, setTurnstileNotice] = useState("");
  const turnstileRef = useRef<TurnstileFieldHandle>(null);

  function handleTurnstileToken(token: string | undefined) {
    setTurnstileToken(token);
    if (token) {
      setTurnstileNotice("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const form = event.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const messageInput = form.elements.namedItem("message") as HTMLTextAreaElement;
    const phoneInput = form.querySelector<HTMLInputElement>("#contact-phone");

    const validationError = firstSequentialValidationError([
      {
        isValid: () => isNonEmptyString(nameInput?.value),
        message: "Please enter your name.",
        focus: () => nameInput?.focus(),
      },
      {
        isValid: () => isNonEmptyString(emailInput?.value),
        message: "Please enter your email address.",
        focus: () => emailInput?.focus(),
      },
      {
        isValid: () => isValidEmail(emailInput?.value ?? ""),
        message: "Please enter a valid email address.",
        focus: () => emailInput?.focus(),
      },
      {
        isValid: () => isNonEmptyString(phone),
        message: "Please enter your phone or WhatsApp number.",
        focus: () => phoneInput?.focus(),
      },
      {
        isValid: () => isNonEmptyString(messageInput?.value),
        message: "Please enter your message.",
        focus: () => messageInput?.focus(),
      },
      {
        isValid: () => !isTurnstileRequired("contact") || isNonEmptyString(turnstileToken),
        message: turnstileNotice || turnstileUserMessages.incomplete,
      },
    ]);

    if (validationError) {
      setStatus("error");
      setErrorMessage(validationError.message);
      return;
    }

    setStatus("loading");

    const data = new FormData(form);

    try {
      const response = await submitContactMessage({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        mobile: phone!,
        subject: String(data.get("subject") ?? "") || undefined,
        message: String(data.get("message") ?? ""),
        turnstileToken,
      });
      setStatus("idle");
      setThankYouMessage(response.message);
      setThankYouOpen(true);
      form.reset();
      setPhone(undefined);
      turnstileRef.current?.reset();
      setTurnstileNotice("");
    } catch (error) {
      setStatus("error");
      turnstileRef.current?.reset();
      const apiMessage = error instanceof ApiError ? error.message : "";
      const isTurnstileReject =
        apiMessage.toLowerCase().includes("security") ||
        apiMessage.toLowerCase().includes("verification");
      setErrorMessage(
        isTurnstileReject ? turnstileUserMessages.submitFailed : apiMessage || "Something went wrong. Please try again.",
      );
      if (isTurnstileReject) {
        setTurnstileNotice("");
      }
    }
  }

  return (
    <>
      <form className="space-y-8" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="contact-name" required>
              Name
            </FieldLabel>
            <Input id="contact-name" name="name" placeholder="Your name" required autoComplete="name" />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="contact-email" required>
              Email
            </FieldLabel>
            <Input
              id="contact-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <PhoneField
            id="contact-phone"
            className="sm:col-span-2"
            value={phone}
            onChange={setPhone}
            requiredMark
          />
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
          <Input
            id="contact-subject"
            name="subject"
            placeholder="Corporate dinner in November"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="contact-message" required>
            Message
          </FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            placeholder="Tell us what you have in mind."
            required
          />
        </div>

        <TurnstileField
          ref={turnstileRef}
          form="contact"
          onTokenChange={handleTurnstileToken}
          onWidgetError={() => {
            setStatus("error");
            setTurnstileNotice(turnstileUserMessages.widgetFailed);
          }}
          onWidgetExpire={() => {
            setStatus("error");
            setTurnstileNotice(turnstileUserMessages.expired);
          }}
        />

        {errorMessage || turnstileNotice ? (
          <p className="text-sm text-destructive" role="alert">
            {errorMessage || turnstileNotice}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="group h-11 px-6 text-xs"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending…" : "Send message"}
          <ArrowRightIcon
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          />
        </Button>
      </form>

      <ThankYouDialog
        open={thankYouOpen}
        onOpenChange={setThankYouOpen}
        description={thankYouMessage}
      />
    </>
  );
}
