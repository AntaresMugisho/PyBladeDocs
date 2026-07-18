import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    icon: '🐍',
    title: 'Pythonic Template Engine',
    details:
      "Write templates with a familiar Python-like syntax. PyBlade's template engine offers clean, readable syntax with full Python expression support and built-in security features.",
  },
  {
    icon: '🧩',
    title: 'Component-Driven Development',
    details:
      'Create reusable, self-contained components with server-side rendering capabilities. Build interactive UIs efficiently, similar to modern frontend frameworks.',
  },
  {
    icon: '🛠️',
    title: 'Powerful CLI Toolkit',
    details:
      'Boost your productivity with PyBlade CLI. Scaffold projects, generate components, and manage your development workflow seamlessly.',
  },
  {
    icon: '🔌',
    title: 'Framework Integration',
    details:
      'Seamlessly integrates with popular Python web frameworks. From custom form handling to data-binding, PyBlade works harmoniously with your stack.',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    details:
      'Optimized for performance with efficient template compilation and minimal runtime overhead. Your templates run at native Python speed.',
  },
  {
    icon: '🛡️',
    title: 'Secure by Design',
    details:
      'Built with security in mind. Automatic XSS protection, content sanitization, and configurable security policies keep your applications safe.',
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-24 text-center">
        <Image
          src="/images/pyblade.png"
          alt="PyBlade Logo"
          width={96}
          height={96}
          className="rounded-2xl"
          priority
        />
        <h1 className="bg-gradient-to-r from-[#4B8BBE] to-[#FFD43B] bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
          PyBlade
        </h1>
        <p className="text-xl font-medium text-fd-foreground">
          The frontend framework for Python web frameworks.
        </p>
        <p className="text-lg text-fd-muted-foreground">
          Secure, Elegant and Lightweight!
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/docs/getting-started"
            className="rounded-full bg-fd-primary px-6 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Getting started
          </Link>
          <Link
            href="/docs/meet-pyblade"
            className="rounded-full border border-fd-border px-6 py-2.5 font-medium transition-colors hover:bg-fd-accent"
          >
            What is PyBlade?
          </Link>
          <a
            href="https://github.com/antaresmugisho/pyblade"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-fd-border px-6 py-2.5 font-medium transition-colors hover:bg-fd-accent"
          >
            GitHub
          </a>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:bg-fd-accent/50"
          >
            <div className="mb-3 text-3xl">{f.icon}</div>
            <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
            <p className="text-sm text-fd-muted-foreground">{f.details}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
