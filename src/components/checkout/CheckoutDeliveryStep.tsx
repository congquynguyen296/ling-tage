"use client";

import { money, shipFee } from "@/config/utils";

interface CheckoutDeliveryStepProps {
  deliveryMethod: "std" | "exp";
  discountedSubtotal: number;
  onChange: (method: "std" | "exp") => void;
}

export function CheckoutDeliveryStep({
  deliveryMethod,
  discountedSubtotal,
  onChange,
}: CheckoutDeliveryStepProps) {
  const deliveryOptions = [
    {
      key: "std" as const,
      label: "Standard (3–5 days)",
      priceText: shipFee(discountedSubtotal, "std")
        ? money(shipFee(discountedSubtotal, "std"))
        : "Free",
    },
    {
      key: "exp" as const,
      label: "Express (1–2 days)",
      priceText: "$25",
    },
  ];

  return (
    <div>
      <h2 className="text-xs tracking-[0.25em] uppercase mb-4">Delivery</h2>
      {deliveryOptions.map(({ key, label, priceText }) => (
        <label
          key={key}
          className="flex justify-between border line p-4 mb-2 text-sm cursor-pointer hover:border-[color:var(--fg)] transition-colors"
        >
          <span>
            <input
              type="radio"
              name="deliveryMethod"
              checked={deliveryMethod === key}
              onChange={() => onChange(key)}
              className="mr-3"
            />
            {label}
          </span>
          <span>{priceText}</span>
        </label>
      ))}
    </div>
  );
}

