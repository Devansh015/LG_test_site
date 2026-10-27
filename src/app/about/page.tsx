import Image from "next/image";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageIntro, FinalCTA, TextLink } from "@/components/ui";
export const generateMetadata = () => pageMetadata("/about");
export default async function AboutPage() {
  const c = await getContent();
  const values = [
    [
      "Professionalism",
      "A considered approach to your property and the people connected to it.",
    ],
    [
      "Transparency",
      "Clear scope, clear fees and straightforward conversations.",
    ],
    [
      "Accountability",
      "Agreed responsibilities and visibility into the next steps.",
    ],
    [
      "Responsiveness",
      "Attentive communication that keeps property matters moving.",
    ],
    [
      "Long-term thinking",
      "Care for today, with the future of your property in mind.",
    ],
  ];
  return (
    <>
      <PageIntro title={c.about.title} description={c.about.description} />
      <div className="full-width-image">
        <Image
          src="/images/residence.jpg"
          alt="Contemporary residential interior with natural materials and a view through large windows"
          fill
          sizes="100vw"
          preload
        />
      </div>
      <section className="section container">
        <div className="about-story">
          <h2>
            For the property.
            <br />
            For the owner.
            <br />
            For the long term.
          </h2>
          <div>
            <p>{c.about.story}</p>
            <p>{c.about.commitment}</p>
            <h3>Our purpose is straightforward.</h3>
            <p>{c.about.mission}</p>
            <TextLink href="/services">See how we can support you</TextLink>
          </div>
        </div>
      </section>
      <section className="section paper">
        <div className="container">
          <h2>The principles behind the work.</h2>
          <ul className="values-list">
            {values.map(([title, description]) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section container">
        <div className="about-story">
          <h2>
            Local attention.
            <br />
            Owner-first thinking.
          </h2>
          <div>
            <p>
              Our work starts with your priorities: the property you own, the
              support you need and the level of involvement that works for you.
            </p>
            <p>
              We focus on the GTA and consider property-specific service
              arrangements across Ontario. We confirm local support, on-site
              needs and service scope before you commit.
            </p>
            <p>
              Whether you live nearby or manage ownership from a distance, the
              objective stays the same: clear information and more manageable
              day-to-day responsibilities.
            </p>
            <TextLink href="/get-a-quote">Start a conversation</TextLink>
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
