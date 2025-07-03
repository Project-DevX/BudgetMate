import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import {
  Text,
  Card,
  Button,
  useTheme,
  Appbar,
  FAB,
  Searchbar,
  Chip,
  Divider,
  IconButton,
  Menu,
  SegmentedButtons,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppSelector, useAppDispatch } from "../store";
import { Transaction } from "../types";
import { setFilters, clearFilters } from "../store/slices/transactionSlice";

export function TransactionsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { transactions, loading, filters } = useAppSelector(
    (state) => state.transactions
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "summary">("list");
  const [refreshing, setRefreshing] = useState(false);

  // Filter and search transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.merchant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(transaction.category);

    return matchesSearch && matchesCategory;
  });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce(
    (groups, transaction) => {
      const date = new Date(transaction.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {} as Record<string, Transaction[]>
  );

  // Calculate summary data
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalIncome - totalExpenses;

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, you would fetch fresh data here
    // await dispatch(fetchTransactions());
    setRefreshing(false);
  };

  const handleCategoryFilter = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    dispatch(setFilters({ categories: newCategories }));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    setSearchQuery("");
  };

  const formatAmount = (amount: number, type: "income" | "expense") => {
    const sign = type === "income" ? "+" : "-";
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const getTransactionIcon = (category: string) => {
    const icons: Record<string, string> = {
      food: "restaurant",
      transport: "directions-car",
      shopping: "shopping-bag",
      bills: "receipt",
      entertainment: "movie",
      health: "favorite",
      education: "school",
      travel: "flight",
      salary: "work",
      freelance: "laptop",
      investment: "trending-up",
      gift: "card-giftcard",
    };
    return icons[category] || "attach-money";
  };

  // Get unique categories for filtering
  const allCategories = Array.from(
    new Set(transactions.map((t) => t.category))
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Transactions" />
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="sort"
              onPress={() => setSortMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            title="Date (Newest)"
            onPress={() => setSortMenuVisible(false)}
          />
          <Menu.Item
            title="Date (Oldest)"
            onPress={() => setSortMenuVisible(false)}
          />
          <Menu.Item
            title="Amount (High to Low)"
            onPress={() => setSortMenuVisible(false)}
          />
          <Menu.Item
            title="Amount (Low to High)"
            onPress={() => setSortMenuVisible(false)}
          />
        </Menu>
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="filter-alt"
              onPress={() => setFilterMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            title="Clear All Filters"
            onPress={() => {
              clearAllFilters();
              setFilterMenuVisible(false);
            }}
          />
        </Menu>
      </Appbar.Header>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search transactions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewModeContainer}>
        <SegmentedButtons
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "list" | "summary")}
          buttons={[
            { value: "list", label: "List", icon: "format-list-bulleted" },
            { value: "summary", label: "Summary", icon: "donut-large" },
          ]}
        />
      </View>

      {/* Category Filters */}
      {allCategories.length > 0 && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterChips}>
              {allCategories.map((category) => (
                <Chip
                  key={category}
                  mode={
                    filters.categories.includes(category) ? "flat" : "outlined"
                  }
                  onPress={() => handleCategoryFilter(category)}
                  style={styles.filterChip}
                >
                  {category}
                </Chip>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {viewMode === "summary" ? (
        /* Summary View */
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.summaryContainer}>
            <Card style={styles.summaryCard}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.summaryTitle}>
                  Financial Summary
                </Text>

                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      Total Income
                    </Text>
                    <Text
                      variant="headlineSmall"
                      style={{ color: theme.colors.primary }}
                    >
                      +${totalIncome.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.summaryItem}>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      Total Expenses
                    </Text>
                    <Text
                      variant="headlineSmall"
                      style={{ color: theme.colors.error }}
                    >
                      -${totalExpenses.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <Divider style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Net Amount
                  </Text>
                  <Text
                    variant="headlineMedium"
                    style={{
                      color:
                        netAmount >= 0
                          ? theme.colors.primary
                          : theme.colors.error,
                      fontWeight: "bold",
                    }}
                  >
                    {netAmount >= 0 ? "+" : ""}${netAmount.toFixed(2)}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.summaryCard}>
              <Card.Content>
                <Text variant="titleMedium">Transaction Count</Text>
                <Text variant="bodyLarge" style={{ marginTop: 8 }}>
                  {filteredTransactions.length} transactions
                </Text>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      ) : (
        /* List View */
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {Object.keys(groupedTransactions).length > 0 ? (
            Object.entries(groupedTransactions)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, dayTransactions]) => (
                <View key={date} style={styles.dayGroup}>
                  <Text variant="titleMedium" style={styles.dayHeader}>
                    {formatDate(date)}
                  </Text>

                  {dayTransactions.map((transaction) => (
                    <Card
                      key={transaction.id}
                      style={styles.transactionCard}
                      onPress={() => {
                        // navigation.navigate('TransactionDetail', { id: transaction.id });
                        console.log("Transaction tapped:", transaction.id);
                      }}
                    >
                      <Card.Content>
                        <View style={styles.transactionRow}>
                          <View style={styles.transactionIcon}>
                            <MaterialIcons
                              name={
                                getTransactionIcon(transaction.category) as any
                              }
                              size={24}
                              color={theme.colors.primary}
                            />
                          </View>

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
                              {transaction.category}
                              {transaction.merchant &&
                                ` • ${transaction.merchant}`}
                            </Text>
                            {transaction.tags &&
                              transaction.tags.length > 0 && (
                                <View style={styles.tagsContainer}>
                                  {transaction.tags.map((tag, index) => (
                                    <Chip
                                      key={index}
                                      compact
                                      style={styles.tag}
                                    >
                                      {tag}
                                    </Chip>
                                  ))}
                                </View>
                              )}
                          </View>

                          <View style={styles.transactionAmount}>
                            <Text
                              variant="titleMedium"
                              style={[
                                styles.amountText,
                                {
                                  color:
                                    transaction.type === "income"
                                      ? theme.colors.primary
                                      : theme.colors.error,
                                },
                              ]}
                            >
                              {formatAmount(
                                transaction.amount,
                                transaction.type
                              )}
                            </Text>
                          </View>
                        </View>
                      </Card.Content>
                    </Card>
                  ))}
                </View>
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
                  No transactions found
                </Text>
                <Text variant="bodyMedium" style={styles.emptyDescription}>
                  {searchQuery || filters.categories.length > 0
                    ? "Try adjusting your search or filters"
                    : "Start by adding your first transaction"}
                </Text>
                {!searchQuery && filters.categories.length === 0 && (
                  <Button
                    mode="contained"
                    onPress={() =>
                      navigation.navigate("AddTransaction" as never)
                    }
                    style={styles.emptyButton}
                  >
                    Add Transaction
                  </Button>
                )}
              </Card.Content>
            </Card>
          )}
        </ScrollView>
      )}

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
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    elevation: 0,
  },
  viewModeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filtersContainer: {
    paddingBottom: 8,
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
  },
  summaryContainer: {
    gap: 16,
  },
  summaryCard: {
    elevation: 2,
  },
  summaryTitle: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryDivider: {
    marginVertical: 16,
  },
  dayGroup: {
    marginBottom: 24,
  },
  dayHeader: {
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: "600",
  },
  transactionCard: {
    marginBottom: 8,
    elevation: 1,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionDescription: {
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 4,
  },
  tag: {
    height: 24,
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontWeight: "bold",
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
