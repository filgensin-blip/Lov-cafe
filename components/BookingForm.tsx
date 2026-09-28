"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  LIMITS,
  MAX_DAYS_AHEAD,
  MAX_PARTY_SIZE,
  addDays,
  cafeNow,
  formatBookingDate,
  isClosedDay,
  timeSlotsFor,
  validateBooking,
  weekdayOf,
  type BookingErrors,
  type BookingField,
  type BookingResponse,
} from "@/lib/booking";
import { siteInfo } from "@/data/site-info";

type FormState = Record<BookingField, string>;

const EMPTY: FormState = { name: "", email: "", phone: "", date: "", time: "", partySize: "2", notes: "" };
const FIELD_ORDER: BookingField[] = ["name", "email", "phone", "date", "time", "partySize", "notes"];

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | {
      kind: "success";
      name: string;
      email: string;
      date: string;
      time: string;
      partySize: number;
      emailSent: boolean;
    }
  | { kind: "failed" };

export function BookingForm() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [today, setToday] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  // "Today" in Maastricht, computed on the client to avoid hydration mismatch.
  useEffect(() => setToday(cafeNow().date), []);

  const slots = useMemo(() => (values.date ? timeSlotsFor(values.date) : []), [values.date]);
  const closed = values.date ? isClosedDay(values.date) : false;

  // Drop a selected time that no longer exists for the newly chosen date.
  useEffect(() => {
    if (values.time && !slots.includes(values.time)) setValues((v) => ({ ...v, time: "" }));
  }, [slots, values.time]);

  useEffect(() => {
    if (status.kind === "success" || status.kind === "failed") resultRef.current?.focus();
  }, [status.kind]);

  const set = (field: BookingField) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const focusFirstError = (errs: BookingErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status.kind === "submitting") return;

    // Instant client-side check. The server re-validates everything.
    const check = validateBooking(values);
    if (!check.ok) {
      setErrors(check.errors);
      focusFirstError(check.errors);
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...check.data, company: honeypot }),
      });
      const data = (await res.json().catch(() => null)) as BookingResponse | null;

      if (data?.ok) {
        setStatus({ kind: "success", ...check.data, emailSent: data.emailSent });
        return;
      }
      if (data && !data.ok && data.errors && Object.keys(data.errors).length > 0) {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
        focusFirstError(data.errors);
        return;
      }
      setStatus({ kind: "failed" });
    } catch {
      setStatus({ kind: "failed" });
    }
  }

  if (status.kind === "success") {
    const firstName = status.name.split(/\s+/)[0];
    // Signature moment ⑤ — the "LØV · reserved" stamp presses onto a paper ticket.
    return (
      <div role="status">
        <div className="paper relative overflow-hidden">
          <div className="p-7 md:p-10">
            <p className="eyebrow">Reservation</p>
            <h2 ref={resultRef} tabIndex={-1} className="mt-3 pr-24 text-3xl md:text-4xl">
              Thank you, <em className="italic text-matcha">{firstName}</em>.
            </h2>
          </div>
          <dl className="ticket-perforation grid grid-cols-[2fr_1fr_1fr] gap-4 px-7 py-6 md:px-10">
            {[
              ["Date", formatBookingDate(status.date).replace(/ \d{4}$/, "")],
              ["Time", status.time],
              ["Guests", String(status.partySize)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-muted">{k}</dt>
                <dd className="mt-1 font-display text-xl tabular-nums leading-tight md:text-2xl">{v}</dd>
              </div>
            ))}
          </dl>
          <Stamp className="stamp absolute right-4 top-4 h-28 w-28 text-matcha md:right-8 md:top-6 md:h-32 md:w-32" />
        </div>

        {status.emailSent ? (
          <p className="mt-6 text-lg">
            We&rsquo;ve sent a confirmation to <strong className="font-medium">{status.email}</strong>.
          </p>
        ) : (
          <p className="mt-6 text-lg">
            We&rsquo;ve received your booking, but our confirmation email didn&rsquo;t go through. To be
            safe, please call us on{" "}
            <a className="link-underline text-matcha" href={`tel:${siteInfo.phoneHref}`}>
              {siteInfo.phone}
            </a>{" "}
            to confirm.
          </p>
        )}
        <p className="mt-4 font-display text-xl italic text-matcha">We look forward to seeing you.</p>
        <button
          type="button"
          className="btn btn-outline mt-8"
          onClick={() => {
            setValues(EMPTY);
            setStatus({ kind: "idle" });
          }}
        >
          Make another booking
        </button>
      </div>
    );
  }

  const describedBy = (field: BookingField, hint?: boolean) =>
    [errors[field] ? `${field}-error` : null, hint ? `${field}-hint` : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="ledger paper space-y-8 p-6 sm:p-8 md:p-10">
      {status.kind === "failed" && (
        <div className="rounded-lg border border-[#8a3425]/30 bg-[#f6e9e3] p-5" role="alert">
          <h2 ref={resultRef} tabIndex={-1} className="font-sans text-base font-medium">
            Sorry — something went wrong on our side.
          </h2>
          <p className="mt-1">
            Your booking may not have reached us. Please try again, or call us on{" "}
            <a className="link-underline font-medium" href={`tel:${siteInfo.phoneHref}`}>
              {siteInfo.phone}
            </a>{" "}
            and we&rsquo;ll sort it out.
          </p>
        </div>
      )}

      <Field id="name" label="Name" required error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={LIMITS.name}
          className="field-input"
          value={values.name}
          onChange={(e) => set("name")(e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy("name")}
        />
      </Field>

      <Field id="email" label="Email" required error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={LIMITS.email}
          className="field-input"
          value={values.email}
          onChange={(e) => set("email")(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("email")}
        />
      </Field>

      <Field id="phone" label="Phone" optional error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={LIMITS.phone}
          className="field-input"
          value={values.phone}
          onChange={(e) => set("phone")(e.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describedBy("phone")}
        />
      </Field>

      <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
        <Field
          id="date"
          label="Date"
          required
          error={errors.date}
          hint={
            closed && !errors.date
              ? `We're closed on ${weekdayOf(values.date)}s — please choose another day.`
              : undefined
          }
        >
          <input
            id="date"
            name="date"
            type="date"
            required
            min={today ?? undefined}
            max={today ? addDays(today, MAX_DAYS_AHEAD) : undefined}
            className="field-input"
            value={values.date}
            onChange={(e) => set("date")(e.target.value)}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={describedBy("date", closed && !errors.date)}
          />
        </Field>

        <Field
          id="time"
          label="Time"
          required
          error={errors.time}
          hint={
            values.date && !closed && slots.length === 0 && !errors.time
              ? "No times left on this day — please choose another."
              : undefined
          }
        >
          <select
            id="time"
            name="time"
            required
            className="field-input"
            value={values.time}
            onChange={(e) => set("time")(e.target.value)}
            disabled={!values.date || slots.length === 0}
            aria-invalid={Boolean(errors.time)}
            aria-describedby={describedBy("time", Boolean(values.date && !closed && slots.length === 0))}
          >
            <option value="">{values.date ? "Choose a time" : "Choose a date first"}</option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id="partySize"
        label="Party size"
        required
        error={errors.partySize}
        hint={`For parties larger than ${MAX_PARTY_SIZE}, please contact us directly at ${siteInfo.phone}.`}
      >
        <select
          id="partySize"
          name="partySize"
          required
          className="field-input sm:max-w-[12rem]"
          value={values.partySize}
          onChange={(e) => set("partySize")(e.target.value)}
          aria-invalid={Boolean(errors.partySize)}
          aria-describedby={describedBy("partySize", true)}
        >
          {Array.from({ length: MAX_PARTY_SIZE }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "person" : "people"}
            </option>
          ))}
        </select>
      </Field>

      <Field id="notes" label="Notes or allergies" optional error={errors.notes}>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={LIMITS.notes}
          className="field-input resize-y"
          placeholder="A window seat, a high chair, a nut allergy…"
          value={values.notes}
          onChange={(e) => set("notes")(e.target.value)}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={describedBy("notes")}
        />
      </Field>

      {/* Honeypot — hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="pt-2">
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status.kind === "submitting"}>
          {status.kind === "submitting" ? "Sending…" : "Confirm reservation"}
        </button>
        <p className="mt-4 text-sm text-muted">
          You&rsquo;ll receive a confirmation email straight away.
        </p>
      </div>
    </form>
  );
}

/** Circular rubber stamp: "LØV · RESERVED · MAASTRICHT ·" around the Ø leaf mark. */
function Stamp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden className={className}>
      <defs>
        <path id="stamp-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <g fill="none" stroke="currentColor" opacity="0.85">
        <circle cx="60" cy="60" r="56" strokeWidth="2" />
        <circle cx="60" cy="60" r="34" strokeWidth="1" />
      </g>
      <text fill="currentColor" fontSize="10.5" letterSpacing="2.6" fontFamily="var(--font-work-sans), sans-serif">
        <textPath href="#stamp-ring">LØV · RESERVED · MAASTRICHT ·</textPath>
      </text>
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fill="currentColor"
        fontSize="34"
        fontFamily="var(--font-fraunces), serif"
      >
        Ø
      </text>
    </svg>
  );
}

function Field({
  id,
  label,
  required,
  optional,
  error,
  hint,
  children,
}: {
  id: BookingField;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-matcha">
            *
          </span>
        )}
        {optional && <span className="ml-2 text-sm font-normal text-muted">optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
    </div>
  );
}
