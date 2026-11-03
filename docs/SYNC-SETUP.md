# Setting up the one-tap care-team sync (Supabase)

Ten minutes, five steps. Pilot use only until a BAA exists (see HIPAA-BRIEF.md).

## 1. Create a NEW Supabase project
- Go to supabase.com/dashboard and sign in.
- New project. Name: `navigator-sync`. Region: West US. Let it generate the
  database password and save it in your password manager (we never use it, but
  keep it).
- IMPORTANT: a brand-new project. Not the production one (capyv...), not the
  old Lovable one. This keeps the pilot data completely isolated.
- Wait ~2 minutes while it provisions.

## 2. Create the table
- Left sidebar: SQL Editor → New query.
- Paste the entire contents of `supabase/migrations/0001_journey_sync.sql`
  from this repo and press Run. You should see "Success. No rows returned."
- Sanity check: Table Editor → you should see a `journey_sync` table with
  columns code / payload / updated_at, and RLS shown as enabled.

## 3. Copy the two values
- Project Settings (gear icon) → Data API: copy the Project URL
  (looks like `https://abcdefghijkl.supabase.co`).
- Project Settings → API Keys: copy the public client key. Supabase renamed
  these in 2025: it's called the "Publishable key" (`sb_publishable_...`) on
  new projects, or "anon public" on older ones. Either works. Never copy the
  secret/service_role key; the app must not have it.
- This public key is designed to ship inside the app, so it is not a secret in
  the usual sense; the row-level security policies are what govern access.

## 4. Set the env vars in Vercel
- vercel.com → the `navigator` project → Settings → Environment Variables.
- Add both, for Production and Preview:
  - `NEXT_PUBLIC_SYNC_URL` = the Project URL from step 3
  - `NEXT_PUBLIC_SYNC_ANON_KEY` = the publishable/anon key from step 3
- These are baked in at build time, so nothing changes until the next deploy.
  Tell Claude "sync env is set" and it will redeploy, or press Redeploy on the
  latest deployment in the Vercel dashboard yourself.

For local dev, put the same two lines in `.env.local` (edit it with nano, per
house rules; the file is gitignored).

## 5. Verify the loop
- Open the new deploy → "Just learning for now" → check a journey step →
  "Send my progress to my care team" (the button only exists when the env vars
  are set) → note the short code it shows, like `MKT-4R7`.
- Open `/team` → enter that code → the patient's checklist appears. Tap a new
  step in the patient tab, Send again, then "Refresh all connected patients"
  on /team and watch it update.

## Troubleshooting
- No Send button → env vars missing or deploy predates them. Redeploy.
- "Couldn't send, tap to retry" → check the table exists (step 2) and RLS
  policies ran; the SQL file creates three policies, all required.
- "No patient found under that code yet" on /team → the patient hasn't tapped
  Send since the code was created, or a typo (codes never contain 0, O, 1, I,
  or L).

## What this feature stores, for anyone who asks
One row per code: the short code, the checklist payload (stage ids, outcome,
date, optional nickname), and a timestamp. It is structurally incapable of
carrying survey answers, diagnosis, age, or ZIP; the client only ever sends
the same payload as the offline share code, which is unit-tested to contain
nothing else.
