import React from "react";

interface FieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  span?: boolean;
  placeholder?: string;
  type?: string;
}

export function Field({
  label,
  value,
  onChange,
  error,
  span,
  placeholder,
  type = "text",
}: FieldProps) {
  return (
    <label className={`block ${span ? "col-span-2" : ""}`}>
      <span className="text-[11px] tracking-[0.15em] uppercase mute">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border line px-3 py-3 text-sm outline-none mt-1 focus:border-[color:var(--fg)] transition-colors"
        style={error ? { borderColor: "#dc2626" } : undefined}
      />
      {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
    </label>
  );
}

