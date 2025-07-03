// App Configuration
export const APP_CONFIG = {
  NAME: 'BudgetMate',
  VERSION: '1.0.0',
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.budgetmate.com',
  GEMINI_API_URL: process.env.EXPO_PUBLIC_GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta',
  PLAID_ENV: process.env.EXPO_PUBLIC_PLAID_ENV || 'sandbox',
  OPENAI_API_URL: 'https://api.openai.com/v1',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    PREFERENCES: '/user/preferences',
    UPDATE_PROFILE: '/user/update-profile',
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    UPDATE: '/transactions/:id',
    DELETE: '/transactions/:id',
    SYNC: '/transactions/sync',
    CATEGORIZE: '/transactions/categorize',
    BULK_CATEGORIZE: '/transactions/bulk-categorize',
  },
  BUDGETS: {
    LIST: '/budgets',
    CREATE: '/budgets',
    UPDATE: '/budgets/:id',
    DELETE: '/budgets/:id',
    ANALYTICS: '/budgets/analytics',
  },
  BILLS: {
    LIST: '/bills',
    CREATE: '/bills',
    UPDATE: '/bills/:id',
    DELETE: '/bills/:id',
    UPCOMING: '/bills/upcoming',
    MARK_PAID: '/bills/:id/mark-paid',
  },
  ACCOUNTS: {
    LIST: '/accounts',
    CREATE: '/accounts',
    UPDATE: '/accounts/:id',
    DELETE: '/accounts/:id',
    SYNC: '/accounts/sync',
    LINK_PLAID: '/accounts/link-plaid',
  },
  DASHBOARD: {
    DATA: '/dashboard',
    INSIGHTS: '/dashboard/insights',
    ALERTS: '/dashboard/alerts',
  },
  AI: {
    INSIGHTS: '/ai/insights',
    PREDICTIONS: '/ai/predictions',
    CATEGORIZATION: '/ai/categorization',
    CHAT: '/ai/chat',
    STATEMENT_PARSE: '/ai/statement-parse',
  },
  UPLOADS: {
    STATEMENT: '/uploads/statement',
    RECEIPT: '/uploads/receipt',
  },
};

// Default Categories
export const DEFAULT_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Home & Garden',
  'Gifts & Donations',
  'Business Services',
  'Financial',
  'Taxes',
  'Insurance',
  'Investment',
  'Income',
  'Other',
];

// Subcategories mapping
export const SUBCATEGORIES: Record<string, string[]> = {
  'Food & Dining': [
    'Groceries',
    'Restaurants',
    'Coffee Shops',
    'Bars & Pubs',
    'Fast Food',
    'Food Delivery',
  ],
  'Transportation': [
    'Gas',
    'Public Transit',
    'Parking',
    'Uber/Lyft',
    'Car Maintenance',
    'Car Payment',
    'Auto Insurance',
  ],
  'Shopping': [
    'Clothing',
    'Electronics',
    'Books',
    'Household Items',
    'Hobbies',
    'Sporting Goods',
  ],
  'Entertainment': [
    'Movies',
    'Music',
    'Games',
    'Sports',
    'Concerts',
    'Streaming Services',
  ],
  'Bills & Utilities': [
    'Electricity',
    'Water',
    'Internet',
    'Phone',
    'Cable TV',
    'Trash',
    'Rent/Mortgage',
  ],
  'Healthcare': [
    'Doctor',
    'Dentist',
    'Pharmacy',
    'Health Insurance',
    'Gym',
    'Wellness',
  ],
  'Education': [
    'Tuition',
    'Books',
    'Courses',
    'Training',
    'School Supplies',
  ],
  'Travel': [
    'Flights',
    'Hotels',
    'Car Rental',
    'Vacation',
    'Business Travel',
  ],
  'Personal Care': [
    'Haircut',
    'Skincare',
    'Clothing',
    'Accessories',
  ],
  'Home & Garden': [
    'Furniture',
    'Appliances',
    'Home Improvement',
    'Garden',
    'Maintenance',
  ],
  'Gifts & Donations': [
    'Gifts',
    'Charity',
    'Religious',
    'Political',
  ],
  'Business Services': [
    'Legal',
    'Accounting',
    'Banking Fees',
    'Office Supplies',
  ],
  'Financial': [
    'Investments',
    'Loans',
    'Credit Card Payments',
    'Bank Fees',
    'Interest',
  ],
  'Income': [
    'Salary',
    'Freelance',
    'Investment Returns',
    'Gifts Received',
    'Refunds',
  ],
};

// Colors for categories
export const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#FF6B6B',
  'Transportation': '#4ECDC4',
  'Shopping': '#45B7D1',
  'Entertainment': '#96CEB4',
  'Bills & Utilities': '#FFEAA7',
  'Healthcare': '#DDA0DD',
  'Education': '#98D8C8',
  'Travel': '#F7DC6F',
  'Personal Care': '#BB8FCE',
  'Home & Garden': '#82E0AA',
  'Gifts & Donations': '#F8C471',
  'Business Services': '#85C1E9',
  'Financial': '#F1948A',
  'Taxes': '#D7BDE2',
  'Insurance': '#A9DFBF',
  'Investment': '#FAD7A0',
  'Income': '#7FB3D3',
  'Other': '#BDC3C7',
};

// Currency symbols
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'Fr',
  CNY: '¥',
  INR: '₹',
  BRL: 'R$',
  KRW: '₩',
  SGD: 'S$',
  MXN: '$',
  ZAR: 'R',
  TRY: '₺',
  RUB: '₽',
  PLN: 'zł',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
};

// Supported currencies
export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_SYMBOLS);

// Budget periods
export const BUDGET_PERIODS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

// Bill frequencies
export const BILL_FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'one-time', label: 'One-time' },
];

// Account types
export const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'investment', label: 'Investment' },
];

// Transaction types
export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_SHORT: 'MMM dd',
  DISPLAY_LONG: 'MMMM dd, yyyy',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm',
};

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Validation rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  AMOUNT: {
    MIN: 0.01,
    MAX: 1000000,
  },
};

// Theme colors
export const THEME_COLORS = {
  light: {
    primary: '#2196F3',
    secondary: '#FFC107',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    accent: '#FF4081',
    error: '#F44336',
    warning: '#FF9800',
    success: '#4CAF50',
    info: '#2196F3',
    border: '#E0E0E0',
  },
  dark: {
    primary: '#1976D2',
    secondary: '#FFA000',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    accent: '#FF4081',
    error: '#F44336',
    warning: '#FF9800',
    success: '#4CAF50',
    info: '#2196F3',
    border: '#333333',
  },
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  CACHE_TRANSACTIONS: 'cache_transactions',
  CACHE_BUDGETS: 'cache_budgets',
  CACHE_BILLS: 'cache_bills',
  CACHE_ACCOUNTS: 'cache_accounts',
  CACHE_DASHBOARD: 'cache_dashboard',
};

// Notification types
export const NOTIFICATION_TYPES = {
  BUDGET_ALERT: 'budget_alert',
  BILL_REMINDER: 'bill_reminder',
  TRANSACTION_ALERT: 'transaction_alert',
  SYNC_COMPLETE: 'sync_complete',
  SYNC_ERROR: 'sync_error',
  AI_INSIGHT: 'ai_insight',
  SECURITY_ALERT: 'security_alert',
};

// ML confidence thresholds
export const ML_CONFIDENCE_THRESHOLDS = {
  CATEGORIZATION: 0.8,
  RECURRING_DETECTION: 0.75,
  ANOMALY_DETECTION: 0.85,
  PREDICTION: 0.7,
};

// File upload limits
export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'text/csv'],
  MAX_FILES: 5,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  FILE_TOO_LARGE: 'File size is too large. Maximum size is 10MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload PDF, JPEG, PNG, or CSV files.',
  LOGIN_REQUIRED: 'Please log in to continue.',
  EXPIRED_SESSION: 'Your session has expired. Please log in again.',
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to access this resource.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  DUPLICATE_ENTRY: 'This entry already exists.',
  NOT_FOUND: 'The requested resource was not found.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_LOCKED: 'Your account has been locked. Please contact support.',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_AMOUNT: 'Please enter a valid amount.',
  INVALID_DATE: 'Please enter a valid date.',
  SYNC_FAILED: 'Failed to sync data. Please try again.',
  PLAID_ERROR: 'Error connecting to your bank. Please try again.',
  AI_SERVICE_UNAVAILABLE: 'AI service is temporarily unavailable.',
  STATEMENT_PARSE_ERROR: 'Error parsing statement. Please try uploading a clearer image.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  UPDATE_SUCCESS: 'Updated successfully!',
  DELETE_SUCCESS: 'Deleted successfully!',
  SYNC_SUCCESS: 'Data synced successfully!',
  UPLOAD_SUCCESS: 'File uploaded successfully!',
  STATEMENT_PARSED: 'Statement parsed successfully!',
  ACCOUNT_LINKED: 'Account linked successfully!',
  BUDGET_CREATED: 'Budget created successfully!',
  BILL_CREATED: 'Bill created successfully!',
  TRANSACTION_ADDED: 'Transaction added successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  PASSWORD_UPDATED: 'Password updated successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PREFERENCES_SAVED: 'Preferences saved successfully!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
};

// Feature flags
export const FEATURE_FLAGS = {
  PLAID_INTEGRATION: true,
  GEMINI_INTEGRATION: true,
  OPENAI_INTEGRATION: true,
  BIOMETRIC_AUTH: true,
  DARK_MODE: true,
  EXPORT_DATA: true,
  MULTI_CURRENCY: true,
  JOINT_ACCOUNTS: false, // Future feature
  SOCIAL_SHARING: false, // Future feature
  INVESTMENT_TRACKING: false, // Future feature
  CRYPTO_TRACKING: false, // Future feature
};

// Chart configurations
export const CHART_CONFIGS = {
  COLORS: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#82E0AA',
    '#F8C471', '#85C1E9', '#F1948A', '#D7BDE2', '#A9DFBF',
  ],
  ANIMATION_DURATION: 300,
  GRID_COLOR: '#E0E0E0',
  AXIS_COLOR: '#757575',
  LEGEND_POSITION: 'bottom',
};

// Regex patterns
export const REGEX_PATTERNS = {
  MERCHANT_CLEAN: /^(.*?)\s*(#\d+|\*\d+|\d{4,})?\s*$/,
  AMOUNT_EXTRACT: /\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/,
  DATE_EXTRACT: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
  PHONE_CLEAN: /[\s\-\(\)]/g,
  SPECIAL_CHARS: /[^a-zA-Z0-9\s]/g,
};

// Time intervals
export const TIME_INTERVALS = {
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  CACHE_EXPIRY: 60 * 60 * 1000, // 1 hour
  TOKEN_REFRESH_INTERVAL: 45 * 60 * 1000, // 45 minutes
  DASHBOARD_REFRESH: 10 * 60 * 1000, // 10 minutes
  NOTIFICATION_CHECK: 30 * 1000, // 30 seconds
};

// Animation timings
export const ANIMATION_TIMINGS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Screen dimensions breakpoints
export const SCREEN_BREAKPOINTS = {
  SMALL: 320,
  MEDIUM: 768,
  LARGE: 1024,
  EXTRA_LARGE: 1440,
};

export default {
  APP_CONFIG,
  API_ENDPOINTS,
  DEFAULT_CATEGORIES,
  SUBCATEGORIES,
  CATEGORY_COLORS,
  CURRENCY_SYMBOLS,
  SUPPORTED_CURRENCIES,
  BUDGET_PERIODS,
  BILL_FREQUENCIES,
  ACCOUNT_TYPES,
  TRANSACTION_TYPES,
  DATE_FORMATS,
  PAGINATION,
  VALIDATION_RULES,
  THEME_COLORS,
  STORAGE_KEYS,
  NOTIFICATION_TYPES,
  ML_CONFIDENCE_THRESHOLDS,
  FILE_UPLOAD_LIMITS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURE_FLAGS,
  CHART_CONFIGS,
  REGEX_PATTERNS,
  TIME_INTERVALS,
  ANIMATION_TIMINGS,
  SCREEN_BREAKPOINTS,
};
