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
  Surface,
  IconButton,
  Divider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../store";
import {
  createTransaction,
  addTransaction,
} from "../store/slices/transactionSlice";

// Predefined categories for expenses and income
const EXPENSE_CATEGORIES = [
  { id: "food", label: "Food & Dining", icon: "food" },
  { id: "transport", label: "Transportation", icon: "car" },
  { id: "shopping", label: "Shopping", icon: "shopping" },
  { id: "bills", label: "Bills & Utilities", icon: "receipt" },
  { id: "entertainment", label: "Entertainment", icon: "movie" },
  { id: "health", label: "Health & Fitness", icon: "heart" },
  { id: "education", label: "Education", icon: "school" },
  { id: "travel", label: "Travel", icon: "airplane" },
  { id: "other", label: "Other", icon: "dots-horizontal" },
];

const INCOME_CATEGORIES = [
  { id: "salary", label: "Salary", icon: "cash" },
  { id: "freelance", label: "Freelance", icon: "laptop" },
  { id: "investment", label: "Investment", icon: "trending-up" },
  { id: "gift", label: "Gift", icon: "gift" },
  { id: "refund", label: "Refund", icon: "cash-refund" },
  { id: "other_income", label: "Other Income", icon: "cash-plus" },
];

const QUICK_AMOUNTS = [10, 25, 50, 100, 200, 500];

export function AddTransactionScreen({ navigation }: any) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.transactions);
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    merchant: "",
    date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
    type: "expense" as "income" | "expense",
    tags: [] as string[],
    isRecurring: false,
  });

  const [errors, setErrors] = useState({
    amount: "",
    description: "",
    category: "",
  });

  const [newTag, setNewTag] = useState("");

  const validateForm = () => {
    const newErrors = { amount: "", description: "", category: "" };
    let isValid = true;

    // Amount validation
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
      isValid = false;
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    console.log("AddTransaction: Submit button pressed");
    console.log("AddTransaction: Form data:", formData);

    if (!validateForm()) {
      console.log("AddTransaction: Form validation failed");
      return;
    }

    if (!user) {
      console.log("AddTransaction: No user found");
      Alert.alert("Error", "You must be logged in to add transactions");
      return;
    }

    console.log("AddTransaction: Creating transaction...");

    try {
      const transactionData = {
        accountId: "default", // You might want to let users select an account
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        category: formData.category,
        subcategory: undefined,
        merchant: formData.merchant.trim() || undefined,
        date: formData.date,
        type: formData.type,
        tags: formData.tags,
        isRecurring: formData.isRecurring,
        recurringId: undefined,
        confidence: 1.0, // Manual entry has high confidence
        source: "manual" as const,
      };

      // For now, let's use the regular action until the API is ready
      const newTransaction = {
        id: Date.now().toString(), // Simple ID generation
        userId: user.id,
        ...transactionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addTransaction(newTransaction));
      console.log("AddTransaction: Transaction dispatched successfully");

      // Uncomment this when the API is ready:
      // await dispatch(createTransaction(transactionData)).unwrap();

      Alert.alert("Success", "Transaction added successfully!", [
        {
          text: "Add Another",
          onPress: () => {
            // Reset form
            setFormData({
              amount: "",
              description: "",
              category: "",
              merchant: "",
              date: new Date().toISOString().split("T")[0],
              type: "expense",
              tags: [],
              isRecurring: false,
            });
          },
        },
        {
          text: "View Transactions",
          onPress: () => navigation.navigate("Transactions"),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error || "Failed to add transaction. Please try again.",
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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const setQuickAmount = (amount: number) => {
    updateFormData("amount", amount.toString());
  };

  const categories =
    formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            Add Transaction
          </Text>

          {/* Transaction Type */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Transaction Type
              </Text>
              <SegmentedButtons
                value={formData.type}
                onValueChange={(value) => updateFormData("type", value)}
                buttons={[
                  {
                    value: "expense",
                    label: "Expense",
                    icon: "minus-circle",
                  },
                  {
                    value: "income",
                    label: "Income",
                    icon: "plus-circle",
                  },
                ]}
                style={styles.segmentedButtons}
              />
            </Card.Content>
          </Card>

          {/* Amount */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Amount
              </Text>

              {/* Quick Amount Buttons */}
              <View style={styles.quickAmountContainer}>
                {QUICK_AMOUNTS.map((amount) => (
                  <Chip
                    key={amount}
                    mode={
                      formData.amount === amount.toString()
                        ? "flat"
                        : "outlined"
                    }
                    onPress={() => setQuickAmount(amount)}
                    style={styles.quickAmountChip}
                  >
                    ${amount}
                  </Chip>
                ))}
              </View>

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

          {/* Description & Merchant */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Details
              </Text>

              <TextInput
                label="Description *"
                value={formData.description}
                onChangeText={(value) => updateFormData("description", value)}
                mode="outlined"
                error={!!errors.description}
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.description}>
                {errors.description}
              </HelperText>

              <TextInput
                label="Merchant (Optional)"
                value={formData.merchant}
                onChangeText={(value) => updateFormData("merchant", value)}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Date"
                value={formData.date}
                onChangeText={(value) => updateFormData("date", value)}
                mode="outlined"
                left={<TextInput.Icon icon="calendar" />}
                style={styles.input}
              />
            </Card.Content>
          </Card>

          {/* Category */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Category *
              </Text>

              <View style={styles.categoryContainer}>
                {categories.map((category) => (
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

          {/* Tags */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Tags (Optional)
              </Text>

              <View style={styles.tagInputContainer}>
                <TextInput
                  label="Add Tag"
                  value={newTag}
                  onChangeText={setNewTag}
                  mode="outlined"
                  style={[styles.input, styles.tagInput]}
                  onSubmitEditing={addTag}
                />
                <IconButton
                  icon="plus"
                  mode="contained"
                  onPress={addTag}
                  disabled={!newTag.trim()}
                />
              </View>

              {formData.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      onClose={() => removeTag(tag)}
                      style={styles.tag}
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>
              )}
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
            icon={formData.type === "expense" ? "minus-circle" : "plus-circle"}
          >
            Add {formData.type === "expense" ? "Expense" : "Income"}
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
  quickAmountContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  quickAmountChip: {
    marginRight: 8,
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
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  tagInput: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});
