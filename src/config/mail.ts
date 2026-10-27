import { Order } from "@/types";
import { money } from "./utils";

export const MAIL_CONFIG = {
  fromAddress: "orders@tage.studio",
  brandName: "TAGE",
};

export function buildOrderConfirmationEmail(order: Order) {
  return {
    to: order.customerEmail,
    from: MAIL_CONFIG.fromAddress,
    subject: `[TAGE] Order Confirmed — ${order.orderNumber}`,
    html: `
      <div style="font-family: Inter, Helvetica, Arial, sans-serif; color: #111; max-width: 560px; margin: 0 auto; padding: 32px 20px;">
        <h1 style="letter-spacing: 0.35em; font-size: 20px; font-weight: 500;">TAGE</h1>
        <p style="font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #737373; margin-top: 24px;">Order Confirmed</p>
        <h2 style="font-weight: 400; font-size: 28px; margin: 8px 0 16px;">Thank you, ${order.customerName}</h2>
        <p style="color: #737373; font-size: 14px;">Your order <strong>${order.orderNumber}</strong> has been received and is being prepared.</p>
        <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 24px 0;" />
        <p style="font-size: 14px;"><strong>Total:</strong> ${money(order.total)}</p>
      </div>
    `,
  };
}

