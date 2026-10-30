# Kishorebabu S — Portfolio

A personal portfolio built with React and Vite. It features a time-aware photographic sky, animated hero clouds and mist, a work timeline, a technology carousel, company project details, and independent project cards.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or preview it with `npm run preview`.

## Features

- A responsive portfolio hero with animated portrait cards and rotating developer roles.
- A local-time sky that blends morning, day, evening, and night scenes. Cloud and mist movement is limited to the hero.
- A work-experience timeline with a static sky photo board that changes with the selected lighting and reveals Codingmart office photos on hover or focus.
- A looping technology carousel that pauses on hover.
- A company project table with detailed project modals.
- A personal projects section for the Tokenizer, LeetCode Grid Viewer, and React Component Library.
- A closing social and contact section with a generated pencil-scribble portrait, profile links, email, and location.
- Reduced-motion support and responsive layouts.

## Personalize

Edit the `profile` object in `src/main.jsx` to update the name, introduction, location, email, and portraits. Sky palettes and scene blending are in `src/sky/time.js`; visual styling is in `src/styles.css` and `src/sky/sky.css`.

Generated images used by the site are in `public/assets/`. The reference photographs in `my images/` are local source material and are not served by the site or included in the repository.

## Scripts

- `npm run dev` — start the development server.
- `npm run build` — create a production build in `dist/`.
- `npm run preview` — preview the production build.
- `npm test` — check sky time handling, palette contrast, and scene blending.
