#!/bin/bash

# Deploy Tower of Hanoi to AWS with Lambda + CloudFront
# This script deploys both backend and frontend

set -e

echo "🚀 Tower of Hanoi AWS Deployment"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
STAGE="${1:-dev}"
REGION="${2:-us-east-1}"
SERVICE_NAME="tower-of-hanoi"

echo -e "${BLUE}Stage: ${STAGE}${NC}"
echo -e "${BLUE}Region: ${REGION}${NC}"
echo ""

# Step 1: Deploy Backend with Serverless Framework
echo -e "${GREEN}Step 1: Deploying Backend (Lambda + API Gateway)${NC}"
echo "---------------------------------------------------"

if ! command -v serverless &> /dev/null; then
    echo -e "${RED}Error: Serverless Framework not found${NC}"
    echo "Install with: npm install -g serverless"
    exit 1
fi

serverless deploy --stage $STAGE --region $REGION

# Get API endpoint
API_URL=$(aws cloudformation describe-stacks \
    --stack-name ${SERVICE_NAME}-${STAGE} \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`ViteApiUrl`].OutputValue' \
    --output text 2>/dev/null || echo "")

if [ -z "$API_URL" ]; then
    echo -e "${RED}Error: Could not retrieve API URL${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Backend deployed successfully${NC}"
echo "API URL: $API_URL"
echo ""

# Step 2: Build Frontend
echo -e "${GREEN}Step 2: Building Frontend${NC}"
echo "-------------------------"
cd frontend

# Create .env.production with API URL
cat > .env.production << EOF
VITE_API_URL=${API_URL}
EOF

echo "Created .env.production with API_URL"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build
npm run build

echo -e "${GREEN}✓ Frontend built successfully${NC}"
echo ""

# Step 3: Get S3 Bucket Name
echo -e "${GREEN}Step 3: Deploying Frontend to S3${NC}"
echo "----------------------------------"

BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name ${SERVICE_NAME}-${STAGE} \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
    --output text 2>/dev/null || echo "")

if [ -z "$BUCKET_NAME" ]; then
    echo -e "${RED}Error: Could not retrieve S3 bucket name${NC}"
    exit 1
fi

echo "Uploading to bucket: $BUCKET_NAME"

# Upload to S3
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
    --region $REGION \
    --delete \
    --cache-control "public,max-age=31536000,immutable" \
    --exclude "index.html"

# Upload index.html separately with no-cache
aws s3 cp dist/index.html s3://${BUCKET_NAME}/index.html \
    --region $REGION \
    --cache-control "no-cache,no-store,must-revalidate"

echo -e "${GREEN}✓ Files uploaded to S3${NC}"
echo ""

# Step 4: Invalidate CloudFront Cache
echo -e "${GREEN}Step 4: Invalidating CloudFront Cache${NC}"
echo "--------------------------------------"

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name ${SERVICE_NAME}-${STAGE} \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text 2>/dev/null || echo "")

if [ -z "$DISTRIBUTION_ID" ]; then
    echo -e "${RED}Warning: Could not retrieve CloudFront Distribution ID${NC}"
else
    # Wait for CloudFront distribution to be deployed
    echo "Waiting for CloudFront distribution to be deployed..."
    aws cloudfront wait distribution-deployed --id $DISTRIBUTION_ID 2>/dev/null || true
    
    # Create cache invalidation
    aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*" > /dev/null

    echo -e "${GREEN}✓ CloudFront cache invalidated${NC}"
fi

echo ""

# Step 5: Get CloudFront URL
CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
    --stack-name ${SERVICE_NAME}-${STAGE} \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
    --output text 2>/dev/null || echo "")

# Display Summary
echo ""
echo "================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "================================="
echo ""
echo "📡 API Endpoint:"
echo "   $API_URL"
echo ""
echo "🌐 CloudFront URL:"
echo "   https://${CLOUDFRONT_URL}"
echo ""
echo "📦 S3 Bucket:"
echo "   $BUCKET_NAME"
echo ""
echo "🔄 CloudFront Distribution:"
echo "   $DISTRIBUTION_ID"
echo ""
echo "⏰ Note: CloudFront propagation may take 5-10 minutes"
echo ""
