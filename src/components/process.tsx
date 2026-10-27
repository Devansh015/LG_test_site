import type { SiteContent } from "@/lib/content-schema";
export function Process({ steps }: { steps: SiteContent["process"] }) {
  return (
    <ol className="process-list">
      {steps.map((step, i) => (
        <li key={step.title}>
          <span className="step-number">0{i + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
