"use client";

import { useState } from "react";
import { money } from "@/config/utils";
import { Field } from "@/components/ui/Field";
import { useProductStore } from "@/service/products/store";
import { ProductCategory, ProductVariant } from "@/types";
import { UpsertProductInput, UpsertProductSchema } from "@/service/products/schema";
import { createProductService, updateVariantStockService } from "@/service/products/actions";

const CATEGORIES: ProductCategory[] = [
  "Outerwear",
  "Denim",
  "Bottoms",
  "Knitwear",
  "Leather",
  "Shirts",
  "Footwear",
  "Dresses",
  "Accessories",
];

export default function AdminProductsPage() {
  const products = useProductStore((s) => s.products);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateVariantStock = useProductStore((s) => s.updateVariantStock);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const [isCreating, setIsCreating] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // New Product Form State
  const [newProd, setNewProd] = useState<UpsertProductInput>({
    name: "",
    color: "",
    colorHex: "#111111",
    price: 250,
    category: "Outerwear",
    sizes: ["S", "M", "L"],
    images: ["/images/products/p1-01.jpg"],
    isNew: true,
    isSale: false,
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreateProduct = async () => {
    const parsed = UpsertProductSchema.safeParse(newProd);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setActionLoading(true);
    setStatusMessage("Saving product to Spring Boot Mock API (2s debounce)...");

    try {
      await createProductService(parsed.data, (validated) => {
        return addProduct(validated);
      });
      setIsCreating(false);
      setStatusMessage("Product created successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Failed to create" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStockChange = async (
    productId: number,
    variantId: string,
    newStock: number
  ) => {
    setActionLoading(true);
    setStatusMessage(`Updating variant inventory via API (2s debounce)...`);

    try {
      await updateVariantStockService(productId, variantId, newStock, () => {
        updateVariantStock(productId, variantId, newStock);
      });
      setStatusMessage("Stock updated!");
      setTimeout(() => setStatusMessage(""), 2000);
    } catch {
      setStatusMessage("Failed to update stock");
    } finally {
      setActionLoading(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="serif text-3xl font-medium">Products & Inventory</h1>
          <p className="mute text-xs mt-1">
            Manage product catalog, colorways, size variants, and real-time stock
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="btn text-xs tracking-wider py-3 px-6"
        >
          + Add New Product
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-neutral-900 text-white text-xs tracking-wider uppercase animate-fade-in flex items-center justify-between">
          <span>{statusMessage}</span>
          {actionLoading && <span className="animate-spin">⏳</span>}
        </div>
      )}

      {/* Add Product Modal */}
      {isCreating && (
        <div className="card p-6 border line bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b line">
            <h2 className="text-xs tracking-widest uppercase font-semibold">
              Create New TAGE Piece
            </h2>
            <button
              onClick={() => setIsCreating(false)}
              className="text-sm mute hover:text-black"
            >
              ✕
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field
              label="Product Name"
              value={newProd.name}
              onChange={(v) => setNewProd({ ...newProd, name: v })}
              placeholder="e.g. Vintage Leather Trench"
              error={errors.name}
            />
            <Field
              label="Color Name"
              value={newProd.color}
              onChange={(v) => setNewProd({ ...newProd, color: v })}
              placeholder="e.g. Washed Charcoal"
              error={errors.color}
            />
            <Field
              label="Color Hex (#RRGGBB)"
              value={newProd.colorHex || "#111111"}
              onChange={(v) => setNewProd({ ...newProd, colorHex: v })}
              placeholder="#333333"
              error={errors.colorHex}
            />
            <Field
              label="Price ($ USD)"
              value={String(newProd.price)}
              onChange={(v) => setNewProd({ ...newProd, price: Number(v) || 0 })}
              type="number"
              error={errors.price}
            />
            <div>
              <label className="block text-[11px] tracking-wider uppercase mute mb-1">
                Category
              </label>
              <select
                value={newProd.category}
                onChange={(e) =>
                  setNewProd({
                    ...newProd,
                    category: e.target.value as ProductCategory,
                  })
                }
                className="w-full bg-transparent border line px-3 py-3 text-sm outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Image Path"
              value={newProd.images[0] || ""}
              onChange={(v) => setNewProd({ ...newProd, images: [v] })}
              placeholder="/images/products/p1-01.jpg"
              error={errors.images}
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              disabled={actionLoading}
              onClick={handleCreateProduct}
              className="btn text-xs py-2 px-6"
            >
              {actionLoading ? "Submitting (2s)..." : "Save Product"}
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="border border-current px-5 py-2 text-xs tracking-wider uppercase"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="card border line bg-white overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b line bg-neutral-50 tracking-wider uppercase text-[11px] mute">
              <th className="p-4">Item</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Variants & Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y line">
            {products.map((p) => {
              const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
              const isSelected = selectedProductId === p.id;

              return (
                <tr
                  key={p.id}
                  className={`hover:bg-neutral-50/70 transition-colors ${
                    isSelected ? "bg-neutral-100/60" : ""
                  }`}
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-14 object-cover card line border"
                    />
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="mute text-[11px]">{p.color}</div>
                    </div>
                  </td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 font-medium">{money(p.price)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.variants.map((v) => (
                        <span
                          key={v.id}
                          className={`px-1.5 py-0.5 text-[10px] border line ${
                            v.stock === 0
                              ? "bg-red-50 text-red-600 line-through"
                              : v.stock <= 3
                              ? "bg-amber-50 text-amber-700"
                              : "bg-neutral-50"
                          }`}
                        >
                          {v.size}: {v.stock}
                        </span>
                      ))}
                    </div>
                    <div className="mute text-[10px] mt-1">
                      Total stock: {totalStock} units
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() =>
                        setSelectedProductId(isSelected ? null : p.id)
                      }
                      className="ul uppercase text-[11px] tracking-wider"
                    >
                      {isSelected ? "Close Stock" : "Edit Stock"}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id);
                      }}
                      className="text-red-600 hover:underline uppercase text-[11px] tracking-wider"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Inline Variant Stock Manager for Selected Product */}
      {selectedProduct && (
        <div className="card p-6 border line bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b line">
            <h2 className="text-xs tracking-widest uppercase font-semibold">
              Quick Inventory Editor — {selectedProduct.name} ({selectedProduct.color})
            </h2>
            <button
              onClick={() => setSelectedProductId(null)}
              className="text-xs mute underline"
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {selectedProduct.variants.map((variant: ProductVariant) => (
              <div key={variant.id} className="p-3 border line bg-neutral-50/50">
                <div className="font-semibold text-xs mb-1">
                  Size: {variant.size}
                </div>
                <div className="text-[10px] mute mb-2">SKU: {variant.sku}</div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={actionLoading || variant.stock <= 0}
                    onClick={() =>
                      handleStockChange(
                        selectedProduct.id,
                        variant.id,
                        variant.stock - 1
                      )
                    }
                    className="w-7 h-7 border line flex items-center justify-center hover:bg-neutral-200"
                  >
                    −
                  </button>
                  <span className="font-medium text-sm w-8 text-center">
                    {variant.stock}
                  </span>
                  <button
                    disabled={actionLoading}
                    onClick={() =>
                      handleStockChange(
                        selectedProduct.id,
                        variant.id,
                        variant.stock + 1
                      )
                    }
                    className="w-7 h-7 border line flex items-center justify-center hover:bg-neutral-200"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

