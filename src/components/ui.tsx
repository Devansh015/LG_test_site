import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "dark";
  className?: string;
}) {
  return (
    <Link href={href} className={`button button-${variant} ${className}`}>
      {children}
      <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
    </Link>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="text-link">
      {children}
      <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
    </Link>
  );
}
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Valore Property Group — home"
      className={`logo ${light ? "logo-light" : ""}`}
    >
      <svg viewBox="0 0 34 40" aria-hidden="true" className="logo-mark">
        <path d="M1 5h9l11 25-4.5 10z" fill="currentColor" />
        <path d="M24 0h10L19 34l-4.5-10z" fill="#B5121B" />
      </svg>
      <span className="logo-type">
        VALORE <span>PROPERTY GROUP</span>
      </span>
    </Link>
  );
}
export function PageIntro({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-intro container">
      <div className="intro-rule" />
      <h1>{title}</h1>
      {description && <p className="lead">{description}</p>}
      {children}
    </section>
  );
}
export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container final-cta-inner">
        <div>
          <h2>Your investment deserves exceptional care.</h2>
          <p>
            Discover a more professional approach to managing your rental
            property.
          </p>
        </div>
        <div className="cta-actions">
          <Button href="/get-a-quote">Request Your Free Quote</Button>
          <TextLink href="/contact">Let’s talk about your property</TextLink>
        </div>
      </div>
    </section>
  );
}
