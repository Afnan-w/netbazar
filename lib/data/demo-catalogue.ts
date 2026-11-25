import type { Category } from "@/types/database";
import { marketplaceFor } from "@/lib/utils/marketplace";
import type { ProductDetail, ProductListItem } from "./store";

type DemoProduct = Omit<ProductListItem, "category"> & {
  categorySlug: string;
};

const now = new Date().toISOString();

export const demoCategories: Category[] = [
  { id: "demo-cat-tech", name: "Tech", slug: "electronics", sort_order: 1, created_at: now, updated_at: now },
  { id: "demo-cat-phone", name: "Accessories", slug: "phone-accessories", sort_order: 2, created_at: now, updated_at: now },
  { id: "demo-cat-home", name: "Home", slug: "home-and-kitchen", sort_order: 3, created_at: now, updated_at: now },
  { id: "demo-cat-fashion", name: "Style", slug: "fashion", sort_order: 4, created_at: now, updated_at: now },
  { id: "demo-cat-toys", name: "Toys", slug: "toys-and-games", sort_order: 5, created_at: now, updated_at: now },
  { id: "demo-cat-travel", name: "Travel", slug: "outdoor-and-travel", sort_order: 6, created_at: now, updated_at: now },
  { id: "demo-cat-beauty", name: "Care", slug: "beauty-and-care", sort_order: 7, created_at: now, updated_at: now },
  { id: "demo-cat-everyday", name: "Everyday", slug: "everyday", sort_order: 8, created_at: now, updated_at: now },
];

const img = (url: string, alt: string) => [{ id: url, storage_path: url, sort_order: 0, alt }];

const demoProductsRaw: DemoProduct[] = [
  {
    id: "demo-1", sku: "DEMO-EL-001", name: "Compact Wireless Earbuds", slug: "compact-wireless-earbuds",
    description: "DEMO — Lightweight earbuds with a clean charging case for everyday listening.",
    specifications: { "Battery": "24 hrs with case", "Bluetooth": "5.3", "Charging": "USB-C" },
    price_bdt: 1850, reference_price_bdt: 2400, category_id: "demo-cat-tech", categorySlug: "electronics",
    status: "available", is_featured: true, is_popular: true, created_at: now, updated_at: now,
    marketplace: { badge: "Best seller", rating: 4.8, soldCount: 2400, shippingDays: "5–8 days" },
    images: img("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80", "White wireless earbuds in a charging case"),
  },
  {
    id: "demo-2", sku: "DEMO-EL-002", name: "Portable Bluetooth Speaker", slug: "portable-bluetooth-speaker",
    description: "DEMO — Small speaker with a simple shape and clear sound for desk or travel.",
    specifications: { "Battery": "10 hrs", "Water resistance": "IPX5", "Bluetooth": "5.3" },
    price_bdt: 2200, reference_price_bdt: 2900, category_id: "demo-cat-tech", categorySlug: "electronics",
    status: "available", is_featured: true, is_popular: true, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80", "Portable black Bluetooth speaker on a table"),
  },
  {
    id: "demo-3", sku: "DEMO-EL-003", name: "Smart Watch", slug: "smart-watch-minimal",
    description: "DEMO — Clean everyday smartwatch with a comfortable strap.",
    specifications: { "Display": "1.9 inch", "Battery": "7 days", "Strap": "Silicone" },
    price_bdt: 3200, reference_price_bdt: 4200, category_id: "demo-cat-tech", categorySlug: "electronics",
    status: "available", is_featured: true, is_popular: false, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80", "Minimal smartwatch with a light dial"),
  },
  {
    id: "demo-4", sku: "DEMO-PA-001", name: "MagSafe Phone Stand", slug: "magsafe-phone-stand",
    description: "DEMO — Simple desk stand for hands-free calls and charging.",
    specifications: { "Material": "Aluminium", "Angle": "Adjustable", "Use": "Desk" },
    price_bdt: 950, reference_price_bdt: 1300, category_id: "demo-cat-phone", categorySlug: "phone-accessories",
    status: "available", is_featured: true, is_popular: true, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80", "Smartphone on a minimal desk stand"),
  },
  {
    id: "demo-5", sku: "DEMO-PA-002", name: "Fast Charging Cable", slug: "fast-charging-cable",
    description: "DEMO — Durable braided cable for daily charging.",
    specifications: { "Length": "1.5 m", "Connector": "USB-C", "Output": "60 W" },
    price_bdt: 450, reference_price_bdt: 650, category_id: "demo-cat-phone", categorySlug: "phone-accessories",
    status: "available", is_featured: false, is_popular: true, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=900&q=80", "Braided charging cable coiled neatly"),
  },
  {
    id: "demo-6", sku: "DEMO-HK-001", name: "Electric Kettle", slug: "electric-kettle-minimal",
    description: "DEMO — Clean matte kettle for quick tea and coffee.",
    specifications: { "Capacity": "1.5 L", "Power": "1500 W", "Material": "Stainless steel" },
    price_bdt: 2450, reference_price_bdt: 3200, category_id: "demo-cat-home", categorySlug: "home-and-kitchen",
    status: "available", is_featured: true, is_popular: false, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=80", "Minimal electric kettle on a kitchen counter"),
  },
  {
    id: "demo-7", sku: "DEMO-HK-002", name: "Desk Organizer Set", slug: "desk-organizer-set",
    description: "DEMO — Keep your workspace tidy with a simple organizer.",
    specifications: { "Pieces": "4", "Material": "ABS", "Colour": "White" },
    price_bdt: 890, reference_price_bdt: 1200, category_id: "demo-cat-home", categorySlug: "home-and-kitchen",
    status: "available", is_featured: false, is_popular: false, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80", "Clean desk organizer with stationery"),
  },
  {
    id: "demo-8", sku: "DEMO-FA-001", name: "Classic Crossbody Bag", slug: "classic-crossbody-bag",
    description: "DEMO — Simple everyday bag with enough room for essentials.",
    specifications: { "Material": "PU leather", "Strap": "Adjustable", "Colour": "Tan" },
    price_bdt: 1650, reference_price_bdt: 2200, category_id: "demo-cat-fashion", categorySlug: "fashion",
    status: "available", is_featured: true, is_popular: true, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80", "Tan crossbody bag on a neutral background"),
  },
  {
    id: "demo-9", sku: "DEMO-FA-002", name: "Minimal Sneakers", slug: "minimal-sneakers",
    description: "DEMO — Clean everyday sneakers with a comfortable sole.",
    specifications: { "Material": "Canvas", "Sizes": "39-44", "Colour": "White" },
    price_bdt: 2800, reference_price_bdt: 3500, category_id: "demo-cat-fashion", categorySlug: "fashion",
    status: "available", is_featured: false, is_popular: true, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", "White minimal sneaker on a clean background"),
  },
  {
    id: "demo-10", sku: "DEMO-TG-001", name: "Remote Control Car", slug: "remote-control-car",
    description: "DEMO — Fun RC car for kids with easy controls.",
    specifications: { "Battery": "Rechargeable", "Range": "30 m", "Age": "6+" },
    price_bdt: 2100, reference_price_bdt: 2800, category_id: "demo-cat-toys", categorySlug: "toys-and-games",
    status: "available", is_featured: true, is_popular: true, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=900&q=80", "Toy remote control car on a surface"),
  },
  {
    id: "demo-11", sku: "DEMO-TG-002", name: "Building Blocks Set", slug: "building-blocks-set",
    description: "DEMO — Colorful blocks for creative play.",
    specifications: { "Pieces": "120", "Material": "ABS plastic", "Age": "3+" },
    price_bdt: 1450, reference_price_bdt: 1900, category_id: "demo-cat-toys", categorySlug: "toys-and-games",
    status: "available", is_featured: false, is_popular: false, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80", "Colorful building blocks for kids"),
  },
  {
    id: "demo-12", sku: "DEMO-TR-001", name: "Travel Backpack", slug: "travel-backpack",
    description: "DEMO — Compact backpack for daily carry or short trips.",
    specifications: { "Capacity": "20 L", "Laptop": "15 inch", "Material": "Water-resistant" },
    price_bdt: 2600, reference_price_bdt: 3400, category_id: "demo-cat-travel", categorySlug: "outdoor-and-travel",
    status: "available", is_featured: true, is_popular: true, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80", "Black travel backpack on a clean background"),
  },
  {
    id: "demo-13", sku: "DEMO-BC-001", name: "Reusable Makeup Pads", slug: "reusable-makeup-pads",
    description: "DEMO — Soft reusable pads with a washable pouch for daily care.",
    specifications: { "Count": "12", "Material": "Microfibre", "Care": "Washable" },
    price_bdt: 390, reference_price_bdt: 560, category_id: "demo-cat-beauty", categorySlug: "beauty-and-care",
    status: "available", is_featured: false, is_popular: true, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80", "Neat cosmetic pads and bottles on a table"),
  },
  {
    id: "demo-14", sku: "DEMO-EV-001", name: "Cable Tidy Clips", slug: "cable-tidy-clips",
    description: "DEMO — Small clips that keep desk and bedside cables in place.",
    specifications: { "Count": "8", "Material": "Silicone", "Colours": "Grey, mint" },
    price_bdt: 240, reference_price_bdt: 360, category_id: "demo-cat-everyday", categorySlug: "everyday",
    status: "available", is_featured: false, is_popular: false, created_at: now, updated_at: now,
    images: img("https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80", "Tidy desk accessories and cables"),
  },
];

export const demoProducts: ProductListItem[] = demoProductsRaw.map(({ categorySlug, ...p }, index) => {
  const category = demoCategories.find((c) => c.slug === categorySlug) ?? null;
  return {
    ...p,
    marketplace: marketplaceFor(p, index),
    category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
  };
});

export function getDemoProductBySlug(slug: string): ProductDetail | null {
  return demoProducts.find((p) => p.slug === slug) ?? null;
}

export function getDemoRelated(product: ProductDetail, limit = 4): ProductListItem[] {
  const same = demoProducts.filter((p) => p.id !== product.id && p.category?.slug === product.category?.slug);
  const pool = same.length >= limit ? same : demoProducts.filter((p) => p.id !== product.id);
  return pool.slice(0, limit);
}
