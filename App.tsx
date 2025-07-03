import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
import { paperTheme } from "./src/utils/theme";
import { firebaseAuthService } from "./src/services/firebaseAuthService";

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);

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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: theme === "dark",
        colors: {
          primary: THEME_COLORS[theme].primary,
          background: THEME_COLORS[theme].background,
          card: THEME_COLORS[theme].surface,
          text: THEME_COLORS[theme].text,
          border: THEME_COLORS[theme].border,
          notification: THEME_COLORS[theme].accent,
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
          <PaperProvider theme={paperTheme}>
            <StatusBar style="auto" />
            <AppContent />
          </PaperProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
