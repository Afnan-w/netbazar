export const DEFAULT_WHATSAPP_NUMBER = "8801627293330";

export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  if (!digits) return "#";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productQuoteMessage(input: {
  name: string;
  sku: string;
  price: string;
  url: string;
}): string {
  return [
    `Hello Netbazar, can you source ${input.name} (Ref: ${input.sku}) for me?`,
    `Example page: ${input.url}`,
    `Indicative price: ${input.price}`,
    "",
    "Please confirm whether your supplier can provide it, then send the unit price, shipping, total and delivery time before I pay.",
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
    "Hello Netbazar, I submitted a sourcing request on your website.",
    `Item you want: ${input.description}`,
    input.productLink ? `Link: ${input.productLink}` : "",
    `Quantity: ${input.quantity}`,
    input.budget ? `Budget: ${input.budget}` : "",
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Delivery address: ${input.address}`,
    "",
    "Please check with your supplier and send me a quote with the unit price, shipping, total and delivery time before I pay. I can also send photos here.",
  ]
    .filter(Boolean)
    .join("\n");
}
