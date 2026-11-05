/** Fixed facts about the jimenajmz.com hosting. Change a value here, not in the stack. */
export const CONFIG = {
    project: 'jimenajmz',
    region: 'us-east-1',
    /** The site. www redirects to it. */
    domain: 'jimenajmz.com',
    /** GitHub repo and branches allowed to deploy (the OIDC trust lists exactly these). `site` is the preview branch until the domain moves. */
    repo: 'Jimenajmz/Jimenajmz.github.io',
    branches: ['main', 'site'],
    /**
     * Serve on the real domain: certificate, aliases and DNS records. Off until the domain's
     * name servers at Squarespace point at the zone this stack creates; the certificate cannot
     * validate before that and the deploy would hang. Flip to true, deploy again.
     */
    domainEnabled: false as boolean,
    /** Monthly spend limit in USD; AWS Budgets emails `alarmEmail` at 100 percent, actual or forecast. */
    budgetUsd: 5,
    alarmEmail: 'davidrazidlo@gmail.com',
} as const
