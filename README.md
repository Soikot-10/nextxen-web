# NEXTXEN website

Marketing site for [nextxen.co.nz](https://nextxen.co.nz), built with Next.js 16 (App Router), React 19 and Tailwind CSS 4.

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
git clone https://github.com/Soikot-10/nextxen-web.git
cd nextxen-web
git checkout claude/project-thread-1vxdzu   # the redesign branch
npm install
npm run dev
```

Then open http://localhost:3000.

## Where things live

| What | Where |
| --- | --- |
| Colours, type, spacing (design tokens) | `src/app/globals.css` (`:root`) |
| Home page | `src/app/page.tsx` |
| Orbiting services hero (canvas animation) | `src/components/HeroNetwork.tsx` |
| Floating AI assistant | `src/components/Assistant.tsx` |
| Services, industries, blog content | `src/data/*.ts` |
| Pricing | `src/components/PricingSection.tsx` |
| Line icons | `src/components/Icon.tsx` |
| SEO: sitemap, robots, share image | `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx` |

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint
