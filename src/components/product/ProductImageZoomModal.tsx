"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Product } from "@/types";
import { getSafeProductImage } from "@/config/utils";

interface ProductImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  activeIndex: number;
}

export function ProductImageZoomModal({
  isOpen,
  onClose,
  product,
  activeIndex,
}: ProductImageZoomModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll (both html and body) and handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const currentImageSrc = getSafeProductImage(product, activeIndex);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  // Render via portal directly to document.body so that sticky header and all other elements are covered
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Zoom Preview"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none"
    >
      {/* Vertical rectangular popup matching product image proportions */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-[85vh] max-h-[85vh] w-[90vw] max-w-[540px] aspect-[3/4] sm:aspect-[4/5] bg-[#ededed] border border-neutral-300 shadow-2xl overflow-hidden flex items-center justify-center"
      >
        {/* Minimal Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close zoom preview"
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-black shadow-md flex items-center justify-center text-xs z-30 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
        >
          ✕
        </button>

        {/* Zoom Area */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair"
        >
          <img
            src={currentImageSrc}
            alt={product.name}
            style={{
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transform: isHovered ? "scale(2.5)" : "scale(1)",
              transition: isHovered
                ? "transform 0.15s ease-out"
                : "all 0.25s ease-out",
            }}
            className="w-full h-full object-contain pointer-events-none select-none"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/images/products/p1-01.jpg";
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
