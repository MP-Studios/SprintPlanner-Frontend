import * as cdk from "aws-cdk-lib";
import * as ses from "aws-cdk-lib/aws-ses";

export class PlanlliEmailStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domain = "planlli.com";

    // SES domain identity
    const identity = new ses.EmailIdentity(this, "PlanlliSesDomain", {
      identity: ses.Identity.domain(domain),
      mailFromDomain: `mail.${domain}`,
    });

    // Output SES verification token
    new cdk.CfnOutput(this, "SESVerificationToken", {
      value: identity.verificationToken!,
      description: "TXT record value to verify your domain in SES",
    });

    // Output DKIM records (CNAMEs)
    identity.dkimRecords?.forEach((record: string, idx: number) => {
      new cdk.CfnOutput(this, `DKIMRecord${idx + 1}`, {
        value: record,
        description: "CNAME record for DKIM signing",
      });
    });

    // Optional: output MAIL FROM domain info
    if (identity.mailFromDomain) {
      new cdk.CfnOutput(this, "MailFromDomain", {
        value: identity.mailFromDomain!,
        description: "MAIL FROM subdomain for SES",
      });
    }
  }
}
