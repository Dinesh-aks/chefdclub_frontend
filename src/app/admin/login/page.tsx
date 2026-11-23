import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { AdminLoginForm } from "@/features/admin/login/AdminLoginForm";
import { Logo } from "@/components/shared/Logo";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Admin login · ${siteConfig.name}`,
};

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="tone-ink relative hidden flex-col justify-between overflow-hidden bg-background px-12 py-12 text-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, color-mix(in oklab, var(--primary) 30%, transparent), transparent 55%), radial-gradient(circle at 85% 85%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 60%)",
          }}
          aria-hidden="true"
        />

        <Logo textClassName="text-2xl" className="relative" />

        <div className="relative max-w-sm">
          <p className="text-xs tracking-mega text-muted-foreground uppercase">Admin Console</p>
          <p className="mt-4 font-serif text-3xl leading-snug">
            Every reservation, every dish, <em className="text-primary italic">one kitchen.</em>
          </p>
        </div>

        <p className="relative text-xs text-muted-foreground">{siteConfig.address}</p>
      </div>

      <div className="flex items-center justify-center bg-background px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="tone-ink mb-10 flex w-fit items-center gap-3 rounded-md bg-background px-4 py-3 lg:hidden">
            <Logo textClassName="text-lg" />
          </div>

          <p className="text-xs tracking-mega text-muted-foreground uppercase">Admin Console</p>
          <h1 className="mt-3 font-serif text-3xl">
            Welcome back<span className="text-primary">.</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage reservations, the gallery and more.
          </p>

          <div className="mt-10">
            <AdminLoginForm />
          </div>

          <Link
            href="/"
            className="mt-10 flex items-center gap-2 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
