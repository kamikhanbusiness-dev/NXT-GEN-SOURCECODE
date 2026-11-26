"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox as UiCheckbox } from "@/components/ui/checkbox";

/** Shared sizing for form controls: large tap targets and brand focus ring. */
const controlClass = "h-12 rounded-xl border-input bg-white px-4 text-base md:text-base focus-visible:ring-4";

/** Class for native <select> elements so they match the shadcn inputs. */
export const inputClass = (invalid?: boolean) =>
  `block w-full h-12 rounded-xl border bg-white px-4 text-base text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/50 ${
    invalid ? "border-destructive ring-3 ring-destructive/20" : "border-input"
  }`;

type FieldProps = { label: ReactNode; error?: string; hint?: ReactNode; required?: boolean; className?: string };

/** shadcn <Label> + control + hint/error, wired up with the right aria attributes. */
export function Field({
  label,
  error,
  hint,
  required,
  className = "",
  children,
}: FieldProps & { children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode }) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`grid content-start gap-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-semibold text-navy-900">
        <span>
          {label}
          {required && <span className="text-primary"> *</span>}
        </span>
      </Label>
      {children({ id, "aria-invalid": !!error, "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="flex animate-fade-up items-center gap-1.5 text-sm font-medium text-destructive">
      <Icon name="info" className="size-4 shrink-0" /> {message}
    </p>
  );
}

/** shadcn <Input>; invalid styling comes from aria-invalid (set by <Field>, or via `invalid`). */
export function TextInput({ invalid, className = "", ...props }: ComponentProps<"input"> & { invalid?: boolean }) {
  return <Input aria-invalid={invalid || undefined} {...props} className={`${controlClass} ${className}`} />;
}

export function TextArea({ className = "", ...props }: ComponentProps<"textarea">) {
  return <Textarea {...props} className={`min-h-28 rounded-xl border-input bg-white px-4 py-3 text-base md:text-base focus-visible:ring-4 ${className}`} />;
}

/** shadcn <Checkbox> with a clickable label. */
export function Checkbox({
  label,
  error,
  checked,
  onCheckedChange,
}: {
  label: ReactNode;
  error?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <div className="flex items-start gap-3">
        <UiCheckbox
          id={id}
          checked={checked}
          onCheckedChange={(v) => onCheckedChange(v === true)}
          aria-invalid={!!error}
          className="mt-0.5 size-5 rounded-md border-2 border-input data-checked:border-secondary data-checked:bg-secondary [&_svg]:size-4"
        />
        <Label htmlFor={id} className="block cursor-pointer text-sm leading-relaxed font-normal text-foreground">
          {label}
        </Label>
      </div>
      <FieldError message={error} />
    </div>
  );
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isUkPhone = (v: string) => /^(?:\+44\s?|0)(?:\d\s?){9,10}$/.test(v.trim());
export const isUkPostcode = (v: string) => /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(v.trim());

/** Prototype only: pretend to submit so loading/success states can be demoed. */
export const simulateSubmit = () => new Promise<void>((r) => setTimeout(r, 1200));

export function Spinner() {
  return <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />;
}
