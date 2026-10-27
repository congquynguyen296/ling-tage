import type { Metadata } from "next";
import { TopProgressBar } from "@/components/layout/TopProgressBar";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TAGE — FW26 Official Online Store",
    template: "%s | TAGE",
  },
  description:
    "TAGE — Considered clothing for the modern wardrobe. Discover FW26 New Arrivals, Japanese Denim, Outerwear, Knitwear and Leather.",
  icons: {
    icon: "/logo/tage_logo.png",
  },
  openGraph: {
    title: "TAGE — FW26 Official Online Store",
    description: "Considered clothing for the modern wardrobe. Designed to last.",
    images: ["/logo/tage_banner.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <TopProgressBar />
        {children}
      </body>
    </html>
  );
}

