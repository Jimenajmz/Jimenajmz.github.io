import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as budgets from 'aws-cdk-lib/aws-budgets'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'
import { CONFIG } from './config'

export interface SiteStackProps extends cdk.StackProps {
    /** Serve on the real domain (certificate, aliases, records). Defaults to CONFIG.domainEnabled. */
    domainEnabled?: boolean
}

/**
 * Viewer-request function: pretty URLs on S3 (a folder address serves its index.html)
 * and www redirected to the bare domain.
 */
export function viewerRequestCode(domain: string): string {
    return [
        'function handler(event) {',
        '  var request = event.request;',
        '  var host = request.headers.host && request.headers.host.value;',
        `  if (host === 'www.${domain}') {`,
        `    return { statusCode: 301, statusDescription: 'Moved Permanently', headers: { location: { value: 'https://${domain}' + request.uri } } };`,
        '  }',
        '  var uri = request.uri;',
        "  if (uri.endsWith('/')) { request.uri = uri + 'index.html'; }",
        "  else if (!uri.includes('.')) { request.uri = uri + '/index.html'; }",
        '  return request;',
        '}',
    ].join('\n')
}

/**
 * Everything jimenajmz.com needs, in one stack: the DNS zone, a private bucket behind
 * CloudFront, a role GitHub Actions assumes to upload (no stored keys), and a budget.
 */
export class SiteStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: SiteStackProps) {
        super(scope, id, props)
        const domainEnabled = props?.domainEnabled ?? CONFIG.domainEnabled
        const www = `www.${CONFIG.domain}`

        // ---- DNS zone: created first so its four name servers can be set at the registrar ----
        const zone = new route53.PublicHostedZone(this, 'Zone', { zoneName: CONFIG.domain })

        // ---- Site files ----
        const bucket = new s3.Bucket(this, 'SiteBucket', {
            bucketName: `${CONFIG.project}-site-${this.account}`,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            enforceSSL: true,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        })

        // ---- Delivery ----
        const viewerRequest = new cloudfront.Function(this, 'ViewerRequest', {
            code: cloudfront.FunctionCode.fromInline(viewerRequestCode(CONFIG.domain)),
            runtime: cloudfront.FunctionRuntime.JS_2_0,
            comment: 'Pretty URLs and the www redirect for jimenajmz.com',
        })
        const certificate = domainEnabled
            ? new acm.Certificate(this, 'Certificate', {
                domainName: CONFIG.domain,
                subjectAlternativeNames: [www],
                validation: acm.CertificateValidation.fromDns(zone),
            })
            : undefined
        const distribution = new cloudfront.Distribution(this, 'Distribution', {
            comment: CONFIG.domain,
            defaultRootObject: 'index.html',
            httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
            defaultBehavior: {
                origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                compress: true,
                functionAssociations: [{ function: viewerRequest, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST }],
            },
            errorResponses: [
                { httpStatus: 403, responseHttpStatus: 404, responsePagePath: '/404.html', ttl: cdk.Duration.minutes(5) },
                { httpStatus: 404, responseHttpStatus: 404, responsePagePath: '/404.html', ttl: cdk.Duration.minutes(5) },
            ],
            ...(certificate ? { certificate, domainNames: [CONFIG.domain, www], minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021 } : {}),
        })
        if (domainEnabled) {
            const target = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
            for (const [label, recordName] of [['Apex', undefined], ['Www', 'www']] as const) {
                new route53.ARecord(this, `${label}A`, { zone, recordName, target })
                new route53.AaaaRecord(this, `${label}Aaaa`, { zone, recordName, target })
            }
        }

        // ---- GitHub Actions deploys with a short-lived identity token, never a stored key ----
        const github = new iam.OpenIdConnectProvider(this, 'GitHub', {
            url: 'https://token.actions.githubusercontent.com',
            clientIds: ['sts.amazonaws.com'],
        })
        const deployRole = new iam.Role(this, 'DeployRole', {
            roleName: `${CONFIG.project}-github-deploy`,
            description: `Lets ${CONFIG.repo} (branch ${CONFIG.branch}) upload the site and refresh the cache`,
            assumedBy: new iam.OpenIdConnectPrincipal(github, {
                StringEquals: {
                    'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
                    'token.actions.githubusercontent.com:sub': `repo:${CONFIG.repo}:ref:refs/heads/${CONFIG.branch}`,
                },
            }),
            maxSessionDuration: cdk.Duration.hours(1),
        })
        bucket.grantReadWrite(deployRole)
        deployRole.addToPolicy(new iam.PolicyStatement({
            actions: ['cloudfront:CreateInvalidation'],
            resources: [`arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`],
        }))

        // ---- Spend: an email at 100 percent of the monthly limit, actual or forecast ----
        new budgets.CfnBudget(this, 'Budget', {
            budget: {
                budgetName: `${CONFIG.project}-monthly`,
                budgetType: 'COST',
                timeUnit: 'MONTHLY',
                budgetLimit: { amount: CONFIG.budgetUsd, unit: 'USD' },
            },
            notificationsWithSubscribers: ['ACTUAL', 'FORECASTED'].map((notificationType) => ({
                notification: { notificationType, comparisonOperator: 'GREATER_THAN', threshold: 100, thresholdType: 'PERCENTAGE' },
                subscribers: [{ subscriptionType: 'EMAIL', address: CONFIG.alarmEmail }],
            })),
        })

        new cdk.CfnOutput(this, 'NameServers', { value: cdk.Fn.join(' ', zone.hostedZoneNameServers ?? []), description: 'Set these four at the registrar' })
        new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName })
        new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId })
        new cdk.CfnOutput(this, 'DistributionDomain', { value: distribution.distributionDomainName, description: 'Test address before the domain is switched' })
        new cdk.CfnOutput(this, 'DeployRoleArn', { value: deployRole.roleArn })
        new cdk.CfnOutput(this, 'DomainEnabled', { value: String(domainEnabled) })
    }
}
