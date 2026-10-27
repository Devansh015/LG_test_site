import Image from "next/image";
import {
  MessagesSquare,
  House,
  SlidersHorizontal,
  ClipboardCheck,
  ChartNoAxesCombined,
  Route,
} from "lucide-react";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/hero";
import { ServiceShowcase } from "@/components/service-showcase";
import { Button, TextLink, FinalCTA } from "@/components/ui";
import { PricingCards } from "@/components/pricing-cards";
import { Process } from "@/components/process";
import { FAQ } from "@/components/faq";
export const generateMetadata = () => pageMetadata("/");
export default async function Home() {
  const c = await getContent();
  const icons = [
    MessagesSquare,
    House,
    Route,
    SlidersHorizontal,
    ClipboardCheck,
    ChartNoAxesCombined,
  ];
  return (
    <>
      <Hero home={c.home} />
      <div className="container hero-footnote">
        <p>Property management, with an owner’s perspective.</p>
        <p>Residential management · Leasing · Property care</p>
      </div>
      <section id="introduction" className="section container">
        <div className="intro-grid">
          <div className="intro-copy">
            <h2>{c.home.introTitle}</h2>
            <p className="lead">{c.home.introDescription}</p>
            <TextLink href="/about">Get to know Valore</TextLink>
          </div>
          <div>
            <div className="intro-image">
              <Image
                src={c.home.introImage}
                alt={c.home.introImageAlt}
                fill
                sizes="(max-width: 767px) 90vw, 42vw"
              />
            </div>
            <div className="image-caption">
              <span>Care for the space. Respect for the investment.</span>
              <span>Illustrative interior</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section paper">
        <div className="container">
          <ServiceShowcase services={c.services} />
        </div>
      </section>
      <section className="section container">
        <div className="why-section">
          <div className="why-heading">
            <h2>Management built around what matters.</h2>
            <p>
              Good property management is in the everyday details. This is the
              approach we bring to yours.
            </p>
          </div>
          <div className="principles-list">
            {c.principles.map((p, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div className="principle" key={p.title}>
                  <Icon size={23} strokeWidth={1.4} aria-hidden="true" />
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section dark">
        <div className="container">
          <div className="process-header">
            <h2>
              A considered approach.
              <br />A simpler journey.
            </h2>
            <p>
              From the first conversation to everyday coordination, know what
              comes next.
            </p>
          </div>
          <Process steps={c.process} />
        </div>
      </section>
      <section className="section container">
        <div className="section-header">
          <h2>
            The right fit.
            <br />
            Clearly priced.
          </h2>
          <p>
            Three levels of property management. Transparent fees. Choose the
            support that makes sense for you.
          </p>
        </div>
        <PricingCards pricing={c.pricing} />
        <p className="pricing-note">
          All amounts in CAD. Management fees only. Repairs, contractors and
          other third-party costs are separate.
        </p>
        <div className="pricing-preview-link">
          <TextLink href="/pricing">Compare All Plans</TextLink>
        </div>
      </section>
      <section className="coverage">
        <div className="coverage-image">
          <Image
            src="/images/toronto.jpg"
            alt="Toronto skyline framed by trees from the waterfront"
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </div>
        <div className="coverage-copy">
          <h2>
            Based in the GTA.
            <br />A broader perspective.
          </h2>
          <p>
            Supporting property owners across Ontario, with our focus firmly on
            the Greater Toronto Area.
          </p>
          <p>{c.business.coverage}</p>
          <TextLink href="/get-a-quote">
            Tell us where your property is
          </TextLink>
        </div>
      </section>
      <section className="section container">
        <div className="faq-section">
          <div>
            <h2>
              A little clarity
              <br />
              goes a long way.
            </h2>
            <p>Answers to the questions property owners ask us.</p>
            <TextLink href="/contact">Have another question?</TextLink>
          </div>
          <FAQ faqs={c.faqs} />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
