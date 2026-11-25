import {
  Box,
  Cable,
  Compass,
  Cpu,
  Gamepad2,
  Gift,
  Grid2X2,
  Home,
  Mouse,
  Puzzle,
  Shirt,
  Smartphone,
  Sparkles,
  Speaker,
  type LucideIcon,
} from "lucide-react";
import { createElement } from "react";

type Palette = {
  icon: LucideIcon;
  from: string;
  to: string;
  glow: string;
  line: string;
};

const palettes: Record<string, Palette> = {
  "phone-accessories": {
    icon: Smartphone,
    from: "#EAF8F1",
    to: "#D8F0E6",
    glow: "#B9E8D4",
    line: "#CBE9DD",
  },
  "home-and-kitchen": {
    icon: Home,
    from: "#F5F3EE",
    to: "#EAE7DE",
    glow: "#DCD5C6",
    line: "#DED8CC",
  },
  fashion: {
    icon: Shirt,
    from: "#F4F1F7",
    to: "#E7E1EF",
    glow: "#D8CEE6",
    line: "#DDD5E7",
  },
  electronics: {
    icon: Cpu,
    from: "#EEF3F7",
    to: "#DDE8F0",
    glow: "#C8DDEA",
    line: "#D5E2EB",
  },
  "toys-and-games": {
    icon: Gamepad2,
    from: "#FDF3EA",
    to: "#F7E6D5",
    glow: "#F2D3B3",
    line: "#EFDCC8",
  },
  "beauty-and-care": {
    icon: Sparkles,
    from: "#FDF1F3",
    to: "#F7E2E7",
    glow: "#F0CBD4",
    line: "#EED7DD",
  },
  "outdoor-and-travel": {
    icon: Compass,
    from: "#EDF6F4",
    to: "#DDEDE9",
    glow: "#C6E3DC",
    line: "#D3E7E1",
  },
  everyday: {
    icon: Grid2X2,
    from: "#F1F4F4",
    to: "#E2E9E8",
    glow: "#CBDAD8",
    line: "#D8E3E1",
  },
};

const iconBySlug: Record<string, LucideIcon> = {
  cable: Cable,
  speaker: Speaker,
  mouse: Mouse,
  puzzle: Puzzle,
  gift: Gift,
  pack: Box,
};

function paletteFor(categorySlug: string): Palette {
  return palettes[categorySlug] ?? palettes.everyday;
}

function iconFor(categorySlug: string, name: string): LucideIcon {
  const keyword = Object.keys(iconBySlug).find((key) =>
    name.toLowerCase().includes(key),
  );
  return keyword ? iconBySlug[keyword] : paletteFor(categorySlug).icon;
}

function VisualIcon({
  categorySlug,
  name,
  className,
}: {
  categorySlug: string;
  name: string;
  className: string;
}) {
  const icon = iconFor(categorySlug, name);
  return createElement(icon, {
    "aria-hidden": true,
    className,
    strokeWidth: 1.3,
  });
}

/** Clean category-tinted placeholder used until real product photos are added. */
export function ProductVisual({
  categorySlug,
  name,
  className = "",
  iconClassName = "h-16 w-16",
}: {
  categorySlug: string;
  name: string;
  className?: string;
  iconClassName?: string;
}) {
  const palette = paletteFor(categorySlug);
  const offset = name.length % 3;

  return (
    <div
      role="img"
      aria-label={`Illustration for ${name}`}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(145deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `linear-gradient(${palette.line} 1px, transparent 1px), linear-gradient(90deg, ${palette.line} 1px, transparent 1px)`,
          backgroundSize: "34px 34px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-12 h-40 w-40 rounded-full blur-2xl"
        style={{ background: palette.glow }}
      />
      <div
        aria-hidden="true"
        className={`absolute grid h-[58%] w-[58%] place-items-center rounded-[28px] border border-white/70 bg-white/65 shadow-[0_22px_60px_-28px_rgba(24,35,45,0.45)] backdrop-blur-sm ${
          offset === 0 ? "rotate-[5deg]" : offset === 1 ? "-rotate-[5deg]" : "rotate-0"
        }`}
        style={{
          left: offset === 2 ? "21%" : "25%",
          top: offset === 1 ? "24%" : "20%",
        }}
      >
        <VisualIcon categorySlug={categorySlug} name={name} className={`${iconClassName} text-ink/70`} />
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-5 left-5 h-1.5 w-12 rounded-full"
        style={{ background: palette.glow }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-5 right-5 h-1.5 w-6 rounded-full border"
        style={{ borderColor: palette.line }}
      />
      <div
        aria-hidden="true"
        className="absolute right-6 top-6 h-2 w-2 rounded-full border border-ink/15"
      />
    </div>
  );
}

export function CategoryIcon({ slug }: { slug: string }) {
  const Icon = paletteFor(slug).icon;
  return <Icon aria-hidden="true" />;
}
