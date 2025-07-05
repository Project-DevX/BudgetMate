import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  UserSettings,
  settingsService,
  defaultSettings,
} from "../../services/settingsService";

interface SettingsState {
  settings: UserSettings;
  loading: boolean;
  updating: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: defaultSettings,
  loading: false,
  updating: false,
  error: null,
};

// Async thunks
export const fetchUserSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await settingsService.getUserSettings(userId);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to fetch settings");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch settings");
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  "settings/updateSettings",
  async (
    { userId, settings }: { userId: string; settings: Partial<UserSettings> },
    { rejectWithValue }
  ) => {
    try {
      const response = await settingsService.updateUserSettings(
        userId,
        settings
      );
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to update settings");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update settings");
    }
  }
);

export const changePassword = createAsyncThunk(
  "settings/changePassword",
  async (
    {
      currentPassword,
      newPassword,
    }: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await settingsService.changePassword(
        currentPassword,
        newPassword
      );
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to change password");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to change password");
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "settings/deleteAccount",
  async (password: string, { rejectWithValue }) => {
    try {
      const response = await settingsService.deleteAccount(password);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to delete account");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete account");
    }
  }
);

export const exportUserData = createAsyncThunk(
  "settings/exportData",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await settingsService.exportUserData(userId);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to export data");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to export data");
    }
  }
);

export const clearCache = createAsyncThunk(
  "settings/clearCache",
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsService.clearCache();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to clear cache");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to clear cache");
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<UserSettings["notifications"]>>
    ) => {
      state.settings.notifications = {
        ...state.settings.notifications,
        ...action.payload,
      };
    },
    updatePrivacySettings: (
      state,
      action: PayloadAction<Partial<UserSettings["privacy"]>>
    ) => {
      state.settings.privacy = {
        ...state.settings.privacy,
        ...action.payload,
      };
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<UserSettings["preferences"]>>
    ) => {
      state.settings.preferences = {
        ...state.settings.preferences,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch settings
    builder
      .addCase(fetchUserSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update settings
    builder
      .addCase(updateUserSettings.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.updating = false;
        state.settings = action.payload;
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });

    // Change password
    builder
      .addCase(changePassword.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });

    // Delete account
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });

    // Export data
    builder
      .addCase(exportUserData.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(exportUserData.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(exportUserData.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });

    // Clear cache
    builder
      .addCase(clearCache.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(clearCache.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(clearCache.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  updateNotificationSettings,
  updatePrivacySettings,
  updatePreferences,
} = settingsSlice.actions;

export default settingsSlice.reducer;
