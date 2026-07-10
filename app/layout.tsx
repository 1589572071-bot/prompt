import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orchestration Studio",
  description: "Digital human prompt orchestration studio MVP"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
