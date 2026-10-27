import { z } from "zod";

export const CheckoutFormSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    first: z.string().min(1, "First name is required"),
    last: z.string().min(1, "Last name is required"),
    phone: z.string().min(8, "Phone number must be at least 8 digits").optional().or(z.literal("")),
    addr: z.string().min(3, "Shipping address is required"),
    city: z.string().min(2, "City is required"),
    zip: z.string().min(2, "Postal code is required"),
    country: z.string().min(2, "Country is required"),
    deliveryMethod: z.enum(["std", "exp"]).default("std"),
    paymentMethod: z.enum(["cod", "online"]).default("online"),
    card: z.string().optional(),
    exp: z.string().optional(),
    cvc: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.paymentMethod === "online") {
      if (!val.card || val.card.trim().length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["card"],
          message: "Card number is required for online payment",
        });
      }
      if (!val.exp || val.exp.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["exp"],
          message: "Expiry date is required",
        });
      }
      if (!val.cvc || val.cvc.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cvc"],
          message: "CVC is required",
        });
      }
    }
  });

export type CheckoutFormInput = z.infer<typeof CheckoutFormSchema>;

