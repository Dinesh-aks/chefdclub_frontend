import type { AdminListPage } from "@/lib/api/core/adminList";

export interface CreateContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  mobile: string;
  turnstileToken?: string;
}

export interface ContactMessageRecord {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  subject: string | null;
  message: string;
  addDate: string;
}

/** A row in the admin inbox table — subject and message load only via the by-id endpoint. */
export type ContactMessageListItem = Pick<ContactMessageRecord, "id" | "name" | "email" | "mobile">;

export type ContactMessagePage = AdminListPage<ContactMessageListItem>;
