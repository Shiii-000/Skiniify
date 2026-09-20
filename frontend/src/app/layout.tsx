import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skiniify - CS:GO/CS2 Inventory Tracker",
  description: "Premium CS:GO/CS2 skin tracking with real-time prices, trade-up calculator, and inventory management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}