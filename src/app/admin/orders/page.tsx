"use client";

import { useState } from "react";
import { money } from "@/config/utils";
import { useOrderStore } from "@/service/orders/service";
import { OrderStatus } from "@/types";
import { updateOrderStatusAction } from "@/service/orders/actions";

const ALL_STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setLoadingOrderId(orderId);
    setStatusMessage(
      `Updating order ${orderId} to ${newStatus} on Spring Boot API (2s debounce)...`
    );

    try {
      await updateOrderStatusAction(orderId, newStatus, () => {
        updateOrderStatus(orderId, newStatus);
      });
      setStatusMessage("Order status updated!");
      setTimeout(() => setStatusMessage(""), 2000);
    } catch {
      setStatusMessage("Failed to update status");
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="serif text-3xl font-medium">Orders Management</h1>
        <p className="mute text-xs mt-1">
          Review, fulfill, and update order statuses across all sales channels
        </p>
      </div>

      {statusMessage && (
        <div className="p-3 bg-neutral-900 text-white text-xs tracking-wider uppercase animate-fade-in flex items-center justify-between">
          <span>{statusMessage}</span>
          {loadingOrderId && <span className="animate-spin">⏳</span>}
        </div>
      )}

      <div className="card border line bg-white overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b line bg-neutral-50 tracking-wider uppercase text-[11px] mute">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment & Method</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y line">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-neutral-50/70 transition-colors">
                <td className="p-4 font-semibold">{o.orderNumber}</td>
                <td className="p-4">
                  <div className="font-medium">{o.customerName}</div>
                  <div className="mute text-[11px]">{o.customerEmail}</div>
                  <div className="mute text-[10px]">
                    {o.shippingAddress.city}, {o.shippingAddress.country}
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    {o.items.map((i, idx) => (
                      <div key={idx} className="mute text-[11px]">
                        • {i.productName} ({i.size}) × {i.qty}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4 font-medium">{money(o.total)}</td>
                <td className="p-4">
                  <span className="uppercase text-[11px] tracking-wider block">
                    {o.paymentMethod}
                  </span>
                  <span className="mute text-[10px]">
                    {o.deliveryMethod === "exp" ? "Express Delivery" : "Standard Delivery"}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    disabled={loadingOrderId === o.id}
                    value={o.status}
                    onChange={(e) =>
                      handleStatusChange(o.id, e.target.value as OrderStatus)
                    }
                    className={`px-2.5 py-1 text-[11px] font-semibold border line bg-white outline-none cursor-pointer ${
                      o.status === "COMPLETED"
                        ? "text-emerald-700 border-emerald-300"
                        : o.status === "SHIPPING"
                        ? "text-blue-700 border-blue-300"
                        : o.status === "CANCELLED"
                        ? "text-red-700 border-red-300"
                        : "text-neutral-700"
                    }`}
                  >
                    {ALL_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

