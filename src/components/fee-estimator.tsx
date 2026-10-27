"use client";
import { useState } from "react";
import { Calculator } from "lucide-react";
import { cad, managementFee } from "@/lib/pricing";
import type { Plan } from "@/lib/content-schema";
export function FeeEstimator({ plans }: { plans: Plan[] }) {
  const [input, setInput] = useState("3000");
  const rent = Number(input);
  const valid = /^\d+(\.\d{1,2})?$/.test(input) && rent > 0 && rent <= 10000000;
  return (
    <section className="estimator" aria-labelledby="estimator-title">
      <div className="estimator-intro">
        <Calculator size={24} strokeWidth={1.4} aria-hidden="true" />
        <h2 id="estimator-title">A clear view of your fees.</h2>
        <p>
          Enter your monthly rental income to compare estimated management fees.
        </p>
        <label htmlFor="monthly-rent">Monthly rental income (CAD)</label>
        <div className="currency-input">
          <span aria-hidden="true">$</span>
          <input
            id="monthly-rent"
            inputMode="decimal"
            type="number"
            min="0.01"
            max="10000000"
            step="0.01"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-invalid={!valid}
            aria-describedby={!valid ? "rent-error" : "estimate-note"}
          />
        </div>
        {!valid && (
          <p className="field-error" id="rent-error">
            Enter an amount from $0.01 to $10,000,000, with up to two decimal
            places.
          </p>
        )}
      </div>
      <div>
        <div className="estimate-results" aria-live="polite" aria-atomic="true">
          {plans.map((plan) => (
            <div className="estimate-row" key={plan.id}>
              <span>{plan.name}</span>
              <div>
                <strong>
                  {valid ? cad(managementFee(rent, plan), true) : "—"}
                </strong>
                <span>/ month</span>
                <small>
                  {valid && plan.rate > 0 && rent * plan.rate < plan.minimum
                    ? "Monthly minimum applies"
                    : plan.monthlyFee
                      ? "Flat monthly fee"
                      : "Management fee only"}
                </small>
              </div>
            </div>
          ))}
        </div>
        <p id="estimate-note" className="small muted">
          Estimates cover management fees only. Final quotes depend on confirmed
          property requirements and applicable terms. All amounts in CAD.
          Applicable taxes, if any, are confirmed in your quote.
        </p>
      </div>
    </section>
  );
}
