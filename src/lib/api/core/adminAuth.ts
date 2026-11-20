import type { ApiSuccessResponse } from "@/lib/api/core/types";
import { adminApiFetch } from "@/lib/api/core/adminClient";
import { apiFetch } from "@/lib/api/core/client";

export interface AdminProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
  image: string | null;
}

export interface AdminLoginResponse {
  expiresInSeconds: number;
  admin: AdminProfile;
}

export interface AdminDashboardStats {
  reservationsThisMonth: number;
  messagesThisMonth: number;
  faqsPublished: number;
}

export interface AdminDashboardReservation {
  id: number;
  name: string;
  guest: number | null;
  date: string | null;
  time: string | null;
  status: string;
}

export interface AdminDashboardMessage {
  id: number;
  name: string;
  subject: string | null;
  message: string;
  addDate: string;
}

export interface AdminDashboardData {
  greeting: string;
  stats: AdminDashboardStats;
  recentReservations: AdminDashboardReservation[];
  recentMessages: AdminDashboardMessage[];
}

export interface AdminProfileRecord {
  firstName: string;
  lastName: string | null;
  email: string;
  mobile: string | null;
  address: string | null;
  /** Relative "/uploads/..." path; resolve with toGalleryAssetUrl. */
  imageUrl: string | null;
}

export interface AdminProfileFormInput {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  image?: File | null;
}

export async function fetchAdminProfile(): Promise<ApiSuccessResponse<AdminProfileRecord>> {
  return adminApiFetch<ApiSuccessResponse<AdminProfileRecord>>("/admin/auth/profile");
}

export async function updateAdminProfile(
  input: AdminProfileFormInput,
): Promise<ApiSuccessResponse<AdminProfileRecord>> {
  const formData = new FormData();
  formData.set("firstName", input.firstName);
  formData.set("lastName", input.lastName);
  formData.set("email", input.email);
  formData.set("mobile", input.mobile);
  formData.set("address", input.address);
  if (input.image) formData.set("image", input.image);
  return adminApiFetch<ApiSuccessResponse<AdminProfileRecord>>("/admin/auth/profile", {
    method: "PATCH",
    body: formData,
  });
}

export async function changeAdminPassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiSuccessResponse<{ ok: boolean }>> {
  return adminApiFetch<ApiSuccessResponse<{ ok: boolean }>>("/admin/auth/change-password", {
    method: "POST",
    body: input,
  });
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<ApiSuccessResponse<AdminLoginResponse>> {
  return apiFetch<ApiSuccessResponse<AdminLoginResponse>>("/admin/auth/login", {
    method: "POST",
    credentials: "include",
    body: { email, password },
  });
}

export async function fetchAdminMe(): Promise<ApiSuccessResponse<AdminProfile>> {
  return adminApiFetch<ApiSuccessResponse<AdminProfile>>("/admin/auth/me");
}

export async function adminLogout(): Promise<void> {
  try {
    await adminApiFetch<ApiSuccessResponse<{ ok: boolean }>>("/admin/auth/logout", {
      method: "POST",
    });
  } catch {
    // Client clears token regardless.
  }
}

export async function fetchAdminDashboard(): Promise<ApiSuccessResponse<AdminDashboardData>> {
  return adminApiFetch<ApiSuccessResponse<AdminDashboardData>>("/admin/dashboard");
}
