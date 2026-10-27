import { Plus } from "lucide-react";
import type { SiteContent } from "@/lib/content-schema";
export function FAQ({ faqs }: { faqs: SiteContent["faqs"] }) {
  return (
    <div className="faq-list">
      {faqs.map((f) => (
        <details key={f.question}>
          <summary>
            {f.question}
            <Plus size={20} strokeWidth={1.5} aria-hidden="true" />
          </summary>
          <div className="faq-answer">
            <p>{f.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
