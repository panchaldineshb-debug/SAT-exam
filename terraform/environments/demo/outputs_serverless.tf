output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.sat_pool.id
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.sat_client.id
}

output "api_endpoint" {
  value = aws_apigatewayv2_api.sat_api.api_endpoint
}
