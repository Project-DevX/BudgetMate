import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Share,
  Platform,
  ScrollView,
} from "react-native";
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
  ActivityIndicator,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";

import { useAppSelector, useAppDispatch } from "../store";
import { toggleTheme } from "../store/slices/themeSlice";
import { logoutUser } from "../store/slices/authSlice";
import {
  fetchUserSettings,
  updateUserSettings,
  updateNotificationSettings,
  updatePrivacySettings,
  updatePreferences,
  changePassword,
  deleteAccount,
  exportUserData,
  clearCache,
  clearError,
} from "../store/slices/settingsSlice";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  CurrencySelectionDialog,
  DateFormatSelectionDialog,
} from "../components/SettingsDialogs";

export function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { isDark, mode } = useAppSelector((state) => state.theme);
  const { settings, loading, updating, error } = useAppSelector(
    (state) => state.settings
  );

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [deletePasswordDialogVisible, setDeletePasswordDialogVisible] =
    useState(false);
  const [currencyDialogVisible, setCurrencyDialogVisible] = useState(false);
  const [dateFormatDialogVisible, setDateFormatDialogVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Load user settings on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserSettings(user.id));
    }
  }, [dispatch, user?.id]);

  // Check biometric availability
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
    } catch (error) {
      console.log("Biometric check failed:", error);
      setBiometricAvailable(false);
    }
  };

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

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    try {
      await dispatch(deleteAccount(deletePassword)).unwrap();
      setDeleteDialogVisible(false);
      setDeletePasswordDialogVisible(false);
      setDeletePassword("");
      Alert.alert(
        "Account Deleted",
        "Your account and all data have been permanently deleted."
      );
    } catch (error: any) {
      Alert.alert("Error", error || "Failed to delete account");
    }
  };

  const handleExportData = async () => {
    if (!user?.id) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      const result = await dispatch(exportUserData(user.id)).unwrap();
      setExportDialogVisible(false);

      // Create a downloadable file or share
      const dataString = JSON.stringify(result, null, 2);
      const shareOptions = {
        title: "BudgetMate Data Export",
        message: "Your financial data export",
        url: `data:application/json;base64,${btoa(dataString)}`,
      };

      if (Platform.OS === "web") {
        // For web, download as file
        const blob = new Blob([dataString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `budgetmate-export-${
          new Date().toISOString().split("T")[0]
        }.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // For mobile, share
        await Share.share(shareOptions);
      }

      Alert.alert(
        "Export Complete",
        "Your data has been exported successfully."
      );
    } catch (error: any) {
      Alert.alert("Error", error || "Failed to export data");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      setPasswordDialogVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Success", "Password changed successfully");
    } catch (error: any) {
      Alert.alert("Error", error || "Failed to change password");
    }
  };

  const handleClearCache = async () => {
    try {
      await dispatch(clearCache()).unwrap();
      Alert.alert(
        "Cache Cleared",
        "Application cache has been cleared successfully."
      );
    } catch (error: any) {
      Alert.alert("Error", error || "Failed to clear cache");
    }
  };

  const updateNotificationSetting = async (
    key: keyof typeof settings.notifications,
    value: boolean
  ) => {
    if (!user?.id) return;

    const updatedNotifications = { ...settings.notifications, [key]: value };
    dispatch(updateNotificationSettings(updatedNotifications));

    // Save to backend
    await dispatch(
      updateUserSettings({
        userId: user.id,
        settings: { notifications: updatedNotifications },
      })
    );
  };

  const updatePrivacySetting = async (
    key: keyof typeof settings.privacy,
    value: boolean
  ) => {
    if (!user?.id) return;

    // Special handling for biometric auth
    if (key === "biometricAuth" && value && biometricAvailable) {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Enable biometric authentication for BudgetMate",
          fallbackLabel: "Use password instead",
        });

        if (!result.success) {
          return; // User cancelled or failed authentication
        }
      } catch (error) {
        Alert.alert("Error", "Biometric authentication setup failed");
        return;
      }
    }

    const updatedPrivacy = { ...settings.privacy, [key]: value };
    dispatch(updatePrivacySettings(updatedPrivacy));

    // Save to backend
    await dispatch(
      updateUserSettings({
        userId: user.id,
        settings: { privacy: updatedPrivacy },
      })
    );
  };

  const handleCurrencyChange = async (currency: string) => {
    if (!user?.id) return;

    const updatedPreferences = { ...settings.preferences, currency };
    dispatch(updatePreferences(updatedPreferences));

    // Save to backend
    await dispatch(
      updateUserSettings({
        userId: user.id,
        settings: { preferences: updatedPreferences },
      })
    );
  };

  const handleDateFormatChange = async (dateFormat: string) => {
    if (!user?.id) return;

    const updatedPreferences = { ...settings.preferences, dateFormat };
    dispatch(updatePreferences(updatedPreferences));

    // Save to backend
    await dispatch(
      updateUserSettings({
        userId: user.id,
        settings: { preferences: updatedPreferences },
      })
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
        <ThemeToggle />
      </Appbar.Header>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 16, textAlign: "center" }}>
              Loading settings...
            </Text>
          </View>
        ) : (
          <>
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
                      icon={isDark ? "weather-sunny" : "weather-night"}
                    />
                  )}
                  right={() => (
                    <Switch value={isDark} onValueChange={handleThemeToggle} />
                  )}
                />

                <Divider />

                <List.Item
                  title="Currency"
                  description={settings.preferences.currency}
                  left={(props) => <List.Icon {...props} icon="currency-usd" />}
                  onPress={() => setCurrencyDialogVisible(true)}
                />

                <Divider />

                <List.Item
                  title="Date Format"
                  description={settings.preferences.dateFormat}
                  left={(props) => <List.Icon {...props} icon="calendar" />}
                  onPress={() => setDateFormatDialogVisible(true)}
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
                      value={settings.notifications.billReminders}
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
                      value={settings.notifications.budgetAlerts}
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
                      value={settings.notifications.transactionSync}
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
                      value={settings.notifications.weeklyReports}
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
                      value={settings.notifications.monthlyReports}
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
                      value={settings.privacy.biometricAuth}
                      onValueChange={(value) =>
                        updatePrivacySetting("biometricAuth", value)
                      }
                      disabled={!biometricAvailable}
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
                      value={settings.privacy.requirePasswordForTransactions}
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
                      value={settings.privacy.shareDataForInsights}
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
                      value={settings.privacy.autoSync}
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
                  onPress={handleClearCache}
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
                  left={(props) => (
                    <List.Icon {...props} icon="file-document" />
                  )}
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
                  onPress={() => setDeletePasswordDialogVisible(true)}
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
          </>
        )}
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
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              mode="outlined"
              style={styles.passwordInput}
            />
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
            <Button onPress={handlePasswordChange} loading={updating}>
              Change Password
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Delete Account Password Dialog */}
        <Dialog
          visible={deletePasswordDialogVisible}
          onDismiss={() => setDeletePasswordDialogVisible(false)}
        >
          <Dialog.Title>Confirm Account Deletion</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
              This action cannot be undone. All your data will be permanently
              deleted. Please enter your password to confirm:
            </Text>
            <TextInput
              label="Password"
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeletePasswordDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={handleDeleteAccount}
              textColor={theme.colors.error}
              loading={updating}
            >
              Delete Account
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Currency Selection Dialog */}
      <CurrencySelectionDialog
        visible={currencyDialogVisible}
        currentCurrency={settings.preferences.currency}
        onDismiss={() => setCurrencyDialogVisible(false)}
        onSelect={handleCurrencyChange}
      />

      {/* Date Format Selection Dialog */}
      <DateFormatSelectionDialog
        visible={dateFormatDialogVisible}
        currentFormat={settings.preferences.dateFormat}
        onDismiss={() => setDateFormatDialogVisible(false)}
        onSelect={handleDateFormatChange}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
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
