"use client";

import { useState } from "react";

interface AccordionProps {
  items: Array<[title: string, body: string]>;
  defaultOpenIndex?: number;
}

export function Accordion({ items, defaultOpenIndex = 0 }: AccordionProps) {
  const [open, setOpen] = useState<number>(defaultOpenIndex);

  return (
    <div className="mt-8 border-t line">
      {items.map(([heading, body], idx) => (
        <div key={heading} className="border-b line">
          <button
            type="button"
            className="w-full flex justify-between py-4 text-xs tracking-[0.2em] uppercase"
            onClick={() => setOpen(open === idx ? -1 : idx)}
          >
            {heading}
            <span
              className="transition-transform duration-300 text-base leading-none"
              style={{ transform: open === idx ? "rotate(45deg)" : "none" }}
            >
              +
            </span>
          </button>
          <div
            className="grid transition-[grid-template-rows] duration-500 ease-out"
            style={{ gridTemplateRows: open === idx ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <p className="mute text-sm pb-4 leading-relaxed">{body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

