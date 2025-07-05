export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  currency: string;
  budgetCycle: "monthly" | "weekly" | "biweekly";
  notifications: NotificationSettings;
  categories: CategorySettings;
}

export interface NotificationSettings {
  billReminders: boolean;
  budgetAlerts: boolean;
  expenseAlerts: boolean;
  subscriptionAlerts: boolean;
}

export interface CategorySettings {
  customCategories: string[];
  categoryRules: CategoryRule[];
}

export interface CategoryRule {
  id: string;
  merchantPattern: string;
  categoryId: string;
  confidence: number;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  date: string;
  type: "income" | "expense";
  merchant?: string;
  tags: string[];
  isRecurring: boolean;
  recurringId?: string;
  confidence: number;
  source: "manual" | "bank_api" | "statement_upload";
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: "checking" | "savings" | "credit" | "investment";
  balance: number;
  currency: string;
  bankName: string;
  lastSynced: string;
  isActive: boolean;
  plaidAccountId?: string;
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
  startDate: string;
  endDate: string;
  isActive: boolean;
  alerts: BudgetAlert[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAlert {
  id: string;
  budgetId: string;
  type: "threshold" | "overspent" | "approaching_limit";
  threshold: number;
  isActive: boolean;
  lastTriggered?: string;
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  description?: string;
  amount: number;
  dueDate: string;
  frequency: "monthly" | "weekly" | "yearly" | "one-time";
  category: string;
  accountId: string;
  isAutoPay: boolean;
  isPaid: boolean;
  reminders: BillReminder[];
  createdAt: string;
  updatedAt: string;
}

export interface BillReminder {
  id: string;
  billId: string;
  daysBeforeDue: number;
  isActive: boolean;
  lastSent?: string;
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  name: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  nextOccurrence: string;
  category: string;
  type: "income" | "expense";
  isActive: boolean;
  detectedAt: string;
  confidence: number;
}

export interface MLPrediction {
  id: string;
  transactionId: string;
  type: "category" | "amount" | "recurring";
  prediction: any;
  confidence: number;
  createdAt: string;
}

export interface Dashboard {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  budgetUtilization: number;
  upcomingBills: Bill[];
  recentTransactions: Transaction[];
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrend: MonthlyTrend[];
  alerts: Alert[];
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  budget: number;
  percentage: number;
  transactions: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface Alert {
  id: string;
  userId: string;
  type:
    | "budget_exceeded"
    | "bill_due"
    | "unusual_spending"
    | "subscription_alert";
  title: string;
  message: string;
  severity: "low" | "medium" | "high";
  isRead: boolean;
  createdAt: string;
  actionRequired: boolean;
  relatedId?: string;
}

export interface AIInsight {
  id: string;
  userId: string;
  type:
    | "spending_pattern"
    | "budget_suggestion"
    | "savings_opportunity"
    | "subscription_optimization";
  title: string;
  description: string;
  actionItems: string[];
  potentialSavings?: number;
  confidence: number;
  createdAt: string;
  isApplied: boolean;
}

export interface StatementUpload {
  id: string;
  userId: string;
  filename: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  processingStatus: "pending" | "processing" | "completed" | "failed";
  extractedTransactions: Transaction[];
  errors: string[];
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  Transactions: undefined;
  Budgets: undefined;
  Bills: undefined;
  Accounts: undefined;
  Settings: undefined;
  Profile: undefined;
  AddTransaction: undefined;
  AddBudget: undefined;
  AddBill: undefined;
  TransactionDetail: { transactionId: string };
  BudgetDetail: { budgetId: string };
  BillDetail: { billId: string };
  StatementUpload: undefined;
  AIInsights: undefined;
  CategoryManagement: undefined;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Store types
export interface RootState {
  auth: AuthState;
  user: UserState;
  transactions: TransactionState;
  budgets: BudgetState;
  bills: BillState;
  accounts: AccountState;
  dashboard: DashboardState;
  ai: AIState;
  ui: UIState;
  theme: ThemeState;
  settings: SettingsState;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UserState {
  profile: User | null;
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
}

export interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  filters: TransactionFilters;
  pagination: PaginationState;
}

export interface TransactionFilters {
  dateRange: DateRange;
  categories: string[];
  accounts: string[];
  amountRange: AmountRange;
  search: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AmountRange {
  min: number;
  max: number;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BudgetState {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  currentPeriod: string;
}

export interface BillState {
  bills: Bill[];
  upcomingBills: Bill[];
  loading: boolean;
  error: string | null;
}

export interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  syncStatus: SyncStatus;
}

export interface SyncStatus {
  isSync: boolean;
  lastSyncTime: string | null;
  errors: string[];
}

export interface DashboardState {
  data: Dashboard | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface AIState {
  insights: AIInsight[];
  predictions: MLPrediction[];
  loading: boolean;
  error: string | null;
}

export interface UIState {
  theme: "light" | "dark";
  isDrawerOpen: boolean;
  loading: boolean;
  alerts: Alert[];
  currentScreen: string;
}

export interface ThemeState {
  mode: "light" | "dark" | "system";
  isDark: boolean;
}

export interface SettingsState {
  settings: {
    notifications: {
      billReminders: boolean;
      budgetAlerts: boolean;
      transactionSync: boolean;
      weeklyReports: boolean;
      monthlyReports: boolean;
    };
    privacy: {
      biometricAuth: boolean;
      requirePasswordForTransactions: boolean;
      shareDataForInsights: boolean;
      autoSync: boolean;
    };
    preferences: {
      currency: string;
      dateFormat: string;
      theme: "light" | "dark" | "system";
    };
    updatedAt: string;
  };
  loading: boolean;
  updating: boolean;
  error: string | null;
}
