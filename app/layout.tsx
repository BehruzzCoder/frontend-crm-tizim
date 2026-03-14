import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM",
  description: "CRM system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}