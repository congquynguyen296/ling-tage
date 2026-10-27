"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/service/auth/store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user?.role !== "ADMIN") {
      router.push("/auth/login?redirect=/admin&reason=admin_required");
    }
  }, [mounted, user, router]);

  if (!mounted || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs tracking-widest uppercase mute">
        Checking Admin Permissions...
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Products & Stock", href: "/admin/products" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Customers", href: "/admin/customers" },
  ];

  return (
    <div className="min-h-screen flex bg-[#f4f4f4] text-[#111]">
      {/* Sidebar */}
      <aside className="w-64 border-r line bg-white flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b line flex items-center justify-between">
            <Link href="/admin" aria-label="TAGE Admin">
              <img
                src="/logo/tage_logo.png"
                alt="TAGE"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <div className="text-[10px] tracking-widest uppercase mute bg-neutral-100 px-2 py-0.5 border line">
              Studio Admin
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2.5 text-xs tracking-wider uppercase transition-colors rounded-sm ${
                    active
                      ? "bg-black text-white font-medium"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t line space-y-2">
          <Link
            href="/"
            className="block text-center text-xs tracking-wider uppercase py-2 border line hover:bg-neutral-100 transition-colors"
          >
            ← View Live Shop
          </Link>
          <div className="flex items-center justify-between pt-2 px-1 text-xs">
            <span className="mute truncate max-w-[120px]">{user.email}</span>
            <button
              onClick={() => {
                logout();
                router.push("/auth/login");
              }}
              className="text-red-600 hover:underline uppercase text-[11px]"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b line flex items-center justify-between px-8">
          <div className="text-xs tracking-widest uppercase mute">
            Admin Management Console
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Spring Boot Mock Service Active (2s delay)</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto page">{children}</main>
      </div>
    </div>
  );
}

