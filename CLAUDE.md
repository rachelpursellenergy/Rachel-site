# Rachel Pursell site

Static site for Rachel Pursell (intuitive energy healer), hosted on Netlify and
versioned on GitHub. Rachel is not a developer: explain steps plainly and do
the technical work for her where you can.

## How the site is built

- `src/` holds the page templates (`index.html`, `privacy.html`, `terms.html`,
  `layout.html`), `style.css`, `form.js` and `images/`.
- `site.json` holds the text and settings (name, contact, links, sections).
  Content changes usually go here, not in the HTML.
- `build.mjs` fills the templates from `site.json` and writes `dist/`.
  Run it with `node build.mjs`. `dist/` is never committed.
  Node 20 is installed locally with Homebrew (`brew install node@20`), the
  same version Netlify uses.
- `netlify.toml` tells Netlify to run `node build.mjs` and publish `dist`
  (Node 20) and sets the security headers.

## Accounts and tools

- GitHub: repo `rachelpursellenergy/Rachel-site`, default branch `main`.
  Remote is SSH (`git@github.com:rachelpursellenergy/Rachel-site.git`).
  `gh` is installed with Homebrew (`/opt/homebrew/bin/gh`) and signed in as
  `rachelpursellenergy`. If `gh` is not found, add `/opt/homebrew/bin` to PATH.
- Netlify: project `rachelpursell`, site id `9c44ef36-83f8-468c-99bd-db8fd65c6ad0`,
  live at https://rachelpursell.netlify.app (custom domain: rachelpursell.com, DNS at Squarespace Domains; keep the
  Google Workspace MX/TXT records when changing DNS).
  Use the Netlify connector for read-only checks (project, deploys).
- Forms are not enabled on the Netlify project yet. Turn them on before
  relying on any contact form.
- Non-production deploys (branch and preview URLs) require Netlify team SSO
  login. Production is public.

## Deploy status

- The repo is linked to Netlify (confirmed 2026-11-13), so every push to
  `main` builds and deploys to production. The very first deploy was an API
  upload before linking.

## Workflow

0. Git identity is `Rachel Pursell <connect@rachelpursell.com>` (set globally).
   Never use a hostname-based email. Do not add a phone number or street
   address to the site or repo; they were deliberately removed.

1. Never work directly on `main` for anything beyond a tiny fix. Make a branch
   (`git switch -c short-description`), commit there, and open a PR with `gh pr create`.
2. Before committing, run `node build.mjs` and make sure it succeeds.
3. Commit small, with a plain-English message saying what changed and why.
4. Only commit, push, open or merge PRs when Rachel asks.
5. Once the repo is linked, merging to `main` publishes the live site. Treat a
   merge as a publish: confirm with Rachel first, then check the Netlify
   deploy finished (state `ready`) and the live page looks right.
6. Never commit secrets, API keys or `node_modules`/`dist`.

## Content rules

- Contact details, prices and legal text live in `site.json` and the legal
  templates. Update `legalUpdated` whenever privacy or terms text changes.
- Keep the voice warm and plain. For spiritual or energy-work copy, run it
  through the `resonant-voice-check` skill.
- Optimize images before adding them to `src/images/`.

## Security

- Do not enter passwords, tokens or card details on Rachel's behalf. She signs
  in to GitHub and Netlify herself.
