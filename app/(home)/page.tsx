import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CopyButton } from '@/components/home/copy-button';
import { HeroTerminal } from '@/components/home/hero-terminal';
import { LogoMark } from '@/components/home/logo-mark';

const steps = [
  {
    command: 'pip install pyblade',
    title: 'Install',
    detail:
      'Inside a virtual environment. The PyBlade CLI ships with the package — nothing else to add.',
  },
  {
    command: 'pyblade init',
    title: 'Create a project',
    detail:
      'Pick a name, your web framework and a CSS framework. settings.py is wired up for you.',
  },
  {
    command: 'pyblade serve',
    title: 'Run it',
    detail: 'Your app is live at http://127.0.0.1:8000, with hot reload on your templates.',
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <div
          className="bg-pb-blade/[0.09] pointer-events-none absolute top-0 left-1/2 h-[560px] w-[900px] -translate-x-1/4 rounded-full blur-[130px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <p
              className="pb-rise border-pb-brand/40 bg-pb-brand/[0.10] text-pb-amber font-code inline-flex items-center gap-2 rounded-full border py-1 pr-3 pl-2.5 text-xs"
              style={{ '--d': '.05s' } as React.CSSProperties}
            >
              <span className="bg-pb-brand size-1.5 rounded-full" />
              experimental · not production-ready
            </p>

            <h1
              className="pb-rise font-display mt-6 text-[2.6rem] leading-[0.98] font-extrabold tracking-[-0.03em] sm:text-6xl"
              style={{ '--d': '.12s' } as React.CSSProperties}
            >
              The frontend framework
              <span className="text-pb-blade block">for Python.</span>
            </h1>

            <p
              className="pb-rise text-pb-muted mt-7 max-w-lg text-lg leading-relaxed"
              style={{ '--d': '.2s' } as React.CSSProperties}
            >
              Secure, elegant and lightweight. Write templates with{' '}
              <code className="font-code text-pb-amber text-[0.92em]">@</code> directives, and
              build interactive components without ever leaving them.
            </p>

            <div
              className="pb-rise mt-9 flex flex-wrap items-center gap-3"
              style={{ '--d': '.28s' } as React.CSSProperties}
            >
              <Link
                href="/docs"
                className="bg-pb-brand inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold text-[#0C141C] transition-all hover:brightness-105 active:scale-[.98]"
              >
                Read the documentation
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              {/* <Link
                href="https://feedback.pyblade.com"
                className="border-pb-line text-pb-ink hover:bg-pb-raised inline-flex items-center gap-2 rounded-lg border px-5 py-3 font-medium transition-colors"
              >
                Leave a feedback
              </Link> */}
            </div>

            <div
              className="pb-rise font-code mt-7 flex items-center gap-1 text-sm"
              style={{ '--d': '.34s' } as React.CSSProperties}
            >
              <code className="text-pb-muted">pip install pyblade</code>
              <CopyButton value="pip install pyblade" />
            </div>
          </div>

          <div className="pb-rise min-w-0" style={{ '--d': '.18s' } as React.CSSProperties}>
            <HeroTerminal />
          </div>
        </div>
      </section>

      {/* ---------------- QUICK START ---------------- */}
      <section className="border-pb-line border-t">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="font-code text-pb-amber text-xs">@quickstart</p>
            <h2 className="font-display mt-4 text-3xl leading-[1.05] font-bold tracking-[-0.025em] sm:text-[2.6rem]">
              Three commands to a running app.
            </h2>
          </div>

          <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={step.command}
                className="border-pb-line bg-pb-surface flex flex-col rounded-xl border p-6"
              >
                <p className="font-code text-pb-amber text-sm">0{i + 1}</p>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="text-pb-muted mt-2 flex-1 text-sm leading-relaxed">
                  {step.detail}
                </p>

                <div className="border-pb-line bg-pb-codebg mt-5 flex items-center justify-between gap-2 rounded-lg border py-2 pr-2 pl-3.5">
                  {/* min-w-0 so the nowrap command scrolls inside the block instead of
                      forcing the card — and the page — wider on narrow screens. */}
                  <code className="font-code pb-code min-w-0 overflow-x-auto text-[13px] whitespace-nowrap">
                    <span className="pb-dir">$</span> {step.command}
                  </code>
                  <CopyButton value={step.command} className="shrink-0" />
                </div>
              </li>
            ))}
          </ol>

          {/* ---------------- CTA ---------------- */}
          <div className="border-pb-line mt-14 flex flex-col items-start gap-6 border-t pt-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <LogoMark className="size-8 shrink-0" />
              <p className="text-pb-muted text-sm leading-relaxed">
                Everything else — directives, layouts, components and PyBlade Live — is in the
                docs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/docs/getting-started/installation"
                className="bg-pb-brand inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-[#0C141C] transition-all hover:brightness-105 active:scale-[.98]"
              >
                Get started
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/docs/live/"
                className="border-pb-line text-pb-ink hover:bg-pb-raised inline-flex items-center rounded-lg border px-5 py-2.5 font-medium transition-colors"
              >
                Live Components
              </Link>
              <a
                href="https://github.com/antaresmugisho/pyblade"
                target="_blank"
                rel="noreferrer"
                className="text-pb-muted hover:text-pb-ink px-2 py-2.5 text-sm transition-colors"
              >
                GitHub →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
