import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Card,
  HelperText,
  SegmentedButtons,
  Chip,
  Appbar,
  Divider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useAppDispatch, useAppSelector } from "../store";

// Predefined budget categories
const BUDGET_CATEGORIES = [
  { id: "food", label: "Food & Dining", icon: "food" },
  { id: "transport", label: "Transportation", icon: "car" },
  { id: "shopping", label: "Shopping", icon: "shopping" },
  { id: "bills", label: "Bills & Utilities", icon: "receipt" },
  { id: "entertainment", label: "Entertainment", icon: "movie" },
  { id: "health", label: "Health & Fitness", icon: "heart" },
  { id: "education", label: "Education", icon: "school" },
  { id: "travel", label: "Travel", icon: "airplane" },
  { id: "savings", label: "Savings", icon: "piggy-bank" },
  { id: "other", label: "Other", icon: "dots-horizontal" },
];

const BUDGET_PERIODS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export function AddBudgetScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(
    (state) => state.budgets || { loading: false }
  );

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    amount: "",
    period: "monthly" as "weekly" | "monthly" | "quarterly" | "yearly",
    description: "",
    alertThreshold: "80", // Percentage
    isActive: true,
  });

  const [errors, setErrors] = useState({
    name: "",
    category: "",
    amount: "",
  });

  const validateForm = () => {
    const newErrors = { name: "", category: "", amount: "" };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Budget name is required";
      isValid = false;
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }

    // Amount validation
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    console.log("AddBudget: Submit button pressed");
    console.log("AddBudget: Form data:", formData);

    if (!validateForm()) {
      console.log("AddBudget: Form validation failed");
      return;
    }

    try {
      const budgetData = {
        name: formData.name.trim(),
        category: formData.category,
        amount: parseFloat(formData.amount),
        period: formData.period,
        description: formData.description.trim(),
        alertThreshold: parseFloat(formData.alertThreshold),
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In a real app, you would dispatch an action to create the budget
      console.log("AddBudget: Budget created successfully", budgetData);

      Alert.alert("Success", "Budget created successfully!", [
        {
          text: "Create Another",
          onPress: () => {
            // Reset form
            setFormData({
              name: "",
              category: "",
              amount: "",
              period: "monthly",
              description: "",
              alertThreshold: "80",
              isActive: true,
            });
          },
        },
        {
          text: "View Budgets",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error("AddBudget: Error occurred:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to create budget. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getSuggestedAmount = () => {
    const categoryAmounts: Record<string, number> = {
      food: 400,
      transport: 200,
      shopping: 150,
      bills: 300,
      entertainment: 100,
      health: 100,
      education: 50,
      travel: 200,
      savings: 500,
      other: 100,
    };

    return categoryAmounts[formData.category] || 100;
  };

  const setPredefinedAmount = (multiplier: number = 1) => {
    const suggested = getSuggestedAmount() * multiplier;
    updateFormData("amount", suggested.toString());
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Create Budget" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            Create New Budget
          </Text>

          {/* Budget Name */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Budget Details
              </Text>

              <TextInput
                label="Budget Name *"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                mode="outlined"
                error={!!errors.name}
                style={styles.input}
                placeholder="e.g., Monthly Groceries"
              />
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>

              <TextInput
                label="Description (Optional)"
                value={formData.description}
                onChangeText={(value) => updateFormData("description", value)}
                mode="outlined"
                multiline
                numberOfLines={2}
                style={styles.input}
                placeholder="Additional details about this budget..."
              />
            </Card.Content>
          </Card>

          {/* Budget Period */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Budget Period
              </Text>
              <SegmentedButtons
                value={formData.period}
                onValueChange={(value) => updateFormData("period", value)}
                buttons={BUDGET_PERIODS}
                style={styles.segmentedButtons}
              />
            </Card.Content>
          </Card>

          {/* Category Selection */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Category *
              </Text>

              <View style={styles.categoryContainer}>
                {BUDGET_CATEGORIES.map((category) => (
                  <Chip
                    key={category.id}
                    mode={
                      formData.category === category.id ? "flat" : "outlined"
                    }
                    onPress={() => updateFormData("category", category.id)}
                    icon={category.icon}
                    style={styles.categoryChip}
                  >
                    {category.label}
                  </Chip>
                ))}
              </View>

              <HelperText type="error" visible={!!errors.category}>
                {errors.category}
              </HelperText>
            </Card.Content>
          </Card>

          {/* Budget Amount */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Budget Amount *
              </Text>

              {formData.category && (
                <View style={styles.suggestedAmounts}>
                  <Text
                    variant="bodySmall"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      marginBottom: 8,
                    }}
                  >
                    Suggested amounts:
                  </Text>
                  <View style={styles.amountChips}>
                    <Chip
                      mode="outlined"
                      onPress={() => setPredefinedAmount(0.5)}
                      style={styles.amountChip}
                    >
                      ${(getSuggestedAmount() * 0.5).toFixed(0)}
                    </Chip>
                    <Chip
                      mode="outlined"
                      onPress={() => setPredefinedAmount(1)}
                      style={styles.amountChip}
                    >
                      ${getSuggestedAmount().toFixed(0)}
                    </Chip>
                    <Chip
                      mode="outlined"
                      onPress={() => setPredefinedAmount(1.5)}
                      style={styles.amountChip}
                    >
                      ${(getSuggestedAmount() * 1.5).toFixed(0)}
                    </Chip>
                  </View>
                </View>
              )}

              <TextInput
                label="Amount"
                value={formData.amount}
                onChangeText={(value) => updateFormData("amount", value)}
                mode="outlined"
                keyboardType="decimal-pad"
                left={<TextInput.Icon icon="currency-usd" />}
                error={!!errors.amount}
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.amount}>
                {errors.amount}
              </HelperText>
            </Card.Content>
          </Card>

          {/* Alert Settings */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Alert Settings
              </Text>

              <TextInput
                label="Alert Threshold (%)"
                value={formData.alertThreshold}
                onChangeText={(value) =>
                  updateFormData("alertThreshold", value)
                }
                mode="outlined"
                keyboardType="numeric"
                right={<TextInput.Icon icon="percent" />}
                style={styles.input}
              />
              <HelperText type="info">
                Get notified when you've spent this percentage of your budget
              </HelperText>
            </Card.Content>
          </Card>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            icon="wallet"
          >
            Create Budget
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  input: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  suggestedAmounts: {
    marginBottom: 16,
  },
  amountChips: {
    flexDirection: "row",
    gap: 8,
  },
  amountChip: {
    flex: 1,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});
