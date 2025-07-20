#!/bin/bash

# Vercel build script for Disease Diagnosis project

echo "🚀 Starting Vercel build process..."

# Build frontend
echo "📦 Building React frontend..."
cd disease-diagnosis-frontend
npm install
npm run build

echo "✅ Build completed successfully!"
echo "📁 Frontend built in: disease-diagnosis-frontend/dist"
echo "🔧 Backend configured for serverless functions"
