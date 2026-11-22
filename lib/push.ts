import { track } from "./analytics";

/**
 * Gentle nudges: opt-in web push. The subscription (an anonymous browser
 * endpoint, no name or email) is stored server-side so a scheduled function
 * can send the occasional quiet note. Turning it off deletes the row.
 */

const URL_ = process.env.NEXT_PUBLIC_SYNC_URL;
const KEY = process.env.NEXT_PUBLIC_SYNC_ANON_KEY;
const VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export type NudgeMode = "deciding" | "during" | "after" | "waiting";

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    Boolean(URL_ && KEY && VAPID)
  );
}

function b64ToBytes(b64: string): Uint8Array {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function rpc(name: string, body: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${URL_}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: { apikey: KEY!, Authorization: `Bearer ${KEY!}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function enableNudges(mode: NudgeMode): Promise<"on" | "denied" | "failed"> {
  if (!pushSupported()) return "failed";
  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return "denied";
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: b64ToBytes(VAPID!) as BufferSource,
    });
    const json = sub.toJSON();
    const ok = await rpc("save_push_sub", {
      p_endpoint: sub.endpoint,
      p_p256dh: json.keys?.p256dh ?? "",
      p_auth: json.keys?.auth ?? "",
      p_mode: mode,
    });
    if (ok) track("nudge_enabled");
    return ok ? "on" : "failed";
  } catch {
    return "failed";
  }
}

export async function disableNudges(): Promise<void> {
  try {
    const reg = await navigator.serviceWorker.getRegistration("/sw.js");
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await rpc("delete_push_sub", { p_endpoint: sub.endpoint });
      await sub.unsubscribe();
    }
  } catch {
    /* fine */
  }
}

export async function nudgesOn(): Promise<boolean> {
  try {
    if (!pushSupported()) return false;
    const reg = await navigator.serviceWorker.getRegistration("/sw.js");
    const sub = await reg?.pushManager.getSubscription();
    return Boolean(sub);
  } catch {
    return false;
  }
}
