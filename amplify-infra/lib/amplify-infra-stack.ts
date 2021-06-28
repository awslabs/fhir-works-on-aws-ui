/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import * as cdk from '@aws-cdk/core';
import * as amplify from "@aws-cdk/aws-amplify";
import { Repository } from '@aws-cdk/aws-codecommit';


export class AmplifyInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Get context variables
    const fhir_server_url = this.node.tryGetContext('fhir_server_url');
    const auth_url = this.node.tryGetContext('auth_url');
    const client_id = this.node.tryGetContext('client_id');
    const api_key = this.node.tryGetContext('api_key');
    const amplify_branch = this.node.tryGetContext('amplify_branch') ?? "mainline";

    const fhirWorksOnAwsUiRepo = new Repository(
      this,
      "FhirWorksOnAwsUiRepo",
      {
        repositoryName: "fhir-works-on-aws-ui",
        description:
          "CodeCommit repository that will be used as the source repository for the FHIR Works on AWS UI React app and the CDK app",
      }
    );

    const amplifyApp = new amplify.App(this, "FhirWorksOnAwsUiApp", {
      sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
        repository: fhirWorksOnAwsUiRepo,
      }),
      environmentVariables: {
        REACT_APP_FHIR_SERVER_URL: fhir_server_url,
        REACT_APP_AUTH_URL: auth_url,
        REACT_APP_CLIENT_ID: client_id,
        REACT_APP_API_KEY: api_key,
      },
    });
    amplifyApp.addBranch(amplify_branch);
    amplifyApp.addCustomRule(amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT);

    new cdk.CfnOutput(this, 'AmplifyDomain',
      {
        value: `${amplify_branch}.${amplifyApp.defaultDomain}`,
        description: 'Amplify Domain',
        exportName: 'AmplifyDomain',
      });

    new cdk.CfnOutput(this, "CodeCommitRepo",
      {
        value: fhirWorksOnAwsUiRepo.repositoryName,
        description: "CodeCommit Repository name",
        exportName: "CodeCommitRepo",
      }
    );
  }
}
