'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/cn';

type Line =
  | { kind: 'cmd'; text: string }
  | { kind: 'ok'; text: string }
  | { kind: 'ask'; label: string; value: string }
  | { kind: 'url'; text: string };

const LINES: Line[] = [
  { kind: 'cmd', text: 'pip install pyblade' },
  { kind: 'ok', text: 'Successfully installed pyblade' },
  { kind: 'cmd', text: 'pyblade init' },
  { kind: 'ask', label: 'Project name', value: 'blog' },
  { kind: 'ask', label: 'Web framework', value: 'Django' },
  { kind: 'ask', label: 'CSS framework', value: 'Tailwind CSS' },
  { kind: 'ok', text: 'Created blog/ and pyblade.json' },
  { kind: 'cmd', text: 'pyblade serve' },
  { kind: 'url', text: 'http://127.0.0.1:8000' },
  // Trailing prompt so the caret has somewhere to rest once the run finishes.
  { kind: 'cmd', text: '' },
];

const CHAR_MS = 30;
const AFTER_CMD_MS = 420;
const AFTER_OUT_MS = 240;

function plainText(line: Line): string {
  switch (line.kind) {
    case 'cmd':
      return `$ ${line.text}`;
    case 'ok':
      return `  ✓ ${line.text}`;
    case 'ask':
      return `  ? ${line.label}  ${line.value}`;
    case 'url':
      return `  → ${line.text}`;
  }
}

const TRANSCRIPT = LINES.map(plainText).join('\n');

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false, // the server can't know; assume motion is fine and correct on hydration
  );
}

export function HeroTerminal() {
  // `line` is the index currently being revealed; `chars` how much of it is typed.
  const [pos, setPos] = useState({ line: 0, chars: 0 });
  const reduced = usePrefersReducedMotion();

  const finished = reduced || pos.line >= LINES.length;

  useEffect(() => {
    if (reduced || finished) return;

    const line = LINES[pos.line];

    if (line.kind === 'cmd' && pos.chars < line.text.length) {
      const t = setTimeout(
        () => setPos((p) => ({ line: p.line, chars: p.chars + 1 })),
        CHAR_MS,
      );
      return () => clearTimeout(t);
    }

    const t = setTimeout(
      () => setPos({ line: pos.line + 1, chars: 0 }),
      line.kind === 'cmd' ? AFTER_CMD_MS : AFTER_OUT_MS,
    );
    return () => clearTimeout(t);
  }, [pos, reduced, finished]);

  return (
    <div className="border-pb-line bg-pb-surface overflow-hidden rounded-xl border shadow-[0_24px_60px_-30px_rgb(0_0_0_/_0.5)]">
      <div className="border-pb-line flex items-center justify-between gap-4 border-b px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="bg-pb-faint/40 size-2.5 rounded-full" />
          <span className="bg-pb-faint/40 size-2.5 rounded-full" />
          <span className="bg-pb-faint/40 size-2.5 rounded-full" />
        </div>
        <p className="font-code text-pb-faint text-xs">bash</p>
        <button
          type="button"
          onClick={() => setPos({ line: 0, chars: 0 })}
          aria-label="Replay the terminal session"
          className={cn(
            'text-pb-faint hover:text-pb-ink -m-1.5 rounded-md p-1.5 transition',
            (!finished || reduced) && 'pointer-events-none opacity-0',
          )}
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Every line is always in the DOM — the ones not yet reached are merely
          invisible, so the panel holds its final height and never reflows. */}
      <div
        className="bg-pb-codebg font-code pb-code overflow-x-auto px-4 py-5 text-[12.5px] leading-[1.95] sm:px-6 sm:text-[13.5px]"
        aria-hidden="true"
      >
        <pre className="min-w-max">
          {LINES.map((line, i) => {
            const reveal = reduced || i < pos.line;
            const active = !reduced && i === pos.line;
            const showCaret =
              (active && line.kind === 'cmd') ||
              (finished && !reduced && i === LINES.length - 1);

            return (
              <div key={i} className={cn(!reveal && !active && 'invisible')}>
                {line.kind === 'cmd' && (
                  <>
                    <span className="pb-dir">$</span>{' '}
                    <span>{reveal ? line.text : line.text.slice(0, pos.chars)}</span>
                    {showCaret && <span className="pb-caret">&nbsp;</span>}
                  </>
                )}
                {line.kind === 'ok' && (
                  <>
                    {'  '}
                    <span className="pb-str">✓</span>{' '}
                    <span className="pb-pun">{line.text}</span>
                  </>
                )}
                {line.kind === 'ask' && (
                  <>
                    {'  '}
                    <span className="pb-pun">?</span>{' '}
                    <span>{line.label.padEnd(17, ' ')}</span>
                    <span className="pb-str">{line.value}</span>
                  </>
                )}
                {line.kind === 'url' && (
                  <>
                    {'  '}
                    <span className="pb-pun">→</span>{' '}
                    <span className="pb-var">{line.text}</span>
                  </>
                )}
              </div>
            );
          })}
        </pre>
      </div>

      <pre className="sr-only">{TRANSCRIPT}</pre>
    </div>
  );
}
