import { Check } from "lucide-react";
import { Button } from "./ui";
import { cad, rateLabel } from "@/lib/pricing";
import type { SiteContent } from "@/lib/content-schema";
export function PricingCards({
  pricing,
  full = false,
}: {
  pricing: SiteContent["pricing"];
  full?: boolean;
}) {
  return (
    <div className="pricing-cards">
      {pricing.plans.map((plan, i) => {
        const previous = pricing.plans[i - 1];
        const features = full
          ? pricing.features.filter(
              (f) =>
                f[plan.id].included &&
                (!previous ||
                  !f[previous.id].included ||
                  f.id === "inspections"),
            )
          : plan.previewFeatures.map((id) =>
              pricing.features.find((f) => f.id === id)!,
            );
        return (
          <article
            key={plan.id}
            className={`pricing-card ${plan.id === "signature" ? "pricing-recommended" : ""}`}
          >
            <div className="plan-top">
              <h3>{plan.name}</h3>
              <span className="plan-label">{plan.label}</span>
            </div>
            <div className="plan-price">
              {plan.monthlyFee ? (
                <>
                  <strong>{cad(plan.monthlyFee)}</strong>
                  <span>/ month</span>
                </>
              ) : (
                <>
                  <strong>{rateLabel(plan)}</strong>
                  <span>of monthly rent</span>
                </>
              )}
            </div>
            <p className="plan-minimum">
              {plan.monthlyFee
                ? "A straightforward monthly fee."
                : `Minimum ${cad(plan.minimum)} / month`}
            </p>
            <p className="plan-description">{plan.description}</p>
            <div className="plan-features">
              {previous && (
                <p className="inheritance">
                  Everything in {previous.name}, plus:
                </p>
              )}
              <ul>
                {features.map((f) => (
                  <li key={f.id}>
                    <Check size={15} strokeWidth={1.8} aria-hidden="true" />
                    <span>
                      {f.id === "inspections"
                        ? `${f[plan.id].detail} — property inspections (total)`
                        : f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              href={`/get-a-quote?package=${plan.id}`}
              variant={plan.id === "signature" ? "primary" : "dark"}
            >
              Choose {plan.name}
            </Button>
          </article>
        );
      })}
    </div>
  );
}
