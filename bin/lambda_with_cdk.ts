#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LambdaWithCdkStack } from "../lib/lambda_with_cdk-stack";

const app = new cdk.App();
const projectName: string = "sample-lambda";

new LambdaWithCdkStack(app, "LambdaWithCdkStack", {
  projectName: projectName,
});
