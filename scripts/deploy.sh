#!/bin/bash

echo "🚀 BudgetMate Deployment Script"
echo "==============================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Starting BudgetMate deployment process..."

# Clean up previous builds
print_status "Cleaning up previous builds..."
rm -rf dist web-build .expo

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build for web
print_status "Building for web platform..."
npx expo export --platform web

if [ $? -eq 0 ]; then
    print_success "Web build completed successfully!"
    print_status "Build artifacts are in the 'dist' folder"
    
    echo ""
    echo "🎉 Your app is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Choose a hosting platform (Netlify recommended)"
    echo "2. Upload the 'dist' folder or connect your Git repository"
    echo "3. Configure environment variables on your hosting platform"
    echo "4. Update Google OAuth redirect URIs with your production URL"
    echo ""
    echo "📁 Deploy folder: $(pwd)/dist"
    echo "📖 Full guide: See DEPLOYMENT_GUIDE.md"
    echo ""
else
    print_error "Build failed. Please check the error messages above."
    exit 1
fi

# Show deployment options
echo "🌐 Quick Deployment Options:"
echo ""
echo "Option 1 - Netlify Drag & Drop:"
echo "   → Go to https://netlify.com"
echo "   → Drag the 'dist' folder to deploy"
echo ""
echo "Option 2 - Vercel:"
echo "   → Go to https://vercel.com"
echo "   → Import your GitHub repository"
echo ""
echo "Option 3 - Firebase Hosting:"
echo "   → Run: firebase init hosting"
echo "   → Run: firebase deploy --only hosting"
echo ""

print_success "Deployment preparation complete!"
