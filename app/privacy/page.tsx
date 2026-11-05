export const metadata = { title: "Privacy - Fertility Preservation Navigator" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-3xl">How this tool protects your privacy</h1>
      <p className="text-muted mt-1 text-sm">Last reviewed November 5, 2026</p>

      <div className="mt-6 flex flex-col gap-5">
        <section>
          <h2 className="text-lg">Your answers stay on your device</h2>
          <p>
            When you answer questions here, the answers live only in your browser's memory. When
            you close the tab, they are gone. There is no account to create, no database, and no
            server that receives your answers.
          </p>
        </section>
        <section>
          <h2 className="text-lg">"Save my progress" is optional and local</h2>
          <p>
            If you choose to save your progress, your answers are stored only in your own browser,
            on your own device. The "Start over and erase everything" button removes all of it
            immediately.
          </p>
        </section>
        <section>
          <h2 className="text-lg">Your summary is made on your device</h2>
          <p>
            When you download your summary, your browser builds the PDF itself. The information in
            it is never uploaded.
          </p>
        </section>
        <section>
          <h2 className="text-lg">Your ZIP code never leaves your phone</h2>
          <p>
            If you enter a ZIP code, it is used only to measure the distance to clinics on the map,
            and only on your device.
          </p>
        </section>
        <section>
          <h2 className="text-lg">No trackers</h2>
          <p>
            This site has no advertising trackers, no social media pixels, and no third-party
            analytics SDKs. If we ever add usage analytics, they will count page views only and
            will never receive any of your answers.
          </p>
        </section>
        <section>
          <h2 className="text-lg">What we can see about you: nothing</h2>
          <p>
            We cannot see your answers, your age, your diagnosis, or your results, because they are
            never sent to us.
          </p>
        </section>
        <section>
          <h2 className="text-lg">"Send my progress" is the one thing that leaves, and only when you tap it</h2>
          <p>
            If you choose to send your progress to your care team, exactly one thing travels: your
            checklist from "Where I am with this" (which steps you checked, where you landed, the
            date), plus anything you specifically tick to include, like your risk group. It is
            stored in a secure database under a short code so your care team can see it. Your
            survey answers, diagnosis, age, and ZIP code are never part of it; the app is built so
            they cannot be sent.
          </p>
        </section>
        <section>
          <h2 className="text-lg">Where HIPAA fits in</h2>
          <p>
            HIPAA is the law that governs how health care providers and insurers handle your
            information. It binds them, not you: sharing your own information is always your right
            and never a violation. This tool is not run by your health care provider, and your
            answers never reach us or them, so there is nothing here for HIPAA to restrict. When
            you share your summary or send your progress, you are the one doing the sharing, which
            the law fully allows. Once your care team receives it, they protect it under their own
            HIPAA obligations, the same as anything you tell them.
          </p>
        </section>
        <section>
          <h2 className="text-lg">A note on medical advice</h2>
          <p>
            This tool is for information. It does not diagnose anything, predict your fertility, or
            tell you what to do. Decisions about fertility preservation belong with you and your
            care team.
          </p>
        </section>
      </div>

      <p className="mt-8">
        <a href="/" className="text-accent-ink font-bold underline">
          Back to the start
        </a>
      </p>
    </main>
  );
}
