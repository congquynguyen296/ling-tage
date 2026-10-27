"use client";

import { useEffect, useRef, useState } from "react";
import { SORT_OPTIONS } from "@/service/products/mock";

interface SortDropdownProps {
  value: "new" | "lo" | "hi";
  onChange: (next: "new" | "lo" | "hi") => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const activeLabel = SORT_OPTIONS.find((s) => s[0] === value)?.[1] || "Newest";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase py-2"
      >
        <span className="mute">Sort</span>
        <span>{activeLabel}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          style={{
            transition: "transform .3s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          <path
            d="M1 3l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </button>

      <div
        className="absolute right-0 top-full mt-2 w-60 z-20 shadow-xl"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--line)",
          opacity: open ? 1 : 0,
          transform: open ? "none" : "translateY(-8px)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .2s,transform .3s cubic-bezier(.2,.7,.2,1)",
        }}
      >
        {SORT_OPTIONS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              onChange(key);
              setOpen(false);
            }}
            className={`w-full flex justify-between items-center px-5 py-3.5 text-[11px] tracking-[0.15em] uppercase text-left hover:bg-[color:var(--card)] transition-colors ${
              key === value ? "" : "mute"
            }`}
          >
            {label}
            {key === value && <span>✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

