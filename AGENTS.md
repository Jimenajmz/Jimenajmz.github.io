# Rules for anyone, and any bot, working on jimenajmz.com

This is Jimena's personal site, built to her requirements brief (October 2026): a scrapbook on engineering graph paper. Jimena works on it with Claude Code; Dave's Claude helps with hosting. Every bot reads this file; keep it short and keep it true.

## What the site is

| Part | Where | Notes |
| --- | --- | --- |
| Home | `index.njk` | Welcome, a map of the sections, the latest pictures, the projects band |
| Art gallery | `art/*.md` | One file per post. `created` (when it was made), `medium`, optional `tags`, `location`, `credits`, and a `media` list of pictures or videos. The year and the medium become filter tags |
| Photography gallery | `photography/*.md` | Same shape as art (but `created` shows as "Taken" and there is no Posted date), with `location`, `camera` (full name under Where, e.g. Sony RX100 II; the filter tag drops the brand, so RX100 II) and `tags` instead of `medium` |
| About me | `about.md` | Text on the left, a `photos` list on the right, one at a time |
| Recipes | `recipes/*.md` | `category` (Appetizers, Breakfast, Lunch, Dinner, Desserts, Snacks), `prep`, `total`, `difficulty`, `rating` 1 to 5, optional `images`; then Ingredients and Steps |
| Blog | `blog/YYYY-MM-DD-title.md` | The date in the file name is the post date. Newest first |
| Projects | `projects/*.md` | `order`, `summary`, optional `links` and `photos`, then the story |
| Pictures and videos | `images/` (and `videos/` if used) | Keep pictures under 1 MB; long videos belong on YouTube, embedded with `youtube: VIDEOID` |
| Starting points | `templates/` | Copy one into the right folder and fill it in |
| Her original pages | `main/` | Her first site, kept exactly as written and still published. Do not edit |
| The look | `brief.css`, `brief.js`, `_includes/` | One stylesheet, one small script (tag filter, media viewer), the page layouts |
| Search engines | `_data/site.json`, `_includes/base.njk`, `robots.txt.njk`, `sitemap.njk` | Every page gets a title, description, canonical link, social preview and structured data (the site name, Jimena, and Menez Made; the Instagram handle stays @MenezMade). A page can set its own `description:`. `/sitemap.xml` lists every page. No trackers |

## Commands

- `npm install` once after cloning.
- `npm start` previews at http://localhost:8080 and reloads when a file is saved.
- `npm test` builds the site and checks the result. Run it before pushing. Claude Code runs it after every change.

## How a change goes live

Two branches, two addresses:

- `site` is the working branch. A push to it runs `deploy.yml`, which builds the site and puts it on the preview address, https://dmbvhwvb3agh1.cloudfront.net, within about two minutes. Nothing public changes.
- `main` is the live site. A push to it runs `pages.yml`, which publishes jimenajmz.com through GitHub Pages. To go live with what is on `site`, merge `site` into `main` (a pull request on GitHub, or ask Claude Code to open one).

Later, when the domain moves to AWS, `deploy.yml` goes back to publishing `main` and the preview address becomes the live one.

## The look, in her words

White background, black text, a subtle light-grey engineering grid, notes in black pen and pencil, small intentional accents of yellow, pink and blue. Scrapbook details sparingly; never tacky or cluttered. Readable type first. Serif headlines (Fraunces), monospace notes (IBM Plex Mono), a reading serif for long text (Lora), handwriting (Caveat) only for small notes. Everything must work on a phone.

## Never

- Put passwords, keys or tokens in the repo. None are needed; the deploy signs in to AWS without any.
- Change anything under `.github/workflows/` or `infra/` without Dave.
- Add trackers, ads or analytics.
- Edit anything under `main/`.
- Add a new colour, font or decoration without a reason the brief would agree with.

## Later phases (not built yet)

- An admin area to edit all sections from a browser. The plan is a file-based CMS (Decap or Sveltia) that edits these same text files in the repo, with a sign-in, so nothing here changes shape.
- A simple newsletter, as a separate feature.

## Decisions log

- 2026-11-04: Jimena approved publishing the rebuilt site (the brief version) to jimenajmz.com. Her original hand-written site is archived in git as the tag `old-site-2026-11-04` and the branch `archive/old-site`, and its pages stay published unchanged under `/main/` (home: `/main/first-webpage.html`). She and Dave work as a team on this site and on Med City Makerspace; she uses Claude Code on her own Claude Pro plan.

## Hosting

AWS account 045738173554, a member of Dave's organization. One stack, `JimenaSiteStack`, in `infra/`. Details in `infra/README.md`. Dave and his Claude run it; Jimena never needs an AWS login.
