"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crumbs } from "@/components/ui/Crumbs";
import { useAuthStore } from "@/service/auth/store";
import { useOrderStore } from "@/service/orders/service";
import { useProductStore } from "@/service/products/store";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const orders = useOrderStore((s) => s.orders);
  const wishlistIds = useProductStore((s) => s.wishlistIds);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user) {
    return (
      <section className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="serif text-3xl mb-4">My Account</h1>
        <p className="mute text-sm mb-8">
          Sign in to access your order history, saved addresses, and wishlist.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/auth/login" className="btn">
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="border border-current text-xs tracking-[0.25em] uppercase px-7 py-3.5"
          >
            Create Account
          </Link>
        </div>
      </section>
    );
  }

  const userOrders = orders.filter((o) => o.customerEmail === user.email);

  return (
    <section className="max-w-[1000px] mx-auto px-5 py-16">
      <Crumbs items={[["Home", "/"], ["Account"]]} />

      <div className="flex items-end justify-between mt-4 mb-10 pb-6 border-b line">
        <div>
          <h1 className="serif text-4xl">Hello, {user.name}</h1>
          <p className="mute text-sm mt-1">{user.email}</p>
          {user.role === "ADMIN" && (
            <span className="inline-block mt-2 text-[10px] tracking-widest uppercase bg-black text-white px-2 py-0.5">
              Admin Access Granted
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user.role === "ADMIN" && (
            <Link href="/admin" className="btn text-xs py-2 px-4">
              Admin Studio →
            </Link>
          )}
          <button
            onClick={logout}
            className="ul text-[11px] tracking-[0.2em] uppercase mute"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="card p-6 rv in flex flex-col justify-between">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase mb-3">
              Orders
            </div>
            <p className="mute text-sm mb-6">
              {userOrders.length > 0
                ? `${userOrders.length} order(s) placed.`
                : "No orders yet."}
            </p>
          </div>
          <Link
            href="/account/orders"
            className="ul text-[11px] tracking-[0.2em] uppercase"
          >
            {userOrders.length > 0 ? "View orders →" : "Start shopping →"}
          </Link>
        </div>

        <div className="card p-6 rv in flex flex-col justify-between">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase mb-3">
              Addresses
            </div>
            <p className="mute text-sm mb-6">
              {user.addresses?.length
                ? `${user.addresses.length} saved address(es).`
                : "Manage your default delivery address."}
            </p>
          </div>
          <Link
            href="/account/addresses"
            className="ul text-[11px] tracking-[0.2em] uppercase"
          >
            Manage addresses →
          </Link>
        </div>

        <div className="card p-6 rv in flex flex-col justify-between">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase mb-3">
              Wishlist
            </div>
            <p className="mute text-sm mb-6">
              {wishlistIds.length} item(s) saved to your curated list.
            </p>
          </div>
          <Link
            href="/shop"
            className="ul text-[11px] tracking-[0.2em] uppercase"
          >
            Explore collections →
          </Link>
        </div>
      </div>
    </section>
  );
}

