import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Surface, Text, TouchableRipple, useTheme } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

interface WebBottomTabBarProps {
  children: React.ReactNode;
}

export function WebBottomTabBar({ children }: WebBottomTabBarProps) {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  console.log("WebBottomTabBar rendering for route:", route.name);

  // Show bottom tab on all screens (web and mobile)
  const routes = [
    { key: "Dashboard", title: "Dashboard", icon: "dashboard" },
    { key: "Transactions", title: "Transactions", icon: "receipt" },
    { key: "Budgets", title: "Budgets", icon: "pie-chart" },
    { key: "Bills", title: "Bills", icon: "schedule" },
    { key: "Accounts", title: "Accounts", icon: "account-balance" },
  ];

  const handleTabPress = (routeKey: string) => {
    console.log("Tab pressed:", routeKey, "current route:", route.name);
    if (routeKey !== route.name) {
      navigation.navigate(routeKey as never);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <Surface
        style={[
          styles.bottomNav,
          {
            backgroundColor: theme.colors.surface || "#ffffff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
        ]}
        elevation={5}
      >
        <View style={styles.tabContainer}>
          {routes.map((tabRoute) => {
            const isActive = tabRoute.key === route.name;
            const color = isActive
              ? theme.colors.primary
              : theme.colors.onSurfaceVariant;

            return (
              <TouchableRipple
                key={tabRoute.key}
                style={styles.tab}
                onPress={() => handleTabPress(tabRoute.key)}
                rippleColor={theme.colors.primary + "20"}
              >
                <View style={styles.tabContent}>
                  <MaterialIcons
                    name={tabRoute.icon as any}
                    size={24}
                    color={color}
                  />
                  <Text
                    variant="labelSmall"
                    style={[styles.tabLabel, { color }]}
                  >
                    {tabRoute.title}
                  </Text>
                </View>
              </TouchableRipple>
            );
          })}
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    height: Platform.OS === "web" ? ("100vh" as any) : "100%",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    overflow: Platform.OS === "web" ? ("auto" as any) : "visible",
  },
  bottomNav: {
    height: 80,
    zIndex: 1000,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    flexShrink: 0, // Prevent the nav bar from shrinking
    position: Platform.OS === "web" ? ("sticky" as any) : "relative",
    bottom: 0,
  },
  tabContainer: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabLabel: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 12,
  },
});
