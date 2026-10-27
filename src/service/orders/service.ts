"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order, OrderStatus } from "@/types";

const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "TG-849201",
    customerEmail: "linh.nguyen@example.com",
    customerName: "Linh Nguyen",
    shippingAddress: {
      id: "addr-1",
      firstName: "Linh",
      lastName: "Nguyen",
      phone: "0901234567",
      addressLine: "42 Nguyen Hue, District 1",
      city: "Ho Chi Minh City",
      postalCode: "700000",
      country: "Vietnam",
    },
    deliveryMethod: "std",
    paymentMethod: "online",
    status: "COMPLETED",
    items: [
      {
        productId: 1,
        productName: "Zip Out Work Jacket",
        productSlug: "zip-out-work-jacket-1",
        image: "/images/products/p1-01.jpg",
        color: "Terracotta",
        size: "M",
        price: 260,
        qty: 1,
      },
      {
        productId: 5,
        productName: "Johnny Knit Polo",
        productSlug: "johnny-knit-polo-5",
        image: "/images/products/p1-05.webp",
        color: "Oxblood Melange",
        size: "M",
        price: 175,
        qty: 1,
      },
    ],
    subtotal: 435,
    shippingFee: 0,
    discount: 0,
    total: 435,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "ord-2",
    orderNumber: "TG-849355",
    customerEmail: "minh.tran@example.com",
    customerName: "Minh Tran",
    shippingAddress: {
      id: "addr-2",
      firstName: "Minh",
      lastName: "Tran",
      phone: "0912345678",
      addressLine: "18 Trang Tien, Hoan Kiem",
      city: "Hanoi",
      postalCode: "100000",
      country: "Vietnam",
    },
    deliveryMethod: "exp",
    paymentMethod: "cod",
    status: "SHIPPING",
    items: [
      {
        productId: 6,
        productName: "Leather Trucker Jacket",
        productSlug: "leather-trucker-jacket-6",
        image: "/images/products/p1-06.jpg",
        color: "Obsidian Black",
        size: "L",
        price: 480,
        qty: 1,
      },
    ],
    subtotal: 480,
    shippingFee: 25,
    discount: 0,
    total: 505,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

interface OrderStoreState {
  orders: Order[];
  lastPlacedOrder: Order | null;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set) => ({
      orders: INITIAL_MOCK_ORDERS,
      lastPlacedOrder: null,
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
          lastPlacedOrder: order,
        })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        })),
    }),
    {
      name: "tage-orders-storage",
    }
  )
);

