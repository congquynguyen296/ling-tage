import Link from "next/link";

interface SectionHeadProps {
  kicker: string;
  title: string;
  linkText?: string;
  linkHref?: string;
}

export function SectionHead({
  kicker,
  title,
  linkText,
  linkHref = "/shop",
}: SectionHeadProps) {
  return (
    <div className="flex items-end justify-between mb-8 rv in">
      <div>
        <div className="text-[11px] tracking-[0.3em] uppercase mute mb-2">{kicker}</div>
        <h2 className="serif text-3xl md:text-4xl">{title}</h2>
      </div>
      {linkText && (
        <Link
          href={linkHref}
          className="text-xs tracking-[0.2em] uppercase border-b border-current pb-0.5"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}

