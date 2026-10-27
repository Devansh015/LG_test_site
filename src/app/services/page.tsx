import Image from "next/image";
import { Check } from "lucide-react";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageIntro, FinalCTA, Button } from "@/components/ui";
export const generateMetadata = () => pageMetadata("/services");
export default async function ServicesPage() {
  const c = await getContent();
  const notes: Record<string, string> = {
    "property-management":
      "Services vary by package. Rent increases, access, lease administration and any LTB processes remain subject to applicable Ontario requirements. LTB support is administrative coordination, not legal advice or representation.",
    leasing:
      "This is the proposed leasing workflow. Marketing channels, showing arrangements, screening criteria, documentation and timing are confirmed in your service agreement. Tenant Placement & Leasing is 60% of one month’s rent.",
    maintenance:
      "Coordination is separate from repair costs, contractor charges and materials, which are paid by the owner. Approval thresholds, emergency arrangements and project limits are agreed before work begins.",
    investment:
      "Operational support is scoped to your package or a separate agreement. Rental market reviews are included with Prestige. We do not promise investment returns or provide regulated investment advice.",
  };
  return (
    <>
      <PageIntro
        title="Every detail has a place."
        description="Property management, leasing and property care, shaped around the responsibilities of ownership. Choose ongoing support or start with a specific need."
      />
      <div className="container service-details">
        {c.services.map((s) => (
          <section className="service-detail" id={s.id} key={s.id}>
            <div className="service-detail-image">
              <Image
                src={s.image}
                alt={s.imageAlt}
                fill
                sizes="(max-width: 767px) 100vw, 44vw"
              />
            </div>
            <div className="service-detail-copy">
              <h2>{s.title}</h2>
              <p className="lead">{s.description}</p>
              <ul>
                {s.details.map((d) => (
                  <li key={d}>
                    <Check size={16} strokeWidth={1.6} aria-hidden="true" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <p className="service-caveat">{notes[s.id]}</p>
              <Button href={s.href}>{s.cta}</Button>
            </div>
          </section>
        ))}
      </div>
      <FinalCTA />
    </>
  );
}
