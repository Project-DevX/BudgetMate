import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  Card,
  Button,
  useTheme,
  Appbar,
  Avatar,
  TextInput,
  Divider,
  List,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppSelector, useAppDispatch } from "../store";

export function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    occupation: "Software Engineer",
    monthlyIncome: "5000",
    financialGoals: "Save for house down payment",
  });

  const [originalData] = useState(profileData);

  const handleSave = () => {
    // In a real app, you would dispatch an action to update the user profile
    console.log("Saving profile:", profileData);
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const updateField = (field: keyof typeof profileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? "$0" : `$${num.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profile" />
        {!isEditing ? (
          <Appbar.Action icon="edit" onPress={() => setIsEditing(true)} />
        ) : (
          <View style={styles.editActions}>
            <IconButton icon="close" onPress={handleCancel} />
            <IconButton icon="check" onPress={handleSave} />
          </View>
        )}
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <Avatar.Text
              size={80}
              label={getInitials(profileData.name)}
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            />

            {isEditing ? (
              <TextInput
                value={profileData.name}
                onChangeText={(value) => updateField("name", value)}
                mode="outlined"
                style={styles.nameInput}
              />
            ) : (
              <Text variant="headlineSmall" style={styles.name}>
                {profileData.name}
              </Text>
            )}

            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Member since January 2025
            </Text>

            <Button
              mode="outlined"
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Photo upload will be available in a future update."
                )
              }
              style={styles.photoButton}
              icon="camera"
            >
              Change Photo
            </Button>
          </Card.Content>
        </Card>

        {/* Personal Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Personal Information
            </Text>

            {isEditing ? (
              <View style={styles.editForm}>
                <TextInput
                  label="Full Name"
                  value={profileData.name}
                  onChangeText={(value) => updateField("name", value)}
                  mode="outlined"
                  style={styles.input}
                />

                <TextInput
                  label="Email"
                  value={profileData.email}
                  onChangeText={(value) => updateField("email", value)}
                  mode="outlined"
                  keyboardType="email-address"
                  style={styles.input}
                />

                <TextInput
                  label="Phone"
                  value={profileData.phone}
                  onChangeText={(value) => updateField("phone", value)}
                  mode="outlined"
                  keyboardType="phone-pad"
                  style={styles.input}
                />

                <TextInput
                  label="Date of Birth"
                  value={profileData.dateOfBirth}
                  onChangeText={(value) => updateField("dateOfBirth", value)}
                  mode="outlined"
                  placeholder="YYYY-MM-DD"
                  style={styles.input}
                />

                <TextInput
                  label="Occupation"
                  value={profileData.occupation}
                  onChangeText={(value) => updateField("occupation", value)}
                  mode="outlined"
                  style={styles.input}
                />
              </View>
            ) : (
              <View>
                <List.Item
                  title="Email"
                  description={profileData.email}
                  left={(props) => <List.Icon {...props} icon="email" />}
                />

                <Divider />

                <List.Item
                  title="Phone"
                  description={profileData.phone}
                  left={(props) => <List.Icon {...props} icon="phone" />}
                />

                <Divider />

                <List.Item
                  title="Date of Birth"
                  description={formatDate(profileData.dateOfBirth)}
                  left={(props) => <List.Icon {...props} icon="cake" />}
                />

                <Divider />

                <List.Item
                  title="Occupation"
                  description={profileData.occupation}
                  left={(props) => <List.Icon {...props} icon="briefcase" />}
                />
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Financial Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Financial Information
            </Text>

            {isEditing ? (
              <View style={styles.editForm}>
                <TextInput
                  label="Monthly Income"
                  value={profileData.monthlyIncome}
                  onChangeText={(value) => updateField("monthlyIncome", value)}
                  mode="outlined"
                  keyboardType="numeric"
                  left={<TextInput.Icon icon="currency-usd" />}
                  style={styles.input}
                />

                <TextInput
                  label="Financial Goals"
                  value={profileData.financialGoals}
                  onChangeText={(value) => updateField("financialGoals", value)}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  style={styles.input}
                />
              </View>
            ) : (
              <View>
                <List.Item
                  title="Monthly Income"
                  description={formatCurrency(profileData.monthlyIncome)}
                  left={(props) => <List.Icon {...props} icon="currency-usd" />}
                />

                <Divider />

                <List.Item
                  title="Financial Goals"
                  description={profileData.financialGoals}
                  left={(props) => <List.Icon {...props} icon="target" />}
                />
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Account Statistics */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Account Statistics
            </Text>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <MaterialIcons
                  name="receipt"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text variant="headlineSmall" style={styles.statNumber}>
                  127
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Transactions
                </Text>
              </View>

              <View style={styles.statItem}>
                <MaterialIcons
                  name="account-balance-wallet"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text variant="headlineSmall" style={styles.statNumber}>
                  8
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Budgets
                </Text>
              </View>

              <View style={styles.statItem}>
                <MaterialIcons
                  name="schedule"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text variant="headlineSmall" style={styles.statNumber}>
                  12
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Bills
                </Text>
              </View>

              <View style={styles.statItem}>
                <MaterialIcons
                  name="account-balance"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text variant="headlineSmall" style={styles.statNumber}>
                  4
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Accounts
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Achievements */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Achievements
            </Text>

            <View style={styles.achievementsList}>
              <View style={styles.achievement}>
                <MaterialIcons name="emoji-events" size={32} color="#FFD700" />
                <View style={styles.achievementText}>
                  <Text variant="titleSmall">Budget Master</Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Stayed within budget for 3 consecutive months
                  </Text>
                </View>
              </View>

              <Divider style={styles.achievementDivider} />

              <View style={styles.achievement}>
                <MaterialIcons name="savings" size={32} color="#4CAF50" />
                <View style={styles.achievementText}>
                  <Text variant="titleSmall">Super Saver</Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Saved $1,000 in a single month
                  </Text>
                </View>
              </View>

              <Divider style={styles.achievementDivider} />

              <View style={styles.achievement}>
                <MaterialIcons name="trending-up" size={32} color="#2196F3" />
                <View style={styles.achievementText}>
                  <Text variant="titleSmall">Expense Tracker</Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Logged 100 transactions
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Actions
            </Text>

            <List.Item
              title="Export Profile Data"
              description="Download your profile information"
              left={(props) => <List.Icon {...props} icon="download" />}
              onPress={() =>
                Alert.alert(
                  "Export Started",
                  "Your profile data export has been initiated."
                )
              }
            />

            <Divider />

            <List.Item
              title="Privacy Settings"
              description="Manage your data and privacy preferences"
              left={(props) => <List.Icon {...props} icon="shield-check" />}
              onPress={() => navigation.navigate("Settings" as never)}
            />

            <Divider />

            <List.Item
              title="Connected Services"
              description="Manage third-party integrations"
              left={(props) => <List.Icon {...props} icon="link" />}
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Connected services management will be available soon."
                )
              }
            />
          </Card.Content>
        </Card>
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
    padding: 16,
  },
  editActions: {
    flexDirection: "row",
  },
  headerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  headerContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  nameInput: {
    width: "80%",
    marginBottom: 8,
  },
  photoButton: {
    marginTop: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  editForm: {
    gap: 16,
  },
  input: {
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
    marginBottom: 16,
  },
  statNumber: {
    fontWeight: "bold",
    marginVertical: 8,
  },
  statLabel: {
    opacity: 0.7,
  },
  achievementsList: {
    gap: 16,
  },
  achievement: {
    flexDirection: "row",
    alignItems: "center",
  },
  achievementText: {
    marginLeft: 16,
    flex: 1,
  },
  achievementDivider: {
    marginVertical: 8,
  },
});
