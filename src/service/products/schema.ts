import { z } from "zod";

export const ProductCategorySchema = z.enum([
  "Outerwear",
  "Denim",
  "Bottoms",
  "Knitwear",
  "Leather",
  "Footwear",
  "Dresses",
  "Accessories",
  "Shirts",
]);

export const ProductVariantSchema = z.object({
  id: z.string().min(1),
  sku: z.string().min(2, "SKU is required"),
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  price: z.number().positive().optional(),
});

export const UpsertProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  color: z.string().min(1, "Color name is required"),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").default("#111111"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  originalPrice: z.coerce.number().positive().optional(),
  category: ProductCategorySchema,
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  images: z.array(z.string().min(1)).min(1, "At least one product image is required"),
  isNew: z.boolean().default(true),
  isSale: z.boolean().default(false),
  description: z.string().optional(),
  variants: z.array(ProductVariantSchema).optional(),
});

export const ProductFilterSchema = z.object({
  category: z.string().optional().default("All"),
  sizes: z.array(z.string()).optional().default([]),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().positive().optional(),
  sort: z.enum(["new", "lo", "hi"]).optional().default("new"),
  q: z.string().optional().default(""),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(48).optional().default(12),
});

export type UpsertProductInput = z.infer<typeof UpsertProductSchema>;
export type ProductFilterInput = z.infer<typeof ProductFilterSchema>;

