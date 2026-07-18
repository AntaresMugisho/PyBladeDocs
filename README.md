# PyBladeDocs

Documentation site for [PyBlade](https://github.com/antaresmugisho/pyblade) — the lightweight and secure frontend framework for Python web frameworks.

Built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev).

## Development

Requires Node.js 20.19+ (Node 22 LTS recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the site.

## Scripts

| Script                | Description                          |
| --------------------- | ------------------------------------ |
| `npm run dev`         | Start the development server.        |
| `npm run build`       | Create a production build.           |
| `npm run start`       | Serve the production build.          |
| `npm run lint`        | Run ESLint.                          |
| `npm run types:check` | Generate types and run `tsc`.        |

## Project structure

| Path                       | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| `content/docs`             | The documentation content, written in MDX.             |
| `content/docs/meta.json`   | Sidebar ordering and section grouping.                  |
| `app/(home)`               | The landing page.                                       |
| `app/docs`                 | The documentation layout and pages.                    |
| `lib/source.ts`            | Content source adapter used by the pages.              |
| `lib/layout.shared.tsx`    | Shared navbar / layout options.                         |
| `source.config.ts`         | Fumadocs MDX configuration (frontmatter schema, etc.). |

## Writing docs

Add or edit `.mdx` files under `content/docs`. Each page uses frontmatter:

```mdx
---
title: Page title
description: Optional short description
---

Content goes here. Callouts, code blocks and cards are available out of the box:

<Callout type="info" title="Note">
  This is a callout.
</Callout>
```

Update `content/docs/meta.json` (and the nested `meta.json` files under `live/`,
`live/features/` and `cli/`) to control the sidebar order and section headings.
