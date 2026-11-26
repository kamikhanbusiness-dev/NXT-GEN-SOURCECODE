"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** Red strip that cycles through short trust messages. */
export function Ticker({ messages }: { messages: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 2800);
    return () => clearInterval(t);
  }, [messages.length]);

  return (
    <div className="overflow-hidden bg-accent-600 text-white" aria-live="off">
      <p key={i} className="flex h-14 animate-ticker items-center justify-center gap-3 text-lg font-medium sm:text-xl">
        <Icon name="check" className="size-6 text-brand-300" strokeWidth={3} />
        {messages[i]}
      </p>
    </div>
  );
}
