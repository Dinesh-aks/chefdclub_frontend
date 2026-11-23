import { IBM_Plex_Sans } from "next/font/google";
import { AdminProviders } from "@/components/admin/AdminProviders";
import { AdminThemeScope } from "@/components/admin/AdminThemeScope";

const fontAdmin = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-admin-body",
  display: "swap",
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const themeClassName = `admin-theme ${fontAdmin.variable}`;

  return (
    <div className={themeClassName}>
      <AdminThemeScope className={themeClassName} />
      <AdminProviders>{children}</AdminProviders>
    </div>
  );
}
