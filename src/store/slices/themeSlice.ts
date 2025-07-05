import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
}

const initialState: ThemeState = {
  mode: "dark",
  isDark: true,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;

      // For 'system' mode, we would need to check system preference
      // For now, we'll just handle 'light' and 'dark' explicitly
      if (action.payload === "dark") {
        state.isDark = true;
      } else if (action.payload === "light") {
        state.isDark = false;
      } else {
        // 'system' mode - would check device setting here
        // For now, default to light
        state.isDark = false;
      }
    },
    toggleTheme: (state) => {
      if (state.mode === "system") {
        // If in system mode, switch to explicit mode
        state.mode = state.isDark ? "light" : "dark";
        state.isDark = !state.isDark;
      } else {
        // Toggle between light and dark
        state.mode = state.mode === "light" ? "dark" : "light";
        state.isDark = !state.isDark;
      }
    },
    setSystemTheme: (state, action: PayloadAction<boolean>) => {
      if (state.mode === "system") {
        state.isDark = action.payload;
      }
    },
  },
});

export const { setThemeMode, toggleTheme, setSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
