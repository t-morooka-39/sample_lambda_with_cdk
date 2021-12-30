import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_iam as iam } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export interface CustomizedProps extends StackProps {
  projectName: string;
}

export class LambdaWithCdkStack extends Stack {
  constructor(scope: Construct, id: string, props: CustomizedProps) {
    super(scope, id, props);

    // iam role
    const iamRoleForLambda = new iam.Role(this, "iamRoleForLambda", {
      roleName: `${props.projectName}-lambda-role`,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      // VPCに設置する場合下記が必要
      // managedPolicies: [
      //   iam.ManagedPolicy.fromAwsManagedPolicyName(
      //     "service-role/AWSLambdaVPCAccessExecutionRole"
      //   ),
      // ],
    });

    // lambda
    const sampleLambda = new NodejsFunction(this, "GETsample", {
      entry: "lambda/get/index.ts", // どのコードを使用するか
      runtime: Runtime.NODEJS_14_X, // どのバージョンか
      timeout: Duration.seconds(30), // 何秒でタイムアウトするか
      role: iamRoleForLambda, // どのIAMロールを使用するか
      // vpc: vpc,
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1", // keepaliveを有効にする
      },
      memorySize: 128, // default=128
    });
  }
}
