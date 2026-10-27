"use client";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { SiteContent } from "@/lib/content-schema";
import { TextLink } from "./ui";
export function ServiceShowcase({
  services,
}: {
  services: SiteContent["services"];
}) {
  const [active, setActive] = useState(0);
  const selected = services[active];
  return (
    <div className="service-showcase">
      <div className="service-photo">
        <Image
          key={selected.image}
          src={selected.image}
          alt={selected.imageAlt}
          fill
          sizes="(max-width: 767px) 100vw, 48vw"
        />
        <span className="photo-note">Spaces worth caring for.</span>
      </div>
      <div className="service-index">
        <h2>
          Consider every
          <br />
          detail handled.
        </h2>
        <p className="section-copy">
          The support you need. The attention your property deserves.
        </p>
        <div className="service-options">
          {services.map((service, i) => (
            <div
              className={`service-option ${i === active ? "selected" : ""}`}
              key={service.id}
            >
              <button
                type="button"
                aria-expanded={i === active}
                aria-controls={`service-panel-${i}`}
                onClick={() => setActive(i)}
              >
                {service.title}
                <ArrowUpRight size={22} strokeWidth={1.3} aria-hidden="true" />
              </button>
              <div id={`service-panel-${i}`} hidden={i !== active}>
                <p>{service.description}</p>
                <TextLink href={`/services#${service.id}`}>
                  Explore {service.title.toLowerCase()}
                </TextLink>
              </div>
            </div>
          ))}
        </div>
        <TextLink href={`/get-a-quote?service=${selected.id}`}>
          Discuss this service
        </TextLink>
      </div>
    </div>
  );
}
