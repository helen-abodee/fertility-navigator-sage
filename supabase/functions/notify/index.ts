// Scheduled nudge sender. Run daily (Supabase dashboard: Functions -> notify
// -> add a schedule). Picks due subscriptions, sends one quiet note, and
// reschedules by mode. Dead endpoints are deleted.
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3";

const MESSAGES: Record<string, string[]> = {
  deciding: [
    "No rush here. One small question is waiting whenever you are.",
    "Your options haven't gone anywhere. Ten quiet minutes is enough.",
    "Still deciding counts as a real place to be. The road is where you left it.",
  ],
  during: [
    "Treatment is the job right now. If a quiet minute shows up, one small thought lives here.",
    "Nothing is expected of you. One question, only if you want it.",
    "This road waits with you, not for you.",
  ],
  after: [
    "Have you had space to think about fertility again? One referral starts everything.",
    "Whenever you're ready: a specialist visit answers most of it in one go.",
    "The after part of the road is open, at your pace.",
  ],
  waiting: [
    "A quiet check-in, a few months on. Have you thought about fertility lately?",
    "Nothing needs doing. This is just so it never falls through the cracks.",
  ],
};
const DAYS: Record<string, number> = { deciding: 4, during: 7, after: 10, waiting: 30 };

Deno.serve(async () => {
  const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  webpush.setVapidDetails(
    Deno.env.get("VAPID_SUBJECT") ?? "mailto:hello@example.org",
    Deno.env.get("VAPID_PUBLIC_KEY")!,
    Deno.env.get("VAPID_PRIVATE_KEY")!,
  );

  const { data: due } = await supa
    .from("push_subs")
    .select("id,endpoint,p256dh,auth,mode")
    .lt("next_at", new Date().toISOString())
    .limit(200);

  let sent = 0, dropped = 0;
  for (const s of due ?? []) {
    const pool = MESSAGES[s.mode] ?? MESSAGES.deciding;
    const body = pool[Math.floor(Math.random() * pool.length)];
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify({ title: "Navigator", body, url: "/questions" }),
      );
      sent++;
      const days = DAYS[s.mode] ?? 7;
      await supa.from("push_subs").update({ next_at: new Date(Date.now() + days * 864e5).toISOString() }).eq("id", s.id);
    } catch (err) {
      const code = (err as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) {
        await supa.from("push_subs").delete().eq("id", s.id);
        dropped++;
      } else {
        await supa.from("push_subs").update({ next_at: new Date(Date.now() + 864e5).toISOString() }).eq("id", s.id);
      }
    }
  }
  return new Response(JSON.stringify({ sent, dropped }), { headers: { "content-type": "application/json" } });
});
