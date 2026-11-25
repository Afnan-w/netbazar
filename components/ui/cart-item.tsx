import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartItem({
  href,
  name,
  variant,
  price,
  imageUrl,
  quantity,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  href: string;
  name: string;
  variant?: string;
  price: string;
  imageUrl?: string;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  return (
    <article className="flex gap-3 rounded-card border border-border bg-surface p-3">
      <Link
        href={href}
        className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-control bg-image-backdrop"
      >
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill sizes="72px" className="object-cover" />
        ) : null}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={href}
          className="block truncate text-sm font-semibold text-ink hover:text-primary"
        >
          {name}
        </Link>
        {variant && <p className="mt-0.5 text-xs text-muted">{variant}</p>}
        <p className="mt-1 text-sm font-bold text-primary">{price}</p>

        <div className="mt-2 flex items-center gap-2">
          <div className="inline-flex items-center rounded-control border border-border">
            <button
              type="button"
              onClick={onDecrease}
              aria-label={`Decrease ${name} quantity`}
              className="grid h-8 w-8 place-items-center rounded-l-control text-secondary-ink hover:bg-primary-tint"
            >
              <Minus aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-xs font-bold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              aria-label={`Increase ${name} quantity`}
              className="grid h-8 w-8 place-items-center rounded-r-control text-secondary-ink hover:bg-primary-tint"
            >
              <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${name}`}
            className="grid h-8 w-8 place-items-center rounded-control text-muted hover:bg-sale/10 hover:text-sale"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
