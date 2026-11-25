const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export function absoluteProductUrl(slug: string): string {
  const path = `/products/${slug}`;
  return siteUrl ? `${siteUrl}${path}` : path;
}
