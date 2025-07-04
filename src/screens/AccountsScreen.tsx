import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
  List,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "investment" | "loan";
  balance: number;
  currency: string;
  institution: string;
  accountNumber: string;
  isConnected: boolean;
  lastSync: string;
  status: "active" | "inactive" | "pending";
  color?: string;
}

export function AccountsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<"all" | Account["type"]>(
    "all"
  );

  // Mock accounts data - in a real app, this would come from Redux store
  const [accounts] = useState<Account[]>([
    {
      id: "1",
      name: "Main Checking",
      type: "checking",
      balance: 2450.75,
      currency: "USD",
      institution: "Chase Bank",
      accountNumber: "****1234",
      isConnected: true,
      lastSync: "2025-07-04T10:30:00Z",
      status: "active",
      color: "#1976D2",
    },
    {
      id: "2",
      name: "Emergency Savings",
      type: "savings",
      balance: 8750.0,
      currency: "USD",
      institution: "Wells Fargo",
      accountNumber: "****5678",
      isConnected: true,
      lastSync: "2025-07-04T10:30:00Z",
      status: "active",
      color: "#388E3C",
    },
    {
      id: "3",
      name: "Travel Credit Card",
      type: "credit",
      balance: -1245.3,
      currency: "USD",
      institution: "Capital One",
      accountNumber: "****9012",
      isConnected: true,
      lastSync: "2025-07-04T10:25:00Z",
      status: "active",
      color: "#D32F2F",
    },
    {
      id: "4",
      name: "Investment Portfolio",
      type: "investment",
      balance: 15420.85,
      currency: "USD",
      institution: "Fidelity",
      accountNumber: "****3456",
      isConnected: false,
      lastSync: "2025-07-03T15:20:00Z",
      status: "pending",
      color: "#7B1FA2",
    },
    {
      id: "5",
      name: "Car Loan",
      type: "loan",
      balance: -12500.0,
      currency: "USD",
      institution: "Auto Finance Corp",
      accountNumber: "****7890",
      isConnected: true,
      lastSync: "2025-07-04T09:15:00Z",
      status: "active",
      color: "#F57C00",
    },
  ]);

  const filteredAccounts = accounts.filter((account) => {
    if (selectedType === "all") return true;
    return account.type === selectedType;
  });

  const totalBalance = accounts.reduce((sum, account) => {
    if (account.type === "credit" || account.type === "loan") {
      return sum + account.balance; // These are negative, so it reduces total
    }
    return sum + account.balance;
  }, 0);

  const assetAccounts = accounts.filter(
    (acc) =>
      acc.type === "checking" ||
      acc.type === "savings" ||
      acc.type === "investment"
  );
  const totalAssets = assetAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const debtAccounts = accounts.filter(
    (acc) => acc.type === "credit" || acc.type === "loan"
  );
  const totalDebts = Math.abs(
    debtAccounts.reduce((sum, acc) => sum + acc.balance, 0)
  );

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, you would sync account data here
    setTimeout(() => setRefreshing(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    return `$${absAmount.toFixed(2)}`;
  };

  const getAccountIcon = (type: Account["type"]) => {
    const icons = {
      checking: "account-balance",
      savings: "savings",
      credit: "credit-card",
      investment: "trending-up",
      loan: "account-balance-wallet",
    };
    return icons[type];
  };

  const getAccountTypeLabel = (type: Account["type"]) => {
    const labels = {
      checking: "Checking",
      savings: "Savings",
      credit: "Credit Card",
      investment: "Investment",
      loan: "Loan",
    };
    return labels[type];
  };

  const getStatusColor = (status: Account["status"]) => {
    switch (status) {
      case "active":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "inactive":
        return "#9E9E9E";
      default:
        return theme.colors.onSurface;
    }
  };

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content
          title="Accounts"
          subtitle="Manage your financial accounts"
        />
        <Appbar.Action icon="sync" onPress={onRefresh} />
      </Appbar.Header>

      {/* Account Type Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterChips}>
            {(
              [
                "all",
                "checking",
                "savings",
                "credit",
                "investment",
                "loan",
              ] as const
            ).map((type) => (
              <Chip
                key={type}
                mode={selectedType === type ? "flat" : "outlined"}
                onPress={() => setSelectedType(type)}
                style={styles.filterChip}
              >
                {type === "all" ? "All Accounts" : getAccountTypeLabel(type)}
              </Chip>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.content}>
        {/* Financial Overview */}
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.overviewTitle}>
              Financial Overview
            </Text>

            <View style={styles.overviewGrid}>
              <View style={styles.overviewItem}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Total Assets
                </Text>
                <Text
                  variant="headlineSmall"
                  style={{ color: theme.colors.primary }}
                >
                  {formatCurrency(totalAssets)}
                </Text>
              </View>

              <View style={styles.overviewItem}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Total Debts
                </Text>
                <Text
                  variant="headlineSmall"
                  style={{ color: theme.colors.error }}
                >
                  {formatCurrency(totalDebts)}
                </Text>
              </View>
            </View>

            <Divider style={styles.overviewDivider} />

            <View style={styles.overviewItem}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Net Worth
              </Text>
              <Text
                variant="headlineMedium"
                style={{
                  color:
                    totalBalance >= 0
                      ? theme.colors.primary
                      : theme.colors.error,
                  fontWeight: "bold",
                }}
              >
                {totalBalance >= 0 ? "+" : ""}
                {formatCurrency(totalBalance)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Accounts List */}
        <View style={styles.accountsList}>
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((account) => (
              <Card
                key={account.id}
                style={[
                  styles.accountCard,
                  {
                    borderLeftWidth: 4,
                    borderLeftColor: account.color || theme.colors.primary,
                  },
                ]}
                onPress={() => {
                  // navigation.navigate('AccountDetail', { id: account.id });
                  console.log("Account tapped:", account.id);
                }}
              >
                <Card.Content>
                  <View style={styles.accountHeader}>
                    <View style={styles.accountIconContainer}>
                      <MaterialIcons
                        name={getAccountIcon(account.type) as any}
                        size={24}
                        color={account.color || theme.colors.primary}
                      />
                    </View>

                    <View style={styles.accountInfo}>
                      <Text variant="titleMedium" style={styles.accountName}>
                        {account.name}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        {account.institution} • {account.accountNumber}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        {getAccountTypeLabel(account.type)}
                      </Text>
                    </View>

                    <View style={styles.accountBalance}>
                      <Text
                        variant="titleLarge"
                        style={[
                          styles.balanceText,
                          {
                            color:
                              account.balance >= 0
                                ? theme.colors.primary
                                : theme.colors.error,
                          },
                        ]}
                      >
                        {account.balance >= 0 ? "+" : ""}
                        {formatCurrency(account.balance)}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        {account.currency}
                      </Text>
                    </View>
                  </View>

                  <Divider style={styles.accountDivider} />

                  <View style={styles.accountDetails}>
                    <View style={styles.accountStatus}>
                      <View style={styles.statusRow}>
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: getStatusColor(account.status) },
                          ]}
                        />
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          {account.status.charAt(0).toUpperCase() +
                            account.status.slice(1)}
                        </Text>
                      </View>

                      {account.isConnected ? (
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          Last sync: {formatLastSync(account.lastSync)}
                        </Text>
                      ) : (
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.error }}
                        >
                          Not connected
                        </Text>
                      )}
                    </View>

                    <View style={styles.accountActions}>
                      {!account.isConnected ? (
                        <Button
                          mode="outlined"
                          compact
                          onPress={() =>
                            console.log("Connect account:", account.id)
                          }
                          style={styles.actionButton}
                        >
                          Connect
                        </Button>
                      ) : (
                        <Button
                          mode="text"
                          compact
                          onPress={() =>
                            console.log("Sync account:", account.id)
                          }
                          style={styles.actionButton}
                        >
                          Sync Now
                        </Button>
                      )}

                      <IconButton
                        icon="more-vert"
                        size={20}
                        onPress={() =>
                          console.log("Account options:", account.id)
                        }
                      />
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <MaterialIcons
                  name="account-balance"
                  size={64}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text variant="headlineSmall" style={styles.emptyTitle}>
                  No accounts found
                </Text>
                <Text variant="bodyMedium" style={styles.emptyDescription}>
                  {selectedType === "all"
                    ? "Connect your first account to start tracking your finances."
                    : `No ${getAccountTypeLabel(
                        selectedType
                      ).toLowerCase()} accounts found.`}
                </Text>
                {selectedType === "all" && (
                  <Button
                    mode="contained"
                    onPress={() => console.log("Add account")}
                    style={styles.emptyButton}
                  >
                    Connect Account
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
              Account Management
            </Text>

            <List.Item
              title="Connect New Account"
              description="Link your bank, credit card, or investment account"
              left={(props) => <List.Icon {...props} icon="plus" />}
              onPress={() => console.log("Connect new account")}
            />

            <Divider />

            <List.Item
              title="Import Transactions"
              description="Upload bank statements or CSV files"
              left={(props) => <List.Icon {...props} icon="upload" />}
              onPress={() => navigation.navigate("StatementUpload" as never)}
            />

            <Divider />

            <List.Item
              title="Account Settings"
              description="Manage categories, sync frequency, and notifications"
              left={(props) => <List.Icon {...props} icon="settings" />}
              onPress={() => console.log("Account settings")}
            />
          </Card.Content>
        </Card>
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log("Connect new account")}
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
  accountsList: {
    gap: 12,
    marginBottom: 16,
  },
  accountCard: {
    elevation: 1,
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  accountIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
    marginRight: 12,
  },
  accountName: {
    fontWeight: "600",
    marginBottom: 4,
  },
  accountBalance: {
    alignItems: "flex-end",
  },
  balanceText: {
    fontWeight: "bold",
  },
  accountDivider: {
    marginVertical: 12,
  },
  accountDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountStatus: {
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  accountActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginRight: 4,
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 1,
  },
  actionsTitle: {
    marginBottom: 8,
    fontWeight: "600",
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
