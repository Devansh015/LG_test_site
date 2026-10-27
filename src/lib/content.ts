import "server-only";
import { cache } from "react";
import defaults from "../../content/site.json";
import { siteSchema } from "./content-schema";

export const getContent = cache(async () => {
  const fallback = siteSchema.parse(defaults);
  const project = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || "production";
  if (!project) return fallback;
  if (!/^[a-z0-9-]+$/.test(project) || !/^[a-z0-9_-]+$/.test(dataset))
    throw new Error("Invalid CMS configuration");
  try {
    const query =
      '*[_type == "siteContent" && _id == "siteContent"][0]{...,home{...,"heroImage":coalesce(heroAsset.asset->url,heroImage),"introImage":coalesce(introAsset.asset->url,introImage)},services[]{...,"image":coalesce(imageAsset.asset->url,image)}}';
    const response = await fetch(
      `https://${project}.api.sanity.io/v2025-02-19/data/query/${dataset}?query=${encodeURIComponent(query)}`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) },
    );
    if (!response.ok) throw new Error("CMS response unavailable");
    const { result } = await response.json();
    if (!result) return fallback;
    return siteSchema.parse(result);
  } catch {
    console.error(
      "CMS content unavailable or invalid; using validated local content.",
    );
    return fallback;
  }
});
