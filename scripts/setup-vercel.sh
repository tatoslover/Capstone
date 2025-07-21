#!/bin/bash

# Vercel Setup Script for Local Development
# This script helps developers set up Vercel CLI for local development

set -e

echo "🚀 Vercel Setup Script"
echo "====================="
echo ""

# Check if we're in the correct directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI globally..."
    npm install -g vercel@latest
else
    echo "✅ Vercel CLI is already installed"
fi

# Check for required environment variables
echo ""
echo "🔑 Checking environment variables..."

MISSING_VARS=()

if [ -z "$VERCEL_TOKEN" ]; then
    MISSING_VARS+=("VERCEL_TOKEN")
fi

if [ -z "$VERCEL_ORG_ID" ]; then
    MISSING_VARS+=("VERCEL_ORG_ID")
fi

if [ -z "$VERCEL_PROJECT_ID" ]; then
    MISSING_VARS+=("VERCEL_PROJECT_ID")
fi

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "📝 To set up these variables:"
    echo "   1. Go to https://vercel.com/account/tokens to create a token"
    echo "   2. Go to your project settings on Vercel to find the Org ID and Project ID"
    echo "   3. Export the variables in your shell or add them to your .env file"
    echo ""
    echo "Example:"
    echo "   export VERCEL_TOKEN='your-token-here'"
    echo "   export VERCEL_ORG_ID='your-org-id-here'"
    echo "   export VERCEL_PROJECT_ID='your-project-id-here'"
    exit 1
fi

echo "✅ All required environment variables are set"

# Navigate to frontend directory
cd frontend

# Link the project
echo ""
echo "🔗 Linking Vercel project..."
vercel link --yes --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID

# Pull environment variables
echo ""
echo "📥 Pulling environment variables..."
echo "Select environment: (development/preview/production)"
read -p "Environment [development]: " ENV
ENV=${ENV:-development}

vercel pull --yes --environment=$ENV --token=$VERCEL_TOKEN

echo ""
echo "✅ Vercel setup complete!"
echo ""
echo "📚 Useful commands:"
echo "   - vercel dev          # Start local development server"
echo "   - vercel build        # Build the project locally"
echo "   - vercel deploy       # Deploy to preview"
echo "   - vercel --prod       # Deploy to production"
echo ""
echo "💡 Tip: Run 'vercel dev' from the frontend directory to start developing!"
