import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DaypartSync } from "@/components/DaypartSync";
import { siteInfo } from "@/data/site-info";
import "./globals.css";

// Variable Fraunces with its expressive axes: opsz (optical size), SOFT
// (rounded, buttery terminals) and WONK (the leaning "handwritten" italic).
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteInfo.name} — Matcha & slow mornings in ${siteInfo.city}`,
    template: `%s — ${siteInfo.name} ${siteInfo.city}`,
  },
  description:
    "A small, plant-forward matcha cafe in Maastricht. Ceremonial matcha, good coffee, fresh pastries and food that makes you feel good.",
};

export const viewport: Viewport = {
  themeColor: "#F7F5EF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables scroll-fade styles only when JS is running, so content is never stuck hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh flex flex-col">
        <DaypartSync />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-cream focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
