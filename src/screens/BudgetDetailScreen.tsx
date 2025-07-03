import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Dimensions } from "react-native";
import {
  Text,
  Card,
  Chip,
  IconButton,
  useTheme,
  Divider,
  Button,
  Surface,
  Menu,
  Portal,
  Dialog,
  TextInput,
  ProgressBar,
  List,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";

type BudgetDetailRouteProp = RouteProp<RootStackParamList, "BudgetDetail">;

interface Budget {
  id: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate: string;
  description?: string;
  transactions: BudgetTransaction[];
  alerts: {
    enabled: boolean;
    threshold: number; // percentage
  };
}

interface BudgetTransaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
}

export function BudgetDetailScreen() {
  const theme = useTheme();
  const route = useRoute<BudgetDetailRouteProp>();
  const navigation = useNavigation();

  // Mock budget data - in real app this would come from Redux/API
  const [budget] = useState<Budget>({
    id: route.params?.budgetId || "1",
    name: "Groceries & Food",
    category: "Food & Dining",
    amount: 800,
    spent: 445.67,
    period: "monthly",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    description: "Monthly budget for groceries and dining out",
    alerts: {
      enabled: true,
      threshold: 80,
    },
    transactions: [
      {
        id: "1",
        title: "Whole Foods",
        amount: -89.45,
        date: "2024-01-15",
        category: "Groceries",
      },
      {
        id: "2",
        title: "McDonald's",
        amount: -12.5,
        date: "2024-01-14",
        category: "Fast Food",
      },
      {
        id: "3",
        title: "Trader Joe's",
        amount: -156.78,
        date: "2024-01-12",
        category: "Groceries",
      },
      {
        id: "4",
        title: "Local Restaurant",
        amount: -45.3,
        date: "2024-01-10",
        category: "Dining",
      },
      {
        id: "5",
        title: "Coffee Shop",
        amount: -5.67,
        date: "2024-01-09",
        category: "Beverages",
      },
    ],
  });

  const [menuVisible, setMenuVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editedBudget, setEditedBudget] = useState(budget);

  const remaining = budget.amount - budget.spent;
  const spentPercentage = (budget.spent / budget.amount) * 100;
  const isOverBudget = spentPercentage > 100;
  const isNearLimit = spentPercentage >= budget.alerts.threshold;

  const getDaysRemaining = () => {
    const endDate = new Date(budget.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getSpendingRate = () => {
    const totalDays = new Date(budget.endDate).getDate();
    const daysPassed = totalDays - getDaysRemaining();
    return daysPassed > 0 ? budget.spent / daysPassed : 0;
  };

  const formatAmount = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getProgressColor = () => {
    if (isOverBudget) return theme.colors.error;
    if (isNearLimit) return theme.colors.primary;
    return theme.colors.primary;
  };

  const handleEdit = () => {
    setEditDialogVisible(true);
    setMenuVisible(false);
  };

  const handleDelete = () => {
    setDeleteDialogVisible(true);
    setMenuVisible(false);
  };

  const confirmDelete = () => {
    // In real app, this would delete from Redux/API
    Alert.alert("Success", "Budget deleted", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
    setDeleteDialogVisible(false);
  };

  const saveEdit = () => {
    // In real app, this would update Redux/API
    Alert.alert("Success", "Budget updated");
    setEditDialogVisible(false);
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    const getIcon = () => {
      switch (category.toLowerCase()) {
        case "food & dining":
          return "restaurant";
        case "transportation":
          return "directions-car";
        case "shopping":
          return "shopping-bag";
        case "entertainment":
          return "movie";
        case "health":
          return "local-hospital";
        case "utilities":
          return "home";
        default:
          return "category";
      }
    };

    return (
      <MaterialIcons
        name={getIcon() as any}
        size={24}
        color={theme.colors.primary}
      />
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <Card
          style={[
            styles.headerCard,
            {
              backgroundColor: isOverBudget
                ? theme.colors.errorContainer
                : theme.colors.primaryContainer,
            },
          ]}
        >
          <Card.Content style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.iconContainer}>
                <CategoryIcon category={budget.category} />
              </View>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="more-vert"
                    size={24}
                    onPress={() => setMenuVisible(true)}
                    iconColor={theme.colors.primary}
                  />
                }
              >
                <Menu.Item
                  onPress={handleEdit}
                  title="Edit Budget"
                  leadingIcon="edit"
                />
                <Menu.Item
                  onPress={() => {
                    /* Add transaction */
                  }}
                  title="Add Transaction"
                  leadingIcon="add"
                />
                <Menu.Item
                  onPress={handleDelete}
                  title="Delete Budget"
                  leadingIcon="delete"
                />
              </Menu>
            </View>

            <Text
              variant="headlineSmall"
              style={[styles.title, { color: theme.colors.onPrimaryContainer }]}
            >
              {budget.name}
            </Text>

            <Text
              variant="bodyMedium"
              style={[
                styles.period,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}{" "}
              Budget
            </Text>

            <View style={styles.amountContainer}>
              <Text
                variant="displaySmall"
                style={[
                  styles.budgetAmount,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {formatAmount(budget.amount)}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onPrimaryContainer }}
              >
                Total Budget
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <Card.Content>
            <View style={styles.progressHeader}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.primary }}
              >
                Spending Progress
              </Text>
              {isNearLimit && (
                <Chip
                  mode="outlined"
                  icon="warning"
                  style={{ backgroundColor: theme.colors.errorContainer }}
                  textStyle={{ color: theme.colors.error }}
                >
                  {isOverBudget ? "Over Budget" : "Near Limit"}
                </Chip>
              )}
            </View>

            <View style={styles.progressInfo}>
              <View style={styles.progressRow}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Spent
                </Text>
                <Text
                  variant="titleMedium"
                  style={{
                    color: isOverBudget
                      ? theme.colors.error
                      : theme.colors.primary,
                  }}
                >
                  {formatAmount(budget.spent)}
                </Text>
              </View>
              <View style={styles.progressRow}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Remaining
                </Text>
                <Text
                  variant="titleMedium"
                  style={{
                    color:
                      remaining >= 0
                        ? theme.colors.primary
                        : theme.colors.error,
                  }}
                >
                  {remaining >= 0
                    ? formatAmount(remaining)
                    : `-${formatAmount(Math.abs(remaining))}`}
                </Text>
              </View>
            </View>

            <ProgressBar
              progress={Math.min(spentPercentage / 100, 1)}
              color={getProgressColor()}
              style={styles.progressBar}
            />

            <Text
              variant="bodySmall"
              style={[
                styles.progressText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {spentPercentage.toFixed(1)}% of budget used
            </Text>
          </Card.Content>
        </Card>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              Budget Statistics
            </Text>

            <View style={styles.statsGrid}>
              <Surface style={styles.statItem} elevation={1}>
                <MaterialIcons
                  name="schedule"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                >
                  Days Remaining
                </Text>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.primary }}
                >
                  {getDaysRemaining()}
                </Text>
              </Surface>

              <Surface style={styles.statItem} elevation={1}>
                <MaterialIcons
                  name="trending-up"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                >
                  Daily Average
                </Text>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.primary }}
                >
                  {formatAmount(getSpendingRate())}
                </Text>
              </Surface>

              <Surface style={styles.statItem} elevation={1}>
                <MaterialIcons
                  name="receipt"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                >
                  Transactions
                </Text>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.primary }}
                >
                  {budget.transactions.length}
                </Text>
              </Surface>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Transactions */}
        <Card style={styles.transactionsCard}>
          <Card.Content>
            <View style={styles.transactionsHeader}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.primary }}
              >
                Recent Transactions
              </Text>
              <Button
                mode="text"
                onPress={() => {
                  /* Navigate to filtered transactions */
                }}
                style={styles.viewAllButton}
              >
                View All
              </Button>
            </View>

            {budget.transactions.slice(0, 5).map((transaction) => (
              <List.Item
                key={transaction.id}
                title={transaction.title}
                description={`${transaction.category} • ${formatDate(
                  transaction.date
                )}`}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="receipt"
                    color={theme.colors.primary}
                  />
                )}
                right={() => (
                  <Text
                    variant="titleSmall"
                    style={{ color: theme.colors.error }}
                  >
                    {formatAmount(transaction.amount)}
                  </Text>
                )}
                onPress={() => {
                  /* Navigate to transaction detail */
                }}
                style={styles.transactionItem}
              />
            ))}

            {budget.transactions.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="receipt"
                  size={48}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
                >
                  No transactions yet
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Budget Details */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              Budget Details
            </Text>

            <View style={styles.detailRow}>
              <MaterialIcons
                name="date-range"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.detailContent}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Period
                </Text>
                <Text variant="bodyMedium">
                  {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                </Text>
              </View>
            </View>

            {budget.description && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="description"
                    size={20}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <View style={styles.detailContent}>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      Description
                    </Text>
                    <Text variant="bodyMedium">{budget.description}</Text>
                  </View>
                </View>
              </>
            )}

            <Divider style={styles.divider} />
            <View style={styles.detailRow}>
              <MaterialIcons
                name="notifications"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.detailContent}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Alerts
                </Text>
                <Text variant="bodyMedium">
                  {budget.alerts.enabled
                    ? `Enabled at ${budget.alerts.threshold}%`
                    : "Disabled"}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              Quick Actions
            </Text>

            <View style={styles.actionsRow}>
              <Button
                mode="outlined"
                style={styles.actionButton}
                onPress={handleEdit}
                icon="edit"
              >
                Edit
              </Button>
              <Button
                mode="outlined"
                style={styles.actionButton}
                onPress={() => {
                  /* Navigate to add transaction */
                }}
                icon="add"
              >
                Add Transaction
              </Button>
            </View>

            <View style={styles.actionsRow}>
              <Button
                mode="outlined"
                style={styles.actionButton}
                onPress={() => {
                  /* Generate report */
                }}
                icon="assessment"
              >
                View Report
              </Button>
              <Button
                mode="outlined"
                style={styles.actionButton}
                onPress={() => {
                  /* Reset budget */
                }}
                icon="refresh"
              >
                Reset
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Edit Dialog */}
      <Portal>
        <Dialog
          visible={editDialogVisible}
          onDismiss={() => setEditDialogVisible(false)}
        >
          <Dialog.Title>Edit Budget</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Budget Name"
              value={editedBudget.name}
              onChangeText={(text) =>
                setEditedBudget((prev) => ({ ...prev, name: text }))
              }
              style={styles.editInput}
            />
            <TextInput
              label="Amount"
              value={editedBudget.amount.toString()}
              onChangeText={(text) =>
                setEditedBudget((prev) => ({
                  ...prev,
                  amount: parseFloat(text) || 0,
                }))
              }
              keyboardType="numeric"
              style={styles.editInput}
            />
            <TextInput
              label="Description"
              value={editedBudget.description || ""}
              onChangeText={(text) =>
                setEditedBudget((prev) => ({ ...prev, description: text }))
              }
              style={styles.editInput}
              multiline
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={saveEdit}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Budget</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this budget? This action cannot be
              undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={confirmDelete} textColor={theme.colors.error}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  headerContent: {
    paddingVertical: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 4,
  },
  period: {
    marginBottom: 16,
  },
  amountContainer: {
    alignItems: "flex-start",
  },
  budgetAmount: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  progressCard: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  progressRow: {
    alignItems: "center",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    textAlign: "center",
  },
  statsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  transactionsCard: {
    marginBottom: 16,
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  viewAllButton: {
    marginRight: -12,
  },
  transactionItem: {
    paddingHorizontal: 0,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
  },
  detailsCard: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  detailContent: {
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    marginVertical: 8,
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
  },
  editInput: {
    marginBottom: 16,
  },
});
