"use client";

import { money } from "@/config/utils";
import { useOrderStore } from "@/service/orders/service";

export default function AdminCustomersPage() {
  const orders = useOrderStore((s) => s.orders);

  // Derive unique customers and their lifetime statistics from orders
  const customerMap = new Map<
    string,
    { name: string; email: string; orderCount: number; totalSpend: number; lastOrder: string }
  >();

  for (const o of orders) {
    const existing = customerMap.get(o.customerEmail);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpend += o.total;
    } else {
      customerMap.set(o.customerEmail, {
        name: o.customerName,
        email: o.customerEmail,
        orderCount: 1,
        totalSpend: o.total,
        lastOrder: o.createdAt,
      });
    }
  }

  const customers = Array.from(customerMap.values());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="serif text-3xl font-medium">Customer Intelligence</h1>
        <p className="mute text-xs mt-1">
          Customer roster, lifetime order frequency, and value analytics
        </p>
      </div>

      <div className="card border line bg-white overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b line bg-neutral-50 tracking-wider uppercase text-[11px] mute">
              <th className="p-4">Customer Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Total Orders</th>
              <th className="p-4">Lifetime Spend</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y line">
            {customers.map((c) => (
              <tr key={c.email} className="hover:bg-neutral-50/70 transition-colors">
                <td className="p-4 font-semibold">{c.name}</td>
                <td className="p-4 mute">{c.email}</td>
                <td className="p-4">{c.orderCount} order(s)</td>
                <td className="p-4 font-medium">{money(c.totalSpend)}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 text-[10px] tracking-widest uppercase bg-emerald-50 text-emerald-700">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

