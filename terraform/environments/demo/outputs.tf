output "cloudfront_domain" {
  value       = aws_cloudfront_distribution.cdn.domain_name
  description = "Direct CloudFront URL (Demo)"
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.react_app.bucket
  description = "S3 Bucket Name for UI deployments"
}

output "cloudfront_distribution_id" {
  value       = aws_cloudfront_distribution.cdn.id
  description = "CloudFront Distribution ID for cache invalidation"
}
