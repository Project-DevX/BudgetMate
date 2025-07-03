import React, { useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import {
  Text,
  Card,
  Button,
  useTheme,
  Appbar,
  FAB,
  Chip,
  Divider,
  IconButton,
  Badge,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  dueDate: string;
  frequency: "weekly" | "monthly" | "quarterly" | "yearly";
  status: "upcoming" | "due_today" | "overdue" | "paid";
  isRecurring: boolean;
  merchant?: string;
  description?: string;
  lastPaid?: string;
  nextDue: string;
  isAutoPay: boolean;
}

export function BillsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "upcoming" | "overdue" | "paid"
  >("all");

  // Mock bills data - in a real app, this would come from Redux store
  const [bills] = useState<Bill[]>([
    {
      id: "1",
      name: "Rent",
      category: "housing",
      amount: 1200,
      dueDate: "2025-07-01",
      frequency: "monthly",
      status: "paid",
      isRecurring: true,
      merchant: "Property Management Co.",
      description: "Monthly rent payment",
      lastPaid: "2025-07-01",
      nextDue: "2025-08-01",
      isAutoPay: true,
    },
    {
      id: "2",
      name: "Electric Bill",
      category: "utilities",
      amount: 85.5,
      dueDate: "2025-07-15",
      frequency: "monthly",
      status: "upcoming",
      isRecurring: true,
      merchant: "City Electric Company",
      description: "Monthly electricity bill",
      lastPaid: "2025-06-15",
      nextDue: "2025-07-15",
      isAutoPay: false,
    },
    {
      id: "3",
      name: "Internet",
      category: "utilities",
      amount: 60,
      dueDate: "2025-07-20",
      frequency: "monthly",
      status: "upcoming",
      isRecurring: true,
      merchant: "FastNet ISP",
      description: "High-speed internet service",
      lastPaid: "2025-06-20",
      nextDue: "2025-07-20",
      isAutoPay: true,
    },
    {
      id: "4",
      name: "Car Insurance",
      category: "insurance",
      amount: 150,
      dueDate: "2025-07-05",
      frequency: "monthly",
      status: "overdue",
      isRecurring: true,
      merchant: "SafeDrive Insurance",
      description: "Auto insurance premium",
      lastPaid: "2025-06-05",
      nextDue: "2025-07-05",
      isAutoPay: false,
    },
    {
      id: "5",
      name: "Phone Bill",
      category: "utilities",
      amount: 45,
      dueDate: "2025-07-04",
      frequency: "monthly",
      status: "due_today",
      isRecurring: true,
      merchant: "Mobile Plus",
      description: "Monthly phone service",
      lastPaid: "2025-06-04",
      nextDue: "2025-07-04",
      isAutoPay: false,
    },
  ]);

  const filteredBills = bills.filter((bill) => {
    if (selectedFilter === "all") return true;
    return bill.status === selectedFilter;
  });

  const upcomingBills = bills.filter(
    (bill) => bill.status === "upcoming" || bill.status === "due_today"
  );
  const overdueBills = bills.filter((bill) => bill.status === "overdue");
  const totalUpcoming = upcomingBills.reduce(
    (sum, bill) => sum + bill.amount,
    0
  );

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, you would fetch fresh bills data here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getBillStatusColor = (status: Bill["status"]) => {
    switch (status) {
      case "overdue":
        return theme.colors.error;
      case "due_today":
        return "#FF9800";
      case "upcoming":
        return theme.colors.primary;
      case "paid":
        return "#4CAF50";
      default:
        return theme.colors.onSurface;
    }
  };

  const getBillStatusText = (status: Bill["status"]) => {
    switch (status) {
      case "overdue":
        return "Overdue";
      case "due_today":
        return "Due Today";
      case "upcoming":
        return "Upcoming";
      case "paid":
        return "Paid";
      default:
        return "Unknown";
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const getBillIcon = (category: string) => {
    const icons: Record<string, string> = {
      housing: "home",
      utilities: "flash-on",
      insurance: "security",
      phone: "phone",
      internet: "wifi",
      credit_card: "credit-card",
      loan: "account-balance",
      subscription: "subscriptions",
    };
    return icons[category] || "receipt";
  };

  const markAsPaid = (billId: string) => {
    console.log("Mark bill as paid:", billId);
    // In a real app, you would dispatch an action to update the bill status
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content
          title="Bills"
          subtitle="Track your recurring payments"
        />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterChips}>
            {(["all", "upcoming", "overdue", "paid"] as const).map((filter) => (
              <Chip
                key={filter}
                mode={selectedFilter === filter ? "flat" : "outlined"}
                onPress={() => setSelectedFilter(filter)}
                style={styles.filterChip}
              >
                {filter === "all" ? "All Bills" : getBillStatusText(filter)}
                {filter === "overdue" && overdueBills.length > 0 && (
                  <Badge style={styles.filterBadge}>
                    {overdueBills.length}
                  </Badge>
                )}
              </Chip>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Bills Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.summaryTitle}>
              Bills Summary
            </Text>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Upcoming Bills
                </Text>
                <Text
                  variant="headlineSmall"
                  style={{ color: theme.colors.primary }}
                >
                  {upcomingBills.length}
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Total Amount
                </Text>
                <Text
                  variant="headlineSmall"
                  style={{ color: theme.colors.error }}
                >
                  {formatCurrency(totalUpcoming)}
                </Text>
              </View>
            </View>

            {overdueBills.length > 0 && (
              <>
                <Divider style={styles.summaryDivider} />
                <View style={styles.overdueAlert}>
                  <MaterialIcons
                    name="warning"
                    size={20}
                    color={theme.colors.error}
                  />
                  <Text
                    variant="titleSmall"
                    style={{
                      color: theme.colors.error,
                      marginLeft: 8,
                      fontWeight: "600",
                    }}
                  >
                    {overdueBills.length} bill
                    {overdueBills.length > 1 ? "s" : ""} overdue
                  </Text>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Bills List */}
        <View style={styles.billsList}>
          {filteredBills.length > 0 ? (
            filteredBills.map((bill) => (
              <Card
                key={bill.id}
                style={[
                  styles.billCard,
                  bill.status === "overdue" && {
                    borderLeftWidth: 4,
                    borderLeftColor: theme.colors.error,
                  },
                ]}
                onPress={() => {
                  // navigation.navigate('BillDetail', { id: bill.id });
                  console.log("Bill tapped:", bill.id);
                }}
              >
                <Card.Content>
                  <View style={styles.billHeader}>
                    <View style={styles.billIconContainer}>
                      <MaterialIcons
                        name={getBillIcon(bill.category) as any}
                        size={24}
                        color={theme.colors.primary}
                      />
                    </View>

                    <View style={styles.billInfo}>
                      <Text variant="titleMedium" style={styles.billName}>
                        {bill.name}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        {bill.merchant && `${bill.merchant} • `}
                        {bill.frequency}
                        {bill.isAutoPay && " • Auto-pay"}
                      </Text>
                    </View>

                    <View style={styles.billAmount}>
                      <Text variant="titleMedium" style={styles.amountText}>
                        {formatCurrency(bill.amount)}
                      </Text>
                      <Chip
                        compact
                        style={[
                          styles.statusChip,
                          {
                            backgroundColor:
                              getBillStatusColor(bill.status) + "20",
                          },
                        ]}
                        textStyle={{ color: getBillStatusColor(bill.status) }}
                      >
                        {getBillStatusText(bill.status)}
                      </Chip>
                    </View>
                  </View>

                  <View style={styles.billDetails}>
                    <View style={styles.billDates}>
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        Due: {formatDate(bill.nextDue)}
                      </Text>
                      {bill.lastPaid && (
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          Last paid: {formatDate(bill.lastPaid)}
                        </Text>
                      )}
                    </View>

                    {(bill.status === "upcoming" ||
                      bill.status === "due_today" ||
                      bill.status === "overdue") && (
                      <View style={styles.billActions}>
                        <Button
                          mode="outlined"
                          compact
                          onPress={() => markAsPaid(bill.id)}
                          style={styles.payButton}
                        >
                          Mark as Paid
                        </Button>
                        {!bill.isAutoPay && (
                          <IconButton
                            icon="schedule"
                            mode="outlined"
                            size={20}
                            onPress={() =>
                              console.log("Set reminder for:", bill.id)
                            }
                          />
                        )}
                      </View>
                    )}
                  </View>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <MaterialIcons
                  name="receipt-long"
                  size={64}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text variant="headlineSmall" style={styles.emptyTitle}>
                  No bills found
                </Text>
                <Text variant="bodyMedium" style={styles.emptyDescription}>
                  {selectedFilter === "all"
                    ? "Add your first bill to start tracking payments."
                    : `No ${selectedFilter} bills at the moment.`}
                </Text>
                {selectedFilter === "all" && (
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate("AddBill" as never)}
                    style={styles.emptyButton}
                  >
                    Add Bill
                  </Button>
                )}
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
                onPress={() => navigation.navigate("AddBill" as never)}
                style={styles.actionButton}
              >
                Add Bill
              </Button>

              <Button
                mode="outlined"
                icon="schedule"
                onPress={() => console.log("Set up reminders")}
                style={styles.actionButton}
              >
                Set Reminders
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("AddBill" as never)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingVertical: 8,
  },
  filterChips: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  filterBadge: {
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  summaryTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryDivider: {
    marginVertical: 16,
  },
  overdueAlert: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  billsList: {
    gap: 12,
    marginBottom: 16,
  },
  billCard: {
    elevation: 1,
  },
  billHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  billIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
    marginRight: 12,
  },
  billName: {
    fontWeight: "600",
  },
  billAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusChip: {
    height: 24,
  },
  billDetails: {
    gap: 8,
  },
  billDates: {
    gap: 4,
  },
  billActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  payButton: {
    flex: 1,
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
