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
  Switch,
  List,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useAppDispatch, useAppSelector } from "../store";

// Predefined bill categories
const BILL_CATEGORIES = [
  { id: "housing", label: "Housing & Rent", icon: "home" },
  { id: "utilities", label: "Utilities", icon: "flash-on" },
  { id: "insurance", label: "Insurance", icon: "security" },
  { id: "phone", label: "Phone & Internet", icon: "phone" },
  { id: "subscription", label: "Subscriptions", icon: "subscriptions" },
  { id: "credit_card", label: "Credit Card", icon: "credit-card" },
  { id: "loan", label: "Loans", icon: "account-balance" },
  { id: "other", label: "Other", icon: "receipt" },
];

const BILL_FREQUENCIES = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export function AddBillScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(
    (state) => state.bills || { loading: false }
  );

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    amount: "",
    frequency: "monthly" as "weekly" | "monthly" | "quarterly" | "yearly",
    dueDate: "",
    merchant: "",
    description: "",
    isRecurring: true,
    isAutoPay: false,
    reminderDays: "3",
  });

  const [errors, setErrors] = useState({
    name: "",
    category: "",
    amount: "",
    dueDate: "",
  });

  const validateForm = () => {
    const newErrors = { name: "", category: "", amount: "", dueDate: "" };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Bill name is required";
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

    // Due date validation
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
      isValid = false;
    } else {
      const dueDate = new Date(formData.dueDate);
      if (isNaN(dueDate.getTime())) {
        newErrors.dueDate = "Please enter a valid date";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    console.log("AddBill: Submit button pressed");
    console.log("AddBill: Form data:", formData);

    if (!validateForm()) {
      console.log("AddBill: Form validation failed");
      return;
    }

    try {
      const billData = {
        name: formData.name.trim(),
        category: formData.category,
        amount: parseFloat(formData.amount),
        frequency: formData.frequency,
        dueDate: formData.dueDate,
        merchant: formData.merchant.trim(),
        description: formData.description.trim(),
        isRecurring: formData.isRecurring,
        isAutoPay: formData.isAutoPay,
        reminderDays: parseInt(formData.reminderDays),
        status: "upcoming" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In a real app, you would dispatch an action to create the bill
      console.log("AddBill: Bill created successfully", billData);

      Alert.alert("Success", "Bill created successfully!", [
        {
          text: "Add Another",
          onPress: () => {
            // Reset form
            setFormData({
              name: "",
              category: "",
              amount: "",
              frequency: "monthly",
              dueDate: "",
              merchant: "",
              description: "",
              isRecurring: true,
              isAutoPay: false,
              reminderDays: "3",
            });
          },
        },
        {
          text: "View Bills",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error("AddBill: Error occurred:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to create bill. Please try again.",
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

  const getNextDueDate = (frequency: string) => {
    const today = new Date();
    switch (frequency) {
      case "weekly":
        today.setDate(today.getDate() + 7);
        break;
      case "monthly":
        today.setMonth(today.getMonth() + 1);
        break;
      case "quarterly":
        today.setMonth(today.getMonth() + 3);
        break;
      case "yearly":
        today.setFullYear(today.getFullYear() + 1);
        break;
    }
    return today.toISOString().split("T")[0];
  };

  const setNextDueDate = () => {
    const nextDate = getNextDueDate(formData.frequency);
    updateFormData("dueDate", nextDate);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Bill" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            Add New Bill
          </Text>

          {/* Bill Details */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Bill Details
              </Text>

              <TextInput
                label="Bill Name *"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                mode="outlined"
                error={!!errors.name}
                style={styles.input}
                placeholder="e.g., Electric Bill"
              />
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>

              <TextInput
                label="Merchant/Company"
                value={formData.merchant}
                onChangeText={(value) => updateFormData("merchant", value)}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., Pacific Gas & Electric"
              />

              <TextInput
                label="Description (Optional)"
                value={formData.description}
                onChangeText={(value) => updateFormData("description", value)}
                mode="outlined"
                multiline
                numberOfLines={2}
                style={styles.input}
                placeholder="Additional details about this bill..."
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
                {BILL_CATEGORIES.map((category) => (
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

          {/* Amount and Frequency */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Amount & Frequency
              </Text>

              <TextInput
                label="Amount *"
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

              <Text variant="bodyMedium" style={styles.fieldLabel}>
                Frequency *
              </Text>
              <SegmentedButtons
                value={formData.frequency}
                onValueChange={(value) => updateFormData("frequency", value)}
                buttons={BILL_FREQUENCIES}
                style={styles.segmentedButtons}
              />
            </Card.Content>
          </Card>

          {/* Due Date */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Due Date
              </Text>

              <View style={styles.dueDateContainer}>
                <TextInput
                  label="Due Date *"
                  value={formData.dueDate}
                  onChangeText={(value) => updateFormData("dueDate", value)}
                  mode="outlined"
                  placeholder="YYYY-MM-DD"
                  left={<TextInput.Icon icon="calendar" />}
                  error={!!errors.dueDate}
                  style={[styles.input, styles.dueDateInput]}
                />
                <Button
                  mode="outlined"
                  onPress={setNextDueDate}
                  style={styles.nextDateButton}
                  compact
                >
                  Next {formData.frequency}
                </Button>
              </View>
              <HelperText type="error" visible={!!errors.dueDate}>
                {errors.dueDate}
              </HelperText>
            </Card.Content>
          </Card>

          {/* Bill Settings */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Bill Settings
              </Text>

              <List.Item
                title="Recurring Bill"
                description="This bill repeats automatically"
                right={() => (
                  <Switch
                    value={formData.isRecurring}
                    onValueChange={(value) =>
                      updateFormData("isRecurring", value)
                    }
                  />
                )}
              />

              <List.Item
                title="Auto-Pay Enabled"
                description="Bill is automatically paid"
                right={() => (
                  <Switch
                    value={formData.isAutoPay}
                    onValueChange={(value) =>
                      updateFormData("isAutoPay", value)
                    }
                  />
                )}
              />

              <TextInput
                label="Reminder (days before due)"
                value={formData.reminderDays}
                onChangeText={(value) => updateFormData("reminderDays", value)}
                mode="outlined"
                keyboardType="numeric"
                right={<TextInput.Icon icon="bell" />}
                style={styles.input}
              />
              <HelperText type="info">
                Get reminded this many days before the bill is due
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
            icon="access-time"
          >
            Add Bill
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
  fieldLabel: {
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
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
  segmentedButtons: {
    marginBottom: 8,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  dueDateInput: {
    flex: 1,
  },
  nextDateButton: {
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
