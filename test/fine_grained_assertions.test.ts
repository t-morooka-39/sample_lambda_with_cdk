import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { LambdaWithCdkStack } from "../lib/lambda_with_cdk-stack";

test("fine grained assertions test", () => {
  const app = new cdk.App();
  const stack = new LambdaWithCdkStack(app, "fineGrainedAssertionsTestStack", {
    projectName: "fine-grained-assertions-test",
  });

  const template = Template.fromStack(stack);

  // Lambdaが１つ作成されていること
  template.resourceCountIs("AWS::Lambda::Function", 1);

  // API Gatewayが１つ作成されていること
  template.resourceCountIs("AWS::ApiGateway::RestApi", 1);

  // API GatewayのMethodが2つ作成されていること
  template.resourceCountIs("AWS::ApiGateway::Method", 2);

  // sampleというResourceが作成されていること
  template.hasResourceProperties("AWS::ApiGateway::Resource", {
    PathPart: "sample",
  });
});
