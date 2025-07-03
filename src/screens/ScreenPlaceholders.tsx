import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// Template component for placeholder screens
function ScreenTemplate({ screenName }: { screenName: string }) {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
          {screenName}
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}
        >
          This screen is under development.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Export all placeholder screens
export function ForgotPasswordScreen() {
  return <ScreenTemplate screenName="Forgot Password" />;
}

export function ResetPasswordScreen() {
  return <ScreenTemplate screenName="Reset Password" />;
}

export function RegisterScreen() {
  return <ScreenTemplate screenName="Register" />;
}

export function TransactionsScreen() {
  return <ScreenTemplate screenName="Transactions" />;
}

export function BudgetsScreen() {
  return <ScreenTemplate screenName="Budgets" />;
}

export function BillsScreen() {
  return <ScreenTemplate screenName="Bills" />;
}

export function AccountsScreen() {
  return <ScreenTemplate screenName="Accounts" />;
}

export function SettingsScreen() {
  return <ScreenTemplate screenName="Settings" />;
}

export function ProfileScreen() {
  return <ScreenTemplate screenName="Profile" />;
}

export function AddTransactionScreen() {
  return <ScreenTemplate screenName="Add Transaction" />;
}

export function AddBudgetScreen() {
  return <ScreenTemplate screenName="Add Budget" />;
}

export function AddBillScreen() {
  return <ScreenTemplate screenName="Add Bill" />;
}

export function TransactionDetailScreen() {
  return <ScreenTemplate screenName="Transaction Details" />;
}

export function BudgetDetailScreen() {
  return <ScreenTemplate screenName="Budget Details" />;
}

export function BillDetailScreen() {
  return <ScreenTemplate screenName="Bill Details" />;
}

export function StatementUploadScreen() {
  return <ScreenTemplate screenName="Statement Upload" />;
}

export function AIInsightsScreen() {
  return <ScreenTemplate screenName="AI Insights" />;
}

export function CategoryManagementScreen() {
  return <ScreenTemplate screenName="Category Management" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
