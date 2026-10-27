"use client";

import { Field } from "@/components/ui/Field";

interface CheckoutContactStepProps {
  email: string;
  error?: string;
  onChange: (val: string) => void;
}

export function CheckoutContactStep({
  email,
  error,
  onChange,
}: CheckoutContactStepProps) {
  return (
    <div>
      <h2 className="text-xs tracking-[0.25em] uppercase mb-4">Contact</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Email"
          value={email}
          onChange={onChange}
          error={error}
          span
          placeholder="you@example.com"
          type="email"
        />
      </div>
    </div>
  );
}

