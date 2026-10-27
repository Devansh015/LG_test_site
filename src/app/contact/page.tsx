import { PageIntro, TextLink } from "@/components/ui";
import { LeadForm } from "@/components/lead-form";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
export const generateMetadata = () => pageMetadata("/contact");
export default async function ContactPage() {
  const c = await getContent();
  const b = c.business;
  return (
    <>
      <PageIntro
        title="Let’s talk about your property."
        description="Whether you need complete property management or support with a specific rental property service, we’d be happy to learn more about your needs."
      />
      <div className="container enquiry-layout contact-layout">
        <aside className="enquiry-aside contact-aside">
          <div className="contact-details">
            <div className="contact-detail">
              <h3>General enquiries</h3>
              {b.previewContacts ? (
                <>
                  <p>{b.email}</p>
                  <p className="preview-label">
                    Preview address · not monitored
                  </p>
                </>
              ) : (
                <a href={`mailto:${b.email}`}>{b.email}</a>
              )}
            </div>
            {b.phone && (
              <div className="contact-detail">
                <h3>By phone</h3>
                {b.previewContacts ? (
                  <>
                    <p>{b.phone}</p>
                    <p className="preview-label">
                      Illustrative number · local preview
                    </p>
                  </>
                ) : (
                  <a href={`tel:${b.phone.replace(/[^+\d]/g, "")}`}>
                    {b.phone}
                  </a>
                )}
              </div>
            )}
            <div className="contact-detail">
              <h3>Our service area</h3>
              <p>{b.area}</p>
              <p className="coverage-description" style={{ marginTop: 12 }}>
                {b.coverage}
              </p>
            </div>
          </div>
          <TextLink href="/get-a-quote">Looking for a tailored quote?</TextLink>
        </aside>
        <LeadForm kind="contact" />
      </div>
    </>
  );
}
