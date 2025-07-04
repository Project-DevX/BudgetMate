#!/bin/bash

# BudgetMate EAS Update Script
# This script helps you publish updates to your Expo app using EAS Update

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
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

print_header() {
    echo -e "${PURPLE}[UPDATE]${NC} $1"
}

# Main header
echo ""
echo "🚀 BudgetMate EAS Update Script"
echo "==============================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if app.json exists
if [ ! -f "app.json" ]; then
    print_error "app.json not found. This doesn't appear to be an Expo project."
    exit 1
fi

# Parse command line arguments
UPDATE_MESSAGE=""
PLATFORM=""
AUTO_MODE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--message)
            UPDATE_MESSAGE="$2"
            shift 2
            ;;
        -p|--platform)
            PLATFORM="$2"
            shift 2
            ;;
        -a|--auto)
            AUTO_MODE=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -m, --message TEXT    Custom update message"
            echo "  -p, --platform TEXT   Platform (ios, android, or all)"
            echo "  -a, --auto           Auto mode (uses latest commit message)"
            echo "  -h, --help           Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --auto                           # Auto update with latest commit"
            echo "  $0 -m \"Fixed login bug\"             # Update with custom message"
            echo "  $0 -p ios -m \"iOS specific fix\"     # Update only iOS"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# Check for git repository
if [ ! -d ".git" ]; then
    print_warning "Not a git repository. Continuing without git checks..."
else
    # Check for uncommitted changes
    if [[ `git status --porcelain` ]]; then
        print_warning "You have uncommitted changes:"
        git status --short
        echo ""
        echo "Do you want to continue anyway? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            print_status "Please commit your changes first:"
            echo "  git add ."
            echo "  git commit -m \"Your commit message\""
            exit 1
        fi
    fi

    # Get latest commit message if auto mode and no custom message
    if [ "$AUTO_MODE" = true ] && [ -z "$UPDATE_MESSAGE" ]; then
        UPDATE_MESSAGE=$(git log -1 --pretty=%B | head -n 1)
        print_status "Using latest commit message: \"$UPDATE_MESSAGE\""
    fi
fi

# If no message provided and not auto mode, prompt for one
if [ -z "$UPDATE_MESSAGE" ] && [ "$AUTO_MODE" = false ]; then
    echo ""
    print_status "Enter update message (or press Enter for default):"
    read -r UPDATE_MESSAGE
    if [ -z "$UPDATE_MESSAGE" ]; then
        UPDATE_MESSAGE="App update - $(date '+%Y-%m-%d %H:%M')"
    fi
fi

# Show update summary
echo ""
print_header "Update Summary:"
echo "📱 App: BudgetMate"
echo "📝 Message: $UPDATE_MESSAGE"
if [ -n "$PLATFORM" ]; then
    echo "🎯 Platform: $PLATFORM"
else
    echo "🎯 Platform: All (iOS & Android)"
fi
echo ""

# Confirm update
echo "Do you want to proceed with this update? (Y/n)"
read -r confirm
if [[ "$confirm" =~ ^[Nn]$ ]]; then
    print_status "Update cancelled."
    exit 0
fi

# Build the EAS update command
EAS_CMD="npx eas update"

if [ -n "$UPDATE_MESSAGE" ]; then
    EAS_CMD="$EAS_CMD --message \"$UPDATE_MESSAGE\""
fi

if [ -n "$PLATFORM" ]; then
    EAS_CMD="$EAS_CMD --platform $PLATFORM"
fi

if [ "$AUTO_MODE" = true ] && [ -z "$UPDATE_MESSAGE" ]; then
    EAS_CMD="npx eas update --auto"
fi

# Execute the update
echo ""
print_status "Running EAS Update..."
print_status "Command: $EAS_CMD"
echo ""

# Run the update command
eval $EAS_CMD

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo ""
    print_success "✅ Update published successfully!"
    echo ""
    print_status "📱 Users will receive the update next time they open the app"
    print_status "🌐 You can monitor the update at: https://expo.dev/accounts/himeth777/projects/BudgetMate"
    echo ""
    
    # Show quick commands for next steps
    echo "Quick commands for next time:"
    echo "  npm run update              # Auto update"
    echo "  npm run update:message      # Update with custom message"
    echo "  ./scripts/eas-update.sh -a  # This script in auto mode"
    echo ""
else
    print_error "❌ Update failed!"
    echo ""
    print_status "Common solutions:"
    echo "  1. Check your internet connection"
    echo "  2. Verify you're logged into Expo: npx expo whoami"
    echo "  3. Ensure EAS is configured: npx eas update:configure"
    echo "  4. Check the error message above for specific issues"
    exit 1
fi
