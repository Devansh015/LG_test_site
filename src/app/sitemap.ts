import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/about",
    "/services",
    "/pricing",
    "/contact",
    "/get-a-quote",
    "/privacy-policy",
  ].map((path) => ({
    url: `${siteUrl()}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/privacy-policy" ? 0.3 : 0.8,
  }));
}
