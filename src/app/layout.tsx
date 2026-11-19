import type { Metadata, Viewport } from "next";
import { COPY_TH } from "@/content/copy.th";
import { Header } from "@/components/layout/Header";
import { MotionToggle } from "@/components/layout/MotionToggle";
import { AwwwardsAtmosphere } from "@/components/ui/AwwwardsAtmosphere";
import { SanctuaryPreloader } from "@/components/ui/SanctuaryPreloader";
import { ScrollProgressHUD } from "@/components/ui/ScrollProgressHUD";
import { FloatingLumiButton } from "@/components/ui/FloatingLumiButton";
import "./globals.css";

export const metadata: Metadata = {
  title: COPY_TH.meta.title,
  description: COPY_TH.meta.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F2",
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
          href="https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Noto+Serif+Thai:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-secondary selection:text-text">
        <SanctuaryPreloader />
        <ScrollProgressHUD />
        <AwwwardsAtmosphere />
        <Header />
        {children}
        <FloatingLumiButton />
        <MotionToggle />
      </body>
    </html>
  );
}
