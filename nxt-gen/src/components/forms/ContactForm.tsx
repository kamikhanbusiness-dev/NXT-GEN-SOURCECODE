"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/primitives";
import { Checkbox, Field, Spinner, TextArea, TextInput, inputClass, isEmail, isUkPhone, simulateSubmit } from "./fields";

const subjects = ["New installation", "Servicing / maintenance", "Repair / breakdown", "Commercial project", "Something else"];
const empty = { name: "", email: "", phone: "", subject: "", message: "", consent: false };
type Values = typeof empty;

function validate(v: Values) {
  const e: Partial<Record<keyof Values, string>> = {};
  if (v.name.trim().length < 2) e.name = "Enter your name";
  if (!isEmail(v.email)) e.email = "Enter a valid email address, e.g. name@example.com";
  if (v.phone && !isUkPhone(v.phone)) e.phone = "Enter a UK phone number, or leave blank";
  if (!v.subject) e.subject = "Choose what your enquiry is about";
  if (v.message.trim().length < 10) e.message = "Tell us a little more (at least 10 characters)";
  if (!v.consent) e.consent = "Please agree so we can reply to you";
  return e;
}

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const errors = submitted ? validate(values) : {};

  const set = <K extends keyof Values>(k: K, v: Values[K]) => setValues((s) => ({ ...s, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(validate(values)).length) {
      // Move focus to the first invalid field for keyboard/screen-reader users.
      requestAnimationFrame(() => (document.querySelector("[aria-invalid=true]") as HTMLElement | null)?.focus());
      return;
    }
    setStatus("loading");
    await simulateSubmit();
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div role="status" className="mt-8 animate-fade-up rounded-2xl bg-brand-50 p-8 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-600 text-white">
          <Icon name="check" className="size-8" strokeWidth={3} />
        </span>
        <h3 className="mt-5 text-2xl font-bold">Thanks, {values.name.split(" ")[0]}!</h3>
        <p className="mt-2 text-slate-600">We&apos;ve received your message and will get back to you within one working day.</p>
        <button
          type="button"
          onClick={() => {
            setValues(empty);
            setSubmitted(false);
            setStatus("idle");
          }}
          className="mt-6 font-semibold text-brand-700 underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-5 sm:grid-cols-2">
      <Field label="Full name" required error={errors.name}>
        {(a) => <TextInput {...a} autoComplete="name" value={values.name} invalid={!!errors.name} onChange={(e) => set("name", e.target.value)} />}
      </Field>
      <Field label="Email" required error={errors.email}>
        {(a) => (
          <TextInput {...a} type="email" autoComplete="email" value={values.email} invalid={!!errors.email} onChange={(e) => set("email", e.target.value)} />
        )}
      </Field>
      <Field label="Phone" error={errors.phone} hint="Optional — for a quicker reply">
        {(a) => (
          <TextInput {...a} type="tel" autoComplete="tel" value={values.phone} invalid={!!errors.phone} onChange={(e) => set("phone", e.target.value)} />
        )}
      </Field>
      <Field label="Enquiry about" required error={errors.subject}>
        {(a) => (
          <select {...a} value={values.subject} onChange={(e) => set("subject", e.target.value)} className={inputClass(!!errors.subject)}>
            <option value="">Please choose…</option>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
      </Field>
      <Field label="Message" required error={errors.message} className="sm:col-span-2">
        {(a) => (
          <TextArea
            {...a}
            rows={5}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Tell us about your property and what you need…"
          />
        )}
      </Field>
      <div className="sm:col-span-2">
        <Checkbox
          checked={values.consent}
          onCheckedChange={(v) => set("consent", v)}
          error={errors.consent}
          label={
            <>
              I agree to be contacted about my enquiry and accept the{" "}
              <Link href="/contact" className="font-semibold text-accent-700 underline">
                privacy policy
              </Link>
              .
            </>
          }
        />
      </div>
      {/* Honeypot for spam bots — hidden from people and assistive tech */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={status === "loading"} className="w-full sm:w-auto" icon={status === "loading" ? undefined : "arrowRight"}>
          {status === "loading" ? (
            <>
              <Spinner /> Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>
      </div>
    </form>
  );
}
