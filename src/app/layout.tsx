import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MotionEnhancer } from "@/components/motion";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/seo";
import "./globals.css";
const editorial = localFont({
  src: "../../public/fonts/dm-serif-latin.woff2",
  variable: "--font-editorial",
  display: "swap",
  weight: "400",
});
const manrope = localFont({
  src: "../../public/fonts/manrope-latin.woff2",
  weight: "400 700",
  variable: "--font-manrope",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Valore Property Group",
    template: "%s | Valore Property Group",
  },
  description:
    "Thoughtful property management for Toronto, the GTA and Ontario.",
  robots: process.env.SITE_URL
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    siteName: "Valore Property Group",
    locale: "en_CA",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = {
  themeColor: "#0B0B0D",
  width: "device-width",
  initialScale: 1,
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: content.business.name,
    ...(process.env.SITE_URL ? { url: siteUrl() } : {}),
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Greater Toronto Area, Ontario, Canada",
    },
    description:
      "Residential property management, leasing and maintenance coordination. Ontario service availability confirmed for each property.",
  };
  return (
    <html lang="en-CA">
      <body className={`${editorial.variable} ${manrope.variable}`}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer business={content.business} />
        <MotionEnhancer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
