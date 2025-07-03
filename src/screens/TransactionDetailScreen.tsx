import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Share } from "react-native";
import {
  Text,
  Card,
  Chip,
  IconButton,
  useTheme,
  Divider,
  Button,
  Surface,
  Menu,
  Portal,
  Dialog,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";

type TransactionDetailRouteProp = RouteProp<
  RootStackParamList,
  "TransactionDetail"
>;

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  description?: string;
  account: string;
  location?: string;
  tags?: string[];
  receipt?: boolean;
  recurring?: boolean;
  notes?: string;
}

export function TransactionDetailScreen() {
  const theme = useTheme();
  const route = useRoute<TransactionDetailRouteProp>();
  const navigation = useNavigation();

  // Mock transaction data - in real app this would come from Redux/API
  const [transaction] = useState<Transaction>({
    id: route.params?.transactionId || "1",
    title: "Grocery Shopping",
    amount: -85.42,
    type: "expense",
    category: "Food & Dining",
    date: "2024-01-15T10:30:00Z",
    description: "Weekly grocery shopping at Whole Foods",
    account: "Chase Checking",
    location: "Whole Foods Market, Downtown",
    tags: ["groceries", "weekly"],
    receipt: true,
    recurring: false,
    notes: "Used coupon for $10 off. Got organic vegetables.",
  });

  const [menuVisible, setMenuVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState(transaction);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount);
    return `$${absAmount.toFixed(2)}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Transaction: ${transaction.title}\nAmount: ${formatAmount(
          transaction.amount
        )}\nDate: ${formatDate(transaction.date)}\nCategory: ${
          transaction.category
        }`,
        title: "Transaction Details",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share transaction");
    }
  };

  const handleEdit = () => {
    setEditDialogVisible(true);
    setMenuVisible(false);
  };

  const handleDelete = () => {
    setDeleteDialogVisible(true);
    setMenuVisible(false);
  };

  const confirmDelete = () => {
    // In real app, this would delete from Redux/API
    Alert.alert("Success", "Transaction deleted", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
    setDeleteDialogVisible(false);
  };

  const saveEdit = () => {
    // In real app, this would update Redux/API
    Alert.alert("Success", "Transaction updated");
    setEditDialogVisible(false);
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    const getIcon = () => {
      switch (category.toLowerCase()) {
        case "food & dining":
          return "restaurant";
        case "transportation":
          return "directions-car";
        case "shopping":
          return "shopping-bag";
        case "entertainment":
          return "movie";
        case "health":
          return "local-hospital";
        case "income":
          return "attach-money";
        default:
          return "category";
      }
    };

    return (
      <MaterialIcons
        name={getIcon() as any}
        size={24}
        color={theme.colors.primary}
      />
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <Card
          style={[
            styles.headerCard,
            {
              backgroundColor:
                transaction.type === "income"
                  ? theme.colors.primaryContainer
                  : theme.colors.errorContainer,
            },
          ]}
        >
          <Card.Content style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.iconContainer}>
                <CategoryIcon category={transaction.category} />
              </View>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="more-vert"
                    size={24}
                    onPress={() => setMenuVisible(true)}
                    iconColor={theme.colors.primary}
                  />
                }
              >
                <Menu.Item
                  onPress={handleEdit}
                  title="Edit"
                  leadingIcon="edit"
                />
                <Menu.Item
                  onPress={handleShare}
                  title="Share"
                  leadingIcon="share"
                />
                <Menu.Item
                  onPress={handleDelete}
                  title="Delete"
                  leadingIcon="delete"
                />
              </Menu>
            </View>

            <Text
              variant="headlineSmall"
              style={[styles.title, { color: theme.colors.onPrimaryContainer }]}
            >
              {transaction.title}
            </Text>

            <Text
              variant="displaySmall"
              style={[
                styles.amount,
                {
                  color:
                    transaction.type === "income"
                      ? theme.colors.primary
                      : theme.colors.error,
                },
              ]}
            >
              {transaction.type === "income" ? "+" : ""}
              {formatAmount(transaction.amount)}
            </Text>

            <View style={styles.headerDetails}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onPrimaryContainer }}
              >
                {formatDate(transaction.date)} • {formatTime(transaction.date)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Details Section */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              Transaction Details
            </Text>

            <View style={styles.detailRow}>
              <MaterialIcons
                name="category"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.detailContent}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Category
                </Text>
                <Chip mode="outlined" style={styles.categoryChip}>
                  {transaction.category}
                </Chip>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.detailRow}>
              <MaterialIcons
                name="account-balance"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.detailContent}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Account
                </Text>
                <Text variant="bodyMedium">{transaction.account}</Text>
              </View>
            </View>

            {transaction.location && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="location-on"
                    size={20}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <View style={styles.detailContent}>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      Location
                    </Text>
                    <Text variant="bodyMedium">{transaction.location}</Text>
                  </View>
                </View>
              </>
            )}

            {transaction.description && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.detailRow}>
                  <MaterialIcons
                    name="description"
                    size={20}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <View style={styles.detailContent}>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      Description
                    </Text>
                    <Text variant="bodyMedium">{transaction.description}</Text>
                  </View>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Additional Info */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              Additional Information
            </Text>

            {transaction.tags && transaction.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.tagsLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Tags
                </Text>
                <View style={styles.tagsRow}>
                  {transaction.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      mode="outlined"
                      compact
                      style={styles.tag}
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <MaterialIcons
                  name={transaction.receipt ? "receipt" : "receipt"}
                  size={20}
                  color={
                    transaction.receipt
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant
                  }
                />
                <Text
                  variant="bodySmall"
                  style={{
                    color: transaction.receipt
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant,
                    marginLeft: 8,
                  }}
                >
                  {transaction.receipt ? "Receipt Available" : "No Receipt"}
                </Text>
              </View>

              <View style={styles.statusItem}>
                <MaterialIcons
                  name={transaction.recurring ? "repeat" : "repeat"}
                  size={20}
                  color={
                    transaction.recurring
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant
                  }
                />
                <Text
                  variant="bodySmall"
                  style={{
                    color: transaction.recurring
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant,
                    marginLeft: 8,
                  }}
                >
                  {transaction.recurring ? "Recurring" : "One-time"}
                </Text>
              </View>
            </View>

            {transaction.notes && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.notesContainer}>
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.notesLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Notes
                  </Text>
                  <Surface style={styles.notesSurface} elevation={1}>
                    <Text variant="bodyMedium">{transaction.notes}</Text>
                  </Surface>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              Quick Actions
            </Text>

            <View style={styles.actionsRow}>
              <Button
                mode="outlined"
                style={styles.actionButton}
                onPress={handleEdit}
                icon="edit"
              >
                Edit
              </Button>
              <Button
                mode="outlined"
                style={styles.actionButton}
                onPress={() => {
                  /* Navigate to add similar transaction */
                }}
                icon="content-copy"
              >
                Duplicate
              </Button>
              <Button
                mode="outlined"
                style={styles.actionButton}
                onPress={handleShare}
                icon="share"
              >
                Share
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Edit Dialog */}
      <Portal>
        <Dialog
          visible={editDialogVisible}
          onDismiss={() => setEditDialogVisible(false)}
        >
          <Dialog.Title>Edit Transaction</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={editedTransaction.title}
              onChangeText={(text) =>
                setEditedTransaction((prev) => ({ ...prev, title: text }))
              }
              style={styles.editInput}
            />
            <TextInput
              label="Amount"
              value={Math.abs(editedTransaction.amount).toString()}
              onChangeText={(text) => {
                const amount = parseFloat(text) || 0;
                setEditedTransaction((prev) => ({
                  ...prev,
                  amount: prev.type === "expense" ? -amount : amount,
                }));
              }}
              keyboardType="numeric"
              style={styles.editInput}
            />
            <TextInput
              label="Description"
              value={editedTransaction.description || ""}
              onChangeText={(text) =>
                setEditedTransaction((prev) => ({ ...prev, description: text }))
              }
              style={styles.editInput}
              multiline
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={saveEdit}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Transaction</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={confirmDelete} textColor={theme.colors.error}>
              Delete
            </Button>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  headerContent: {
    paddingVertical: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 8,
  },
  amount: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerDetails: {
    marginTop: 8,
  },
  detailsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  detailContent: {
    flex: 1,
    marginLeft: 16,
  },
  categoryChip: {
    alignSelf: "flex-start",
    marginTop: 4,
  },
  divider: {
    marginVertical: 8,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsLabel: {
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  notesContainer: {
    marginTop: 16,
  },
  notesLabel: {
    marginBottom: 8,
  },
  notesSurface: {
    padding: 12,
    borderRadius: 8,
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  editInput: {
    marginBottom: 16,
  },
});
