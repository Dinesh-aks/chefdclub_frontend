"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface JournalSubscribeFormProps {
  className?: string;
}

export function JournalSubscribeForm({ className }: JournalSubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-end", className)}
    >
      <label className="flex-1">
        <span className="sr-only">Email address</span>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={submitted}
        />
      </label>
      <Button type="submit" disabled={submitted} className="shrink-0 cursor-pointer">
        {submitted ? "Thanks" : "Join"}
      </Button>
    </form>
  );
}
