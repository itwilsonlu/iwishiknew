import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "I wish I knew",
  description:
    "I wish I knew is a collection of resources gathered and simplified",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Script
        defer
        src="https://u.foxnox.app/script.js"
        data-website-id="49fa0fcf-7e7d-49e2-a38a-a33676c4a00c"
      ></Script>
    </html>
  );
}
