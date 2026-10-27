"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./ui";
const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/pricing", "Pricing"],
  ["/contact", "Contact"],
];
export function Header() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 24);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([href, label]) => (
            <Link
              href={href}
              key={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href="/get-a-quote"
            className="button button-primary header-quote"
          >
            Get a Free Quote
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="menu-trigger"
            aria-label="Open navigation"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(true)}
            ref={trigger}
          >
            <Menu size={24} />
          </button>
        </div>
        <dialog
          ref={dialog}
          id="mobile-navigation"
          aria-labelledby="menu-title"
          className="mobile-dialog"
          onCancel={(e) => {
            e.preventDefault();
            close();
          }}
          onClose={() => {
            setOpen(false);
            trigger.current?.focus();
          }}
        >
          <div className="mobile-dialog-head">
            <span id="menu-title">Explore Valore</span>
            <button
              type="button"
              aria-label="Close navigation"
              className="icon-button"
              onClick={close}
            >
              <X size={25} />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {links.map(([href, label]) => (
              <Link
                onClick={close}
                href={href}
                key={href}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <Link
            onClick={close}
            href="/get-a-quote"
            className="button button-primary"
          >
            Get a Free Quote
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <p>Property care, with an owner’s perspective.</p>
        </dialog>
      </div>
    </header>
  );
}
