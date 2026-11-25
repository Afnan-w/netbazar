import Image from "next/image";
import Link from "next/link";

export function RecentlyViewed({
  items,
}: {
  items: { href: string; name: string; imageUrl?: string }[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          title={item.name}
          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-control border border-border bg-image-backdrop transition-transform hover:-translate-y-0.5"
        >
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          )}
        </Link>
      ))}
    </div>
  );
}
