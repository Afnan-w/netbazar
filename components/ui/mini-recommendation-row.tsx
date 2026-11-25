import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type MiniRecommendation = {
  href: string;
  name: string;
  variant?: string;
  price: string;
  imageUrl?: string;
};

export function MiniRecommendationRow({
  items,
  onAdd,
}: {
  items: MiniRecommendation[];
  onAdd?: (item: MiniRecommendation) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.href} className="flex items-center gap-3">
          <Link
            href={item.href}
            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-control bg-image-backdrop"
          >
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            )}
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={item.href}
              className="block truncate text-xs font-semibold text-ink hover:text-primary"
            >
              {item.name}
            </Link>
            {item.variant && (
              <p className="truncate text-[11px] text-muted">{item.variant}</p>
            )}
            <p className="mt-0.5 text-xs font-bold text-primary">{item.price}</p>
          </div>
          {onAdd && (
            <button
              type="button"
              onClick={() => onAdd(item)}
              aria-label={`Add ${item.name}`}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-tint text-primary hover:bg-primary hover:text-white"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
