import Link from "next/link";
import { Logo } from "./ui";
import type { SiteContent } from "@/lib/content-schema";
export function Footer({ business }: { business: SiteContent["business"] }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Logo light />
            <p>
              Thoughtful management.
              <br />
              Confident ownership.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <nav aria-label="Footer navigation">
              <Link href="/about">About Valore</Link>
              <Link href="/services">Our services</Link>
              <Link href="/pricing">Plans & pricing</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
          <div>
            <h3>For property owners</h3>
            <nav aria-label="Property owner links">
              <Link href="/get-a-quote">Get a Free Quote</Link>
              <Link href="/services#leasing">Tenant placement</Link>
              <Link href="/services#maintenance">Maintenance coordination</Link>
            </nav>
          </div>
          <div className="footer-area">
            <h3>Rooted in the GTA.</h3>
            <p>
              Supporting property owners
              <br />
              across Ontario.
            </p>
            <p className="small">
              Service availability confirmed
              <br />
              for each property.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {business.name}.
          </p>
          <p>Architectural imagery is illustrative.</p>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
