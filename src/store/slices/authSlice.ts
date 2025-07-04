import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User, ApiResponse } from "../../types";
import { firebaseAuthService } from "../../services/firebaseAuthService";
import { storageService } from "../../services/storageService";
import { STORAGE_KEYS } from "../../constants";

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  user: null,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await firebaseAuthService.login(credentials);
      if (response.success && response.data) {
        await storageService.setItem(
          STORAGE_KEYS.AUTH_TOKEN,
          response.data.token
        );
        await storageService.setItem(
          STORAGE_KEYS.REFRESH_TOKEN,
          response.data.refreshToken
        );
        return response.data;
      }
      return rejectWithValue(response.error || "Login failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await firebaseAuthService.register(userData);
      if (response.success && response.data) {
        await storageService.setItem(
          STORAGE_KEYS.AUTH_TOKEN,
          response.data.token
        );
        await storageService.setItem(
          STORAGE_KEYS.REFRESH_TOKEN,
          response.data.refreshToken
        );
        return response.data;
      }
      return rejectWithValue(response.error || "Registration failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await firebaseAuthService.logout();
      await storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await storageService.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        return rejectWithValue("No refresh token available");
      }

      const response = await firebaseAuthService.refreshToken(refreshToken);
      if (response.success && response.data) {
        await storageService.setItem(
          STORAGE_KEYS.AUTH_TOKEN,
          response.data.token
        );
        return response.data;
      }
      return rejectWithValue(response.error || "Token refresh failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Token refresh failed");
    }
  }
);

export const validateToken = createAsyncThunk(
  "auth/validate",
  async (_, { rejectWithValue }) => {
    try {
      // Check if Firebase user is already authenticated
      const currentUser = firebaseAuthService.getCurrentUser();

      if (currentUser) {
        // User is authenticated, get fresh token and user data
        const token = await currentUser.getIdToken();
        const refreshToken = currentUser.refreshToken || "";

        const response = await firebaseAuthService.validateToken(token);
        if (response.success && response.data) {
          // Store tokens
          await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
          await storageService.setItem(
            STORAGE_KEYS.REFRESH_TOKEN,
            refreshToken
          );

          return {
            token,
            refreshToken,
            user: response.data.user,
          };
        }
      }

      // Check stored token as fallback
      const storedToken = await storageService.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedRefreshToken = await storageService.getItem(
        STORAGE_KEYS.REFRESH_TOKEN
      );

      if (storedToken && currentUser) {
        const response = await firebaseAuthService.validateToken(storedToken);
        if (response.success && response.data) {
          return {
            token: storedToken,
            refreshToken: storedRefreshToken,
            user: response.data.user,
          };
        }
      }

      // No valid authentication found
      throw new Error("No valid authentication found");
    } catch (error: any) {
      return rejectWithValue(error.message || "Token validation failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await firebaseAuthService.forgotPassword(email);
      if (response.success) {
        return response.message || "Password reset email sent";
      }
      return rejectWithValue(response.error || "Failed to send reset email");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to send reset email");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { oobCode: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await firebaseAuthService.resetPassword(data);
      if (response.success) {
        return response.message || "Password reset successful";
      }
      return rejectWithValue(response.error || "Password reset failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Password reset failed");
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const response = await firebaseAuthService.signInWithGoogle();
      if (response.success && response.data) {
        await storageService.setItem(
          STORAGE_KEYS.AUTH_TOKEN,
          response.data.token
        );
        await storageService.setItem(
          STORAGE_KEYS.REFRESH_TOKEN,
          response.data.refreshToken
        );
        return response.data;
      }
      return rejectWithValue(response.error || "Google Sign-In failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Google Sign-In failed");
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAuthState: (
      state,
      action: PayloadAction<{
        isAuthenticated: boolean;
        user: User | null;
        token: string | null;
        refreshToken: string | null;
      }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Refresh token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        state.error = action.payload as string;
      });

    // Validate token
    builder
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        // Don't show "No token found" as an error - it's normal for new users
        const errorMessage = action.payload as string;
        state.error = errorMessage === "No token found" ? null : errorMessage;
      });

    // Forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Sign in with Google
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setUser,
  setAuthState,
  updateUserProfile,
  setLoading,
} = authSlice.actions;
export default authSlice.reducer;
