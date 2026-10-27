import Link from "next/link";

interface CrumbsProps {
  items: Array<[label: string, href?: string]>;
}

export function Crumbs({ items }: CrumbsProps) {
  return (
    <div className="text-[11px] tracking-[0.2em] uppercase mute flex flex-wrap gap-x-2">
      {items.map(([label, href], idx) => (
        <span key={`${label}-${idx}`}>
          {href ? (
            <Link href={href} className="hover:text-[color:var(--fg)] transition-colors">
              {label}
            </Link>
          ) : (
            <span className="text-[color:var(--fg)]">{label}</span>
          )}
          {idx < items.length - 1 && " /"}
        </span>
      ))}
    </div>
  );
}

