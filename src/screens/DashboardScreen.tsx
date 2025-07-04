import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Button, useTheme, Appbar, FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppSelector, useAppDispatch } from "../store";
import { toggleTheme } from "../store/slices/uiSlice";
import { logoutUser } from "../store/slices/authSlice";
import { fetchAllTransactions } from "../store/slices/transactionSlice";

export function DashboardScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const { theme: currentTheme } = useAppSelector((state) => state.ui);
  const { transactions, loading } = useAppSelector(
    (state) => state.transactions
  );
  const { accounts } = useAppSelector((state) => state.accounts);

  // Calculate totals from transactions and accounts
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Calculate total balance from accounts if available, otherwise from transactions
  const totalBalance =
    accounts && accounts.length > 0
      ? accounts.reduce((sum, account) => sum + (account.balance || 0), 0)
      : transactions && transactions.length > 0
      ? transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + (t.amount || 0), 0) -
        transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + (t.amount || 0), 0)
      : 0;

  // Calculate current month spending
  const monthlySpending =
    transactions && transactions.length > 0
      ? transactions
          .filter((transaction) => {
            try {
              const transactionDate = new Date(transaction.date);
              // Ensure the date is valid
              if (isNaN(transactionDate.getTime())) {
                console.warn("Invalid transaction date:", transaction.date);
                return false;
              }
              return (
                transaction.type === "expense" &&
                transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear
              );
            } catch (error) {
              console.warn(
                "Error parsing transaction date:",
                transaction.date,
                error
              );
              return false;
            }
          })
          .reduce((sum, transaction) => sum + transaction.amount, 0)
      : 0;

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    const sign = amount >= 0 ? "+" : "";
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  };

  // Debug logging for calculations
  console.log("🔢 Dashboard calculations:", {
    transactionsCount: transactions?.length || 0,
    accountsCount: accounts?.length || 0,
    totalBalance,
    monthlySpending,
    currentMonth: currentMonth + 1, // +1 for display (January = 1)
    currentYear,
  });

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // Helper function to refresh data
  const refreshData = async () => {
    try {
      console.log("🔄 Dashboard: Refreshing data...");
      await dispatch(fetchAllTransactions()).unwrap();
      console.log("✅ Dashboard: Data refreshed successfully");
    } catch (error) {
      console.error("❌ Dashboard: Failed to refresh data:", error);
    }
  };

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  // Fetch transactions when component mounts or when user returns to dashboard
  useEffect(() => {
    refreshData();
  }, [dispatch]);

  // Add navigation focus listener to refresh data when user returns to dashboard
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("📱 Dashboard: Screen focused, refreshing data...");
      refreshData();
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  // Additional effect to recalculate when transactions change
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      console.log(
        "📊 Dashboard: Transactions updated, recalculating totals..."
      );
    }
  }, [transactions]);

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

      <View style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Quick Overview {loading && "(Updating...)"}
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
                  style={{
                    color: theme.colors.onPrimaryContainer,
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(totalBalance)}
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
                  style={{
                    color: theme.colors.onSecondaryContainer,
                    fontWeight: "bold",
                  }}
                >
                  ${monthlySpending.toFixed(2)}
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
              icon={() => (
                <MaterialIcons
                  name="pie-chart"
                  size={18}
                  color={theme.colors.primary}
                />
              )}
              onPress={() => navigation.navigate("AddBudget" as never)}
              style={styles.actionButton}
            >
              Create Budget
            </Button>
            <Button
              mode="outlined"
              icon={() => (
                <MaterialIcons
                  name="schedule"
                  size={18}
                  color={theme.colors.primary}
                />
              )}
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
                  style={{
                    marginTop: 8,
                    color: theme.colors.onSurfaceVariant,
                  }}
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
      </View>

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
    paddingBottom: 100, // Extra padding to ensure FAB doesn't cover content
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
