"use client";

import { Field } from "@/components/ui/Field";
import { PAYMENT_CONFIG } from "@/config/payment";
import { CheckoutFormInput } from "@/service/orders/schema";

interface CheckoutPaymentStepProps {
  form: Pick<CheckoutFormInput, "paymentMethod" | "card" | "exp" | "cvc">;
  errors: Record<string, string>;
  onChange: <K extends keyof CheckoutFormInput>(
    key: K,
    val: CheckoutFormInput[K]
  ) => void;
}

export function CheckoutPaymentStep({
  form,
  errors,
  onChange,
}: CheckoutPaymentStepProps) {
  return (
    <div>
      <h2 className="text-xs tracking-[0.25em] uppercase mb-3">Payment</h2>
      <div className="space-y-2 mb-5">
        {(["online", "cod"] as const).map((pm) => (
          <label
            key={pm}
            className="flex items-start gap-3 border line p-4 text-sm cursor-pointer hover:border-[color:var(--fg)] transition-colors"
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={form.paymentMethod === pm}
              onChange={() => onChange("paymentMethod", pm)}
              className="mt-1"
            />
            <div>
              <div className="font-medium">
                {PAYMENT_CONFIG.providers[pm].label}
              </div>
              <div className="mute text-xs mt-0.5">
                {PAYMENT_CONFIG.providers[pm].description}
              </div>
            </div>
          </label>
        ))}
      </div>

      {form.paymentMethod === "online" && (
        <>
          <p className="text-xs mute mb-4">
            Demo only. Please don’t enter real card details.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Card number"
              value={form.card || ""}
              onChange={(v) => onChange("card", v)}
              error={errors.card}
              span
              placeholder="4242 4242 4242 4242"
            />
            <Field
              label="Expiry"
              value={form.exp || ""}
              onChange={(v) => onChange("exp", v)}
              error={errors.exp}
              placeholder="MM / YY"
            />
            <Field
              label="CVC"
              value={form.cvc || ""}
              onChange={(v) => onChange("cvc", v)}
              error={errors.cvc}
              placeholder="123"
            />
          </div>
        </>
      )}
    </div>
  );
}

