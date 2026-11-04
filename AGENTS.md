# Rules for anyone, and any bot, working on jimenajmz.com

This is Jimena's personal site, built to her requirements brief (October 2026): a scrapbook on engineering graph paper. Cursor, Grok and Claude all read this file; keep it short and keep it true.

## What the site is

| Part | Where | Notes |
| --- | --- | --- |
| Home | `index.njk` | Welcome, a map of the sections, the latest pictures, the projects band |
| Art gallery | `art/*.md` | One file per post. `created` (when it was made), `medium`, optional `tags`, `location`, `credits`, and a `media` list of pictures or videos. The year and the medium become filter tags |
| Photography gallery | `photography/*.md` | Same shape as art, with `location` and `tags` instead of `medium` |
| About me | `about.md` | Text on the left, a `photos` list on the right, one at a time |
| Recipes | `recipes/*.md` | `category` (Appetizers, Breakfast, Lunch, Dinner, Desserts, Snacks), `prep`, `total`, `difficulty`, `rating` 1 to 5, optional `images`; then Ingredients and Steps |
| Blog | `blog/YYYY-MM-DD-title.md` | The date in the file name is the post date. Newest first |
| Projects | `projects/*.md` | `order`, `summary`, optional `links` and `photos`, then the story |
| Pictures and videos | `images/` (and `videos/` if used) | Keep pictures under 1 MB; long videos belong on YouTube, embedded with `youtube: VIDEOID` |
| Starting points | `templates/` | Copy one into the right folder and fill it in |
| Her original pages | `main/` | Her first site, kept exactly as written and still published. Do not edit |
| The look | `brief.css`, `brief.js`, `_includes/` | One stylesheet, one small script (tag filter, media viewer), the page layouts |

## Commands

- `npm install` once after cloning.
- `npm start` previews at http://localhost:8080 and reloads when a file is saved.
- `npm test` builds the site and checks the result. Run it before pushing.

## How a change goes live

A push to `main` runs two workflows: `pages.yml` builds the site and publishes it to GitHub Pages (jimenajmz.com, while the domain points there), and `deploy.yml` uploads the same build to the AWS hosting. About two minutes. Until the first merge, the new site lives on a branch; pushing to that branch changes nothing live. When more than one person is editing, work on a branch and open a pull request.

## The look, in her words

White background, black text, a subtle light-grey engineering grid, notes in black pen and pencil, small intentional accents of yellow, pink and blue. Scrapbook details sparingly; never tacky or cluttered. Readable type first. Serif headlines (Fraunces), monospace notes (IBM Plex Mono), a reading serif for long text (Lora), handwriting (Caveat) only for small notes. Everything must work on a phone.

## Never

- Put passwords, keys or tokens in the repo. None are needed; the deploy signs in to AWS without any.
- Change `.github/workflows/deploy.yml` or anything in `infra/` without Dave.
- Add trackers, ads or analytics.
- Edit anything under `main/`.
- Add a new colour, font or decoration without a reason the brief would agree with.

## Later phases (not built yet)

- An admin area to edit all sections from a browser. The plan is a file-based CMS (Decap or Sveltia) that edits these same text files in the repo, with a sign-in, so nothing here changes shape.
- A simple newsletter, as a separate feature.

## Hosting

AWS account 045738173554, a member of Dave's organization. One stack, `JimenaSiteStack`, in `infra/`. Details in `infra/README.md`. Dave and his Claude run it; Jimena never needs an AWS login.
