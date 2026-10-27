"use client";

import { Field } from "@/components/ui/Field";
import { CheckoutFormInput } from "@/service/orders/schema";

interface CheckoutAddressStepProps {
  form: Pick<
    CheckoutFormInput,
    "first" | "last" | "addr" | "city" | "zip" | "phone" | "country"
  >;
  errors: Record<string, string>;
  onChange: <K extends keyof CheckoutFormInput>(
    key: K,
    val: CheckoutFormInput[K]
  ) => void;
}

export function CheckoutAddressStep({
  form,
  errors,
  onChange,
}: CheckoutAddressStepProps) {
  return (
    <div>
      <h2 className="text-xs tracking-[0.25em] uppercase mb-4">
        Shipping address
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="First name"
          value={form.first}
          onChange={(v) => onChange("first", v)}
          error={errors.first}
        />
        <Field
          label="Last name"
          value={form.last}
          onChange={(v) => onChange("last", v)}
          error={errors.last}
        />
        <Field
          label="Address"
          value={form.addr}
          onChange={(v) => onChange("addr", v)}
          error={errors.addr}
          span
          placeholder="Street address, apartment, suite"
        />
        <Field
          label="City"
          value={form.city}
          onChange={(v) => onChange("city", v)}
          error={errors.city}
        />
        <Field
          label="Postal code"
          value={form.zip}
          onChange={(v) => onChange("zip", v)}
          error={errors.zip}
        />
        <Field
          label="Phone (Optional)"
          value={form.phone || ""}
          onChange={(v) => onChange("phone", v)}
          error={errors.phone}
          placeholder="0901234567"
        />
        <Field
          label="Country"
          value={form.country}
          onChange={(v) => onChange("country", v)}
          error={errors.country}
        />
      </div>
    </div>
  );
}

