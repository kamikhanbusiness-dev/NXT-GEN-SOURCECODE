import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { Button as UiButton } from "./button";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

type ButtonStyle = {
  variant?: "primary" | "secondary" | "dark" | "outline" | "ghostLight" | "white";
  size?: "md" | "lg";
  icon?: IconName;
  className?: string;
};

// Thin wrappers over the shadcn/ui <Button> so pages keep a simple API.
const toShadcn = ({ variant = "primary", size = "md" }: ButtonStyle) => ({
  variant: variant === "primary" ? ("default" as const) : variant,
  size: size === "md" ? ("default" as const) : size,
});

function ButtonIcon({ name }: { name?: IconName }) {
  return name ? <Icon name={name} className="size-5 transition-transform group-hover/button:translate-x-1" /> : null;
}

/** Pill button rendered as a link (Next <Link> for internal routes, <a> for tel:/mailto:). */
export function ButtonLink({ href, children, icon, className, ...style }: ButtonStyle & { href: string; children: ReactNode }) {
  const external = href.startsWith("tel:") || href.startsWith("mailto:");
  return (
    <UiButton asChild {...toShadcn(style)} className={className}>
      {external ? (
        <a href={href}>
          {children}
          <ButtonIcon name={icon} />
        </a>
      ) : (
        <Link href={href}>
          {children}
          <ButtonIcon name={icon} />
        </Link>
      )}
    </UiButton>
  );
}

export function Button({ variant, size, icon, className, children, ...props }: ButtonStyle & ComponentProps<"button">) {
  return (
    <UiButton {...toShadcn({ variant, size })} className={className} {...props}>
      {children}
      <ButtonIcon name={icon} />
    </UiButton>
  );
}

/** Section heading. Wrap words in <em> to highlight them in brand red. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  light = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
  light?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div data-reveal="up" className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`mb-3 font-display text-base font-semibold sm:text-lg ${light ? "text-brand-100" : "text-navy-800"}`}>{eyebrow}</p>}
      <Tag
        className={`font-display text-[2rem] leading-[1.15] font-extrabold tracking-tight sm:text-[2.75rem] [&_em]:not-italic ${
          light ? "text-white [&_em]:text-navy-900" : "[&_em]:text-accent-600"
        }`}
      >
        {title}
      </Tag>
      {intro && <p className={`mt-5 text-lg leading-relaxed ${light ? "text-white/90" : "text-ink/80"}`}>{intro}</p>}
    </div>
  );
}

export function Stars({ className = "size-4" }: { className?: string }) {
  return (
    <span className="flex text-amber-400" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Split hero used at the top of inner pages: big heading + copy on the left,
 * illustration (or photo) card on the right.
 */
export function PageHero({
  title,
  children,
  art,
  actions = true,
  tone = "light",
}: {
  title: ReactNode;
  children: ReactNode;
  art: ReactNode;
  actions?: boolean;
  tone?: "light" | "ice";
}) {
  return (
    <section className={`pt-header overflow-hidden pb-16 sm:pb-24 ${tone === "ice" ? "bg-ice" : "bg-[#f7f8fa]"}`}>
      <Container className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="animate-slide-left">
          <h1 className="font-display text-[2.5rem] leading-[1.1] font-extrabold tracking-tight sm:text-6xl [&_em]:text-accent-600 [&_em]:not-italic">
            {title}
          </h1>
          <div className="mt-7 space-y-5 text-lg leading-relaxed text-ink/85 sm:text-xl">{children}</div>
          {actions && (
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/get-a-quote" size="lg">
                Get a quote
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Speak to our experts
              </ButtonLink>
            </div>
          )}
        </div>
        <div className="animate-slide-right">{art}</div>
      </Container>
    </section>
  );
}

/** Stagger scroll-reveal animations: `<li data-reveal style={revealDelay(i * 80)}>`. */
export const revealDelay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;
