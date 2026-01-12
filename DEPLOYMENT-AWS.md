# Tower of Hanoi - AWS Deployment Guide

## 🚀 Complete AWS Deployment (Lambda + CloudFront)

This guide covers deploying both the backend (Lambda) and frontend (CloudFront + S3) to AWS.

## Prerequisites

1. **AWS CLI** configured with credentials:
   ```bash
   aws configure
   ```

2. **Serverless Framework** installed globally:
   ```bash
   npm install -g serverless
   ```

3. **Node.js 18+** and npm

## Quick Deployment

### Option 1: Automated Script (Recommended)

```bash
# Make script executable
chmod +x deploy.sh

# Deploy to production
./deploy.sh prd us-east-1

# Deploy to staging
./deploy.sh stg us-east-1

# Deploy to developmen
./deploy.sh dev us-east-1
```

The script will:
1. ✅ Deploy Lambda function + API Gateway
2. ✅ Create S3 bucket for frontend
3. ✅ Set up CloudFront distribution
4. ✅ Build frontend with correct API URL
5. ✅ Upload frontend to S3
6. ✅ Invalidate CloudFront cache
7. ✅ Display all URLs and endpoints

### Option 2: Manual Step-by-Step

#### Step 1: Deploy Backend

```bash
# Install Serverless dependencies
npm install -g serverless
npm install --save-dev serverless-python-requirements

# Deploy the stack
serverless deploy --stage prod --region us-east-1
```

This creates:
- Lambda function
- API Gateway endpoint
- S3 bucket for frontend
- CloudFront distribution
- All necessary IAM roles and permissions

#### Step 2: Get API URL

```bash
# Get the API endpoint
API_URL=$(aws cloudformation describe-stacks \
  --stack-name tower-of-hanoi-prod \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text)

echo $API_URL
```

#### Step 3: Build Frontend

```bash
cd frontend

# Create production environment file
cat > .env.production << EOF
VITE_API_URL=$API_URL
EOF

# Install and build
npm install
npm run build
```

#### Step 4: Upload to S3

```bash
# Get bucket name
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name tower-of-hanoi-prod \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
  --output text)

# Upload files
aws s3 sync dist/ s3://$BUCKET_NAME/ \
  --region us-east-1 \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html"

# Upload index.html with no-cache
aws s3 cp dist/index.html s3://$BUCKET_NAME/index.html \
  --region us-east-1 \
  --cache-control "no-cache,no-store,must-revalidate"
```

#### Step 5: Invalidate CloudFront

```bash
# Get distribution ID
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name tower-of-hanoi-prod \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

# Create invalidation
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

#### Step 6: Get CloudFront URL

```bash
CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
  --stack-name tower-of-hanoi-prod \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
  --output text)

echo "Visit: https://$CLOUDFRONT_URL"
```

## Infrastructure Details

### Backend
- **Lambda Function**: Python 3.12 runtime
- **Memory**: 256 MB
- **Timeout**: 30 seconds
- **API Gateway**: REST API with CORS enabled
- **Endpoint**: `/solve` (POST)

### Frontend
- **S3 Bucket**: Static website hosting
- **CloudFront**: Global CDN
- **HTTPS**: Automatic redirect
- **Caching**: 
  - Static assets: 1 year
  - index.html: No cache
- **Error handling**: SPA fallback to index.html

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTPS
       ▼
┌──────────────┐
│  CloudFront  │  ← Global CDN
└──────┬───────┘
       │
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌──────────┐          ┌──────────────┐
│ S3 Bucket│          │ API Gateway  │
│ (Static) │          └──────┬───────┘
└──────────┘                 │
                             ▼
                      ┌──────────────┐
                      │    Lambda    │
                      │  (Python)    │
                      └──────────────┘
```

## Configuration

### Environment Variables

The deployment automatically configures:
- `VITE_API_URL`: Set during build to point to Lambda API

### Custom Domain (Optional)

To use a custom domain with CloudFront:

1. Register domain in Route 53
2. Request ACM certificate in us-east-1
3. Update `serverless.yml`:

```yaml
ViewerCertificate:
  AcmCertificateArn: arn:aws:acm:us-east-1:xxx:certificate/xxx
  SslSupportMethod: sni-only
  MinimumProtocolVersion: TLSv1.2_2021
Aliases:
  - hanoi.yourdomain.com
```

4. Create Route 53 alias record pointing to CloudFront

## Updating the Application

### Update Backend Only

```bash
serverless deploy --stage prod
```

### Update Frontend Only

```bash
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

### Update Both

```bash
./deploy.sh prod us-east-1
```

## Monitoring

### View Lambda Logs

```bash
serverless logs -f hanoiSolver --stage prod --tail
```

Or in AWS Console:
- CloudWatch → Log Groups → `/aws/lambda/tower-of-hanoi-prod-solver`

### CloudFront Metrics

AWS Console → CloudFront → Monitoring:
- Requests
- Data Transfer
- Error Rate
- Cache Hit Rate

### API Gateway Metrics

AWS Console → API Gateway → Dashboard:
- Request Count
- Latency
- 4XX/5XX Errors

## Cost Estimate

For 10,000 requests/month:

| Service        | Usage              | Cost    |
|----------------|-------------------|---------|
| Lambda         | 10K invocations   | $0.20   |
| API Gateway    | 10K requests      | $0.04   |
| S3             | 1 GB storage      | $0.02   |
| CloudFront     | 10 GB transfer    | $0.85   |
| **Total**      |                   | **$1.11** |

**Free Tier:**
- Lambda: 1M requests/month free
- API Gateway: 1M requests/month free (first year)
- S3: 5GB storage, 20K GET requests free
- CloudFront: 1TB transfer free (first year)

## Troubleshooting

### CORS Errors

Check that API Gateway has CORS enabled:
```bash
serverless info --stage prod
```

### CloudFront Not Updating

Create invalidation:
```bash
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

Wait 5-10 minutes for propagation.

### Lambda Timeout

Check CloudWatch logs for errors:
```bash
serverless logs -f hanoiSolver --stage prod
```

### S3 403 Errors

Verify bucket policy allows public read:
```bash
aws s3api get-bucket-policy --bucket $BUCKET_NAME
```

## Cleanup

Remove all AWS resources:

```bash
# Delete frontend files from S3
aws s3 rm s3://$BUCKET_NAME --recursive

# Remove CloudFormation stack
serverless remove --stage prod --region us-east-1
```

## Security Best Practices

1. **CORS**: Restrict origins in production:
   ```yaml
   cors:
     origin: 'https://yourdomain.com'
   ```

2. **API Rate Limiting**: Add usage plans in API Gateway

3. **CloudFront**: Enable AWS WAF for DDoS protection

4. **S3**: Keep block public access for sensitive data

5. **Secrets**: Never commit AWS credentials

## Next Steps

1. Set up custom domain with Route 53
2. Enable AWS WAF on CloudFront
3. Add CloudWatch alarms for errors
4. Set up CI/CD with GitHub Actions
5. Implement API key authentication
6. Add CloudFront signed URLs for private content

## Support

- AWS Documentation: https://docs.aws.amazon.com/
- Serverless Framework: https://www.serverless.com/framework/docs
- CloudFront Docs: https://docs.aws.amazon.com/cloudfront/
