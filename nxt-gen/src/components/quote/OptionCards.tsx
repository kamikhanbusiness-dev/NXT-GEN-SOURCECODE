"use client";

import { useId, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { FieldError } from "@/components/forms/fields";
import { Badge } from "@/components/ui/badge";

export type Option<T extends string> = { value: T; label: string; hint?: string; icon?: IconName; badge?: string };

/**
 * Radio group rendered as large tappable cards (in the style of the
 * reference site's question cards). Uses real radio inputs so arrow-key
 * navigation and screen readers work out of the box.
 */
export function OptionCards<T extends string>({
  legend,
  description,
  options,
  value,
  onChange,
  columns = 2,
  size = "md",
  error,
}: {
  legend: ReactNode;
  description?: ReactNode;
  options: Option<T>[];
  value: T | "";
  onChange: (v: T) => void;
  columns?: 2 | 3 | 4;
  size?: "sm" | "md";
  error?: string;
}) {
  const name = useId();
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <fieldset>
      <legend className="font-display text-lg font-bold text-navy-900">{legend}</legend>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      <div className={`mt-4 grid gap-3 ${size === "sm" ? "grid-cols-2" : ""} ${cols}`}>
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={`group relative flex cursor-pointer items-center rounded-2xl border-2 bg-white transition-all duration-200 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-500/25 ${
                size === "sm" ? "min-h-14 gap-2.5 px-3 py-3 sm:gap-4 sm:px-4" : "min-h-20 gap-4 px-4 py-4"
              } ${checked ? "border-brand-500 bg-brand-50/60 shadow-md shadow-brand-500/10" : "border-slate-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"}`}
            >
              <input type="radio" name={name} value={o.value} checked={checked} onChange={() => onChange(o.value)} className="sr-only" />
              {o.icon && (
                <span
                  className={`shrink-0 place-items-center rounded-full transition-colors ${size === "sm" ? "hidden size-9 sm:grid" : "grid size-12"} ${
                    checked ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-600 group-hover:bg-brand-200"
                  }`}
                >
                  <Icon name={o.icon} className={size === "sm" ? "size-4" : "size-6"} />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className={`block font-semibold text-navy-900 ${size === "sm" ? "text-sm sm:text-base" : ""}`}>{o.label}</span>
                {o.hint && <span className="mt-0.5 block text-sm leading-snug text-slate-500">{o.hint}</span>}
              </span>
              {o.badge && <Badge className="font-bold uppercase">{o.badge}</Badge>}
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full border-2 transition-all ${
                  checked ? "scale-100 border-brand-600 bg-brand-600 text-white" : "border-slate-300 text-transparent"
                }`}
                aria-hidden="true"
              >
                <Icon name="check" className="size-3.5" strokeWidth={3.5} />
              </span>
            </label>
          );
        })}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}

/** Compact pill-style segmented control, used inside room cards. */
export function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: ReactNode;
  options: { value: T; label: string; title?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold text-navy-900">{legend}</legend>
      <div className="flex rounded-xl bg-slate-100 p-1">
        {options.map((o) => (
          <label
            key={o.value}
            title={o.title}
            className={`flex min-h-10 flex-1 cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-medium transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500 ${
              value === o.value ? "bg-white text-brand-700 shadow-sm" : "text-slate-600 hover:text-navy-900"
            }`}
          >
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
