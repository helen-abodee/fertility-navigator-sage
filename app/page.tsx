export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-12">
      <h1 className="text-3xl">Thinking about future fertility, on your terms</h1>
      <p className="text-muted">
        A few questions, a few minutes. You can skip anything, and &ldquo;not sure&rdquo; is always
        a real answer. At the end you get the options that fit your situation, what they cost, and
        what to ask your care team.
      </p>
      <p className="text-muted text-sm">
        Your answers stay on this device. No account, nothing sent anywhere.
      </p>
      <a
        href="/questions"
        className="bg-accent text-accent-contrast rounded-xl px-6 py-4 text-center text-lg font-bold"
      >
        Start
      </a>
    </main>
  );
}
