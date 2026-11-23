"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/core/client";
import { fetchAdminProfile, updateAdminProfile } from "@/lib/api/core/adminAuth";
import { toGalleryAssetUrl } from "@/lib/api/gallery";
import { AdminFileInput } from "@/components/admin/AdminFileInput";
import { InkDots } from "@/components/shared/InkDots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileValues {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
}

export function ProfileForm() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<ProfileValues | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data } = await fetchAdminProfile();
        if (cancelled) return;
        setValues({
          firstName: data.firstName,
          lastName: data.lastName ?? "",
          email: data.email,
          mobile: data.mobile ?? "",
          address: data.address ?? "",
        });
        setImageUrl(data.imageUrl);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Could not load your profile.");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values) return;
    setSubmitting(true);
    try {
      const { data } = await updateAdminProfile({
        ...values,
        image: imageInputRef.current?.files?.[0] ?? null,
      });
      setImageUrl(data.imageUrl);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update your profile.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) return <p className="text-sm text-destructive">{loadError}</p>;
  if (!values) return <InkDots label="Loading profile" />;

  function field(name: keyof ProfileValues) {
    return {
      value: values![name],
      onChange: (event: { target: { value: string } }) =>
        setValues({ ...values!, [name]: event.target.value }),
    };
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-8 rounded-lg border border-border bg-card p-6 shadow-sm lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-10">
        <div className="space-y-2">
          <Label htmlFor="profile-image">Profile image</Label>
          <AdminFileInput
            id="profile-image"
            inputRef={imageInputRef}
            currentImageUrl={imageUrl ? toGalleryAssetUrl(imageUrl) : null}
            currentImageAlt="Profile image"
            className="flex-col items-stretch"
            large
          />
        </div>

        <div className="space-y-5 lg:border-l lg:border-border lg:pl-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-first-name">First name</Label>
              <Input id="profile-first-name" required maxLength={50} {...field("firstName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-last-name">Last name</Label>
              <Input id="profile-last-name" maxLength={50} {...field("lastName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" type="email" required maxLength={255} {...field("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-mobile">Mobile</Label>
              <Input id="profile-mobile" maxLength={25} {...field("mobile")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="profile-address">Address</Label>
              <Textarea id="profile-address" rows={4} maxLength={150} {...field("address")} />
            </div>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
