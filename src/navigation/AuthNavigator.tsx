import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "react-native-paper";

import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import {
  ForgotPasswordScreen,
  ResetPasswordScreen,
} from "../screens/ScreenPlaceholders";

const Stack = createStackNavigator();

export function AuthNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
