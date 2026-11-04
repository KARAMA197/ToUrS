export const WHATSAPP_NUMBER = "255676882297";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello, I would like to plan a Tanzania safari.";

export function buildWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppChatUrl(
  phone: string,
  message = DEFAULT_WHATSAPP_MESSAGE
) {
  const normalizedPhone = phone.replace(/\D/g, "");

  if (!normalizedPhone) {
    return buildWhatsAppUrl(message);
  }

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
