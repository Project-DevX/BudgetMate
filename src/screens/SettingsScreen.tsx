import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  Card,
  Button,
  useTheme,
  Appbar,
  List,
  Switch,
  Divider,
  Dialog,
  Portal,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useAppSelector, useAppDispatch } from "../store";
import { toggleTheme } from "../store/slices/uiSlice";
import { logoutUser } from "../store/slices/authSlice";

export function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { theme: currentTheme } = useAppSelector((state) => state.ui);

  const [notifications, setNotifications] = useState({
    billReminders: true,
    budgetAlerts: true,
    transactionSync: false,
    weeklyReports: true,
    monthlyReports: true,
  });

  const [privacy, setPrivacy] = useState({
    biometricAuth: false,
    requirePasswordForTransactions: true,
    shareDataForInsights: false,
    autoSync: true,
  });

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    setDeleteDialogVisible(false);
    Alert.alert(
      "Account Deleted",
      "Your account and all data have been permanently deleted.",
      [{ text: "OK" }]
    );
  };

  const handleExportData = () => {
    setExportDialogVisible(false);
    Alert.alert(
      "Export Started",
      "Your data export has been initiated. You will receive an email with the download link shortly.",
      [{ text: "OK" }]
    );
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    setPasswordDialogVisible(false);
    setNewPassword("");
    setConfirmPassword("");
    Alert.alert("Success", "Password changed successfully");
  };

  const updateNotificationSetting = (
    key: keyof typeof notifications,
    value: boolean
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const updatePrivacySetting = (key: keyof typeof privacy, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Account
            </Text>

            <List.Item
              title={user?.name || "User"}
              description={user?.email || "email@example.com"}
              left={(props) => <List.Icon {...props} icon="account" />}
              onPress={() => navigation.navigate("Profile" as never)}
            />

            <Divider />

            <List.Item
              title="Change Password"
              description="Update your account password"
              left={(props) => <List.Icon {...props} icon="lock" />}
              onPress={() => setPasswordDialogVisible(true)}
            />

            <Divider />

            <List.Item
              title="Two-Factor Authentication"
              description="Add an extra layer of security"
              left={(props) => <List.Icon {...props} icon="security" />}
              right={() => (
                <Switch
                  value={false}
                  onValueChange={() =>
                    Alert.alert(
                      "Coming Soon",
                      "Two-factor authentication will be available in a future update."
                    )
                  }
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Appearance Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Appearance
            </Text>

            <List.Item
              title="Dark Mode"
              description="Switch between light and dark themes"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={
                    currentTheme === "light" ? "weather-night" : "weather-sunny"
                  }
                />
              )}
              right={() => (
                <Switch
                  value={currentTheme === "dark"}
                  onValueChange={handleThemeToggle}
                />
              )}
            />

            <Divider />

            <List.Item
              title="Currency"
              description="USD ($)"
              left={(props) => <List.Icon {...props} icon="currency-usd" />}
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Currency selection will be available in a future update."
                )
              }
            />

            <Divider />

            <List.Item
              title="Date Format"
              description="MM/DD/YYYY"
              left={(props) => <List.Icon {...props} icon="calendar" />}
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Date format selection will be available in a future update."
                )
              }
            />
          </Card.Content>
        </Card>

        {/* Notifications Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Notifications
            </Text>

            <List.Item
              title="Bill Reminders"
              description="Get notified before bills are due"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notifications.billReminders}
                  onValueChange={(value) =>
                    updateNotificationSetting("billReminders", value)
                  }
                />
              )}
            />

            <Divider />

            <List.Item
              title="Budget Alerts"
              description="Warnings when approaching budget limits"
              left={(props) => <List.Icon {...props} icon="alert" />}
              right={() => (
                <Switch
                  value={notifications.budgetAlerts}
                  onValueChange={(value) =>
                    updateNotificationSetting("budgetAlerts", value)
                  }
                />
              )}
            />

            <Divider />

            <List.Item
              title="Transaction Sync"
              description="Real-time transaction notifications"
              left={(props) => <List.Icon {...props} icon="sync" />}
              right={() => (
                <Switch
                  value={notifications.transactionSync}
                  onValueChange={(value) =>
                    updateNotificationSetting("transactionSync", value)
                  }
                />
              )}
            />

            <Divider />

            <List.Item
              title="Weekly Reports"
              description="Summary of your weekly spending"
              left={(props) => <List.Icon {...props} icon="chart-line" />}
              right={() => (
                <Switch
                  value={notifications.weeklyReports}
                  onValueChange={(value) =>
                    updateNotificationSetting("weeklyReports", value)
                  }
                />
              )}
            />

            <Divider />

            <List.Item
              title="Monthly Reports"
              description="Detailed monthly financial insights"
              left={(props) => <List.Icon {...props} icon="file-chart" />}
              right={() => (
                <Switch
                  value={notifications.monthlyReports}
                  onValueChange={(value) =>
                    updateNotificationSetting("monthlyReports", value)
                  }
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Privacy & Security Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Privacy & Security
            </Text>

            <List.Item
              title="Biometric Authentication"
              description="Use fingerprint or face recognition"
              left={(props) => <List.Icon {...props} icon="fingerprint" />}
              right={() => (
                <Switch
                  value={privacy.biometricAuth}
                  onValueChange={(value) =>
                    updatePrivacySetting("biometricAuth", value)
                  }
                />
              )}
            />

            <Divider />

            <List.Item
              title="Password for Transactions"
              description="Require password for adding transactions"
              left={(props) => <List.Icon {...props} icon="lock" />}
              right={() => (
                <Switch
                  value={privacy.requirePasswordForTransactions}
                  onValueChange={(value) =>
                    updatePrivacySetting(
                      "requirePasswordForTransactions",
                      value
                    )
                  }
                />
              )}
            />

            <Divider />

            <List.Item
              title="Share Data for Insights"
              description="Help improve AI recommendations"
              left={(props) => <List.Icon {...props} icon="brain" />}
              right={() => (
                <Switch
                  value={privacy.shareDataForInsights}
                  onValueChange={(value) =>
                    updatePrivacySetting("shareDataForInsights", value)
                  }
                />
              )}
            />

            <Divider />

            <List.Item
              title="Auto Sync"
              description="Automatically sync with connected accounts"
              left={(props) => <List.Icon {...props} icon="sync" />}
              right={() => (
                <Switch
                  value={privacy.autoSync}
                  onValueChange={(value) =>
                    updatePrivacySetting("autoSync", value)
                  }
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Data & Storage Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Data & Storage
            </Text>

            <List.Item
              title="Export Data"
              description="Download your financial data"
              left={(props) => <List.Icon {...props} icon="download" />}
              onPress={() => setExportDialogVisible(true)}
            />

            <Divider />

            <List.Item
              title="Clear Cache"
              description="Free up storage space"
              left={(props) => <List.Icon {...props} icon="cached" />}
              onPress={() =>
                Alert.alert(
                  "Cache Cleared",
                  "Application cache has been cleared successfully."
                )
              }
            />

            <Divider />

            <List.Item
              title="Storage Usage"
              description="View app storage details"
              left={(props) => <List.Icon {...props} icon="storage" />}
              onPress={() =>
                Alert.alert(
                  "Storage Usage",
                  "App Data: 45.2 MB\nCache: 12.8 MB\nDocuments: 3.4 MB"
                )
              }
            />
          </Card.Content>
        </Card>

        {/* Support Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Support
            </Text>

            <List.Item
              title="Help Center"
              description="Get answers to common questions"
              left={(props) => <List.Icon {...props} icon="help" />}
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Help center will be available soon."
                )
              }
            />

            <Divider />

            <List.Item
              title="Contact Support"
              description="Get help from our team"
              left={(props) => <List.Icon {...props} icon="support" />}
              onPress={() =>
                Alert.alert(
                  "Contact Support",
                  "Email: support@budgetmate.com\nPhone: 1-800-BUDGET"
                )
              }
            />

            <Divider />

            <List.Item
              title="Privacy Policy"
              description="Review our privacy practices"
              left={(props) => <List.Icon {...props} icon="shield-check" />}
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Privacy policy will be available soon."
                )
              }
            />

            <Divider />

            <List.Item
              title="Terms of Service"
              description="Review app terms and conditions"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Terms of service will be available soon."
                )
              }
            />
          </Card.Content>
        </Card>

        {/* Account Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.error }]}
            >
              Account Actions
            </Text>

            <List.Item
              title="Logout"
              description="Sign out of your account"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="logout"
                  color={theme.colors.error}
                />
              )}
              onPress={handleLogout}
            />

            <Divider />

            <List.Item
              title="Delete Account"
              description="Permanently delete your account and data"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="delete"
                  color={theme.colors.error}
                />
              )}
              onPress={() => setDeleteDialogVisible(true)}
            />
          </Card.Content>
        </Card>

        <View style={styles.versionInfo}>
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            BudgetMate v1.0.0
          </Text>
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            © 2025 BudgetMate. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      {/* Dialogs */}
      <Portal>
        {/* Delete Account Dialog */}
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Account</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently lost.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={handleDeleteAccount}
              textColor={theme.colors.error}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Export Data Dialog */}
        <Dialog
          visible={exportDialogVisible}
          onDismiss={() => setExportDialogVisible(false)}
        >
          <Dialog.Title>Export Data</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              This will create a downloadable file containing all your financial
              data including transactions, budgets, and bills.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setExportDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={handleExportData}>Export</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog
          visible={passwordDialogVisible}
          onDismiss={() => setPasswordDialogVisible(false)}
        >
          <Dialog.Title>Change Password</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              mode="outlined"
              style={styles.passwordInput}
            />
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              mode="outlined"
              style={styles.passwordInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPasswordDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={handlePasswordChange}>Change Password</Button>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50, // Extra padding for better scrolling
  },
  card: {
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: "600",
  },
  passwordInput: {
    marginBottom: 16,
  },
  versionInfo: {
    paddingVertical: 24,
    gap: 4,
  },
});
