import React, { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { NavigationContainer, NavigationState } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform, BackHandler, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { store } from "./src/store";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { AuthNavigator } from "./src/navigation/AuthNavigator";
import { useAppSelector, useAppDispatch } from "./src/store";
import {
  setAuthState,
  setLoading,
  clearError,
} from "./src/store/slices/authSlice";
import { LoadingScreen } from "./src/screens/LoadingScreen";
import { THEME_COLORS } from "./src/constants";
import { lightTheme, darkTheme } from "./src/utils/theme";
import { firebaseAuthService } from "./src/services/firebaseAuthService";
import { useAppTheme } from "./src/hooks/useAppTheme";

// Navigation persistence configuration
const PERSISTENCE_KEY = "NAVIGATION_STATE_V1";

// Web routing configuration
const linking = {
  prefixes: [
    // Production URLs
    "https://budgetmate-bkwk1w8se-darshanas-projects-48d8e09a.vercel.app",
    "https://budgetmate-psi.vercel.app",
    // Development URLs
    "http://localhost:19006",
    "http://localhost:3000",
  ],
  config: {
    screens: {
      // Auth screens (when not authenticated)
      Onboarding: "onboarding",
      Login: "login",
      Register: "register",
      ForgotPassword: "forgot-password",
      ResetPassword: "reset-password",

      // Main app screens (when authenticated)
      Dashboard: "", // Root path - default route
      Transactions: "transactions",
      Budgets: "budgets",
      Bills: "bills",
      Accounts: "accounts",

      // Modal/Stack screens
      AddTransaction: "add-transaction",
      AddBudget: "add-budget",
      AddBill: "add-bill",
      TransactionDetail: "transaction/:transactionId",
      BudgetDetail: "budget/:budgetId",
      BillDetail: "bill/:billId",
      StatementUpload: "upload-statement",
      AIInsights: "ai-insights",
      CategoryManagement: "categories",
      Profile: "profile",
      Settings: "settings",
    } as const,
  },
};

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const { isDark } = useAppSelector((state) => state.theme);
  const currentTheme = isDark ? darkTheme : lightTheme;

  // Navigation state persistence
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    NavigationState | undefined
  >();
  const navigationRef = useRef<any>(null);

  // Restore navigation state on app start
  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;

        if (state !== undefined) {
          setInitialState(state);
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  // Handle mobile back button
  React.useEffect(() => {
    if (Platform.OS === "android") {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (navigationRef.current?.canGoBack()) {
            navigationRef.current.goBack();
            return true; // Prevent default behavior
          }
          return false; // Allow default behavior (exit app)
        }
      );

      return () => backHandler.remove();
    }
  }, []);

  useEffect(() => {
    console.log("App: Setting up Firebase auth state listener...");

    // Listen to Firebase auth state changes
    const unsubscribe = firebaseAuthService.onAuthStateChanged(
      async (firebaseUser) => {
        try {
          console.log(
            "App: Auth state changed",
            firebaseUser ? "User logged in" : "No user"
          );

          if (firebaseUser) {
            // User is signed in, convert to our User type
            console.log("App: Converting Firebase user...");
            const response = await firebaseAuthService.validateToken(
              await firebaseUser.getIdToken()
            );
            if (response.success && response.data) {
              console.log("App: Setting authenticated user");
              dispatch(
                setAuthState({
                  isAuthenticated: true,
                  user: response.data.user,
                  token: await firebaseUser.getIdToken(),
                  refreshToken: firebaseUser.refreshToken || "",
                })
              );
            }
          } else {
            // User is signed out
            console.log("App: Setting unauthenticated state");
            dispatch(
              setAuthState({
                isAuthenticated: false,
                user: null,
                token: null,
                refreshToken: null,
              })
            );
          }
        } catch (error) {
          console.error("App: Auth state change error:", error);
          dispatch(clearError());
        } finally {
          console.log("App: Setting loading to false");
          dispatch(setLoading(false));
        }
      }
    );

    return () => {
      console.log("App: Cleaning up auth listener");
      unsubscribe();
    };
  }, [dispatch]);

  if (!isReady || loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      initialState={initialState}
      onStateChange={(state) => {
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
      }}
      linking={linking}
      theme={{
        dark: isDark,
        colors: {
          primary: currentTheme.colors.primary,
          background: currentTheme.colors.background,
          card: currentTheme.colors.surface,
          text: currentTheme.colors.onSurface,
          border: currentTheme.colors.outline,
          notification: currentTheme.colors.primary,
        },
        fonts: {
          regular: {
            fontFamily: "System",
            fontWeight: "normal",
          },
          medium: {
            fontFamily: "System",
            fontWeight: "500",
          },
          bold: {
            fontFamily: "System",
            fontWeight: "bold",
          },
          heavy: {
            fontFamily: "System",
            fontWeight: "800",
          },
        },
      }}
    >
      {isAuthenticated ? <RootNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemedApp />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function ThemedApp() {
  const { isDark } = useAppSelector((state) => state.theme);
  const currentTheme = isDark ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={currentTheme}>
      <StatusBar style="auto" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true} // Show vertical scroll bar
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll bar
        persistentScrollbar={true} // Always show on Android
        horizontal={false} // Prevent horizontal scrolling
        scrollEventThrottle={16}
        bounces={false}
        overScrollMode="never"
      >
        <AppContent />
      </ScrollView>
    </PaperProvider>
  );
}
