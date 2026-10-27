"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crumbs } from "@/components/ui/Crumbs";
import { Field } from "@/components/ui/Field";
import { useAuthStore } from "@/service/auth/store";
import { AddressInput, AddressSchema } from "@/service/auth/schema";

export default function AddressesPage() {
  const user = useAuthStore((s) => s.user);
  const addAddress = useAuthStore((s) => s.addAddress);
  const removeAddress = useAuthStore((s) => s.removeAddress);
  const [mounted, setMounted] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<AddressInput>({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
    country: "Vietnam",
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user) {
    return (
      <section className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="serif text-3xl mb-4">Addresses</h1>
        <p className="mute text-sm mb-6">Please sign in to view your addresses.</p>
        <Link href="/auth/login" className="btn">
          Sign In
        </Link>
      </section>
    );
  }

  const handleSave = () => {
    const parsed = AddressSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    addAddress(parsed.data);
    setIsAdding(false);
    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      addressLine: "",
      city: "",
      postalCode: "",
      country: "Vietnam",
      isDefault: false,
    });
    setErrors({});
  };

  const addresses = user.addresses || [];

  return (
    <section className="max-w-[1000px] mx-auto px-5 py-12">
      <Crumbs items={[["Home", "/"], ["Account", "/account"], ["Addresses"]]} />

      <div className="flex items-center justify-between mt-4 mb-8">
        <h1 className="serif text-4xl">Address Book</h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn text-xs tracking-widest py-3 px-6"
          >
            + Add New Address
          </button>
        )}
      </div>

      {isAdding && (
        <div className="card p-6 mb-8 border line space-y-4">
          <h2 className="text-xs tracking-[0.25em] uppercase font-semibold">
            Add New Address
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="First Name"
              value={form.firstName}
              onChange={(v) => setForm({ ...form, firstName: v })}
              error={errors.firstName}
            />
            <Field
              label="Last Name"
              value={form.lastName}
              onChange={(v) => setForm({ ...form, lastName: v })}
              error={errors.lastName}
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              error={errors.phone}
            />
            <Field
              label="City"
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
              error={errors.city}
            />
            <Field
              label="Street Address"
              value={form.addressLine}
              onChange={(v) => setForm({ ...form, addressLine: v })}
              error={errors.addressLine}
              span
            />
            <Field
              label="Postal Code"
              value={form.postalCode}
              onChange={(v) => setForm({ ...form, postalCode: v })}
              error={errors.postalCode}
            />
            <Field
              label="Country"
              value={form.country}
              onChange={(v) => setForm({ ...form, country: v })}
              error={errors.country}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSave} className="btn py-2 px-6">
              Save Address
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="border border-current px-5 py-2 text-xs tracking-wider uppercase"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="mute text-sm">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className="card p-6 border line flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-sm">
                    {addr.firstName} {addr.lastName}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] tracking-widest uppercase bg-black text-white px-2 py-0.5">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm mute leading-relaxed">
                  {addr.addressLine}
                  <br />
                  {addr.city}, {addr.postalCode}
                  <br />
                  {addr.country}
                  <br />
                  Phone: {addr.phone}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t line flex justify-end">
                <button
                  onClick={() => removeAddress(addr.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

