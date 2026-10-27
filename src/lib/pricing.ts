import type { Plan } from "./content-schema";
export function managementFee(rent: number, plan: Plan) {
  if (!Number.isFinite(rent) || rent <= 0 || rent > 10000000)
    throw new Error(
      "Enter monthly rental income between $0.01 and $10,000,000.",
    );
  return (
    Math.round(
      (plan.monthlyFee || Math.max(rent * plan.rate, plan.minimum)) * 100,
    ) / 100
  );
}
export const cad = (amount: number, cents = false) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(amount);
export const rateLabel = (plan: Plan) =>
  `${Number((plan.rate * 100).toFixed(2))}%`;
