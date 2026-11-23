"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRightIcon } from "lucide-react";
import type { Value as PhoneValue } from "react-phone-number-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/shared/FieldLabel";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimeField } from "@/components/shared/DateTimeField";
import { PhoneField } from "@/components/shared/PhoneField";
import { ThankYouDialog } from "@/components/shared/ThankYouDialog";
import {
  TurnstileField,
  type TurnstileFieldHandle,
} from "@/components/shared/TurnstileField";
import { isTurnstileRequired, turnstileUserMessages } from "@/config/turnstile";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import {
  beforeYouBook,
  formatOptions,
  menuOptions,
  winePairingOptions,
} from "@/features/website/reserve/data";
import { siteConfig } from "@/config/site";
import { ApiError } from "@/lib/api/core/client";
import { submitReservationRequest } from "@/lib/api/reservations";
import {
  firstSequentialValidationError,
  isNonEmptyString,
  isValidEmail,
} from "@/lib/validation/sequential";

export function ReservationForm() {
  const [phone, setPhone] = useState<PhoneValue>();
  const [preferredDateTime, setPreferredDateTime] = useState<Date>();
  const [format, setFormat] = useState<string>("");
  const [menu, setMenu] = useState<string>("");
  const [winePairing, setWinePairing] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [feedback, setFeedback] = useState<string>("");
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
    setFeedback("");

    const form = event.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const guestsInput = form.elements.namedItem("guests") as HTMLInputElement;

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
        focus: () => document.querySelector<HTMLInputElement>("#reserve-phone")?.focus(),
      },
      {
        isValid: () => preferredDateTime !== undefined,
        message: "Please choose a preferred date and time.",
        focus: () => document.getElementById("preferred-date")?.focus(),
      },
      {
        isValid: () =>
          preferredDateTime !== undefined && preferredDateTime.getTime() > Date.now(),
        message: "Preferred date and time must be in the future.",
        focus: () => document.getElementById("preferred-date")?.focus(),
      },
      {
        isValid: () => isNonEmptyString(format),
        message: "Please select a format.",
        focus: () => document.getElementById("format")?.focus(),
      },
      {
        isValid: () => {
          const guestCount = Number.parseInt(guestsInput?.value ?? "", 10);
          return Number.isInteger(guestCount) && guestCount >= 1;
        },
        message: "Please enter a valid number of guests.",
        focus: () => guestsInput?.focus(),
      },
      {
        isValid: () => isNonEmptyString(menu),
        message: "Please select a menu.",
        focus: () => document.getElementById("menu")?.focus(),
      },
      {
        isValid: () => isNonEmptyString(winePairing),
        message: "Please select a wine pairing option.",
        focus: () => document.getElementById("wine-pairing")?.focus(),
      },
      {
        isValid: () => !isTurnstileRequired("reservation") || isNonEmptyString(turnstileToken),
        message: turnstileNotice || turnstileUserMessages.incomplete,
      },
    ]);

    if (validationError) {
      setStatus("error");
      setFeedback(validationError.message);
      return;
    }

    setStatus("loading");

    const data = new FormData(form);
    const guestCount = Number.parseInt(String(data.get("guests") ?? ""), 10);

    const when = preferredDateTime as Date;
    const y = when.getFullYear();
    const m = String(when.getMonth() + 1).padStart(2, "0");
    const d = String(when.getDate()).padStart(2, "0");
    const time = `${String(when.getHours()).padStart(2, "0")}:${String(when.getMinutes()).padStart(2, "0")}`;

    try {
      const response = await submitReservationRequest({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: phone!,
        preferredDate: `${y}-${m}-${d}`,
        time,
        format,
        guestCount,
        menu,
        winePairing,
        occasion: String(data.get("occasion") ?? "") || undefined,
        turnstileToken,
      });
      setStatus("idle");
      setThankYouMessage(response.message);
      setThankYouOpen(true);
      form.reset();
      setPhone(undefined);
      setPreferredDateTime(undefined);
      setFormat("");
      setMenu("");
      setWinePairing("");
      turnstileRef.current?.reset();
      setTurnstileNotice("");
    } catch (error) {
      setStatus("error");
      turnstileRef.current?.reset();
      const apiMessage = error instanceof ApiError ? error.message : "";
      const isTurnstileReject =
        apiMessage.toLowerCase().includes("security") ||
        apiMessage.toLowerCase().includes("verification");
      setFeedback(
        isTurnstileReject
          ? turnstileUserMessages.reservationSubmitFailed
          : apiMessage || "Something went wrong. Please try again.",
      );
      if (isTurnstileReject) {
        setTurnstileNotice("");
      }
    }
  }

  return (
    <Section tone="default" padding="afterHero">
      <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr]">
        <Reveal className="space-y-8">
          <form className="space-y-8" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="name" required>
                  Name
                </FieldLabel>
                <Input id="name" name="name" placeholder="Your name" required autoComplete="name" />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="email" required>
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <PhoneField id="reserve-phone" value={phone} onChange={setPhone} requiredMark />
              <DateTimeField
                id="preferred-date"
                value={preferredDateTime}
                onChange={setPreferredDateTime}
                requiredMark
              />
              <div className="space-y-2">
                <FieldLabel htmlFor="format" required>
                  Format
                </FieldLabel>
                <Select value={format} onValueChange={setFormat} required>
                  <SelectTrigger id="format" className="w-full">
                    <SelectValue placeholder="Select a format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="guests" required>
                  Guests
                </FieldLabel>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min={1}
                  placeholder="e.g. 8"
                  required
                />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="menu" required>
                  Menu
                </FieldLabel>
                <Select value={menu} onValueChange={setMenu} required>
                  <SelectTrigger id="menu" className="w-full">
                    <SelectValue placeholder="Select a menu" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="wine-pairing" required>
                  Wine pairing
                </FieldLabel>
                <Select value={winePairing} onValueChange={setWinePairing} required>
                  <SelectTrigger id="wine-pairing" className="w-full">
                    <SelectValue placeholder="Please advise" />
                  </SelectTrigger>
                  <SelectContent>
                    {winePairingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occasion">
                The occasion, and anything the table can&rsquo;t eat
              </Label>
              <Textarea
                id="occasion"
                name="occasion"
                placeholder="Anniversary for 8; two vegetarians; no shellfish."
              />
            </div>

            <TurnstileField
              ref={turnstileRef}
              form="reservation"
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

            {feedback || turnstileNotice ? (
              <p className="text-sm text-destructive" role="alert">
                {feedback || turnstileNotice}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              <Button
                type="submit"
                size="lg"
                className="group h-11 px-6 text-xs"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending…" : "Send reservation request"}
                <ArrowRightIcon
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Button>
              <p className="text-sm text-muted-foreground">
                No deposit is taken at this stage.
              </p>
            </div>
          </form>
        </Reveal>

        <Reveal className="h-fit border border-border bg-card p-8">
          <h2 className="font-serif text-2xl">Before you book</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A few things that help us write the right menu the first time.
          </p>
          <dl className="mt-6 space-y-5 border-t border-border pt-6">
            {beforeYouBook.map((item) => (
              <div key={item.label} className="grid grid-cols-[7rem_1fr] gap-4">
                <dt className="text-xs tracking-mega text-muted-foreground uppercase">
                  {item.label}
                </dt>
                <dd className="text-sm">{item.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[7rem_1fr] gap-4">
              <dt className="text-xs tracking-mega text-muted-foreground uppercase">
                Prefer to talk?
              </dt>
              <dd className="text-sm">{siteConfig.phone}</dd>
            </div>
          </dl>
        </Reveal>
      </div>

      <ThankYouDialog
        open={thankYouOpen}
        onOpenChange={setThankYouOpen}
        description={thankYouMessage}
      />
    </Section>
  );
}
