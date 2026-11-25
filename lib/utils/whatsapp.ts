export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  if (!digits) return "#";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productOrderMessage(input: {
  name: string;
  sku: string;
  price: string;
  url: string;
}): string {
  return [
    `Hello Netbazar, I would like to order ${input.name} (SKU: ${input.sku}) listed at ${input.price}.`,
    `Product page: ${input.url}`,
    "",
    "Please confirm availability, the final price, shipping cost and delivery time before I pay.",
  ].join("\n");
}

export function requestWhatsAppMessage(input: {
  description: string;
  productLink: string;
  quantity: number;
  budget: string;
  name: string;
  phone: string;
  address: string;
}): string {
  return [
    "Hello Netbazar, I submitted a product request on your website.",
    `Product: ${input.description}`,
    input.productLink ? `Link: ${input.productLink}` : "",
    `Quantity: ${input.quantity}`,
    input.budget ? `Budget: ${input.budget}` : "",
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Delivery address: ${input.address}`,
    "",
    "Please confirm availability, the final price, shipping cost and delivery time before I pay.",
  ]
    .filter(Boolean)
    .join("\n");
}
