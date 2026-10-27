import { PageIntro } from "@/components/ui";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
export const generateMetadata = () => pageMetadata("/privacy-policy");
export default async function PrivacyPage() {
  const c = await getContent();
  return (
    <>
      <PageIntro
        title="Your information, handled with care."
        description="Privacy policy for website enquiries to Valore Property Group."
      />
      <article className="container narrow legal-content">
        <div className="legal-notice">
          <p>
            <strong>Local preview — policy draft for review.</strong> Before
            launch, Valore must confirm its privacy contact, retention schedule,
            providers, processing locations and access/correction process. This
            draft describes the implemented website flow and is not a claim of
            completed legal review.
          </p>
        </div>
        <h2>What you share with us</h2>
        <p>
          The enquiry forms request your name, email address and, for quote
          requests, phone number. A quote request also asks about property
          location, type, number of rental units and the services you are
          considering. Rental income, occupancy and additional notes are
          optional. Please do not submit tenant records, banking information or
          identification documents.
        </p>
        <h2>Why we collect it</h2>
        <p>
          We use enquiry information to understand your request, check service
          availability, recommend a service scope and respond to you. The
          consent checkbox covers this purpose. It does not enrol you in
          marketing.
        </p>
        <h2>How enquiries are processed</h2>
        <p>
          When delivery is configured, the website sends your enquiry to Valore
          through its email provider, Resend. Valore and the email and hosting
          providers involved in delivery may process enquiry information.
          Provider processing may occur outside Canada; the business must
          confirm its actual arrangements before launch.
        </p>
        <p>
          In this local preview, delivery credentials are not connected. The
          form reports this and does not show a successful submission. The
          application does not store an enquiry database or place your form
          details in the page URL.
        </p>
        <h2>Spam prevention and technical information</h2>
        <p>
          The website uses validation, a hidden spam field and submission timing
          checks. When configured, rate limiting uses a salted hash of a network
          address rather than the raw address, with an approximately one-hour
          expiry in the application rate-limit store. Hosting and email
          providers may keep separate operational logs according to their
          policies.
        </p>
        <h2>Cookies and analytics</h2>
        <p>
          The application does not set marketing or analytics cookies and does
          not load advertising trackers. The hosting platform may maintain
          essential infrastructure records. Any future analytics or tracking
          changes require an updated policy and any appropriate consent.
        </p>
        <h2>Retention and access</h2>
        <p>
          Valore must establish a retention schedule for enquiry emails and a
          process to receive access, correction and deletion requests before
          launch. Withdrawal of consent and other requests should be directed to
          the confirmed privacy contact once available. Applicable requirements
          and legitimate retention needs will be reviewed by the business.
        </p>
        <h2>Questions about privacy</h2>
        <p>
          {c.business.previewContacts ? (
            "A verified privacy contact has not yet been supplied. This local preview’s contact details are illustrative and should not be used for privacy requests."
          ) : (
            <>
              Contact{" "}
              <a href={`mailto:${c.business.email}`}>{c.business.email}</a> to
              ask about your personal information.
            </>
          )}
        </p>
        <h2>Policy updates</h2>
        <p>
          This policy must be reviewed when the actual hosting, email, content
          management or information handling arrangements change. A confirmed
          effective date will be added after business and privacy review.
        </p>
      </article>
    </>
  );
}
