"use client";

import Link from "next/link";
import { money } from "@/config/utils";
import { useProductStore } from "@/service/products/store";
import { useOrderStore } from "@/service/orders/service";

export default function AdminDashboardPage() {
  const products = useProductStore((s) => s.products);
  const orders = useOrderStore((s) => s.orders);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const lowStockVariants = products.flatMap((p) =>
    p.variants.filter((v) => v.stock <= 3).map((v) => ({ ...v, productName: p.name }))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="serif text-3xl font-medium">Dashboard Overview</h1>
        <p className="mute text-xs mt-1">Real-time store performance & operational health</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card p-6 border line bg-white">
          <div className="text-[11px] tracking-widest uppercase mute mb-2">Total Revenue</div>
          <div className="serif text-3xl">{money(totalRevenue)}</div>
          <div className="text-xs text-emerald-600 mt-2">From {orders.length} orders</div>
        </div>

        <div className="card p-6 border line bg-white">
          <div className="text-[11px] tracking-widest uppercase mute mb-2">Total Orders</div>
          <div className="serif text-3xl">{orders.length}</div>
          <div className="text-xs mute mt-2">Spring Boot Orders synced</div>
        </div>

        <div className="card p-6 border line bg-white">
          <div className="text-[11px] tracking-widest uppercase mute mb-2">Active Catalog</div>
          <div className="serif text-3xl">{products.length}</div>
          <div className="text-xs mute mt-2">Products in FW26</div>
        </div>

        <div className="card p-6 border line bg-white">
          <div className="text-[11px] tracking-widest uppercase mute mb-2">Low Stock Alerts</div>
          <div className={`serif text-3xl ${lowStockVariants.length ? "text-amber-600" : ""}`}>
            {lowStockVariants.length}
          </div>
          <div className="text-xs mute mt-2">Variants with stock ≤ 3</div>
        </div>
      </div>

      {/* Recent Orders & Stock Table */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="card border line bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs tracking-widest uppercase font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs mute hover:text-black underline">
              View all →
            </Link>
          </div>

          <div className="divide-y line">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold">{o.orderNumber}</div>
                  <div className="mute">{o.customerName} ({o.items.length} items)</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{money(o.total)}</div>
                  <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 bg-neutral-100">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card border line bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs tracking-widest uppercase font-semibold">
              Low Stock Warnings
            </h2>
            <Link href="/admin/products" className="text-xs mute hover:text-black underline">
              Manage stock →
            </Link>
          </div>

          {lowStockVariants.length === 0 ? (
            <p className="mute text-xs py-8 text-center">All variants have healthy inventory levels.</p>
          ) : (
            <div className="divide-y line">
              {lowStockVariants.slice(0, 5).map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold">{v.productName}</div>
                    <div className="mute">SKU: {v.sku} · Size: {v.size}</div>
                  </div>
                  <span className={`px-2 py-1 text-[11px] font-semibold ${
                    v.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"
                  }`}>
                    {v.stock === 0 ? "OUT OF STOCK" : `${v.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

