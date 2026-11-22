import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-figtree",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Fertility Preservation Navigator",
  manifest: "/manifest.json",
  description:
    "A free, private tool for people with cancer deciding whether and how to preserve their fertility. Your answers never leave your device.",
};

export const viewport: Viewport = {
  themeColor: "#16697a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${fraunces.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
