import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Answers } from "./types";
import type { Journey } from "./journey";

/**
 * Lane-2 profiles (PILOT, flag-gated; see docs/PROFILES-LAW-BRIEF.md).
 * Storing answers server-side makes the operator a provider of health care
 * under California CMIA, so this module is built to those duties:
 * - nothing is stored before the user grants explicit authorization
 * - every row is isolated to its owner by row-level security
 * - deletion is self-service and total (auth user + data)
 * - there is no sharing path to any third party in this codebase
 * Enabled only when NEXT_PUBLIC_PROFILES=1 and the sync env exists; real
 * patient use additionally waits on counsel review (operating entity: LLC).
 */

export const CONSENT_VERSION = "2026-11-06";

const URL_ = process.env.NEXT_PUBLIC_SYNC_URL;
const KEY = process.env.NEXT_PUBLIC_SYNC_ANON_KEY;

export const profilesEnabled =
  process.env.NEXT_PUBLIC_PROFILES === "1" && Boolean(URL_ && KEY);

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient | null {
  if (!profilesEnabled) return null;
  if (!client) client = createClient(URL_!, KEY!);
  return client;
}

export async function requestLoginCode(email: string): Promise<boolean> {
  const sb = supabase();
  if (!sb) return false;
  const { error } = await sb.auth.signInWithOtp({ email });
  return !error;
}

export async function verifyLoginCode(email: string, code: string): Promise<boolean> {
  const sb = supabase();
  if (!sb) return false;
  const { error } = await sb.auth.verifyOtp({ email, token: code.trim(), type: "email" });
  return !error;
}

export async function currentUserEmail(): Promise<string | null> {
  const sb = supabase();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data.user?.email ?? null;
}

export async function signOut(): Promise<void> {
  await supabase()?.auth.signOut();
}

/** Stores answers + journey; refuses without the consent version recorded. */
export async function saveProfileData(
  answers: Answers,
  journey: Journey,
  consented: boolean,
): Promise<boolean> {
  const sb = supabase();
  if (!sb || !consented) return false;
  const { data } = await sb.auth.getUser();
  if (!data.user) return false;
  const { error } = await sb.from("profile_data").upsert({
    user_id: data.user.id,
    answers,
    journey,
    consent_version: CONSENT_VERSION,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

export async function loadProfileData(): Promise<{ answers: Answers; journey: Journey } | null> {
  const sb = supabase();
  if (!sb) return null;
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return null;
  const { data, error } = await sb.from("profile_data").select("answers,journey").eq("user_id", u.user.id).maybeSingle();
  if (error || !data) return null;
  return { answers: (data.answers ?? {}) as Answers, journey: (data.journey ?? null) as Journey };
}

/** Total deletion: account and all data, no support ticket needed. */
export async function deleteAccount(): Promise<boolean> {
  const sb = supabase();
  if (!sb) return false;
  const { error } = await sb.rpc("delete_me");
  if (!error) await sb.auth.signOut();
  return !error;
}
