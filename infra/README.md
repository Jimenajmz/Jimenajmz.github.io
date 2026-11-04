# Hosting for jimenajmz.com

One CDK stack, `JimenaSiteStack`, in AWS account 045738173554 (a member of Dave's organization, on Dave's bill). Jimena never needs an AWS login.

| Piece | What it does |
| --- | --- |
| Route 53 zone | DNS for jimenajmz.com. Its four name servers are set at Squarespace, where the domain stays registered |
| S3 bucket | Holds the built site. Private; only CloudFront reads it |
| CloudFront | Serves the site over https. A small function gives pretty URLs and sends www to the bare domain |
| Certificate | Free, renews itself, validated through the zone. Only once `domainEnabled` is true |
| Deploy role | What GitHub Actions assumes on a push to `main`, using GitHub's identity token. No stored keys anywhere |
| Budget | Emails Dave if the account passes 5 USD in a month |

## Commands

```bash
cd infra
npm install            # once
npm test               # stack assertions
npx cdk deploy --profile jimenajmz --require-approval never
```

The `jimenajmz` profile in `~/.aws/config` assumes `OrganizationAccountAccessRole` in the account from Dave's management account.

## Turning the domain on (once, after the name servers point at the zone)

1. Check: `dig +short NS jimenajmz.com` lists the four `awsdns` names from the stack's `NameServers` output.
2. Set `domainEnabled: true` in `lib/config.ts`, commit, and deploy. The certificate validates in a few minutes, then the records go in.
3. Open https://jimenajmz.com and https://www.jimenajmz.com (www redirects).

## Never

- Create or change anything in the account by hand. Change the stack.
- Deploy with a red test suite.
