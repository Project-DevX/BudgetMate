import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import {
  Text,
  Card,
  Button,
  useTheme,
  Appbar,
  Chip,
  ProgressBar,
  Divider,
  List,
  Surface,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppSelector, useAppDispatch } from "../store";

interface SpendingInsight {
  id: string;
  title: string;
  description: string;
  type: "warning" | "tip" | "achievement" | "suggestion";
  category?: string;
  amount?: number;
  percentage?: number;
  actionable: boolean;
  priority: "high" | "medium" | "low";
}

interface SpendingPattern {
  category: string;
  amount: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  trendPercentage: number;
}

export function AIInsightsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { transactions } = useAppSelector((state) => state.transactions);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "week" | "month" | "quarter"
  >("month");

  // Calculate insights based on transaction data
  const generateInsights = (): SpendingInsight[] => {
    const insights: SpendingInsight[] = [];

    // Calculate total spending by category
    const categorySpending = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const totalSpending = Object.values(categorySpending).reduce(
      (sum, amount) => sum + amount,
      0
    );

    // High spending category insight
    const highestCategory = Object.entries(categorySpending).sort(
      ([, a], [, b]) => b - a
    )[0];

    if (highestCategory && totalSpending > 0) {
      const percentage = (highestCategory[1] / totalSpending) * 100;
      insights.push({
        id: "highest-category",
        title: `${highestCategory[0]} is your top expense`,
        description: `You've spent $${highestCategory[1].toFixed(
          2
        )} (${percentage.toFixed(1)}%) on ${highestCategory[0]} this month.`,
        type: "tip",
        category: highestCategory[0],
        amount: highestCategory[1],
        percentage,
        actionable: true,
        priority: "high",
      });
    }

    // Frequent small transactions
    const smallTransactions = transactions.filter(
      (t) => t.amount < 10 && t.type === "expense"
    );
    if (smallTransactions.length > 10) {
      const totalSmall = smallTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );
      insights.push({
        id: "small-transactions",
        title: "Many small purchases detected",
        description: `You made ${
          smallTransactions.length
        } purchases under $10, totaling $${totalSmall.toFixed(
          2
        )}. Consider tracking these micro-expenses.`,
        type: "suggestion",
        amount: totalSmall,
        actionable: true,
        priority: "medium",
      });
    }

    // Income vs Expenses
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalSpending) / totalIncome) * 100 : 0;

    if (savingsRate > 20) {
      insights.push({
        id: "good-savings",
        title: "Excellent savings rate!",
        description: `You're saving ${savingsRate.toFixed(
          1
        )}% of your income. Keep up the great work!`,
        type: "achievement",
        percentage: savingsRate,
        actionable: false,
        priority: "low",
      });
    } else if (savingsRate < 10 && totalIncome > 0) {
      insights.push({
        id: "low-savings",
        title: "Consider boosting your savings",
        description: `Your savings rate is ${savingsRate.toFixed(
          1
        )}%. Try to aim for at least 20% of your income.`,
        type: "warning",
        percentage: savingsRate,
        actionable: true,
        priority: "high",
      });
    }

    // Weekly spending pattern
    const thisWeekTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return transactionDate >= weekAgo && t.type === "expense";
    });

    const thisWeekSpending = thisWeekTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const dailyAverage = thisWeekSpending / 7;

    if (dailyAverage > 50) {
      insights.push({
        id: "high-daily-spending",
        title: "High daily spending this week",
        description: `You're averaging $${dailyAverage.toFixed(
          2
        )} per day. Consider setting daily spending limits.`,
        type: "suggestion",
        amount: dailyAverage,
        actionable: true,
        priority: "medium",
      });
    }

    return insights;
  };

  const generateSpendingPatterns = (): SpendingPattern[] => {
    const categorySpending = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const totalSpending = Object.values(categorySpending).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
        trend: Math.random() > 0.5 ? "up" : ("down" as "up" | "down"), // Random for demo
        trendPercentage: Math.random() * 20 + 5,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  };

  const insights = generateInsights();
  const spendingPatterns = generateSpendingPatterns();

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, you would regenerate insights or fetch fresh data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getInsightIcon = (type: SpendingInsight["type"]) => {
    switch (type) {
      case "warning":
        return "warning";
      case "tip":
        return "lightbulb";
      case "achievement":
        return "emoji-events";
      case "suggestion":
        return "tips-and-updates";
      default:
        return "info";
    }
  };

  const getInsightColor = (type: SpendingInsight["type"]) => {
    switch (type) {
      case "warning":
        return theme.colors.error;
      case "tip":
        return theme.colors.primary;
      case "achievement":
        return "#4CAF50";
      case "suggestion":
        return theme.colors.secondary;
      default:
        return theme.colors.onSurface;
    }
  };

  const getPriorityColor = (priority: SpendingInsight["priority"]) => {
    switch (priority) {
      case "high":
        return theme.colors.error;
      case "medium":
        return "#FF9800";
      case "low":
        return theme.colors.primary;
      default:
        return theme.colors.onSurface;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="AI Insights"
          subtitle="Powered by intelligent analysis"
        />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Timeframe Selection */}
        <View style={styles.timeframeContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Analysis Period
          </Text>
          <View style={styles.timeframeChips}>
            {(["week", "month", "quarter"] as const).map((timeframe) => (
              <Chip
                key={timeframe}
                mode={selectedTimeframe === timeframe ? "flat" : "outlined"}
                onPress={() => setSelectedTimeframe(timeframe)}
                style={styles.timeframeChip}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </Chip>
            ))}
          </View>
        </View>

        {/* Key Insights */}
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Key Insights
          </Text>

          {insights.length > 0 ? (
            insights.map((insight) => (
              <Card key={insight.id} style={[styles.insightCard, styles.card]}>
                <Card.Content>
                  <View style={styles.insightHeader}>
                    <MaterialIcons
                      name={getInsightIcon(insight.type) as any}
                      size={24}
                      color={getInsightColor(insight.type)}
                    />
                    <View style={styles.insightTitleContainer}>
                      <Text variant="titleMedium" style={styles.insightTitle}>
                        {insight.title}
                      </Text>
                      <Chip
                        compact
                        style={[
                          styles.priorityChip,
                          {
                            backgroundColor:
                              getPriorityColor(insight.priority) + "20",
                          },
                        ]}
                        textStyle={{
                          color: getPriorityColor(insight.priority),
                        }}
                      >
                        {insight.priority} priority
                      </Chip>
                    </View>
                  </View>

                  <Text variant="bodyMedium" style={styles.insightDescription}>
                    {insight.description}
                  </Text>

                  {insight.actionable && (
                    <Button
                      mode="text"
                      onPress={() => {
                        // Handle insight action
                        console.log("Action for insight:", insight.id);
                      }}
                      style={styles.insightAction}
                    >
                      Take Action
                    </Button>
                  )}
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card style={styles.card}>
              <Card.Content style={styles.emptyContent}>
                <MaterialIcons
                  name="insights"
                  size={64}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  Building insights...
                </Text>
                <Text variant="bodyMedium" style={styles.emptyDescription}>
                  Add more transactions to get personalized insights and
                  recommendations.
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Spending Patterns */}
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Spending Patterns
          </Text>

          {spendingPatterns.length > 0 ? (
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Category Breakdown
                </Text>

                {spendingPatterns.map((pattern, index) => (
                  <View key={pattern.category}>
                    <View style={styles.patternRow}>
                      <View style={styles.patternInfo}>
                        <Text
                          variant="titleSmall"
                          style={styles.patternCategory}
                        >
                          {pattern.category}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          ${pattern.amount.toFixed(2)} •{" "}
                          {pattern.percentage.toFixed(1)}%
                        </Text>
                      </View>

                      <View style={styles.patternTrend}>
                        <MaterialIcons
                          name={
                            pattern.trend === "up"
                              ? "trending-up"
                              : "trending-down"
                          }
                          size={16}
                          color={
                            pattern.trend === "up"
                              ? theme.colors.error
                              : theme.colors.primary
                          }
                        />
                        <Text
                          variant="bodySmall"
                          style={{
                            color:
                              pattern.trend === "up"
                                ? theme.colors.error
                                : theme.colors.primary,
                            marginLeft: 4,
                          }}
                        >
                          {pattern.trendPercentage.toFixed(1)}%
                        </Text>
                      </View>
                    </View>

                    <ProgressBar
                      progress={pattern.percentage / 100}
                      style={styles.progressBar}
                      color={theme.colors.primary}
                    />

                    {index < spendingPatterns.length - 1 && (
                      <Divider style={styles.patternDivider} />
                    )}
                  </View>
                ))}
              </Card.Content>
            </Card>
          ) : (
            <Card style={styles.card}>
              <Card.Content style={styles.emptyContent}>
                <MaterialIcons
                  name="donut-large"
                  size={64}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  No patterns detected
                </Text>
                <Text variant="bodyMedium" style={styles.emptyDescription}>
                  Add transactions to see your spending patterns and trends.
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Smart Recommendations */}
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Smart Recommendations
          </Text>

          <Card style={styles.card}>
            <Card.Content>
              <List.Item
                title="Set up budget alerts"
                description="Get notified when you're close to your spending limits"
                left={(props) => (
                  <List.Icon {...props} icon="notification-important" />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => console.log("Navigate to budget alerts")}
              />

              <Divider />

              <List.Item
                title="Connect bank account"
                description="Automatically categorize transactions and get better insights"
                left={(props) => (
                  <List.Icon {...props} icon="account-balance" />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => console.log("Navigate to bank connection")}
              />

              <Divider />

              <List.Item
                title="Create savings goals"
                description="Set targets and track your progress"
                left={(props) => <List.Icon {...props} icon="savings" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => console.log("Navigate to savings goals")}
              />
            </Card.Content>
          </Card>
        </View>

        {/* AI Assistant */}
        <View style={[styles.section, styles.lastSection]}>
          <Surface style={styles.aiAssistantCard} elevation={3}>
            <View style={styles.aiHeader}>
              <MaterialIcons
                name="smart-toy"
                size={32}
                color={theme.colors.primary}
              />
              <Text variant="titleLarge" style={styles.aiTitle}>
                AI Financial Assistant
              </Text>
            </View>

            <Text variant="bodyMedium" style={styles.aiDescription}>
              Get personalized financial advice, spending optimization tips, and
              budget recommendations powered by AI.
            </Text>

            <Button
              mode="contained"
              onPress={() => console.log("Chat with AI assistant")}
              style={styles.aiButton}
              icon="chat"
            >
              Chat with Assistant
            </Button>
          </Surface>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  timeframeContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  timeframeChips: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  timeframeChip: {
    flex: 1,
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  lastSection: {
    paddingBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    marginBottom: 16,
  },
  insightCard: {
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  insightTitleContainer: {
    flex: 1,
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  insightTitle: {
    flex: 1,
    fontWeight: "600",
  },
  priorityChip: {
    marginLeft: 8,
  },
  insightDescription: {
    marginBottom: 8,
    opacity: 0.8,
  },
  insightAction: {
    alignSelf: "flex-start",
    marginTop: 4,
  },
  patternRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  patternInfo: {
    flex: 1,
  },
  patternCategory: {
    fontWeight: "600",
    textTransform: "capitalize",
  },
  patternTrend: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  patternDivider: {
    marginVertical: 16,
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
    opacity: 0.7,
  },
  aiAssistantCard: {
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  aiTitle: {
    marginLeft: 12,
    fontWeight: "bold",
  },
  aiDescription: {
    marginBottom: 20,
    lineHeight: 22,
    opacity: 0.8,
  },
  aiButton: {
    alignSelf: "flex-start",
  },
});
