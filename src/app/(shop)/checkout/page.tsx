"use client";

import { Crumbs } from "@/components/ui/Crumbs";
import { OrderSummaryAside } from "@/components/checkout/OrderSummaryAside";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutEmpty } from "@/components/checkout/CheckoutEmpty";
import { useCheckout } from "@/hooks/useCheckout";

export default function CheckoutPage() {
  const checkout = useCheckout();

  if (!checkout.items.length) {
    return <CheckoutEmpty />;
  }

  return (
    <section className="max-w-[1200px] mx-auto px-5 py-12">
      <Crumbs items={[["Cart", "/cart"], ["Checkout"]]} />
      <h1 className="serif text-4xl mt-4 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <CheckoutForm checkout={checkout} />

        <OrderSummaryAside
          items={checkout.items}
          subtotal={checkout.subtotal}
          discountAmount={checkout.discountAmount}
          shippingFee={checkout.shippingFee}
          total={checkout.total}
        />
      </div>
    </section>
  );
}
