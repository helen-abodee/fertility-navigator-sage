import type { Metadata, Viewport } from "next";
import { Literata, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const literata = Literata({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-literata",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-atkinson",
});

export const metadata: Metadata = {
  title: "Fertility Preservation Navigator",
  description:
    "A free, private tool for people with cancer deciding whether and how to preserve their fertility. Your answers never leave your device.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${literata.variable} ${atkinson.variable}`}>
      <body>{children}</body>
    </html>
  );
}
