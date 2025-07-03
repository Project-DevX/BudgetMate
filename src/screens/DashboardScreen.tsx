import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Button, useTheme, Appbar, FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppSelector, useAppDispatch } from "../store";
import { toggleTheme } from "../store/slices/uiSlice";
import { logoutUser } from "../store/slices/authSlice";

export function DashboardScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { theme: currentTheme } = useAppSelector((state) => state.ui);
  const { transactions } = useAppSelector((state) => state.transactions);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content
          title="BudgetMate"
          subtitle={`Welcome back, ${user?.name || "User"}!`}
        />
        <Appbar.Action
          icon={currentTheme === "light" ? "weather-night" : "weather-sunny"}
          onPress={handleToggleTheme}
        />
        <Appbar.Action
          icon="account-circle"
          onPress={() => navigation.navigate("Profile" as never)}
        />
        <Appbar.Action
          icon="cog"
          onPress={() => navigation.navigate("Settings" as never)}
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Quick Overview
          </Text>
          <View style={styles.statsGrid}>
            <Card
              style={[
                styles.statCard,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Card.Content>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onPrimaryContainer }}
                >
                  Total Balance
                </Text>
                <Text
                  variant="headlineMedium"
                  style={{ color: theme.colors.onPrimaryContainer }}
                >
                  $5,240.50
                </Text>
              </Card.Content>
            </Card>

            <Card
              style={[
                styles.statCard,
                { backgroundColor: theme.colors.secondaryContainer },
              ]}
            >
              <Card.Content>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSecondaryContainer }}
                >
                  This Month Spending
                </Text>
                <Text
                  variant="headlineMedium"
                  style={{ color: theme.colors.onSecondaryContainer }}
                >
                  $1,890.25
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <Button
              mode="outlined"
              icon="plus"
              onPress={() => navigation.navigate("AddTransaction" as never)}
              style={styles.actionButton}
            >
              Add Transaction
            </Button>
            <Button
              mode="outlined"
              icon="pie-chart"
              onPress={() => navigation.navigate("AddBudget" as never)}
              style={styles.actionButton}
            >
              Create Budget
            </Button>
            <Button
              mode="outlined"
              icon="schedule"
              onPress={() => navigation.navigate("AddBill" as never)}
              style={styles.actionButton}
            >
              Add Bill
            </Button>
            <Button
              mode="outlined"
              icon="upload"
              onPress={() => navigation.navigate("StatementUpload" as never)}
              style={styles.actionButton}
            >
              Upload Statement
            </Button>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Recent Transactions
          </Text>
          {transactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {transactions.slice(0, 5).map((transaction) => (
                <Card key={transaction.id} style={styles.transactionCard}>
                  <Card.Content>
                    <View style={styles.transactionRow}>
                      <View style={styles.transactionInfo}>
                        <Text
                          variant="titleMedium"
                          style={styles.transactionDescription}
                        >
                          {transaction.description}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          {transaction.category} •{" "}
                          {new Date(transaction.date).toLocaleDateString()}
                        </Text>
                        {transaction.merchant && (
                          <Text
                            variant="bodySmall"
                            style={{ color: theme.colors.onSurfaceVariant }}
                          >
                            {transaction.merchant}
                          </Text>
                        )}
                      </View>
                      <Text
                        variant="titleMedium"
                        style={[
                          styles.transactionAmount,
                          {
                            color:
                              transaction.type === "income"
                                ? theme.colors.primary
                                : theme.colors.error,
                          },
                        ]}
                      >
                        {transaction.type === "income" ? "+" : "-"}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              ))}
              <Button
                mode="text"
                onPress={() => navigation.navigate("Transactions" as never)}
                style={{ marginTop: 8, alignSelf: "center" }}
              >
                View All Transactions
              </Button>
            </View>
          ) : (
            <Card>
              <Card.Content>
                <Text variant="bodyMedium">
                  No recent transactions available.
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}
                >
                  Start by adding your first transaction or connecting your bank
                  account.
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            AI Insights
          </Text>
          <Card>
            <Card.Content>
              <View style={styles.insightHeader}>
                <MaterialIcons
                  name="lightbulb"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                  Smart Suggestion
                </Text>
              </View>
              <Text variant="bodyMedium" style={{ marginTop: 8 }}>
                Connect your bank account to get personalized insights and
                automated transaction categorization.
              </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate("AIInsights" as never)}
                style={{ marginTop: 8, alignSelf: "flex-start" }}
              >
                View All Insights
              </Button>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Button mode="outlined" onPress={handleLogout} icon="logout">
            Logout
          </Button>
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("AddTransaction" as never)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: "45%",
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  transactionsList: {
    gap: 8,
  },
  transactionCard: {
    marginBottom: 8,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionDescription: {
    fontWeight: "600",
  },
  transactionAmount: {
    fontWeight: "bold",
    textAlign: "right",
  },
});
