# BudgetMate - Smart Budgeting App

🚀 **Live Demo**: [https://budgetmate-pbki0qyg1-darshanas-projects-48d8e09a.vercel.app](https://budgetmate-pbki0qyg1-darshanas-projects-48d8e09a.vercel.app)

BudgetMate is a comprehensive React Native budgeting application built with Expo that helps users manage their finances intelligently through automated expense tracking, AI-powered categorization, and smart budgeting suggestions.

## 🚀 Features

### MVP Features
- **Expense Tracking**: Auto-import via bank APIs (Plaid) or statement upload
- **Smart Categorization**: Rule-based categorization with user overrides and ML suggestions
- **Budget Management**: Create budgets by category with spending alerts
- **Bill Reminders**: Similar to Prism or Mint, with due dates and projected balances
- **Recurring Cost Detection**: Automatic detection and scheduling of subscriptions and bills
- **Statement Analysis**: Upload and parse bank statements using Google Gemini API
- **Basic AI Insights**: Flag overspending and provide budgeting suggestions
- **Dashboard**: Comprehensive overview of financial health

### Future Features (Long-term Vision)
- **ML-based Predictions**: Expense prediction and smart budgeting suggestions
- **AI-powered Automation**: Auto-pay setup and subscription management
- **Enhanced ML Categorization**: Personalized per-user categorization
- **Investment Integration**: Investment opportunities and retail offers
- **Conversational AI**: Chatbot/coach using LLMs like GPT
- **Multi-platform Support**: iOS, Android, and web
- **Multi-currency & Joint Accounts**: Global and collaborative features
- **Social Features**: Goals sharing and social budgeting

## 🏗️ Architecture

### Frontend (React Native with Expo)
- **Framework**: React Native with Expo for cross-platform development
- **Navigation**: React Navigation for screen management
- **State Management**: Redux Toolkit for application state
- **UI Components**: React Native Paper for Material Design
- **Charts**: React Native Chart Kit for data visualization
- **Storage**: AsyncStorage for local data persistence

### Backend (Microservices Architecture)
- **API Gateway**: Centralized entry point for all requests
- **Microservices**: Modular backend services (Node.js/Express or Python Django/FastAPI)
- **Database**: PostgreSQL for structured data, MongoDB for flexible document storage
- **Authentication**: OAuth2/JWT for secure user authentication
- **Cloud Infrastructure**: AWS, GCP, or Azure for scalability

### Key Integrations
- **Google Gemini API**: Document parsing and AI insights
- **Plaid/TrueLayer**: Open banking APIs for transaction import
- **ML Frameworks**: TensorFlow, scikit-learn for predictions and categorization
- **OpenAI/GPT**: Conversational AI features
- **Cloud Services**: Firebase Auth, AWS SNS/SQS for notifications

## 📱 Screens & Navigation

### Authentication Flow
- Onboarding Screen
- Login Screen
- Register Screen
- Forgot/Reset Password Screens

### Main Application
- **Dashboard**: Financial overview and quick actions
- **Transactions**: Transaction list and management
- **Budgets**: Budget creation and monitoring
- **Bills**: Bill management and reminders
- **Accounts**: Bank account management and syncing
- **Settings**: App preferences and configurations
- **Profile**: User profile management

### Additional Features
- **Statement Upload**: PDF/image upload and processing
- **AI Insights**: Smart suggestions and spending analysis
- **Category Management**: Custom category creation and rules

## 🛠️ Technology Stack

### Frontend Dependencies
```json
{
  "@react-navigation/native": "Navigation library",
  "@react-navigation/stack": "Stack navigator",
  "@react-navigation/bottom-tabs": "Tab navigator",
  "@reduxjs/toolkit": "State management",
  "react-redux": "React Redux bindings",
  "react-native-paper": "Material Design components",
  "react-native-vector-icons": "Icon library",
  "react-native-chart-kit": "Charts and graphs",
  "react-native-svg": "SVG support",
  "react-native-reanimated": "Animations",
  "react-native-gesture-handler": "Gesture handling",
  "@react-native-async-storage/async-storage": "Local storage",
  "axios": "HTTP client",
  "date-fns": "Date manipulation"
}
```

### Key Services
```typescript
// Core Services
- apiService: HTTP client with token refresh
- authService: Authentication management
- transactionService: Transaction CRUD operations
- storageService: Local storage management

// Redux Store
- authSlice: Authentication state
- transactionSlice: Transaction management
- budgetSlice: Budget management
- billSlice: Bill management
- accountSlice: Account management
- dashboardSlice: Dashboard data
- aiSlice: AI insights and predictions
- uiSlice: UI state and theming
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- React Native development environment

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/budgetmate.git
   cd BudgetMate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/emulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://api.budgetmate.com
EXPO_PUBLIC_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta
EXPO_PUBLIC_PLAID_ENV=sandbox
EXPO_PUBLIC_PLAID_CLIENT_ID=your_plaid_client_id
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

## 📊 Data Models

### Core Entities
- **User**: User profiles and preferences
- **Account**: Bank accounts and balances
- **Transaction**: Financial transactions with categorization
- **Budget**: Budget definitions and tracking
- **Bill**: Bill management and reminders
- **Category**: Expense categories and rules
- **AIInsight**: ML-generated insights and suggestions

### Key Features
- **Real-time Sync**: Automatic data synchronization
- **Offline Support**: Works offline with local storage
- **Smart Categorization**: ML-powered expense categorization
- **Predictive Analytics**: Spending predictions and insights
- **Multi-currency Support**: Handle multiple currencies

## 🔒 Security & Privacy

- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Secure Authentication**: OAuth2/JWT with refresh tokens
- **Bank-level Security**: Plaid integration for secure bank connections
- **Privacy First**: User data ownership and control
- **GDPR Compliance**: European privacy regulation compliance

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Build & Deployment

### Development Build
```bash
npx expo build:android
npx expo build:ios
```

### Production Build
```bash
# EAS Build (recommended)
npx eas build --platform android
npx eas build --platform ios
```

### App Store Deployment
```bash
npx eas submit --platform ios
npx eas submit --platform android
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Plaid** for banking API integration
- **Google Gemini** for AI-powered document processing
- **OpenAI** for conversational AI capabilities
- **React Native Community** for excellent libraries and tools
- **Expo** for simplifying React Native development

## 📞 Support

- **Documentation**: [docs.budgetmate.com](https://docs.budgetmate.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/budgetmate/issues)
- **Email**: support@budgetmate.com
- **Discord**: [BudgetMate Community](https://discord.gg/budgetmate)

---

**BudgetMate** - Your intelligent financial companion 💰✨
