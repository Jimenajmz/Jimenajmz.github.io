#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { CONFIG } from '../lib/config'
import { SiteStack } from '../lib/site-stack'

const app = new cdk.App()
// `cdk deploy -c domainEnabled=true` turns the domain on for one deploy; CONFIG.domainEnabled is the lasting switch.
const flag = app.node.tryGetContext('domainEnabled')
new SiteStack(app, 'JimenaSiteStack', {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: CONFIG.region },
    description: 'jimenajmz.com: DNS zone, site bucket, CloudFront, GitHub deploy role, budget',
    domainEnabled: flag === undefined ? CONFIG.domainEnabled : flag === 'true' || flag === true,
})
cdk.Tags.of(app).add('project', CONFIG.project)
