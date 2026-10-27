"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { create } from "zustand";

interface FlyingParticle {
  id: string;
  image: string;
  startX: number;
  startY: number;
}

interface FlyToCartState {
  particles: FlyingParticle[];
  triggerFly: (image: string, startElement?: HTMLElement | null) => void;
  removeParticle: (id: string) => void;
}

export const useFlyToCart = create<FlyToCartState>((set) => ({
  particles: [],
  triggerFly: (image, startElement) => {
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (startElement) {
      const rect = startElement.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      particles: [...state.particles, { id, image, startX, startY }],
    }));
  },
  removeParticle: (id) =>
    set((state) => ({
      particles: state.particles.filter((p) => p.id !== id),
    })),
}));

export function flyToCart(image: string, startElement?: HTMLElement | null) {
  useFlyToCart.getState().triggerFly(image, startElement);
}

const FLY_DURATION = 900; // Slower, more perceptible particle animation (was 650ms)

function ParticleItem({
  particle,
  onComplete,
}: {
  particle: FlyingParticle;
  onComplete: () => void;
}) {
  const [active, setActive] = useState(false);
  const [endPos, setEndPos] = useState({ x: window.innerWidth - 45, y: 35 });

  useEffect(() => {
    const cartEl = document.getElementById("header-cart-icon");
    if (cartEl) {
      const rect = cartEl.getBoundingClientRect();
      setEndPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    // Trigger animation next frame
    const timer = requestAnimationFrame(() => {
      setActive(true);
    });

    // Remove particle and bump cart icon when it reaches target
    const cleanupTimer = setTimeout(() => {
      const cartTarget = document.getElementById("header-cart-icon");
      if (cartTarget) {
        cartTarget.classList.remove("cart-bump");
        void cartTarget.offsetWidth; // force reflow
        cartTarget.classList.add("cart-bump");
      }
      onComplete();
    }, FLY_DURATION);

    return () => {
      cancelAnimationFrame(timer);
      clearTimeout(cleanupTimer);
    };
  }, [particle, onComplete]);

  const currentX = active ? endPos.x - 14 : particle.startX - 28;
  const currentY = active ? endPos.y - 18 : particle.startY - 35;
  const currentScale = active ? 0.2 : 1;
  const currentOpacity = active ? 0.25 : 1;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale})`,
        opacity: currentOpacity,
        transition: active
          ? `transform ${FLY_DURATION}ms cubic-bezier(0.2, 0.8, 0.25, 1), opacity ${FLY_DURATION}ms cubic-bezier(0.4, 0, 1, 1)`
          : "none",
        width: "56px",
        height: "70px",
        zIndex: 99999,
        pointerEvents: "none",
        borderRadius: "6px",
      }}
      className="overflow-hidden shadow-2xl border border-white bg-white/95 backdrop-blur-sm"
    >
      <img
        src={particle.image}
        alt="Fly to cart"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            "/images/products/p1-01.jpg";
        }}
      />
    </div>
  );
}

export function FlyToCartContainer() {
  const particles = useFlyToCart((s) => s.particles);
  const removeParticle = useFlyToCart((s) => s.removeParticle);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || particles.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      {particles.map((p) => (
        <ParticleItem
          key={p.id}
          particle={p}
          onComplete={() => removeParticle(p.id)}
        />
      ))}
    </div>,
    document.body
  );
}

