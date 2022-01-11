import { Duration, Stack, StackProps, aws_apigateway } from "aws-cdk-lib";
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

    // api gateway
    const sampleApi = new aws_apigateway.RestApi(this, "sampleApigateway", {
      restApiName: `${props.projectName}-apigateway`,
      deployOptions: {
        loggingLevel: aws_apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true,
      },
    });

    // api key
    const apiKey = sampleApi.addApiKey("sampleApiKey", {
      apiKeyName: `${props.projectName}-sample-api-key`,
    }); // APIキーの値は未指定で自動作成

    // 使用量プランの作成
    const usagePlan = sampleApi.addUsagePlan("sampleApiUsagePlan");
    usagePlan.addApiKey(apiKey);
    usagePlan.addApiStage({ stage: sampleApi.deploymentStage });

    // GET/sample を作成
    const sample = sampleApi.root.addResource("sample");
    const courseSearchIntegration = new aws_apigateway.LambdaIntegration(
      sampleLambda
    );
    sample.addMethod("GET", courseSearchIntegration);

    // GET/messages/2 などを作成したい場合
    const messages = sampleApi.root.addResource("messages");
    const messageId = messages.addResource("{message_id}");
    messageId.addMethod("GET", courseSearchIntegration, {
      apiKeyRequired: true,
    });
  }
}
