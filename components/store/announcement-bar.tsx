import { Megaphone } from "lucide-react";

export function AnnouncementBar({ text }: { text: string }) {
  if (!text.trim()) return null;

  return (
    <div className="bg-mint px-4 py-2.5 text-center text-xs font-medium text-ink/75 sm:text-sm">
      <p className="mx-auto flex max-w-4xl items-center justify-center gap-2">
        <Megaphone aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-brand" />
        <span>{text}</span>
      </p>
    </div>
  );
}
