# Rules for anyone, and any bot, working on jimenajmz.com

This is Jimena's personal site. She is learning HTML and CSS, and the site is hers. Cursor, Grok and Claude all read this file; keep it short and keep it true.

## What the site is

| Part | Where | How it is published |
| --- | --- | --- |
| Her hand-written pages | `main/` (main.html, first-webpage.html, aboutme.html, projects.html, styles, images, main.js) | Copied exactly as written. Do not rewrite them unless Jimena asks |
| Home and About | `index.njk`, `about.md` | Scrapbook pages built by Eleventy with `_includes/layout.njk` |
| The scrapbook look | `scrapbook.css`, `scrapbook.js` | One stylesheet and the star rain. Her colours, fonts, grid paper and ghost cat |
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

Her look started in `main/styles/style.css` and the scrapbook theme in `scrapbook.css` is built from it: purples (`#b89cc2`, `rgb(134, 77, 156)`, `#2c1d31`), Mate for text, Lustria for headings, Caveat for handwritten labels, her grid paper as the page, white lined sheets, washi tape, sticky notes and polaroids, the star rain. Her voice is playful. Keep it.

## Hosting

AWS account 045738173554, a member of Dave's organization. One stack, `JimenaSiteStack`, in `infra/`. Details in `infra/README.md`. Dave and his Claude run it; Jimena never needs an AWS login.
