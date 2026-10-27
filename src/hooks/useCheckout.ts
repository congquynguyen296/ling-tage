"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/service/auth/store";
import { useOrderStore } from "@/service/orders/service";
import { CheckoutFormInput, CheckoutFormSchema } from "@/service/orders/schema";
import { submitOrderAction } from "@/service/orders/actions";
import { shipFee } from "@/config/utils";

export function useCheckout() {
  const router = useRouter();
  const {
    items,
    subtotal,
    discountAmount,
    discountedSubtotal,
    discountRate,
    clearCart,
  } = useCart();

  const user = useAuthStore((s) => s.user);
  const addOrder = useOrderStore((s) => s.addOrder);

  const [form, setForm] = useState<CheckoutFormInput>({
    email: "",
    first: "",
    last: "",
    phone: "",
    addr: "",
    city: "",
    zip: "",
    country: "Vietnam",
    deliveryMethod: "std",
    paymentMethod: "online",
    card: "",
    exp: "",
    cvc: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Prefill from logged-in user & default address if available
  useEffect(() => {
    if (user) {
      const defAddr = user.addresses?.[0];
      setForm((prev) => ({
        ...prev,
        email: prev.email || user.email,
        first: prev.first || defAddr?.firstName || user.name,
        last: prev.last || defAddr?.lastName || "",
        phone: prev.phone || defAddr?.phone || "",
        addr: prev.addr || defAddr?.addressLine || "",
        city: prev.city || defAddr?.city || "",
        zip: prev.zip || defAddr?.postalCode || "",
        country: defAddr?.country || prev.country,
      }));
    }
  }, [user]);

  const shippingFee = shipFee(discountedSubtotal, form.deliveryMethod);
  const total = discountedSubtotal + shippingFee;

  const updateField = <K extends keyof CheckoutFormInput>(
    key: K,
    val: CheckoutFormInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handlePlaceOrder = async () => {
    // Validate with Zod before sending to Spring Boot mock backend
    const parsed = CheckoutFormSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const pathKey = String(issue.path[0] || "form");
        if (!fieldErrors[pathKey]) {
          fieldErrors[pathKey] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await submitOrderAction(
        parsed.data,
        items,
        discountRate,
        (createdOrder) => {
          addOrder(createdOrder);
        }
      );
      clearCart();
      router.push(`/checkout/success?order=${response.data.orderNumber}`);
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Failed to submit order",
      });
      setSubmitting(false);
    }
  };

  return {
    form,
    errors,
    submitting,
    items,
    subtotal,
    discountAmount,
    discountedSubtotal,
    shippingFee,
    total,
    updateField,
    handlePlaceOrder,
  };
}

export type UseCheckoutReturn = ReturnType<typeof useCheckout>;

