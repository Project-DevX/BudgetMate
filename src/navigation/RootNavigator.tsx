import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { Platform } from "react-native";

// Screens
import { DashboardScreen } from "../screens/DashboardScreen";
import { AddTransactionScreen } from "../screens/AddTransactionScreen";
import { TransactionsScreen } from "../screens/TransactionsScreen";
import { AIInsightsScreen } from "../screens/AIInsightsScreen";
import { BudgetsScreen } from "../screens/BudgetsScreen";
import { BillsScreen } from "../screens/BillsScreen";
import { AccountsScreen } from "../screens/AccountsScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { AddBudgetScreen } from "../screens/AddBudgetScreen";
import { AddBillScreen } from "../screens/AddBillScreen";
import { StatementUploadScreen } from "../screens/StatementUploadScreen";
import { TransactionDetailScreen } from "../screens/TransactionDetailScreen";
import { BudgetDetailScreen } from "../screens/BudgetDetailScreen";
import { BillDetailScreen } from "../screens/BillDetailScreen";
import { CategoryManagementScreen } from "../screens/CategoryManagementScreen";
import { WebBottomTabBar } from "../components/WebBottomTabBar";

import { RootStackParamList } from "../types";

const Stack = createStackNavigator<RootStackParamList>();

// Wrapped components with WebBottomTabBar
const WrappedDashboardScreen = () => (
  <WebBottomTabBar>
    <DashboardScreen />
  </WebBottomTabBar>
);

const WrappedTransactionsScreen = () => (
  <WebBottomTabBar>
    <TransactionsScreen />
  </WebBottomTabBar>
);

const WrappedBudgetsScreen = () => (
  <WebBottomTabBar>
    <BudgetsScreen />
  </WebBottomTabBar>
);

const WrappedBillsScreen = () => (
  <WebBottomTabBar>
    <BillsScreen />
  </WebBottomTabBar>
);

const WrappedAccountsScreen = () => (
  <WebBottomTabBar>
    <AccountsScreen />
  </WebBottomTabBar>
);

const WrappedSettingsScreen = () => (
  <WebBottomTabBar>
    <SettingsScreen />
  </WebBottomTabBar>
);

const WrappedProfileScreen = () => (
  <WebBottomTabBar>
    <ProfileScreen />
  </WebBottomTabBar>
);

const WrappedAddTransactionScreen = () => (
  <WebBottomTabBar>
    <AddTransactionScreen />
  </WebBottomTabBar>
);

const WrappedAddBudgetScreen = () => (
  <WebBottomTabBar>
    <AddBudgetScreen />
  </WebBottomTabBar>
);

const WrappedAddBillScreen = () => (
  <WebBottomTabBar>
    <AddBillScreen />
  </WebBottomTabBar>
);

const WrappedTransactionDetailScreen = () => (
  <WebBottomTabBar>
    <TransactionDetailScreen />
  </WebBottomTabBar>
);

const WrappedBudgetDetailScreen = () => (
  <WebBottomTabBar>
    <BudgetDetailScreen />
  </WebBottomTabBar>
);

const WrappedBillDetailScreen = () => (
  <WebBottomTabBar>
    <BillDetailScreen />
  </WebBottomTabBar>
);

const WrappedStatementUploadScreen = () => (
  <WebBottomTabBar>
    <StatementUploadScreen />
  </WebBottomTabBar>
);

const WrappedAIInsightsScreen = () => (
  <WebBottomTabBar>
    <AIInsightsScreen />
  </WebBottomTabBar>
);

const WrappedCategoryManagementScreen = () => (
  <WebBottomTabBar>
    <CategoryManagementScreen />
  </WebBottomTabBar>
);

export function RootNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* Main screens */}
      <Stack.Screen
        name="Dashboard"
        component={WrappedDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Transactions"
        component={WrappedTransactionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Budgets"
        component={WrappedBudgetsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Bills"
        component={WrappedBillsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Accounts"
        component={WrappedAccountsScreen}
        options={{ headerShown: false }}
      />

      {/* Modal and Detail Screens */}
      <Stack.Screen
        name="Settings"
        component={WrappedSettingsScreen}
        options={{ title: "Settings" }}
      />
      <Stack.Screen
        name="Profile"
        component={WrappedProfileScreen}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={WrappedAddTransactionScreen}
        options={{
          title: "Add Transaction",
          presentation: Platform.OS === "ios" ? "modal" : "card",
        }}
      />
      <Stack.Screen
        name="AddBudget"
        component={WrappedAddBudgetScreen}
        options={{
          title: "Add Budget",
          presentation: Platform.OS === "ios" ? "modal" : "card",
        }}
      />
      <Stack.Screen
        name="AddBill"
        component={WrappedAddBillScreen}
        options={{
          title: "Add Bill",
          presentation: Platform.OS === "ios" ? "modal" : "card",
        }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={WrappedTransactionDetailScreen}
        options={{ title: "Transaction Details" }}
      />
      <Stack.Screen
        name="BudgetDetail"
        component={WrappedBudgetDetailScreen}
        options={{ title: "Budget Details" }}
      />
      <Stack.Screen
        name="BillDetail"
        component={WrappedBillDetailScreen}
        options={{ title: "Bill Details" }}
      />
      <Stack.Screen
        name="StatementUpload"
        component={WrappedStatementUploadScreen}
        options={{
          title: "Upload Statement",
          presentation: Platform.OS === "ios" ? "modal" : "card",
        }}
      />
      <Stack.Screen
        name="AIInsights"
        component={WrappedAIInsightsScreen}
        options={{ title: "AI Insights" }}
      />
      <Stack.Screen
        name="CategoryManagement"
        component={WrappedCategoryManagementScreen}
        options={{ title: "Manage Categories" }}
      />
    </Stack.Navigator>
  );
}
