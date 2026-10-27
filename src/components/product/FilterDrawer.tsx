"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SIZE_GROUPS } from "@/service/products/mock";

export interface FilterValues {
  sizes: string[];
  maxPrice?: number;
}

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  sizes: string[];
  maxPrice?: number;
  onApply: (filters: FilterValues) => void;
}

const PRICE_TIERS: Array<[string, number | undefined]> = [
  ["All prices", undefined],
  ["Under $200", 200],
  ["Under $300", 300],
  ["Under $450", 450],
];

export function FilterDrawer({
  open,
  onClose,
  sizes,
  maxPrice,
  onApply,
}: FilterDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [draftSizes, setDraftSizes] = useState<string[]>(sizes);
  const [draftMaxPrice, setDraftMaxPrice] = useState<number | undefined>(maxPrice);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync draft state from active filters whenever the drawer opens
  useEffect(() => {
    if (open) {
      setDraftSizes(sizes);
      setDraftMaxPrice(maxPrice);
    }
  }, [open, sizes, maxPrice]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!mounted) return;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mounted]);

  // Close on Escape key press without applying
  useEffect(() => {
    if (!mounted || !open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, mounted]);

  if (!mounted) return null;

  const toggleDraftSize = (s: string) => {
    setDraftSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleClearDraft = () => {
    setDraftSizes([]);
    setDraftMaxPrice(undefined);
  };

  const handleApply = () => {
    onApply({
      sizes: draftSizes,
      maxPrice: draftMaxPrice,
    });
    onClose();
  };

  const draftCount =
    draftSizes.length + (typeof draftMaxPrice === "number" ? 1 : 0);

  return createPortal(
    <>
      {/* Backdrop covering the entire viewport */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[2px]"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .35s ease",
        }}
      />

      {/* Drawer panel floating above header and page content */}
      <aside
        className="fixed top-0 right-0 bottom-0 z-[85] w-[380px] max-w-[90vw] flex flex-col shadow-2xl"
        style={{
          background: "var(--bg)",
          paddingTop: "env(safe-area-inset-top,0px)",
          transform: open ? "none" : "translateX(100%)",
          transition: "transform .45s cubic-bezier(.7,0,.2,1)",
          visibility: open ? "visible" : "hidden",
          transitionProperty: "transform,visibility",
          transitionDelay: open ? "0s" : "0s,.45s",
        }}
      >
        <div className="flex items-center justify-between px-6 h-16 md:h-20 border-b line">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-[0.25em] uppercase font-medium">Filter</span>
            {draftCount > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[color:var(--accent)] text-white rounded-full">
                {draftCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 flex items-center justify-center -mr-2 text-lg hover:opacity-60 transition-opacity"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
          {SIZE_GROUPS.map(([groupName, list]) => (
            <div key={groupName}>
              <div className="text-[11px] tracking-[0.2em] uppercase mute mb-4">
                Size · {groupName}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {list.map((s) => {
                  const isSelected = draftSizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleDraftSize(s)}
                      className={`py-3 text-sm transition-colors ${
                        isSelected
                          ? "bg-[color:var(--accent)] text-white"
                          : "bg-[color:var(--card)] hover:brightness-95"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase mute mb-4">
              Price Range
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRICE_TIERS.map(([label, val]) => {
                const isSelected = draftMaxPrice === val;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDraftMaxPrice(val)}
                    className={`py-3 px-3 text-xs tracking-wider uppercase transition-colors ${
                      isSelected
                        ? "bg-[color:var(--accent)] text-white"
                        : "bg-[color:var(--card)] hover:brightness-95"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions: Clear draft and Apply */}
        <div className="p-6 border-t line flex items-center gap-4 bg-[color:var(--bg)]">
          <button
            type="button"
            onClick={handleClearDraft}
            className="ul text-[11px] tracking-[0.2em] uppercase mute py-2"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="btn flex-1 tracking-[0.25em]"
          >
            Apply
          </button>
        </div>
      </aside>
    </>,
    document.body
  );
}
