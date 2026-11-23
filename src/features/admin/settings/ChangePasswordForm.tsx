"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/core/client";
import { changeAdminPassword, fetchAdminMe } from "@/lib/api/core/adminAuth";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/admin/PasswordInput";
import { Label } from "@/components/ui/label";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Hidden username so the browser's password manager can fill the current password.
  const [email, setEmail] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchAdminMe()
      .then((response) => {
        if (!cancelled) setEmail(response.data.email);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await changeAdminPassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not change your password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="max-w-md space-y-5" onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        autoComplete="username"
        value={email}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
      <div className="space-y-2">
        <Label htmlFor="current-password">Current password</Label>
        <PasswordInput
          id="current-password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">New password</Label>
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          required
          minLength={6}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : "Change password"}
      </Button>
    </form>
  );
}
