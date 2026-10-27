import type { Metadata } from "next";
import { getContent } from "./content";
export const siteUrl = () =>
  (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export async function pageMetadata(path: string): Promise<Metadata> {
  const content = await getContent();
  const entry = content.seo.find((s) => s.path === path)!;
  return {
    title: { absolute: `${entry.title} | Valore Property Group` },
    description: entry.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${entry.title} | Valore Property Group`,
      description: entry.description,
      url: path,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Valore Property Group — Your Property. Our Priority.",
        },
      ],
    },
  };
}
