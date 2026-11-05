/** sms: for phone-looking contacts, mailto: otherwise. Patient-initiated,
 * through their own messenger; nothing routes through us. */
export function contactHref(contact: string, body: string, subject?: string): string {
  const isPhone = /^[+\d][\d\s().-]{6,}$/.test(contact.trim());
  if (isPhone) return `sms:${contact.replace(/[^+\d]/g, "")}?&body=${encodeURIComponent(body)}`;
  return `mailto:${contact.trim()}?subject=${encodeURIComponent(subject ?? "A question about fertility preservation")}&body=${encodeURIComponent(body)}`;
}
