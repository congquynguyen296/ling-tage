"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/service/cart/store";
import { FREE_SHIPPING_THRESHOLD, shipFee } from "@/config/utils";

export function useCart() {
  const store = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const items = hydrated ? store.items : [];
  const count = items.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const discountAmount = Math.round(subtotal * (hydrated ? store.discountRate : 0));
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const standardShipping = shipFee(discountedSubtotal, "std");
  const amountLeftForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);

  return {
    ...store,
    hydrated,
    items,
    count,
    subtotal,
    discountAmount,
    discountedSubtotal,
    standardShipping,
    amountLeftForFreeShipping,
  };
}

