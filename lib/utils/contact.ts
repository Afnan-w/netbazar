export const CONTACT_EMAIL = "ox17afnan@gmail.com";

/** Use the owner's Gmail until a real Netbazar mailbox is configured. */
export function getContactEmail(value?: string | null): string {
  const configured = value?.trim();
  if (
    !configured ||
    configured.endsWith(".example") ||
    configured.toLowerCase().includes("netbazar.example")
  ) {
    return CONTACT_EMAIL;
  }
  return configured;
}
