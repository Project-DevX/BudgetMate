import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, ApiResponse } from "../../types";
import { userProfileService } from "../../services/userProfileService";

interface UserProfileState {
  profile: User | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
}

const initialState: UserProfileState = {
  profile: null,
  loading: false,
  error: null,
  updating: false,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userProfileService.getProfile(userId);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to fetch profile");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "userProfile/updateProfile",
  async (
    { userId, profileData }: { userId: string; profileData: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      const response = await userProfileService.updateProfile(
        userId,
        profileData
      );
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to update profile");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

export const uploadUserAvatar = createAsyncThunk(
  "userProfile/uploadAvatar",
  async (
    { userId, avatarUri }: { userId: string; avatarUri: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userProfileService.uploadAvatar(userId, avatarUri);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to upload avatar");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to upload avatar");
    }
  }
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      })
      // Upload avatar
      .addCase(uploadUserAvatar.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        state.updating = false;
        if (state.profile) {
          state.profile.avatar = action.payload;
        }
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
