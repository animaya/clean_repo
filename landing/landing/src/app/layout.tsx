import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diesel Dudes - Mobile Diesel Mechanic Charlotte & Columbia | 24/7 Emergency Service",
  description: "Professional mobile diesel repair services in Charlotte, NC & Columbia, SC. 24/7 emergency roadside assistance, on-site repairs, and expert diesel mechanics. Call (803) 230-6390 for fast, reliable service.",
  openGraph: {
    title: "Diesel Dudes - Mobile Diesel Mechanic Charlotte & Columbia",
    description: "24/7 Emergency diesel repair services. Professional mobile mechanics serving Charlotte, NC & Columbia, SC areas.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
