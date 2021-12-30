import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // GETの場合
  const params = event.queryStringParameters ? event.queryStringParameters : {};

  const RESPONSE_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,access-token",
  };

  return {
    statusCode: 200,
    headers: RESPONSE_HEADERS,
    body: params.message ? params.message : "空です",
  };
};
