import { Megaphone } from "lucide-react";

export function AnnouncementBar({ text }: { text: string }) {
  if (!text.trim()) return null;

  return (
    <div className="border-b border-primary/10 bg-lilac px-4 py-2.5 text-center text-xs font-medium text-secondary-ink sm:text-sm">
      <p className="mx-auto flex min-h-11 max-w-4xl items-center justify-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface/80 text-primary shadow-card">
          <Megaphone aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
        <span>{text}</span>
      </p>
    </div>
  );
}
