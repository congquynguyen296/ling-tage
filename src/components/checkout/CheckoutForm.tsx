"use client";

import { money } from "@/config/utils";
import { UseCheckoutReturn } from "@/hooks/useCheckout";
import { CheckoutContactStep } from "./CheckoutContactStep";
import { CheckoutAddressStep } from "./CheckoutAddressStep";
import { CheckoutDeliveryStep } from "./CheckoutDeliveryStep";
import { CheckoutPaymentStep } from "./CheckoutPaymentStep";

interface CheckoutFormProps {
  checkout: UseCheckoutReturn;
}

export function CheckoutForm({ checkout }: CheckoutFormProps) {
  const {
    form,
    errors,
    submitting,
    total,
    discountedSubtotal,
    updateField,
    handlePlaceOrder,
  } = checkout;

  return (
    <div className="space-y-10">
      <CheckoutContactStep
        email={form.email}
        error={errors.email}
        onChange={(v) => updateField("email", v)}
      />

      <CheckoutAddressStep
        form={form}
        errors={errors}
        onChange={updateField}
      />

      <CheckoutDeliveryStep
        deliveryMethod={form.deliveryMethod}
        discountedSubtotal={discountedSubtotal}
        onChange={(v) => updateField("deliveryMethod", v)}
      />

      <CheckoutPaymentStep
        form={form}
        errors={errors}
        onChange={updateField}
      />

      {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}

      <button
        type="button"
        disabled={submitting}
        className="btn w-full disabled:opacity-60"
        onClick={handlePlaceOrder}
      >
        {submitting
          ? "Processing Order via Spring Boot API (2s)..."
          : form.paymentMethod === "cod"
          ? `Place COD Order (${money(total)})`
          : `Pay ${money(total)}`}
      </button>
    </div>
  );
}

