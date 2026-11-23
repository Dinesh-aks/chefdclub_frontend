import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { MotionProvider } from "@/components/shared/MotionProvider";
import { PageLoader } from "@/components/shared/PageLoader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import "./globals.css";

const fontSans = Jost({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-sans-body",
  display: "swap",
});

const fontSerif = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <MotionProvider>
          <TooltipProvider>
            <PageLoader />
            {children}
          </TooltipProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
