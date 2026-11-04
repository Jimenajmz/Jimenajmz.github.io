# Rules for anyone, and any bot, working on jimenajmz.com

This is Jimena's personal site. She is learning HTML and CSS, and the site is hers. Cursor, Grok and Claude all read this file; keep it short and keep it true.

## What the site is

| Part | Where | How it is published |
| --- | --- | --- |
| Hand-written pages | `index.html`, `main/` (main.html, aboutme.html, projects.html, styles, images, main.js) | Copied exactly as written. Do not rewrite them unless Jimena asks |
| Recipes | `recipes/*.md` | Eleventy turns each file into a page using `_includes/layout.njk` |
| Blog posts | `posts/YYYY-MM-DD-title.md` | Same. The date in the file name is the post date |
| Art | `art/*.md` with `image:` in the front matter | Same, plus a thumbnail on the Art page |
| Pictures for text pages | `images/` | Copied as they are. Keep each under 1 MB |
| Starting points | `templates/` | Copy one into the right folder and fill it in |

## Commands

- `npm install` once after cloning.
- `npm start` previews at http://localhost:8080 and reloads when a file is saved.
- `npm test` builds the site and checks the result. Run it before pushing.

## How a change goes live

A push to `main` runs `.github/workflows/deploy.yml`: build, test, upload to AWS, refresh the cache. About two minutes. When more than one person is editing, work on a branch and open a pull request.

## Never

- Put passwords, keys or tokens in the repo. None are needed; the deploy signs in to AWS without any.
- Change `.github/workflows/deploy.yml` or anything in `infra/` without Dave.
- Add trackers, ads or analytics.
- Rewrite her hand-written pages into a framework or a template. Tidy them only when she asks.

## Style

Her look lives in `main/styles/style.css`: purples (`#b89cc2`, `rgb(134, 77, 156)`, `#2c1d31`), Mate for text and Lustria for headings, white cards with purple borders and rounded corners, the star rain from `main/main.js`. New pages reuse all of it through the layout; `pages.css` only adjusts the card for long content. Her voice is playful. Keep it.

## Hosting

AWS account 045738173554, a member of Dave's organization. One stack, `JimenaSiteStack`, in `infra/`. Details in `infra/README.md`. Dave and his Claude run it; Jimena never needs an AWS login.
