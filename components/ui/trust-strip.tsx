import type { LucideIcon } from "lucide-react";

export function TrustStrip({
  items,
}: {
  items: { icon: LucideIcon; title: string; description: string }[];
}) {
  return (
    <div className="nova-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {items.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-control bg-primary-tint text-primary">
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-xs font-bold text-ink">{title}</p>
            <p className="mt-0.5 text-[11px] text-muted">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
