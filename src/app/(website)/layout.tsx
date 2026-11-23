import { Suspense } from "react";
import { ApiDebugBar } from "@/components/dev/ApiDebugBar";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="website-root">
      <Header />
      <main>{children}</main>
      <Footer />
      {/* Dev only (renders nothing in production): lists this page's server-side API calls. */}
      <Suspense fallback={null}>
        <ApiDebugBar />
      </Suspense>
    </div>
  );
}
