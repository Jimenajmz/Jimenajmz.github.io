# jimenajmz.com

The one rules file for this repo is `AGENTS.md`: what the site is, where each kind of page lives, how a change goes live, and what never to do. It is pulled in here so Claude Code always has it:

@AGENTS.md

Working with Jimena (this is her site; she has basic programming experience):

- Explain in plain words, one step at a time. Say which file you changed and why. She can read code; she does not want to be buried in it.
- Make the change, run `npm test`, then commit and push to the `site` branch so the preview address updates. Tell her the preview is at https://dmbvhwvb3agh1.cloudfront.net and takes about two minutes.
- Going live is her decision: only merge `site` into `main` when she asks.
- Start a new page from the matching file in `templates/`.
- Pictures: she adds them under `images/`; keep each under 1 MB and use a short, descriptive file name.

For Dave's Claude only:

- Infrastructure: `cd infra && npm test && npx cdk deploy --profile jimenajmz --require-approval never`. The `jimenajmz` profile assumes the organization role into account 045738173554.
- One heavy job at a time on Dave's machine (build, test, deploy). Jest runs with `-w 2`.
- Never deploy the site by hand; the workflows do it.
