import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Board",
  description: "Task management board built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
