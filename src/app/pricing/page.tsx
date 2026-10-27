import { Check, Minus, Info } from "lucide-react";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageIntro, Button, FinalCTA } from "@/components/ui";
import { PricingCards } from "@/components/pricing-cards";
import { FeeEstimator } from "@/components/fee-estimator";
import { FAQ } from "@/components/faq";
export const generateMetadata = () => pageMetadata("/pricing");
export default async function PricingPage() {
  const c = await getContent();
  const p = c.pricing;
  return (
    <>
      <PageIntro
        title="Exceptional care. Clear pricing."
        description="Choose the level of support that works for your property. Straightforward packages, a clear service scope and no guesswork about management fees."
      />
      <section
        className="container pricing-main"
        aria-label="Management packages"
      >
        <PricingCards pricing={p} full />
        <p className="pricing-note">
          All prices in Canadian dollars (CAD). Percentage fees are based on
          monthly rent, subject to the stated minimum. Applicable taxes, if any,
          are confirmed in your quote.
        </p>
        <div className="pricing-context">
          <Info size={19} strokeWidth={1.5} aria-hidden="true" />
          <p>
            {p.disclaimer} LTB coordination is administrative support only, not
            legal advice or representation.
          </p>
        </div>
      </section>
      <section className="section paper">
        <div className="container">
          <h2>Know what’s included.</h2>
          <div
            className="table-wrap"
            role="region"
            aria-label="Plan features comparison — scroll horizontally on smaller screens"
            tabIndex={0}
          >
            <table className="comparison-table">
              <caption>
                Included services by management plan. Annual inspection counts
                are the total included.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  {p.plans.map((plan) => (
                    <th scope="col" key={plan.id}>
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.features.map((f) => (
                  <tr key={f.id}>
                    <th scope="row">{f.label}</th>
                    {p.plans.map((plan) => (
                      <td key={plan.id}>
                        {f[plan.id].detail ? (
                          f[plan.id].detail
                        ) : f[plan.id].included ? (
                          <>
                            <Check size={17} aria-hidden="true" />
                            <span className="sr-only">Included</span>
                          </>
                        ) : (
                          <>
                            <Minus size={15} aria-hidden="true" />
                            <span className="sr-only">Not included</span>
                          </>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-hint">
            On smaller screens, scroll the comparison horizontally. Move-in /
            move-out coordination and turnover coordination do not include
            third-party costs. Inspection add-ons remain separate.
          </p>
        </div>
      </section>
      <section className="section container">
        <FeeEstimator plans={p.plans} />
      </section>
      <section className="section container no-top-padding">
        <div className="addon-grid">
          <div className="addon-intro">
            <h2>
              A little extra,
              <br />
              when you need it.
            </h2>
            <p>
              Additional services for specific moments in your property’s
              lifecycle. Scope and any overlap with your management package are
              confirmed before work begins.
            </p>
          </div>
          <dl className="addons-list">
            {p.addons.map((a) => (
              <div className="addon-row" key={a.name}>
                <dt>{a.name}</dt>
                <dd>{a.price}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="cost-disclaimer">
          <h3>What is paid separately</h3>
          <p>{p.disclaimer}</p>
          <p>
            LTB administrative coordination is not legal advice or
            representation. Limited project coordination in Prestige has an
            agreed scope; additional or larger projects are quoted separately.
            Confirm applicable taxes, approval thresholds and final terms in
            your service agreement.
          </p>
        </div>
        <div className="addon-cta">
          <p>Let’s find the right service mix for your property.</p>
          <Button href="/get-a-quote">Get a Free Quote</Button>
        </div>
      </section>
      <section className="section paper">
        <div className="container faq-section">
          <div>
            <h2>
              More clarity.
              <br />
              Fewer questions.
            </h2>
          </div>
          <FAQ faqs={c.faqs} />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
