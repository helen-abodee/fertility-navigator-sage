export const metadata = { title: "Privacy Policy - Fertility Preservation Navigator" };

const EFFECTIVE = "November 5, 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-3xl">Privacy Policy</h1>
      <p className="text-muted mt-1 text-sm">Effective date: {EFFECTIVE}</p>

      <div className="bg-accent-tint mt-5 rounded-xl p-4">
        <p className="text-sm font-bold">The short version</p>
        <p className="mt-1 text-sm">
          Your answers stay on your device. We operate no accounts and receive none of your health
          information. The only thing that can ever leave is your progress checklist, and only when
          you choose to share or send it.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-6 text-[0.95rem]">
        <section>
          <h2 className="text-lg">1. Scope</h2>
          <p>
            This Privacy Policy describes how the Fertility Preservation Navigator (the
            &ldquo;Service&rdquo;) handles information when you use it. By using the Service, you
            acknowledge this Policy. The Service provides educational information only and does not
            provide medical, legal, or financial advice.
          </p>
        </section>

        <section>
          <h2 className="text-lg">2. Information we collect</h2>
          <p>
            <strong>Survey responses and results.</strong> Your answers, risk information, and
            results are processed entirely on your device, in your browser. They are not
            transmitted to, collected by, or accessible to us or any third party through the
            Service.
          </p>
          <p className="mt-2">
            <strong>Locally stored information.</strong> If you enable &ldquo;Save my
            progress,&rdquo; your answers and checklist are stored in your browser&rsquo;s local
            storage on your device only. You may erase all locally stored information at any time
            using &ldquo;Start over and erase everything.&rdquo;
          </p>
          <p className="mt-2">
            <strong>Progress sharing, at your direction.</strong> If you use &ldquo;Send my
            progress to my care team,&rdquo; the Service transmits only your progress checklist
            (completed steps, your selected outcome, the date) and any items you expressly elect to
            include, to a secured database, retrievable by means of the code associated with your
            submission. The Service is designed so that survey answers, diagnosis, age, and ZIP
            code cannot be included in this transmission. Sharing is optional and initiated solely
            by you.
          </p>
          <p className="mt-2">
            <strong>Usage events.</strong> The Service records anonymous usage events, such as a
            screen being opened or a feature being used, together with a random session token that
            is not linked to your name, contact information, or any account. These events are
            restricted by design to a fixed list that cannot describe your answers, diagnosis,
            results, or which specific content you viewed. The Service does not use advertising
            trackers, social media pixels, or third-party advertising SDKs.
          </p>
        </section>

        <section>
          <h2 className="text-lg">2a. Optional profiles (pilot)</h2>
          <p>
            Where the optional profile feature is available and you create a profile, your survey
            responses and progress checklist are stored in a secured database, associated with your
            account, only after you grant express authorization on a dated authorization screen.
            Profile information is accessible to you alone, is never shared with third parties, and
            is never used for advertising. You may delete your profile at any time from within the
            Service; deletion is immediate and removes your account and all stored information.
            California residents: information stored in a profile is treated as medical information
            subject to the Confidentiality of Medical Information Act.
          </p>
        </section>
        <section>
          <h2 className="text-lg">3. How information is used</h2>
          <p>
            Locally stored information is used solely to restore your session on your device.
            Progress information you elect to send is used solely to display your checklist to the
            care team you direct it to. We do not sell, rent, or share personal information, and we
            do not use it for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-lg">4. HIPAA</h2>
          <p>
            The Health Insurance Portability and Accountability Act (&ldquo;HIPAA&rdquo;) applies
            to covered entities, such as health care providers and health plans, and to those
            processing information on their behalf. The Service is not offered by your health care
            provider and, because your survey responses are never transmitted to us, the Service
            does not create, receive, maintain, or transmit protected health information on behalf
            of any covered entity. HIPAA does not restrict your own right to share your
            information; when you share your summary or send your progress, you are exercising that
            right. Information received by your care team is thereafter protected under their own
            HIPAA obligations.
          </p>
        </section>

        <section>
          <h2 className="text-lg">5. Your choices and rights</h2>
          <p>
            All sharing features are off by default. You may use the Service without saving,
            sharing, or sending anything. You may erase locally stored information at any time. If
            you have sent progress information and wish it deleted, contact us with your code and
            we will delete the associated record.
          </p>
        </section>

        <section>
          <h2 className="text-lg">6. Children</h2>
          <p>
            The Service provides educational information for adolescents and young adults affected
            by cancer, including users under 18, and is designed to function without collecting
            personal information from any user.
          </p>
        </section>

        <section>
          <h2 className="text-lg">7. Changes to this Policy</h2>
          <p>
            We may update this Policy from time to time. The effective date above reflects the
            latest revision. Material changes will be reflected on this page before they take
            effect.
          </p>
        </section>

        <section>
          <h2 className="text-lg">8. Contact</h2>
          <p>
            Questions about this Policy can be directed to the project team through the program
            that provided you this tool.
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
