import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
const { SCRIPT_ID, SCRIPT_SRC } = process.env;
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
      <head>
        {SCRIPT_SRC && SCRIPT_ID && (
          <Script defer src={SCRIPT_SRC} data-website-id={SCRIPT_ID} />
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
