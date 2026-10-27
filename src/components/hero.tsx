"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowDown, MapPin } from "lucide-react";
import { Button } from "./ui";
import type { SiteContent } from "@/lib/content-schema";
export function Hero({ home }: { home: SiteContent["home"] }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top = ref.current?.getBoundingClientRect().top ?? 0;
        ref.current?.style.setProperty(
          "--hero-drift",
          `${Math.min(32, Math.max(0, -top) * 0.06)}px`,
        );
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero-photo">
        <Image
          src={home.heroImage}
          alt={home.heroImageAlt}
          fill
          sizes="100vw"
          fetchPriority="high"
          loading="eager"
        />
      </div>
      <div className="hero-shade" />
      <div className="hero-content">
        <div className="hero-heading">
          <h1 id="hero-title">
            {home.heroTitle.split("\n").map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </h1>
          <p>{home.heroDescription}</p>
          <div className="hero-actions">
            <Button href="/get-a-quote">Get a Free Quote</Button>
            <Button href="/services" variant="outline">
              Explore Our Services
            </Button>
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#introduction" className="scroll-cue">
            <ArrowDown size={17} aria-hidden="true" />
            <span>A higher standard of property care</span>
          </a>
          <p>
            <MapPin size={14} aria-hidden="true" />
            Greater Toronto Area & Ontario
          </p>
        </div>
      </div>
    </section>
  );
}
