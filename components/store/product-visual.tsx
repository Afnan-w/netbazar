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
    from: "#F3F6F2",
    to: "#E7EFE8",
    glow: "#D6E6D7",
    line: "#E1EAE1",
  },
  "home-and-kitchen": {
    icon: Home,
    from: "#F7F4EC",
    to: "#EFE9DC",
    glow: "#E5D9BF",
    line: "#E9E2D3",
  },
  fashion: {
    icon: Shirt,
    from: "#F8F2E9",
    to: "#F0E4D6",
    glow: "#E8D4BC",
    line: "#EDDFCE",
  },
  electronics: {
    icon: Cpu,
    from: "#F1F6F3",
    to: "#E5EFE9",
    glow: "#CFE3D7",
    line: "#DBE8DF",
  },
  "toys-and-games": {
    icon: Gamepad2,
    from: "#FBF1EC",
    to: "#F5E2D8",
    glow: "#EAD0C0",
    line: "#F0DED4",
  },
  "beauty-and-care": {
    icon: Sparkles,
    from: "#F9F3EA",
    to: "#F2E6D3",
    glow: "#E9D7B7",
    line: "#EFE2CB",
  },
  "outdoor-and-travel": {
    icon: Compass,
    from: "#F1F6F4",
    to: "#E4EEE9",
    glow: "#CFE1D7",
    line: "#DCE9E2",
  },
  everyday: {
    icon: Grid2X2,
    from: "#F7F5EE",
    to: "#EDE9DD",
    glow: "#DED8C5",
    line: "#E7E2D4",
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
        className={`absolute grid h-[58%] w-[58%] place-items-center rounded-xl border border-white/70 bg-white/65 shadow-[0_18px_40px_-28px_rgba(23,28,44,0.4)] backdrop-blur-sm ${
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
