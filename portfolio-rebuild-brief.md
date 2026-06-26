# Portfolio Rebuild Brief

A handoff doc to take into Claude Code. Read this first, then follow the plan.

## What we are doing and why

I am Roberto Viana, a senior product designer with 11 years of experience. I am rebuilding my portfolio site with Claude Code, on my own custom domain, instead of the current free Framer subdomain.

This has two goals at once:
1. A cleaner, owned portfolio that matches my seniority.
2. The build itself is proof of a skill I want to show: I design and build with AI. The roles I am targeting want designers who build fast with AI tools and can produce real frontend. So I want to be able to say, truthfully, "this site was designed and built by me using Claude Code."

Keep that second goal in mind. The way the site is built is part of the message.

## My positioning (this should shape the copy)

Old framing: a UX/UI designer who builds platforms, design systems, and interactive experiences.

New framing: a senior product designer who pairs research and business strategy with building, and who builds fast with AI. I use Claude daily to automate routine work, speed up prototyping, and spend more time on the hard design calls. I also code my own front end (HTML, CSS, JavaScript).

The current site says nothing about AI. The new site should make this part of who I am, without overdoing it. One clear line in the hero or about section, plus a short note somewhere that the site was built with Claude Code.

## Plan: two phases

### Phase 1: mimic the current site
First, recreate my current site as closely as makes sense. Same pages, same structure, same projects, similar clean and minimal look. Get a working copy I can run locally before we change anything. This keeps it low risk and gives us a baseline.

### Phase 2: make the changes
Once the copy works, we improve it:
- Add the AI positioning to the hero and about copy.
- Add a short "built with Claude Code" note (footer or about).
- Add or expand one case study section that shows how I use AI in my process (rough idea to working prototype, what I did by hand versus what I sped up).
- Fix the writing slips from the old site (examples below).
- Move from a free subdomain to my own custom domain.

We do Phase 2 step by step, inside Claude Code, after Phase 1 runs.

## Current site structure (the thing to mimic)

Live reference: https://robertoviana.framer.website/

Two main pages plus case study pages.

Top nav: Projects, About.

Home page:
- Hero: "Hi, I'm Roberto Viana." with rotating words: Platforms, Design systems, Interactive experiences.
- A grid of project cards, each with a category tag, a year, and a title.
- A short about blurb near the bottom.

Projects (case study cards on the home grid):
- Carlshop Plus, B2B, 2024
- Malty design system, Design system, 2025
- Cadi, B2B and B2C, 2022
- Forecast Demand, B2B and B2A, 2022 (titled "Bridging supply logistics with predictive insights", my most AI-adjacent project)
- Branding, 2015 to present
- Motion and 3D, Video and Graphics, 2020 to present

About page: https://robertoviana.framer.website/about

Each case study has its own page at /cs/[name], for example /cs/carlshop-plus.

### Case study depth (use Carlshop Plus as the quality bar)
The Carlshop Plus case study is the model for how detailed a case study should be. Its shape:
- Title and one line subtitle.
- The Challenge: the real problem, with a short bullet list of friction points.
- The Mission: what we set out to build.
- Research: 32+ interviews, 6 personas, a service blueprint.
- High-impact solutions, each written as Insight, Solution, Result, with a real number. Examples: bounce down 12 percent, time to interactive cut by 6 seconds, search engagement up 42 percent, menu use over 60 percent.
- A "data as a compass" optimization section (rage clicks, card redesign, before and after).

When I bring over the other case studies, aim for this same Insight, Solution, Result rhythm.

## Writing fixes to carry over (do not copy these mistakes)
From the old site, clean these up:
- "Scaling a E-Commerce Ecosystem for asian markets" should be "Scaling an E-Commerce Ecosystem for Asian markets".
- "It also made soo that overall engagement increase by 6%" should be "It also increased overall engagement by 6%".
- "miss clicking" should be "misclicking".
- "Bounce off rate decrease 12%" should be "Bounce rate decreased by 12%".
Do a full proofreading pass on all copy as we go. I am a designer, so polish matters.

## Look and feel

Direction: refined editorial minimalism. Confident, quiet, lots of negative space, big type doing the work. Close in spirit to the current site, but more intentional and more owned. The work images carry the color. The layout stays calm so the projects stand out.

The starting choices (all in the provided `styles.css`, easy to change):
- Paper, not white. A warm off-white background instead of stark white. Reads more premium and editorial.
- Ink, not black. A near-black warm grey for text, softer on the eye.
- One accent only. A burnt vermilion, used sparingly: the rotating hero word, link hovers, the result callouts. Everything else stays monochrome. This keeps it from looking like a generic template.
- Type pairing with character. Headings in Fraunces (a soft editorial serif with personality). Body in Hanken Grotesk (clean and warm, not the overused Inter). Small labels like category and year in Spline Sans Mono, a monospace. That mono is a quiet nod to the fact that I code and build, which fits my positioning.
- Generous, fluid spacing and type that scale with the screen.
- One orchestrated page-load reveal (a soft staggered rise), not scattered effects. Motion respects reduced-motion settings.

If any of this does not feel like me once it is on screen, it is all driven by CSS variables at the top of the file, so I can shift the whole mood by changing a few values.

## Tech approach

I know HTML, CSS, and JavaScript, so I want to stay in control and keep it simple.

Suggested default: a plain static site, hand built with shared header and footer. Clean, fast, easy to host anywhere, and easy for me to understand.

Optional, if the repetition across case study pages gets annoying: use Astro, which lets me reuse components and write case studies in Markdown. It is AI friendly and Claude Code handles it well. Your call once we start.

Keep the design minimal and typographic, close to the current feel. Mobile first. Fast loading.

### Suggested starting structure (plain static version)
```
portfolio/
  index.html            (home: hero + project grid)
  about.html
  cases/
    carlshop-plus.html
    malty.html
    cadi.html
    forecast-demand.html
    branding.html
    motion-3d.html
  assets/
    css/styles.css        (starter design baseline is provided, drop it here)
    js/main.js
    img/               (project images go here)
  README.md
```

## Assets I need to gather
- The images from the current case studies. I will need to export or recollect these, since they currently live on Framer.
- The full text of the case studies other than Carlshop Plus (Malty, Cadi, Forecast Demand, Branding, Motion and 3D). I will paste these in as we build each page.
- My profile photo.

## Open decisions (I will choose these)
- Domain name (for example robertoviana.com or robertoviana.design).
- Where to host (Netlify, Vercel, Cloudflare Pages, and GitHub Pages all have free tiers and connect a custom domain easily).

## First prompt to paste into Claude Code

> I am rebuilding my design portfolio. Read the brief in this folder first. There is a starter `styles.css` in `assets/css/` that defines the design baseline (colors, fonts, spacing as CSS variables). Use it as the foundation, do not start the styling from scratch. To begin Phase 1, set up a plain static site with the file structure suggested in the brief. Build the home page first, matching the look and feel described in the brief: a minimal, typographic hero that says "Hi, I'm Roberto Viana" with three rotating words (Platforms, Design systems, Interactive experiences) where the rotating word uses the accent color, followed by a project grid with six cards (Carlshop Plus, Malty design system, Cadi, Forecast Demand, Branding, Motion and 3D), each showing a category tag, a year, and a title, linking to its case study page. Use placeholder images for now. Keep it mobile first. Do not add the AI copy yet, that is Phase 2.

After the home page runs, we move through the other pages, then start Phase 2.
