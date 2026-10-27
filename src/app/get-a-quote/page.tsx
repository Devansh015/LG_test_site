import Image from "next/image";
import { Check } from "lucide-react";
import { PageIntro } from "@/components/ui";
import { LeadForm } from "@/components/lead-form";
import { pageMetadata } from "@/lib/seo";
import type { Enquiry } from "@/lib/enquiry-schema";
export const generateMetadata = () => pageMetadata("/get-a-quote");
export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const selected =
    typeof params.package === "string" &&
    ["core", "signature", "prestige"].includes(params.package)
      ? (params.package as Enquiry["package"])
      : "not-sure";
  const service = typeof params.service === "string" ? params.service : "";
  return (
    <>
      <PageIntro
        title="Your property. Our next conversation."
        description="Tell us a little about your rental property. We’ll help you find the right level of support, with a tailored recommendation and clear pricing."
      />
      <div className="container enquiry-layout">
        <aside className="enquiry-aside">
          <div className="aside-image">
            <Image
              src="/images/interior.jpg"
              alt="Sunlit, carefully furnished residential living room"
              fill
              sizes="(max-width: 767px) 100vw, 30vw"
            />
          </div>
          <h2>Good management starts with understanding.</h2>
          <p>
            One property or several. Full management or a specific service.
            Let’s start with what you need.
          </p>
          <ul className="aside-points">
            {[
              "A property-specific recommendation",
              "Clear service scope and fees",
              "No obligation to proceed",
            ].map((t) => (
              <li key={t}>
                <Check size={16} aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <p className="aside-note">
            GTA-focused, with services across Ontario confirmed individually.
            Your enquiry helps us check the right support for your location.
          </p>
        </aside>
        <LeadForm
          kind="quote"
          initialPackage={selected}
          initialService={service}
        />
      </div>
    </>
  );
}
