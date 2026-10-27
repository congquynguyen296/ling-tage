"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crumbs } from "@/components/ui/Crumbs";
import { Field } from "@/components/ui/Field";
import { OrderSummaryAside } from "@/components/checkout/OrderSummaryAside";
import { money, shipFee } from "@/config/utils";
import { PAYMENT_CONFIG } from "@/config/payment";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/service/auth/store";
import { useOrderStore } from "@/service/orders/service";
import { CheckoutFormInput, CheckoutFormSchema } from "@/service/orders/schema";
import { submitOrderAction } from "@/service/orders/actions";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, discountedSubtotal, discountRate, clearCart } =
    useCart();
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

  if (!items.length) {
    return (
      <section className="max-w-xl mx-auto px-5 py-32 text-center">
        <p className="mb-6">Your cart is empty.</p>
        <Link href="/shop" className="btn">
          Go to shop
        </Link>
      </section>
    );
  }

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

  return (
    <section className="max-w-[1200px] mx-auto px-5 py-12">
      <Crumbs items={[["Cart", "/cart"], ["Checkout"]]} />
      <h1 className="serif text-4xl mt-4 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-10">
          {/* Contact */}
          <div>
            <h2 className="text-xs tracking-[0.25em] uppercase mb-4">Contact</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Email"
                value={form.email}
                onChange={(v) => updateField("email", v)}
                error={errors.email}
                span
                placeholder="you@example.com"
                type="email"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-xs tracking-[0.25em] uppercase mb-4">
              Shipping address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="First name"
                value={form.first}
                onChange={(v) => updateField("first", v)}
                error={errors.first}
              />
              <Field
                label="Last name"
                value={form.last}
                onChange={(v) => updateField("last", v)}
                error={errors.last}
              />
              <Field
                label="Address"
                value={form.addr}
                onChange={(v) => updateField("addr", v)}
                error={errors.addr}
                span
                placeholder="Street address, apartment, suite"
              />
              <Field
                label="City"
                value={form.city}
                onChange={(v) => updateField("city", v)}
                error={errors.city}
              />
              <Field
                label="Postal code"
                value={form.zip}
                onChange={(v) => updateField("zip", v)}
                error={errors.zip}
              />
              <Field
                label="Phone (Optional)"
                value={form.phone || ""}
                onChange={(v) => updateField("phone", v)}
                error={errors.phone}
                placeholder="0901234567"
              />
              <Field
                label="Country"
                value={form.country}
                onChange={(v) => updateField("country", v)}
                error={errors.country}
              />
            </div>
          </div>

          {/* Delivery Method */}
          <div>
            <h2 className="text-xs tracking-[0.25em] uppercase mb-4">Delivery</h2>
            {(
              [
                [
                  "std",
                  "Standard (3–5 days)",
                  shipFee(discountedSubtotal, "std")
                    ? money(shipFee(discountedSubtotal, "std"))
                    : "Free",
                ],
                ["exp", "Express (1–2 days)", "$25"],
              ] as const
            ).map(([k, label, priceText]) => (
              <label
                key={k}
                className="flex justify-between border line p-4 mb-2 text-sm cursor-pointer"
              >
                <span>
                  <input
                    type="radio"
                    checked={form.deliveryMethod === k}
                    onChange={() => updateField("deliveryMethod", k)}
                    className="mr-3"
                  />
                  {label}
                </span>
                <span>{priceText}</span>
              </label>
            ))}
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-xs tracking-[0.25em] uppercase mb-3">Payment</h2>
            <div className="space-y-2 mb-5">
              {(["online", "cod"] as const).map((pm) => (
                <label
                  key={pm}
                  className="flex items-start gap-3 border line p-4 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={form.paymentMethod === pm}
                    onChange={() => updateField("paymentMethod", pm)}
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
                    onChange={(v) => updateField("card", v)}
                    error={errors.card}
                    span
                    placeholder="4242 4242 4242 4242"
                  />
                  <Field
                    label="Expiry"
                    value={form.exp || ""}
                    onChange={(v) => updateField("exp", v)}
                    error={errors.exp}
                    placeholder="MM / YY"
                  />
                  <Field
                    label="CVC"
                    value={form.cvc || ""}
                    onChange={(v) => updateField("cvc", v)}
                    error={errors.cvc}
                    placeholder="123"
                  />
                </div>
              </>
            )}
          </div>

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

        <OrderSummaryAside
          items={items}
          subtotal={subtotal}
          discountAmount={discountAmount}
          shippingFee={shippingFee}
          total={total}
        />
      </div>
    </section>
  );
}

