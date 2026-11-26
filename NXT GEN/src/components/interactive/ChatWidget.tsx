"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { Icon } from "@/components/ui/Icon";
import { isUkPhone, simulateSubmit, Spinner } from "@/components/forms/fields";

/**
 * Floating red chat bubble with a quick-help panel and a "request a
 * callback" mini form. Prototype: the callback request is simulated.
 */
export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "error" | "sending" | "sent">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !isUkPhone(phone)) return setState("error");
    setState("sending");
    await simulateSubmit();
    setState("sent");
  }

  return (
    // On the quote page the mobile price bar owns the bottom of the screen.
    <div className={`fixed right-4 bottom-20 z-40 flex-col items-end gap-3 sm:right-6 sm:bottom-6 ${pathname === "/get-a-quote" ? "hidden sm:flex" : "flex"}`}>
      {open && (
        <div
          id="chat-panel"
          role="dialog"
          aria-label="Chat with us"
          className="w-[min(22rem,calc(100vw-2rem))] origin-bottom-right animate-pop-in overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-12px_rgba(7,11,24,0.45)] ring-1 ring-black/5"
        >
          <div className="bg-navy-900 p-5 text-white">
            <div className="flex items-center gap-3">
              <span className="relative grid size-11 place-items-center rounded-full bg-white text-accent-600">
                <Icon name="engineer" className="size-6" />
                <span className="absolute right-0 bottom-0 size-3 rounded-full bg-emerald-400 ring-2 ring-navy-900" />
              </span>
              <div>
                <p className="font-display font-bold">NXTGEN team</p>
                <p className="text-sm text-white/70">Typically replies in minutes</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 p-5">
            <p className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-mist px-4 py-3 text-sm">
              Hi there 👋 How can we help you stay comfortable today?
            </p>
            <div className="grid gap-2">
              <Link href="/get-a-quote" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition-colors hover:border-brand-400 hover:bg-brand-50">
                Get an instant quote <Icon name="arrowRight" className="size-4 text-brand-600" />
              </Link>
              <a href={site.phoneHref} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition-colors hover:border-brand-400 hover:bg-brand-50">
                Call {site.phone} <Icon name="phone" className="size-4 text-brand-600" />
              </a>
            </div>

            {state === "sent" ? (
              <p role="status" className="animate-pop-in rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                Thanks {name.split(" ")[0]}! We&apos;ll call you back shortly.
              </p>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-2 border-t border-slate-100 pt-4">
                <p className="text-sm font-semibold text-navy-900">Or request a callback</p>
                <input
                  aria-label="Your name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    aria-label="Phone number"
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 min-w-0 flex-1 rounded-xl border border-slate-300 px-3 text-sm focus:border-brand-400 focus:ring-4 focus:ring-brand-400/20 focus:outline-none"
                  />
                  <button type="submit" disabled={state === "sending"} aria-label="Request callback" className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-600 text-white hover:bg-accent-700">
                    {state === "sending" ? <Spinner /> : <Icon name="send" className="size-5" />}
                  </button>
                </div>
                {state === "error" && <p className="text-xs font-medium text-accent-700">Please enter your name and a UK phone number.</p>}
              </form>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close chat" : "Chat with us"}
        className="relative grid size-16 place-items-center rounded-full bg-accent-600 text-white shadow-[0_12px_30px_-8px_rgba(200,54,58,0.7)] transition-transform hover:scale-110 active:scale-95"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-accent-600 opacity-30" aria-hidden="true" />}
        <Icon name={open ? "x" : "chat"} className="relative size-7" />
      </button>
    </div>
  );
}
