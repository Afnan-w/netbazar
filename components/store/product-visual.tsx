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

const mix = (token: string, percent: number) =>
  `color-mix(in srgb, ${token} ${percent}%, var(--surface))`;

const wash = (token: string, percent: number) =>
  `color-mix(in srgb, ${token} ${percent}%, transparent)`;

const palettes: Record<string, Palette> = {
  "phone-accessories": {
    icon: Smartphone,
    from: mix("var(--sage)", 50),
    to: mix("var(--primary-tint)", 65),
    glow: wash("var(--sage)", 55),
    line: wash("var(--ink)", 7),
  },
  "home-and-kitchen": {
    icon: Home,
    from: mix("var(--peach)", 50),
    to: mix("var(--blush)", 60),
    glow: wash("var(--peach)", 55),
    line: wash("var(--ink)", 7),
  },
  fashion: {
    icon: Shirt,
    from: mix("var(--blush)", 50),
    to: mix("var(--lilac)", 60),
    glow: wash("var(--blush)", 55),
    line: wash("var(--ink)", 7),
  },
  electronics: {
    icon: Cpu,
    from: mix("var(--primary-tint)", 50),
    to: mix("var(--sage)", 60),
    glow: wash("var(--primary-tint)", 55),
    line: wash("var(--ink)", 7),
  },
  "toys-and-games": {
    icon: Gamepad2,
    from: mix("var(--blush)", 55),
    to: mix("var(--peach)", 65),
    glow: wash("var(--blush)", 55),
    line: wash("var(--ink)", 7),
  },
  "beauty-and-care": {
    icon: Sparkles,
    from: mix("var(--lilac)", 55),
    to: mix("var(--blush)", 65),
    glow: wash("var(--lilac)", 55),
    line: wash("var(--ink)", 7),
  },
  "outdoor-and-travel": {
    icon: Compass,
    from: mix("var(--sage)", 55),
    to: mix("var(--peach)", 60),
    glow: wash("var(--sage)", 55),
    line: wash("var(--ink)", 7),
  },
  everyday: {
    icon: Grid2X2,
    from: mix("var(--primary-tint)", 55),
    to: mix("var(--lilac)", 60),
    glow: wash("var(--primary-tint)", 55),
    line: wash("var(--ink)", 7),
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
        className="hairline-grid absolute inset-0 opacity-70"
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
        className={`absolute grid h-[58%] w-[58%] place-items-center rounded-card border border-border/70 bg-surface/70 shadow-card backdrop-blur-sm ${
          offset === 0 ? "rotate-[5deg]" : offset === 1 ? "-rotate-[5deg]" : "rotate-0"
        }`}
        style={{
          left: offset === 2 ? "21%" : "25%",
          top: offset === 1 ? "24%" : "20%",
        }}
      >
        <VisualIcon categorySlug={categorySlug} name={name} className={`${iconClassName} text-primary`} />
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
        className="absolute right-6 top-6 h-2 w-2 rounded-full border border-primary/20"
      />
    </div>
  );
}

export function CategoryIcon({ slug }: { slug: string }) {
  const Icon = paletteFor(slug).icon;
  return <Icon aria-hidden="true" />;
}
