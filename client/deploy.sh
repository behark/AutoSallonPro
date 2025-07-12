#!/bin/bash
# Deployment script for AutoSallonPro used car dealership website

echo "🚀 Starting deployment process for AutoSallonPro..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
  echo "❌ Error: .env.production file not found. Please create it first."
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Run tests
echo "🧪 Running tests..."
npm test || { echo "❌ Tests failed. Please fix the issues before deploying."; exit 1; }

# Build the application
echo "🏗️ Building the application for production..."
npm run build

# Check if the build was successful
if [ ! -d "dist" ]; then
  echo "❌ Build failed. Please check the error messages above."
  exit 1
fi

echo "✅ Build completed successfully!"
echo "📂 Production files are available in the 'dist' directory."
echo "🌐 You can now deploy these files to your web server or hosting service."

# Deployment instructions
echo "
🚀 Deployment Options:
1. Manual deployment: Upload the contents of the 'dist' directory to your web hosting service.
2. Netlify: Run 'netlify deploy --prod --dir=dist' if you have the Netlify CLI installed.
3. Vercel: Run 'vercel --prod' if you have the Vercel CLI installed.
4. GitHub Pages: Push the dist directory to the gh-pages branch of your repository.
"

# Make the script ask for deployment method
echo "Would you like to deploy automatically? (y/n)"
read -r deploy_answer

if [ "$deploy_answer" = "y" ] || [ "$deploy_answer" = "Y" ]; then
  echo "Select deployment platform:"
  echo "1. Netlify"
  echo "2. Vercel"
  echo "3. GitHub Pages"
  read -r platform_choice
  
  case $platform_choice in
    1)
      echo "Deploying to Netlify..."
      if command -v netlify &> /dev/null; then
        netlify deploy --prod --dir=dist
      else
        echo "Netlify CLI not found. Install it with 'npm install -g netlify-cli' and try again."
      fi
      ;;
    2)
      echo "Deploying to Vercel..."
      if command -v vercel &> /dev/null; then
        vercel --prod
      else
        echo "Vercel CLI not found. Install it with 'npm install -g vercel' and try again."
      fi
      ;;
    3)
      echo "Deploying to GitHub Pages..."
      echo "This requires additional setup. Please follow the instructions in DEPLOYMENT.md"
      ;;
    *)
      echo "Invalid choice. Please deploy manually following the instructions above."
      ;;
  esac
else
  echo "Manual deployment selected. Please deploy the 'dist' directory to your hosting provider."
fi

echo "🎉 Deployment process completed!"
