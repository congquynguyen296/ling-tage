import { springBootFetch } from "@/config/db";
import { buildOrderConfirmationEmail } from "@/config/mail";
import { shipFee } from "@/config/utils";
import { CartItem, Order, OrderStatus } from "@/types";
import { CheckoutFormInput, CheckoutFormSchema } from "./schema";

/**
 * Validates checkout form with Zod and submits order to Spring Boot backend (2s mock debounce)
 */
export async function submitOrderAction(
  rawForm: CheckoutFormInput,
  cartItems: CartItem[],
  discountRate: number = 0,
  onOrderCreated?: (order: Order) => void
) {
  const form = CheckoutFormSchema.parse(rawForm);

  if (!cartItems.length) {
    throw new Error("Your cart is empty");
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const discount = Math.round(subtotal * discountRate);
  const fee = shipFee(subtotal - discount, form.deliveryMethod);
  const total = subtotal - discount + fee;

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `TG-${Math.floor(100000 + Math.random() * 900000)}`,
    customerEmail: form.email,
    customerName: `${form.first} ${form.last}`.trim(),
    shippingAddress: {
      id: `addr-${Date.now()}`,
      firstName: form.first,
      lastName: form.last,
      phone: form.phone || "",
      addressLine: form.addr,
      city: form.city,
      postalCode: form.zip,
      country: form.country,
    },
    deliveryMethod: form.deliveryMethod,
    paymentMethod: form.paymentMethod,
    status: form.paymentMethod === "online" ? "PAID" : "PENDING_PAYMENT",
    items: cartItems.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      productSlug: i.product.slug,
      image: i.product.images[0],
      color: i.color,
      size: i.size,
      price: i.product.price,
      qty: i.qty,
    })),
    subtotal,
    shippingFee: fee,
    discount,
    total,
    createdAt: new Date().toISOString(),
  };

  return springBootFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(newOrder),
    debounceKey: "checkout-submit",
    mockResolver: () => {
      // Simulate sending confirmation email
      buildOrderConfirmationEmail(newOrder);
      onOrderCreated?.(newOrder);
      return newOrder;
    },
  });
}

/**
 * Updates order status from Admin dashboard (2s mock debounce)
 */
export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
  onMockUpdated?: () => void
) {
  return springBootFetch<{ orderId: string; status: OrderStatus }>(`/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    debounceKey: `order-status-${orderId}`,
    mockResolver: () => {
      onMockUpdated?.();
      return { orderId, status };
    },
  });
}

