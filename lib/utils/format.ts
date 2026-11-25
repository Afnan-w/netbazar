const bdtFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatBDT(amount: number | null): string {
  if (amount === null) return "";
  return `৳${bdtFormatter.format(amount)}`;
}
