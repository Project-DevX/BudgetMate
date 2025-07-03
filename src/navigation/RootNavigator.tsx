import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

// Screens
import { DashboardScreen } from '../screens/DashboardScreen';
import {
  TransactionsScreen,
  BudgetsScreen,
  BillsScreen,
  AccountsScreen,
  SettingsScreen,
  ProfileScreen,
  AddTransactionScreen,
  AddBudgetScreen,
  AddBillScreen,
  TransactionDetailScreen,
  BudgetDetailScreen,
  BillDetailScreen,
  StatementUploadScreen,
  AIInsightsScreen,
  CategoryManagementScreen,
} from '../screens/ScreenPlaceholders';

import { RootStackParamList } from '../types';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function TabNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Transactions') {
            iconName = 'receipt';
          } else if (route.name === 'Budgets') {
            iconName = 'pie-chart';
          } else if (route.name === 'Bills') {
            iconName = 'schedule';
          } else if (route.name === 'Accounts') {
            iconName = 'account-balance';
          } else {
            iconName = 'dashboard';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ 
          title: 'Dashboard',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsScreen}
        options={{ 
          title: 'Transactions',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Budgets" 
        component={BudgetsScreen}
        options={{ 
          title: 'Budgets',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Bills" 
        component={BillsScreen}
        options={{ 
          title: 'Bills',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Accounts" 
        component={AccountsScreen}
        options={{ 
          title: 'Accounts',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen}
        options={{ 
          title: 'Add Transaction',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="AddBudget" 
        component={AddBudgetScreen}
        options={{ 
          title: 'Add Budget',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="AddBill" 
        component={AddBillScreen}
        options={{ 
          title: 'Add Bill',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="TransactionDetail" 
        component={TransactionDetailScreen}
        options={{ title: 'Transaction Details' }}
      />
      <Stack.Screen 
        name="BudgetDetail" 
        component={BudgetDetailScreen}
        options={{ title: 'Budget Details' }}
      />
      <Stack.Screen 
        name="BillDetail" 
        component={BillDetailScreen}
        options={{ title: 'Bill Details' }}
      />
      <Stack.Screen 
        name="StatementUpload" 
        component={StatementUploadScreen}
        options={{ 
          title: 'Upload Statement',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="AIInsights" 
        component={AIInsightsScreen}
        options={{ title: 'AI Insights' }}
      />
      <Stack.Screen 
        name="CategoryManagement" 
        component={CategoryManagementScreen}
        options={{ title: 'Manage Categories' }}
      />
    </Stack.Navigator>
  );
}
