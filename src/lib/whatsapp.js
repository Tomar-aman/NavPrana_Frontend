/**
 * WhatsApp click-to-chat.
 *
 * The number defaults to the support line already published on the site
 * (footer, shipping policy, Organization schema). Set NEXT_PUBLIC_WHATSAPP_NUMBER
 * (digits only, with country code, e.g. 917509531811) if chats should go to a
 * different WhatsApp Business number.
 */
import { trackContact } from "@/lib/meta-pixel";
import { trackEvent } from "@/lib/analytics";

export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917509531811"
).replace(/\D/g, "");

/** wa.me link that opens a chat with `message` already typed. */
export const whatsappUrl = (message = "") =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

/**
 * Track a WhatsApp click in Meta (Contact, so ads can optimise for it) and GA4
 * (whatsapp_click, with where it came from).
 */
export const trackWhatsAppClick = (placement, extra = {}) => {
  trackContact();
  trackEvent("whatsapp_click", { placement, ...extra });
};
