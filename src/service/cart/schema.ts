import { z } from "zod";

export const AddToCartSchema = z.object({
  productId: z.number().int().positive(),
  size: z.string().min(1, "Please select a size"),
  color: z.string().min(1, "Color is required"),
  qty: z.number().int().min(1, "Quantity must be at least 1").max(20, "Maximum 20 items per line"),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;

