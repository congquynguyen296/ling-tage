"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crumbs } from "@/components/ui/Crumbs";
import { money } from "@/config/utils";
import { useAuthStore } from "@/service/auth/store";
import { useOrderStore } from "@/service/orders/service";

export default function OrderHistoryPage() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user) {
    return (
      <section className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="serif text-3xl mb-4">Orders</h1>
        <p className="mute text-sm mb-6">Please sign in to view your orders.</p>
        <Link href="/auth/login" className="btn">
          Sign In
        </Link>
      </section>
    );
  }

  // Show user's orders or all mock demo orders if testing
  const userOrders = orders.filter(
    (o) => o.customerEmail === user.email || user.email.includes("tage")
  );

  return (
    <section className="max-w-[1000px] mx-auto px-5 py-12">
      <Crumbs items={[["Home", "/"], ["Account", "/account"], ["Orders"]]} />

      <h1 className="serif text-4xl mt-4 mb-8">Order History</h1>

      {userOrders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="mute text-sm mb-6">You have no order history yet.</p>
          <Link href="/shop" className="btn">
            Explore TAGE Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div key={order.id} className="border line p-6 bg-white/40">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b line text-xs tracking-wider uppercase">
                <div>
                  <span className="font-semibold">{order.orderNumber}</span>
                  <span className="mute ml-3">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 text-[10px] tracking-widest ${
                      order.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : order.status === "SHIPPING"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-neutral-200 text-neutral-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-medium text-sm">
                    {money(order.total)}
                  </span>
                </div>
              </div>

              <div className="divide-y line">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-4 flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-16 h-20 object-cover card"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium uppercase">
                        {item.productName}
                      </div>
                      <div className="mute text-xs mt-1">
                        {item.color} · Size: {item.size} · Qty: {item.qty}
                      </div>
                    </div>
                    <div className="text-sm">{money(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t line flex justify-between items-center text-xs mute">
                <span>
                  Delivery: {order.shippingAddress.addressLine},{" "}
                  {order.shippingAddress.city}
                </span>
                <span>Payment: {order.paymentMethod.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

