import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, FlatList } from "react-native";
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
  List,
  FAB,
  Searchbar,
  SegmentedButtons,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  parentId?: string;
  subcategories?: Category[];
  transactionCount: number;
  totalAmount: number;
  isDefault: boolean;
}

export function CategoryManagementScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  // Mock categories data - in real app this would come from Redux/API
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Food & Dining",
      type: "expense",
      icon: "restaurant",
      color: "#FF5722",
      transactionCount: 45,
      totalAmount: 1234.56,
      isDefault: true,
      subcategories: [
        {
          id: "1-1",
          name: "Groceries",
          type: "expense",
          icon: "shopping-cart",
          color: "#FF5722",
          parentId: "1",
          transactionCount: 25,
          totalAmount: 890.34,
          isDefault: true,
        },
        {
          id: "1-2",
          name: "Restaurants",
          type: "expense",
          icon: "restaurant",
          color: "#FF5722",
          parentId: "1",
          transactionCount: 15,
          totalAmount: 234.56,
          isDefault: true,
        },
        {
          id: "1-3",
          name: "Fast Food",
          type: "expense",
          icon: "fastfood",
          color: "#FF5722",
          parentId: "1",
          transactionCount: 5,
          totalAmount: 109.66,
          isDefault: true,
        },
      ],
    },
    {
      id: "2",
      name: "Transportation",
      type: "expense",
      icon: "directions-car",
      color: "#2196F3",
      transactionCount: 32,
      totalAmount: 567.89,
      isDefault: true,
      subcategories: [
        {
          id: "2-1",
          name: "Gas",
          type: "expense",
          icon: "local-gas-station",
          color: "#2196F3",
          parentId: "2",
          transactionCount: 20,
          totalAmount: 345.67,
          isDefault: true,
        },
        {
          id: "2-2",
          name: "Public Transit",
          type: "expense",
          icon: "train",
          color: "#2196F3",
          parentId: "2",
          transactionCount: 12,
          totalAmount: 222.22,
          isDefault: true,
        },
      ],
    },
    {
      id: "3",
      name: "Shopping",
      type: "expense",
      icon: "shopping-bag",
      color: "#9C27B0",
      transactionCount: 28,
      totalAmount: 890.12,
      isDefault: false,
    },
    {
      id: "4",
      name: "Salary",
      type: "income",
      icon: "attach-money",
      color: "#4CAF50",
      transactionCount: 2,
      totalAmount: 6500.0,
      isDefault: true,
    },
    {
      id: "5",
      name: "Freelance",
      type: "income",
      icon: "work",
      color: "#4CAF50",
      transactionCount: 5,
      totalAmount: 1250.0,
      isDefault: false,
    },
    {
      id: "6",
      name: "Entertainment",
      type: "expense",
      icon: "movie",
      color: "#FF9800",
      transactionCount: 15,
      totalAmount: 345.67,
      isDefault: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Dialog states
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Form states
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    icon: "category",
    color: "#2196F3",
    parentId: "",
  });

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || category.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = () => {
    // In real app, this would add to Redux/API
    const id = Date.now().toString();
    const category: Category = {
      id,
      ...newCategory,
      transactionCount: 0,
      totalAmount: 0,
      isDefault: false,
    };

    if (newCategory.parentId) {
      // Add as subcategory
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === newCategory.parentId) {
            return {
              ...cat,
              subcategories: [...(cat.subcategories || []), category],
            };
          }
          return cat;
        })
      );
    } else {
      // Add as main category
      setCategories((prev) => [...prev, category]);
    }

    setNewCategory({
      name: "",
      type: "expense",
      icon: "category",
      color: "#2196F3",
      parentId: "",
    });
    setAddDialogVisible(false);
    Alert.alert("Success", "Category added successfully");
  };

  const handleEditCategory = () => {
    if (!selectedCategory) return;

    // In real app, this would update Redux/API
    Alert.alert("Success", "Category updated successfully");
    setEditDialogVisible(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;

    if (selectedCategory.isDefault) {
      Alert.alert("Error", "Default categories cannot be deleted");
      return;
    }

    if (selectedCategory.transactionCount > 0) {
      Alert.alert(
        "Warning",
        "This category has transactions. Are you sure you want to delete it?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: confirmDelete },
        ]
      );
    } else {
      confirmDelete();
    }
  };

  const confirmDelete = () => {
    if (!selectedCategory) return;

    // In real app, this would delete from Redux/API
    setCategories((prev) =>
      prev.filter((cat) => cat.id !== selectedCategory.id)
    );
    Alert.alert("Success", "Category deleted successfully");
    setDeleteDialogVisible(false);
    setSelectedCategory(null);
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogVisible(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogVisible(true);
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const CategoryItem = ({
    category,
    isSubcategory = false,
  }: {
    category: Category;
    isSubcategory?: boolean;
  }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
      <View
        style={[styles.categoryItem, isSubcategory && styles.subcategoryItem]}
      >
        <List.Item
          title={category.name}
          description={`${
            category.transactionCount
          } transactions • ${formatAmount(category.totalAmount)}`}
          left={(props) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: category.color },
              ]}
            >
              <MaterialIcons
                name={category.icon as any}
                size={24}
                color="white"
              />
            </View>
          )}
          right={() => (
            <View style={styles.categoryActions}>
              <Chip mode="outlined" compact>
                {category.type}
              </Chip>
              {category.isDefault && (
                <Chip mode="outlined" compact style={{ marginLeft: 4 }}>
                  Default
                </Chip>
              )}
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="more-vert"
                    size={20}
                    onPress={() => setMenuVisible(true)}
                  />
                }
              >
                <Menu.Item
                  onPress={() => {
                    openEditDialog(category);
                    setMenuVisible(false);
                  }}
                  title="Edit"
                  leadingIcon="edit"
                />
                <Menu.Item
                  onPress={() => {
                    setMenuVisible(false);
                  }}
                  title="Add Subcategory"
                  leadingIcon="add"
                />
                {!category.isDefault && (
                  <Menu.Item
                    onPress={() => {
                      openDeleteDialog(category);
                      setMenuVisible(false);
                    }}
                    title="Delete"
                    leadingIcon="delete"
                  />
                )}
              </Menu>
            </View>
          )}
          onPress={() => {
            if (category.subcategories && category.subcategories.length > 0) {
              toggleCategory(category.id);
            }
          }}
        />

        {/* Subcategories */}
        {category.subcategories &&
          expandedCategories.has(category.id) &&
          category.subcategories.map((subcategory) => (
            <CategoryItem
              key={subcategory.id}
              category={subcategory}
              isSubcategory={true}
            />
          ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Search categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchbar}
        />

        <SegmentedButtons
          value={filterType}
          onValueChange={(value) =>
            setFilterType(value as "all" | "income" | "expense")
          }
          buttons={[
            { value: "all", label: "All" },
            { value: "income", label: "Income" },
            { value: "expense", label: "Expense" },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Summary Card */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[styles.summaryTitle, { color: theme.colors.primary }]}
          >
            Category Overview
          </Text>

          <View style={styles.summaryGrid}>
            <Surface style={styles.summaryItem} elevation={1}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Total Categories
              </Text>
              <Text
                variant="titleLarge"
                style={{ color: theme.colors.primary }}
              >
                {categories.length}
              </Text>
            </Surface>

            <Surface style={styles.summaryItem} elevation={1}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Income Categories
              </Text>
              <Text
                variant="titleLarge"
                style={{ color: theme.colors.primary }}
              >
                {categories.filter((c) => c.type === "income").length}
              </Text>
            </Surface>

            <Surface style={styles.summaryItem} elevation={1}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Expense Categories
              </Text>
              <Text
                variant="titleLarge"
                style={{ color: theme.colors.primary }}
              >
                {categories.filter((c) => c.type === "expense").length}
              </Text>
            </Surface>
          </View>
        </Card.Content>
      </Card>

      {/* Categories List */}
      <ScrollView
        style={styles.categoriesList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCategories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}

        {filteredCategories.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="category"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}
            >
              No Categories Found
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Add your first category to get started"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Category FAB */}
      <FAB
        icon="add"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setAddDialogVisible(true)}
        label="Add Category"
      />

      {/* Add Category Dialog */}
      <Portal>
        <Dialog
          visible={addDialogVisible}
          onDismiss={() => setAddDialogVisible(false)}
        >
          <Dialog.Title>Add New Category</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category Name"
              value={newCategory.name}
              onChangeText={(text) =>
                setNewCategory((prev) => ({ ...prev, name: text }))
              }
              style={styles.dialogInput}
            />

            <SegmentedButtons
              value={newCategory.type}
              onValueChange={(value) =>
                setNewCategory((prev) => ({
                  ...prev,
                  type: value as "income" | "expense",
                }))
              }
              buttons={[
                { value: "income", label: "Income" },
                { value: "expense", label: "Expense" },
              ]}
              style={styles.typeSelector}
            />

            <TextInput
              label="Icon Name (Material Icons)"
              value={newCategory.icon}
              onChangeText={(text) =>
                setNewCategory((prev) => ({ ...prev, icon: text }))
              }
              style={styles.dialogInput}
              placeholder="e.g., restaurant, car, home"
            />

            <View style={styles.colorRow}>
              <Text variant="bodyMedium">Color:</Text>
              <View style={styles.colorPicker}>
                {[
                  "#FF5722",
                  "#2196F3",
                  "#4CAF50",
                  "#FF9800",
                  "#9C27B0",
                  "#795548",
                ].map((color) => (
                  <IconButton
                    key={color}
                    icon="circle"
                    size={24}
                    iconColor={color}
                    selected={newCategory.color === color}
                    onPress={() =>
                      setNewCategory((prev) => ({ ...prev, color }))
                    }
                    style={[
                      styles.colorButton,
                      newCategory.color === color && styles.selectedColorButton,
                    ]}
                  />
                ))}
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAddDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={handleAddCategory}
              disabled={!newCategory.name.trim()}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog
          visible={editDialogVisible}
          onDismiss={() => setEditDialogVisible(false)}
        >
          <Dialog.Title>Edit Category</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
              Edit category details for "{selectedCategory?.name}"
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Note: Editing categories will affect all associated transactions.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleEditCategory}>Save Changes</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Delete Category Dialog */}
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Category</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete "{selectedCategory?.name}"?
            </Text>
            {selectedCategory?.transactionCount &&
              selectedCategory.transactionCount > 0 && (
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.error, marginTop: 8 }}
                >
                  This category has {selectedCategory.transactionCount}{" "}
                  transactions that will need to be recategorized.
                </Text>
              )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={handleDeleteCategory}
              textColor={theme.colors.error}
            >
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
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  summaryCard: {
    margin: 16,
    marginTop: 8,
  },
  summaryTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  categoriesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 50, // Extra padding for better scrolling
  },
  categoryItem: {
    marginBottom: 8,
  },
  subcategoryItem: {
    marginLeft: 32,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: "#E0E0E0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  categoryActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialogInput: {
    marginBottom: 16,
  },
  typeSelector: {
    marginBottom: 16,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  colorPicker: {
    flexDirection: "row",
    marginLeft: 16,
    gap: 4,
  },
  colorButton: {
    margin: 0,
  },
  selectedColorButton: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});
