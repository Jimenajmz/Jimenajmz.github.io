import * as cdk from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { CONFIG } from '../lib/config'
import { SiteStack, SiteStackProps, viewerRequestCode } from '../lib/site-stack'

function synthesise(props: SiteStackProps = {}): Template {
    const app = new cdk.App()
    return Template.fromStack(new SiteStack(app, 'JimenaSiteStack', { env: { account: '111111111111', region: 'us-east-1' }, ...props }))
}

describe('JimenaSiteStack', () => {
    const template = synthesise()

    it('creates the DNS zone for jimenajmz.com and publishes its name servers', () => {
        template.hasResourceProperties('AWS::Route53::HostedZone', { Name: 'jimenajmz.com.' })
        template.hasOutput('NameServers', {})
    })

    it('keeps the site bucket private, encrypted and retained', () => {
        template.hasResourceProperties('AWS::S3::Bucket', {
            BucketName: 'jimenajmz-site-111111111111',
            PublicAccessBlockConfiguration: { BlockPublicAcls: true, BlockPublicPolicy: true, IgnorePublicAcls: true, RestrictPublicBuckets: true },
        })
        template.hasResource('AWS::S3::Bucket', { DeletionPolicy: 'Retain', UpdateReplacePolicy: 'Retain' })
    })

    it('serves through CloudFront over https with pretty URLs and a 404 page', () => {
        template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1)
        template.hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: Match.objectLike({
                DefaultRootObject: 'index.html',
                DefaultCacheBehavior: Match.objectLike({
                    ViewerProtocolPolicy: 'redirect-to-https',
                    FunctionAssociations: [Match.objectLike({ EventType: 'viewer-request' })],
                }),
                CustomErrorResponses: Match.arrayWith([Match.objectLike({ ErrorCode: 404, ResponseCode: 404, ResponsePagePath: '/404.html' })]),
            }),
        })
        const code = viewerRequestCode('jimenajmz.com')
        expect(code).toContain("request.uri = uri + 'index.html'")
        expect(code).toContain("host === 'www.jimenajmz.com'")
        expect(code).toContain('https://jimenajmz.com')
    })

    it('ships with the domain off: no certificate, no aliases, no records (until the name servers move)', () => {
        expect(CONFIG.domainEnabled).toBe(false)
        template.resourceCountIs('AWS::CertificateManager::Certificate', 0)
        template.resourceCountIs('AWS::Route53::RecordSet', 0)
        const config = Object.values(template.findResources('AWS::CloudFront::Distribution'))[0].Properties['DistributionConfig']
        expect(config['Aliases']).toBeUndefined()
        template.hasOutput('DomainEnabled', { Value: 'false' })
    })

    it('adds the certificate, both aliases and four alias records when the domain is on', () => {
        const on = synthesise({ domainEnabled: true })
        on.resourceCountIs('AWS::CertificateManager::Certificate', 1)
        on.hasResourceProperties('AWS::CertificateManager::Certificate', {
            DomainName: 'jimenajmz.com', SubjectAlternativeNames: ['www.jimenajmz.com'], ValidationMethod: 'DNS',
        })
        on.hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: Match.objectLike({ Aliases: ['jimenajmz.com', 'www.jimenajmz.com'] }),
        })
        on.resourceCountIs('AWS::Route53::RecordSet', 4)
        for (const name of ['jimenajmz.com.', 'www.jimenajmz.com.']) {
            on.hasResourceProperties('AWS::Route53::RecordSet', { Name: name, Type: 'A' })
            on.hasResourceProperties('AWS::Route53::RecordSet', { Name: name, Type: 'AAAA' })
        }
    })

    it('lets only the main and site branches of her repo deploy, through GitHub OIDC, and only to this site', () => {
        template.hasResourceProperties('AWS::IAM::Role', {
            RoleName: 'jimenajmz-github-deploy',
            AssumeRolePolicyDocument: Match.objectLike({
                Statement: [Match.objectLike({
                    Action: 'sts:AssumeRoleWithWebIdentity',
                    Condition: {
                        StringEquals: {
                            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
                            'token.actions.githubusercontent.com:sub': ['repo:Jimenajmz/Jimenajmz.github.io:ref:refs/heads/main', 'repo:Jimenajmz/Jimenajmz.github.io:ref:refs/heads/site'],
                        },
                    },
                })],
            }),
        })
        const policies = JSON.stringify(template.findResources('AWS::IAM::Policy'))
        expect(policies).toContain('cloudfront:CreateInvalidation')
        expect(policies).toContain('s3:DeleteObject')
        expect(policies).not.toContain('"*"')
    })

    it('emails Dave when the month passes 5 USD, actual or forecast', () => {
        template.hasResourceProperties('AWS::Budgets::Budget', {
            Budget: Match.objectLike({ BudgetLimit: { Amount: 5, Unit: 'USD' }, TimeUnit: 'MONTHLY' }),
            NotificationsWithSubscribers: [
                Match.objectLike({ Notification: Match.objectLike({ NotificationType: 'ACTUAL' }), Subscribers: [{ SubscriptionType: 'EMAIL', Address: 'davidrazidlo@gmail.com' }] }),
                Match.objectLike({ Notification: Match.objectLike({ NotificationType: 'FORECASTED' }) }),
            ],
        })
    })
})
