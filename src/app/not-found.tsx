import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { Footer } from "@/components/website/Footer";
import { Header } from "@/components/website/Header";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** Minimal branded 404 for any address that doesn't exist, with the normal header and footer. */
export default function NotFound() {
  return (
    <div className="website-root">
      <Header />
      <main>
        <section className="tone-ink flex min-h-[70vh] items-center bg-background text-center text-foreground">
          <Container className="py-20 md:py-28 lg:py-32">
            <div className="mx-auto flex max-w-2xl flex-col items-center">
              <p aria-hidden="true" className="font-serif text-8xl leading-none sm:text-9xl lg:text-[10rem]">
                404
              </p>
              <h1 className="mt-6 font-serif text-3xl sm:text-4xl lg:text-5xl">
                Page <em className="text-primary">not found</em>
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">
                Sorry, the page you&rsquo;re looking for doesn&rsquo;t exist.
              </p>
              <Button asChild size="lg" className="mt-10 h-12 px-8 text-xs">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
