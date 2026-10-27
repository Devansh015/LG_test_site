"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useForm, type FieldPath, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";
import {
  enquirySchema,
  propertyTypes,
  serviceOptions,
  type Enquiry,
} from "@/lib/enquiry-schema";
import { TextLink } from "./ui";

export function LeadForm({
  kind,
  initialPackage = "not-sure",
  initialService = "",
}: {
  kind: "quote" | "contact";
  initialPackage?: Enquiry["package"];
  initialService?: string;
}) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [notice, setNotice] = useState("");
  const idempotency = useRef("");
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    trigger,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<Enquiry>({
    resolver: zodResolver(enquirySchema),
    mode: "onTouched",
    defaultValues: {
      kind,
      fullName: "",
      email: "",
      phone: "",
      contactMethod: "",
      city: "",
      propertyType: "",
      units: "1",
      monthlyRent: "",
      occupancy: "",
      services: serviceOptions.some(([id]) => id === initialService)
        ? [initialService as Enquiry["services"][number]]
        : [],
      package: initialPackage,
      message: "",
      consent: false,
      website: "",
      startedAt: Date.now(),
    },
  });
  function error(name: FieldPath<Enquiry>) {
    const e = errors[name as keyof Enquiry];
    return e?.message ? (
      <p id={`${name}-error`} className="field-error">
        {String(e.message)}
      </p>
    ) : null;
  }
  function attrs(name: FieldPath<Enquiry>) {
    return {
      "aria-invalid": !!errors[name as keyof Enquiry],
      "aria-describedby": errors[name as keyof Enquiry]
        ? `${name}-error`
        : undefined,
    };
  }
  async function next() {
    const names: FieldPath<Enquiry>[] = [
      "fullName",
      "email",
      "phone",
      "contactMethod",
    ];
    const valid = await trigger(names, { shouldFocus: true });
    if (valid) {
      setStep(1);
      setStatus("idle");
      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "start",
        });
        formRef.current
          ?.querySelector<HTMLElement>('[data-step-title="property"]')
          ?.focus();
      });
    }
  }
  async function submit(values: Enquiry) {
    setStatus("idle");
    setNotice("");
    if (!idempotency.current) idempotency.current = crypto.randomUUID();
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotency.current,
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.fields) {
          for (const [key, message] of Object.entries(result.fields))
            setError(key as FieldPath<Enquiry>, {
              type: "server",
              message: String(message),
            });
        }
        throw new Error(
          result.message || "Your enquiry could not be sent. Please try again.",
        );
      }
      setStatus("success");
      setNotice("");
      requestAnimationFrame(() =>
        formRef.current?.querySelector<HTMLElement>("[data-success]")?.focus(),
      );
    } catch (e) {
      setStatus("error");
      setNotice(
        e instanceof Error
          ? e.message
          : "The connection was interrupted. Please try again; your details are still here.",
      );
    }
  }
  const onInvalid = (issues: FieldErrors<Enquiry>) => {
    if (issues.fullName || issues.email || issues.phone) {
      setStep(0);
      requestAnimationFrame(() =>
        setFocus(
          issues.fullName ? "fullName" : issues.email ? "email" : "phone",
        ),
      );
    }
  };
  return (
    <form
      className="lead-form"
      ref={formRef}
      method="post"
      action="/api/enquiries"
      noValidate
      onSubmit={handleSubmit(submit, onInvalid)}
      aria-label={kind === "quote" ? "Free quote request" : "General enquiry"}
    >
      <noscript>
        <p className="noscript-form">
          JavaScript is required to validate and securely send this form. Please
          enable it to continue. Do not include sensitive information.
        </p>
      </noscript>
      {status === "success" ? (
        <div className="form-success" tabIndex={-1} data-success role="status">
          <CheckCircle2 size={42} strokeWidth={1.2} aria-hidden="true" />
          <h2>Your enquiry is with us.</h2>
          <p>
            Thank you for getting in touch. We’ll review your details and
            respond using the contact information you provided.
          </p>
          <TextLink href="/">Return to Valore</TextLink>
        </div>
      ) : (
        <>
          {kind === "quote" && (
            <div className="form-progress">
              <ol aria-label="Quote progress">
                <li aria-current={step === 0 ? "step" : undefined}>
                  <span>1</span>Your details
                </li>
                <li aria-current={step === 1 ? "step" : undefined}>
                  <span>2</span>Your property
                </li>
              </ol>
              <span>Step {step + 1} of 2</span>
            </div>
          )}
          <input type="hidden" {...register("kind")} />
          <input
            type="hidden"
            {...register("startedAt", { valueAsNumber: true })}
          />
          <div className="honeypot" aria-hidden="true">
            <label htmlFor={`${kind}-website`}>Leave this field empty</label>
            <input
              id={`${kind}-website`}
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>
          <div hidden={kind === "quote" && step !== 0}>
            <fieldset className="form-section">
              <legend>
                {kind === "quote"
                  ? "Let’s get acquainted."
                  : "How can we help?"}
              </legend>
              <p>
                {kind === "quote"
                  ? "Start with your contact details. We’ll ask about your property next."
                  : "Share your question and the best way to reach you."}{" "}
                Required fields are marked *.
              </p>
              <div className="field-grid">
                <div className="field full">
                  <label htmlFor="fullName">Full name *</label>
                  <input
                    id="fullName"
                    autoComplete="name"
                    {...register("fullName")}
                    {...attrs("fullName")}
                  />
                  {error("fullName")}
                </div>
                <div className="field">
                  <label htmlFor="email">Email address *</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    {...attrs("email")}
                  />
                  {error("email")}
                </div>
                <div className="field">
                  <label htmlFor="phone">
                    Phone number{" "}
                    {kind === "quote" ? (
                      "*"
                    ) : (
                      <span className="optional">(optional)</span>
                    )}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    {...register("phone")}
                    {...attrs("phone")}
                  />
                  {error("phone")}
                </div>
                <div className="field full">
                  <label htmlFor="contactMethod">
                    Preferred contact method{" "}
                    <span className="optional">(optional)</span>
                  </label>
                  <select
                    id="contactMethod"
                    {...register("contactMethod")}
                    {...attrs("contactMethod")}
                  >
                    <option value="">No preference</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                  {error("contactMethod")}
                </div>
              </div>
            </fieldset>
            {kind === "quote" && (
              <div className="form-actions">
                <span className="form-reassurance">
                  A few details. A more useful recommendation.
                </span>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={next}
                >
                  Your property
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
          <div hidden={kind === "quote" && step !== 1}>
            {kind === "quote" && (
              <>
                <fieldset className="form-section">
                  <legend tabIndex={-1} data-step-title="property">
                    Tell us about your property.
                  </legend>
                  <p>
                    A few details help us recommend the right support. Required
                    fields are marked *.
                  </p>
                  <div className="field-grid">
                    <div className="field">
                      <label htmlFor="city">Property city / location *</label>
                      <input
                        id="city"
                        autoComplete="address-level2"
                        {...register("city")}
                        {...attrs("city")}
                      />
                      {error("city")}
                    </div>
                    <div className="field">
                      <label htmlFor="propertyType">Property type *</label>
                      <select
                        id="propertyType"
                        {...register("propertyType")}
                        {...attrs("propertyType")}
                      >
                        <option value="">Select property type</option>
                        {propertyTypes.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                      {error("propertyType")}
                    </div>
                    <div className="field">
                      <label htmlFor="units">Number of rental units *</label>
                      <input
                        id="units"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={100000}
                        step={1}
                        {...register("units")}
                        {...attrs("units")}
                      />
                      {error("units")}
                    </div>
                    <div className="field">
                      <label htmlFor="monthlyRent">
                        Monthly rental income (CAD){" "}
                        <span className="optional">(optional)</span>
                      </label>
                      <input
                        id="monthlyRent"
                        type="number"
                        inputMode="decimal"
                        min="0.01"
                        max="10000000"
                        step="0.01"
                        {...register("monthlyRent")}
                        {...attrs("monthlyRent")}
                      />
                      {error("monthlyRent")}
                    </div>
                    <div className="field full">
                      <label htmlFor="occupancy">
                        Occupancy status{" "}
                        <span className="optional">(optional)</span>
                      </label>
                      <select id="occupancy" {...register("occupancy")}>
                        <option value="">Select if known</option>
                        <option value="occupied">Occupied</option>
                        <option value="vacant">Vacant</option>
                        <option value="partially-occupied">
                          Partially occupied
                        </option>
                        <option value="not-sure">Not sure</option>
                      </select>
                    </div>
                  </div>
                </fieldset>
                <fieldset
                  className="choice-fieldset"
                  aria-describedby={
                    errors.services ? "services-error" : undefined
                  }
                >
                  <legend>What would you like help with? *</legend>
                  <div className="checkbox-grid">
                    {serviceOptions.map(([id, label]) => (
                      <label className="check-label" key={id}>
                        <input
                          type="checkbox"
                          value={id}
                          {...register("services")}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                  {error("services")}
                </fieldset>
                <fieldset className="choice-fieldset">
                  <legend>Package interest</legend>
                  <div className="package-choices">
                    {[
                      ["core", "Core"],
                      ["signature", "Signature"],
                      ["prestige", "Prestige"],
                      ["not-sure", "Not sure yet"],
                    ].map(([id, label]) => (
                      <label className="package-choice" key={id}>
                        <input
                          type="radio"
                          value={id}
                          {...register("package")}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            )}
            <div
              className={`field ${kind === "contact" ? "contact-message" : ""}`}
              style={kind === "contact" ? { marginTop: 24 } : undefined}
            >
              <label htmlFor="message">
                {kind === "contact"
                  ? "Your message *"
                  : "Anything else we should know?"}{" "}
                {kind === "quote" && (
                  <span className="optional">(optional)</span>
                )}
              </label>
              <textarea
                id="message"
                rows={5}
                maxLength={4000}
                {...register("message")}
                {...attrs("message")}
              />
              {error("message")}
            </div>
            <div className="consent-row">
              <label className="check-label">
                <input
                  type="checkbox"
                  {...register("consent")}
                  {...attrs("consent")}
                />
                <span>
                  I agree that Valore Property Group may use these details to
                  respond to my enquiry, as described in the{" "}
                  <Link href="/privacy-policy" target="_blank" rel="noopener">
                    Privacy Policy (opens in a new tab)
                  </Link>
                  . *
                </span>
              </label>
              {error("consent")}
            </div>
            <p className="privacy-copy">
              Your details are used to assess and respond to this enquiry. This
              does not sign you up for marketing. Please do not include tenant
              records, banking details or other sensitive information.
            </p>
            {status === "error" && (
              <div className="form-notice" role="alert">
                {notice}
              </div>
            )}
            <div className="form-actions">
              {kind === "quote" && (
                <button
                  type="button"
                  className="back-button"
                  onClick={() => {
                    setStep(0);
                    requestAnimationFrame(() => setFocus("fullName"));
                  }}
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  Back
                </button>
              )}
              <button
                type="submit"
                className="button button-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className="loading-spinner"
                      aria-hidden="true"
                    />
                    Sending enquiry…
                  </>
                ) : (
                  <>
                    {kind === "quote"
                      ? "Request My Free Quote"
                      : "Send Enquiry"}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </form>
  );
}
