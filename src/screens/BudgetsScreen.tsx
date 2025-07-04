import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Card,
  Button,
  useTheme,
  Appbar,
  FAB,
  ProgressBar,
  Chip,
  Divider,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppSelector } from "../store";

interface Budget {
  id: string;
  name: string;
  category: string;
  allocated: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export function BudgetsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const { transactions } = useAppSelector((state) => state.transactions);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "weekly" | "monthly" | "yearly"
  >("monthly");

  // Mock budgets data - in a real app, this would come from Redux store
  const [budgets] = useState<Budget[]>([
    {
      id: "1",
      name: "Groceries",
      category: "food",
      allocated: 500,
      spent: 347.5,
      period: "monthly",
      startDate: "2025-07-01",
      endDate: "2025-07-31",
      isActive: true,
    },
    {
      id: "2",
      name: "Transportation",
      category: "transport",
      allocated: 200,
      spent: 156.3,
      period: "monthly",
      startDate: "2025-07-01",
      endDate: "2025-07-31",
      isActive: true,
    },
    {
      id: "3",
      name: "Entertainment",
      category: "entertainment",
      allocated: 150,
      spent: 89.75,
      period: "monthly",
      startDate: "2025-07-01",
      endDate: "2025-07-31",
      isActive: true,
    },
    {
      id: "4",
      name: "Shopping",
      category: "shopping",
      allocated: 300,
      spent: 425.2,
      period: "monthly",
      startDate: "2025-07-01",
      endDate: "2025-07-31",
      isActive: true,
    },
  ]);

  const filteredBudgets = budgets.filter(
    (budget) => budget.period === selectedPeriod
  );

  const totalAllocated = filteredBudgets.reduce(
    (sum, budget) => sum + budget.allocated,
    0
  );
  const totalSpent = filteredBudgets.reduce(
    (sum, budget) => sum + budget.spent,
    0
  );
  const totalRemaining = totalAllocated - totalSpent;

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, you would fetch fresh budget data here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.allocated) * 100;
    if (percentage >= 100) return "over";
    if (percentage >= 80) return "warning";
    return "good";
  };

  const getBudgetStatusColor = (status: string) => {
    switch (status) {
      case "over":
        return theme.colors.error;
      case "warning":
        return "#FF9800";
      default:
        return theme.colors.primary;
    }
  };

  const formatCurrency = (amount: number) => `$${Math.abs(amount).toFixed(2)}`;

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Ends today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content
          title="Budgets"
          subtitle="Manage your spending limits"
        />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>

      {/* Period Selection */}
      <View style={styles.periodContainer}>
        <View style={styles.periodChips}>
          {(["weekly", "monthly", "yearly"] as const).map((period) => (
            <Chip
              key={period}
              mode={selectedPeriod === period ? "flat" : "outlined"}
              onPress={() => setSelectedPeriod(period)}
              style={styles.periodChip}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        {/* Budget Overview */}
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.overviewTitle}>
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}{" "}
              Overview
            </Text>

            <View style={styles.overviewGrid}>
              <View style={styles.overviewItem}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Total Budget
                </Text>
                <Text
                  variant="headlineSmall"
                  style={{ color: theme.colors.primary }}
                >
                  {formatCurrency(totalAllocated)}
                </Text>
              </View>

              <View style={styles.overviewItem}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Total Spent
                </Text>
                <Text
                  variant="headlineSmall"
                  style={{ color: theme.colors.error }}
                >
                  {formatCurrency(totalSpent)}
                </Text>
              </View>
            </View>

            <Divider style={styles.overviewDivider} />

            <View style={styles.overviewItem}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Remaining
              </Text>
              <Text
                variant="headlineMedium"
                style={{
                  color:
                    totalRemaining >= 0
                      ? theme.colors.primary
                      : theme.colors.error,
                  fontWeight: "bold",
                }}
              >
                {totalRemaining >= 0 ? "+" : ""}
                {formatCurrency(totalRemaining)}
              </Text>
            </View>

            <ProgressBar
              progress={Math.min(totalSpent / totalAllocated, 1)}
              style={styles.overviewProgress}
              color={
                totalSpent > totalAllocated
                  ? theme.colors.error
                  : theme.colors.primary
              }
            />
          </Card.Content>
        </Card>

        {/* Budget List */}
        <View style={styles.budgetList}>
          {filteredBudgets.length > 0 ? (
            filteredBudgets.map((budget) => {
              const status = getBudgetStatus(budget);
              const percentage = Math.min(
                (budget.spent / budget.allocated) * 100,
                100
              );
              const remaining = budget.allocated - budget.spent;

              return (
                <Card
                  key={budget.id}
                  style={styles.budgetCard}
                  onPress={() => {
                    // navigation.navigate('BudgetDetail', { id: budget.id });
                    console.log("Budget tapped:", budget.id);
                  }}
                >
                  <Card.Content>
                    <View style={styles.budgetHeader}>
                      <View style={styles.budgetInfo}>
                        <Text variant="titleMedium" style={styles.budgetName}>
                          {budget.name}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          {getTimeRemaining(budget.endDate)}
                        </Text>
                      </View>

                      <View style={styles.budgetStatus}>
                        <Chip
                          compact
                          style={[
                            styles.statusChip,
                            {
                              backgroundColor:
                                getBudgetStatusColor(status) + "20",
                            },
                          ]}
                          textStyle={{ color: getBudgetStatusColor(status) }}
                        >
                          {status === "over"
                            ? "Over Budget"
                            : status === "warning"
                            ? "Warning"
                            : "On Track"}
                        </Chip>
                      </View>
                    </View>

                    <View style={styles.budgetAmounts}>
                      <View style={styles.amountRow}>
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          Spent: {formatCurrency(budget.spent)}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          Budget: {formatCurrency(budget.allocated)}
                        </Text>
                      </View>

                      <ProgressBar
                        progress={percentage / 100}
                        style={styles.budgetProgress}
                        color={getBudgetStatusColor(status)}
                      />

                      <View style={styles.remainingRow}>
                        <Text
                          variant="titleSmall"
                          style={{
                            color:
                              remaining >= 0
                                ? theme.colors.primary
                                : theme.colors.error,
                            fontWeight: "600",
                          }}
                        >
                          {remaining >= 0 ? "Remaining: " : "Over by: "}
                          {formatCurrency(Math.abs(remaining))}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          {percentage.toFixed(1)}% used
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              );
            })
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <MaterialIcons
                  name="account-balance-wallet"
                  size={64}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text variant="headlineSmall" style={styles.emptyTitle}>
                  No budgets found
                </Text>
                <Text variant="bodyMedium" style={styles.emptyDescription}>
                  Create your first budget to start tracking your spending
                  limits.
                </Text>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate("AddBudget" as never)}
                  style={styles.emptyButton}
                >
                  Create Budget
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.actionsTitle}>
              Quick Actions
            </Text>

            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                icon="plus"
                onPress={() => navigation.navigate("AddBudget" as never)}
                style={styles.actionButton}
              >
                New Budget
              </Button>

              <Button
                mode="outlined"
                icon="settings"
                onPress={() =>
                  navigation.navigate("CategoryManagement" as never)
                }
                style={styles.actionButton}
              >
                Categories
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("AddBudget" as never)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  periodContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  periodChips: {
    flexDirection: "row",
    gap: 8,
  },
  periodChip: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100, // Extra padding to ensure FAB doesn't cover content
  },
  overviewCard: {
    marginBottom: 16,
    elevation: 2,
  },
  overviewTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },
  overviewGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  overviewItem: {
    alignItems: "center",
  },
  overviewDivider: {
    marginVertical: 16,
  },
  overviewProgress: {
    height: 8,
    borderRadius: 4,
    marginTop: 12,
  },
  budgetList: {
    gap: 12,
    marginBottom: 16,
  },
  budgetCard: {
    elevation: 1,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetName: {
    fontWeight: "600",
  },
  budgetStatus: {
    marginLeft: 12,
  },
  statusChip: {
    height: 28,
  },
  budgetAmounts: {
    gap: 8,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  budgetProgress: {
    height: 6,
    borderRadius: 3,
  },
  remainingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 1,
  },
  actionsTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  emptyCard: {
    marginTop: 40,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  emptyButton: {
    marginTop: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
