# jimenajmz.com

Read `AGENTS.md` first. It is the one rules file for this repo and applies to Claude too.

For Claude in particular:

- Never deploy the site by hand. A push to `main` deploys it through GitHub Actions.
- Infrastructure: `cd infra && npm test && npx cdk deploy --profile jimenajmz --require-approval never`. The `jimenajmz` profile assumes the organization role into account 045738173554.
- One heavy job at a time on Dave's machine (build, test, deploy). Jest runs with `-w 2`.
- Changes to Jimena's own pages go through a pull request she approves, unless she says otherwise.
