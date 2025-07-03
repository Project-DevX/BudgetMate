import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
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
  List,
  Switch,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";

type BillDetailRouteProp = RouteProp<RootStackParamList, "BillDetail">;

interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  dueDate: string;
  frequency: "weekly" | "monthly" | "quarterly" | "yearly";
  description?: string;
  vendor: string;
  account: string;
  autopay: boolean;
  notifications: {
    enabled: boolean;
    daysBefore: number;
  };
  paymentHistory: BillPayment[];
  nextPayment: string;
  status: "upcoming" | "overdue" | "paid";
}

interface BillPayment {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  method: string;
}

export function BillDetailScreen() {
  const theme = useTheme();
  const route = useRoute<BillDetailRouteProp>();
  const navigation = useNavigation();

  // Mock bill data - in real app this would come from Redux/API
  const [bill] = useState<Bill>({
    id: route.params?.billId || "1",
    name: "Electric Bill",
    category: "Utilities",
    amount: 145.5,
    dueDate: "2024-01-25",
    frequency: "monthly",
    description: "Monthly electricity bill from City Power & Light",
    vendor: "City Power & Light",
    account: "Chase Checking",
    autopay: true,
    notifications: {
      enabled: true,
      daysBefore: 3,
    },
    nextPayment: "2024-01-25",
    status: "upcoming",
    paymentHistory: [
      {
        id: "1",
        date: "2023-12-25",
        amount: 142.3,
        status: "paid",
        method: "Auto-pay",
      },
      {
        id: "2",
        date: "2023-11-25",
        amount: 138.75,
        status: "paid",
        method: "Auto-pay",
      },
      {
        id: "3",
        date: "2023-10-25",
        amount: 155.9,
        status: "paid",
        method: "Auto-pay",
      },
      {
        id: "4",
        date: "2023-09-25",
        amount: 148.2,
        status: "paid",
        method: "Manual",
      },
    ],
  });

  const [menuVisible, setMenuVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [paymentDialogVisible, setPaymentDialogVisible] = useState(false);
  const [editedBill, setEditedBill] = useState(bill);

  const getDaysUntilDue = () => {
    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = () => {
    switch (bill.status) {
      case "paid":
        return theme.colors.primary;
      case "overdue":
        return theme.colors.error;
      case "upcoming":
        return theme.colors.tertiary;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const getStatusIcon = () => {
    switch (bill.status) {
      case "paid":
        return "check-circle";
      case "overdue":
        return "warning";
      case "upcoming":
        return "schedule";
      default:
        return "help";
    }
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return theme.colors.primary;
      case "pending":
        return theme.colors.tertiary;
      case "failed":
        return theme.colors.error;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const handleEdit = () => {
    setEditDialogVisible(true);
    setMenuVisible(false);
  };

  const handleDelete = () => {
    setDeleteDialogVisible(true);
    setMenuVisible(false);
  };

  const handlePayNow = () => {
    setPaymentDialogVisible(true);
    setMenuVisible(false);
  };

  const confirmDelete = () => {
    // In real app, this would delete from Redux/API
    Alert.alert("Success", "Bill deleted", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
    setDeleteDialogVisible(false);
  };

  const saveEdit = () => {
    // In real app, this would update Redux/API
    Alert.alert("Success", "Bill updated");
    setEditDialogVisible(false);
  };

  const processPayment = () => {
    // In real app, this would process payment
    Alert.alert("Success", "Payment processed successfully");
    setPaymentDialogVisible(false);
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    const getIcon = () => {
      switch (category.toLowerCase()) {
        case "utilities":
          return "home";
        case "insurance":
          return "security";
        case "subscriptions":
          return "subscriptions";
        case "loan":
          return "account-balance";
        case "credit card":
          return "credit-card";
        case "rent":
          return "apartment";
        default:
          return "receipt";
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
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Card.Content style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.iconContainer}>
                <CategoryIcon category={bill.category} />
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
                  title="Edit Bill"
                  leadingIcon="edit"
                />
                <Menu.Item
                  onPress={handlePayNow}
                  title="Pay Now"
                  leadingIcon="payment"
                />
                <Menu.Item
                  onPress={handleDelete}
                  title="Delete Bill"
                  leadingIcon="delete"
                />
              </Menu>
            </View>

            <Text
              variant="headlineSmall"
              style={[styles.title, { color: theme.colors.onPrimaryContainer }]}
            >
              {bill.name}
            </Text>

            <Text
              variant="bodyMedium"
              style={[
                styles.vendor,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {bill.vendor}
            </Text>

            <View style={styles.amountContainer}>
              <Text
                variant="displaySmall"
                style={[
                  styles.amount,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {formatAmount(bill.amount)}
              </Text>
              <View style={styles.statusContainer}>
                <MaterialIcons
                  name={getStatusIcon() as any}
                  size={20}
                  color={getStatusColor()}
                />
                <Text
                  variant="bodyMedium"
                  style={{ color: getStatusColor(), marginLeft: 4 }}
                >
                  {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Due Date Card */}
        <Card style={styles.dueDateCard}>
          <Card.Content>
            <View style={styles.dueDateHeader}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.primary }}
              >
                Payment Information
              </Text>
              {bill.autopay && (
                <Chip
                  mode="outlined"
                  icon="autorenew"
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                >
                  Auto-pay Enabled
                </Chip>
              )}
            </View>

            <View style={styles.dueDateInfo}>
              <View style={styles.dueDateRow}>
                <MaterialIcons
                  name="schedule"
                  size={24}
                  color={theme.colors.primary}
                />
                <View style={styles.dueDateContent}>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Due Date
                  </Text>
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.primary }}
                  >
                    {formatDate(bill.dueDate)}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {getDaysUntilDue() > 0
                      ? `${getDaysUntilDue()} days remaining`
                      : getDaysUntilDue() === 0
                      ? "Due today"
                      : `${Math.abs(getDaysUntilDue())} days overdue`}
                  </Text>
                </View>
              </View>

              <View style={styles.dueDateRow}>
                <MaterialIcons
                  name="repeat"
                  size={24}
                  color={theme.colors.primary}
                />
                <View style={styles.dueDateContent}>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Frequency
                  </Text>
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.primary }}
                  >
                    {bill.frequency.charAt(0).toUpperCase() +
                      bill.frequency.slice(1)}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Next: {formatDate(bill.nextPayment)}
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Bill Details */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              Bill Details
            </Text>

            <View style={styles.detailRow}>
              <MaterialIcons
                name="category"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.detailContent}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Category
                </Text>
                <Chip mode="outlined" style={styles.categoryChip}>
                  {bill.category}
                </Chip>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.detailRow}>
              <MaterialIcons
                name="account-balance"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.detailContent}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Payment Account
                </Text>
                <Text variant="bodyMedium">{bill.account}</Text>
              </View>
            </View>

            {bill.description && (
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
                    <Text variant="bodyMedium">{bill.description}</Text>
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
                  Notifications
                </Text>
                <Text variant="bodyMedium">
                  {bill.notifications.enabled
                    ? `${bill.notifications.daysBefore} days before due date`
                    : "Disabled"}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Payment History */}
        <Card style={styles.historyCard}>
          <Card.Content>
            <View style={styles.historyHeader}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.primary }}
              >
                Payment History
              </Text>
              <Button
                mode="text"
                onPress={() => {
                  /* Navigate to full history */
                }}
                style={styles.viewAllButton}
              >
                View All
              </Button>
            </View>

            {bill.paymentHistory.slice(0, 3).map((payment) => (
              <List.Item
                key={payment.id}
                title={formatDate(payment.date)}
                description={`${payment.method} • ${payment.status}`}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={
                      payment.status === "paid"
                        ? "check-circle"
                        : payment.status === "pending"
                        ? "schedule"
                        : "error"
                    }
                    color={getPaymentStatusColor(payment.status)}
                  />
                )}
                right={() => (
                  <Text
                    variant="titleSmall"
                    style={{ color: theme.colors.primary }}
                  >
                    {formatAmount(payment.amount)}
                  </Text>
                )}
                style={styles.historyItem}
              />
            ))}

            {bill.paymentHistory.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="history"
                  size={48}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
                >
                  No payment history
                </Text>
              </View>
            )}
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
                mode="contained"
                style={styles.primaryActionButton}
                onPress={handlePayNow}
                icon="payment"
                disabled={bill.status === "paid"}
              >
                Pay Now
              </Button>
            </View>

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
                  /* Mark as paid */
                }}
                icon="check"
              >
                Mark Paid
              </Button>
            </View>

            <View style={styles.actionsRow}>
              <Button
                mode="outlined"
                style={styles.actionButton}
                onPress={() => {
                  /* Set reminder */
                }}
                icon="alarm"
              >
                Set Reminder
              </Button>
              <Button
                mode="outlined"
                style={styles.actionButton}
                onPress={() => {
                  /* View statements */
                }}
                icon="description"
              >
                Statements
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
          <Dialog.Title>Edit Bill</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Bill Name"
              value={editedBill.name}
              onChangeText={(text) =>
                setEditedBill((prev) => ({ ...prev, name: text }))
              }
              style={styles.editInput}
            />
            <TextInput
              label="Amount"
              value={editedBill.amount.toString()}
              onChangeText={(text) =>
                setEditedBill((prev) => ({
                  ...prev,
                  amount: parseFloat(text) || 0,
                }))
              }
              keyboardType="numeric"
              style={styles.editInput}
            />
            <TextInput
              label="Vendor"
              value={editedBill.vendor}
              onChangeText={(text) =>
                setEditedBill((prev) => ({ ...prev, vendor: text }))
              }
              style={styles.editInput}
            />
            <View style={styles.switchRow}>
              <Text variant="bodyMedium">Auto-pay</Text>
              <Switch
                value={editedBill.autopay}
                onValueChange={(value) =>
                  setEditedBill((prev) => ({ ...prev, autopay: value }))
                }
              />
            </View>
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
          <Dialog.Title>Delete Bill</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this bill? This action cannot be
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

        <Dialog
          visible={paymentDialogVisible}
          onDismiss={() => setPaymentDialogVisible(false)}
        >
          <Dialog.Title>Pay Bill</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
              Pay {bill.name} for {formatAmount(bill.amount)}?
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              This will be charged to your {bill.account} account.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPaymentDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={processPayment} mode="contained">
              Pay Now
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
  vendor: {
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  amount: {
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueDateCard: {
    marginBottom: 16,
  },
  dueDateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dueDateInfo: {
    gap: 16,
  },
  dueDateRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  dueDateContent: {
    flex: 1,
    marginLeft: 16,
  },
  detailsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "600",
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
  categoryChip: {
    alignSelf: "flex-start",
    marginTop: 4,
  },
  divider: {
    marginVertical: 8,
  },
  historyCard: {
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  viewAllButton: {
    marginRight: -12,
  },
  historyItem: {
    paddingHorizontal: 0,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
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
  primaryActionButton: {
    flex: 1,
  },
  editInput: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
});
