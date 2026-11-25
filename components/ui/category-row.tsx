import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type CategoryTone = "blush" | "sage" | "peach" | "lilac" | "primary";

const toneClasses: Record<CategoryTone, string> = {
  blush: "bg-blush",
  sage: "bg-sage",
  peach: "bg-peach",
  lilac: "bg-lilac",
  primary: "bg-primary-tint",
};

export type CategoryItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  tone: CategoryTone;
};

export function CategoryRow({ items }: { items: CategoryItem[] }) {
  return (
    <div className="nova-card grid grid-cols-3 gap-3 p-4 sm:grid-cols-6 sm:p-5">
      {items.map(({ label, href, icon: Icon, tone }) => (
        <Link
          key={label}
          href={href}
          className="group flex flex-col items-center gap-2 rounded-card px-2 py-3 text-center transition-transform duration-200 hover:-translate-y-1"
        >
          <span
            className={`grid h-14 w-14 place-items-center rounded-full transition-colors group-hover:brightness-95 ${toneClasses[tone]}`}
          >
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <span className="text-xs font-semibold text-secondary-ink group-hover:text-primary">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
