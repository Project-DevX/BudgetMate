# 🚀 EAS Update Guide for BudgetMate

## Quick Commands

### Using npm scripts (Simple):
```bash
# Auto update with latest commit message
npm run update

# Update with custom message (will prompt you)
npm run update:message

# Update only iOS
npm run update:ios

# Update only Android  
npm run update:android

# Use the interactive script
npm run update:script
```

### Using the script directly (Advanced):
```bash
# Auto update with latest commit message
./scripts/eas-update.sh --auto

# Update with custom message
./scripts/eas-update.sh --message "Fixed Google Sign-In bug"

# Update specific platform
./scripts/eas-update.sh --platform ios --message "iOS performance improvements"

# Interactive mode (prompts for message)
./scripts/eas-update.sh

# Show help
./scripts/eas-update.sh --help
```

## Script Features

✅ **Git Integration**: Checks for uncommitted changes  
✅ **Interactive Mode**: Prompts for update messages  
✅ **Auto Mode**: Uses latest commit message  
✅ **Platform Targeting**: Update specific platforms  
✅ **Colored Output**: Easy to read status messages  
✅ **Error Handling**: Helpful error messages and solutions  
✅ **Confirmation**: Shows update summary before proceeding  

## Typical Workflow

### 1. Quick Update (Recommended)
```bash
# Make your changes
# Commit them to git
git add .
git commit -m "Added new dashboard features"

# Quick update
npm run update
```

### 2. Custom Message Update
```bash
# Make changes but don't commit yet
npm run update:message
# Script will prompt for message and warn about uncommitted changes
```

### 3. Platform-Specific Update
```bash
# Update only iOS with bug fix
npm run update:ios

# Update only Android with performance improvement
npm run update:android
```

## Script Options

| Option | Short | Description | Example |
|--------|--------|-------------|---------|
| `--auto` | `-a` | Use latest commit message | `./scripts/eas-update.sh -a` |
| `--message` | `-m` | Custom update message | `./scripts/eas-update.sh -m "Bug fixes"` |
| `--platform` | `-p` | Target platform (ios/android) | `./scripts/eas-update.sh -p ios` |
| `--help` | `-h` | Show help message | `./scripts/eas-update.sh -h` |

## What Gets Updated

### ✅ Updates Instantly (Over-the-Air)
- React components and JavaScript code
- Styling and layout changes
- Business logic updates
- API integrations
- Firebase configuration changes
- New screens and features

### ❌ Requires New Build
- New native dependencies (npm packages with native code)
- Changes to app.json configuration
- Permission changes
- Expo SDK version updates

## Monitoring Updates

After publishing an update, you can monitor it at:
- **EAS Dashboard**: https://expo.dev/accounts/himeth777/projects/BudgetMate
- **Update Details**: Check the URL provided after successful update

## Troubleshooting

### Common Issues:

1. **"Not logged in"**
   ```bash
   npx expo login
   ```

2. **"Project not configured for EAS Update"**
   ```bash
   npx eas update:configure
   ```

3. **"No compatible builds found"**
   - This is normal if you haven't created native builds yet
   - Users can still access updates through Expo Go

4. **"Git repository not found"**
   - Initialize git: `git init`
   - Or use the script with uncommitted changes (not recommended)

## Examples

### Example 1: Quick Fix
```bash
# Fix a bug
# Edit your code...

git add .
git commit -m "Fixed login button not working"
npm run update
```

### Example 2: Feature Update
```bash
# Add new feature
# Edit your code...

./scripts/eas-update.sh --message "Added expense categories and dark mode"
```

### Example 3: iOS-specific Fix
```bash
./scripts/eas-update.sh --platform ios --message "Fixed iOS navigation issue"
```

## Pro Tips

1. **Always test locally first**: `npm start`
2. **Use descriptive commit messages**: They become your update messages
3. **Update regularly**: Small, frequent updates are better than large ones
4. **Monitor the dashboard**: Check if users are receiving updates
5. **Version your major releases**: Use semantic versioning in app.json

---

## Next Steps

1. **Try a test update**: Make a small change and run `npm run update`
2. **Set up GitHub Actions**: For automatic updates on push (optional)
3. **Create native builds**: For app store distribution
4. **Monitor usage**: Use Expo Analytics or Firebase Analytics
