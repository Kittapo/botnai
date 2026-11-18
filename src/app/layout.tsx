import type { Metadata, Viewport } from "next";
import { COPY_TH } from "@/content/copy.th";
import { Header } from "@/components/layout/Header";
import { MotionToggle } from "@/components/layout/MotionToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: COPY_TH.meta.title,
  description: COPY_TH.meta.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFAFC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-secondary selection:text-text">
        <Header />
        {children}
        <MotionToggle />
      </body>
    </html>
  );
}
