import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BillState, Bill } from "../../types";
import { billService } from "../../services/firebaseBillService";

// Async thunks
export const fetchBills = createAsyncThunk(
  "bills/fetchBills",
  async (_, { rejectWithValue }) => {
    try {
      const response = await billService.getBills();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to fetch bills");
    } catch (error) {
      return rejectWithValue("Failed to fetch bills");
    }
  }
);

export const createBill = createAsyncThunk(
  "bills/createBill",
  async (
    billData: Omit<Bill, "id" | "userId" | "createdAt" | "updatedAt">,
    { rejectWithValue }
  ) => {
    try {
      const response = await billService.addBill(billData);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to create bill");
    } catch (error) {
      return rejectWithValue("Failed to create bill");
    }
  }
);

export const updateBillAsync = createAsyncThunk(
  "bills/updateBill",
  async (
    { billId, updates }: { billId: string; updates: Partial<Bill> },
    { rejectWithValue }
  ) => {
    try {
      const response = await billService.updateBill(billId, updates);
      if (response.success) {
        return { billId, updates };
      }
      return rejectWithValue(response.error || "Failed to update bill");
    } catch (error) {
      return rejectWithValue("Failed to update bill");
    }
  }
);

export const deleteBillAsync = createAsyncThunk(
  "bills/deleteBill",
  async (billId: string, { rejectWithValue }) => {
    try {
      const response = await billService.deleteBill(billId);
      if (response.success) {
        return billId;
      }
      return rejectWithValue(response.error || "Failed to delete bill");
    } catch (error) {
      return rejectWithValue("Failed to delete bill");
    }
  }
);

export const markBillPaid = createAsyncThunk(
  "bills/markBillPaid",
  async (billId: string, { rejectWithValue }) => {
    try {
      const response = await billService.markBillPaid(billId);
      if (response.success) {
        return billId;
      }
      return rejectWithValue(response.error || "Failed to mark bill as paid");
    } catch (error) {
      return rejectWithValue("Failed to mark bill as paid");
    }
  }
);

const initialState: BillState = {
  bills: [],
  upcomingBills: [],
  loading: false,
  error: null,
};

const billSlice = createSlice({
  name: "bills",
  initialState,
  reducers: {
    setBills: (state, action: PayloadAction<Bill[]>) => {
      state.bills = action.payload;
    },
    setUpcomingBills: (state, action: PayloadAction<Bill[]>) => {
      state.upcomingBills = action.payload;
    },
    addBill: (state, action: PayloadAction<Bill>) => {
      state.bills.push(action.payload);
    },
    updateBill: (state, action: PayloadAction<Bill>) => {
      const index = state.bills.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
    },
    removeBill: (state, action: PayloadAction<string>) => {
      state.bills = state.bills.filter((b) => b.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bills
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create bill
      .addCase(createBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills.push(action.payload);
      })
      .addCase(createBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update bill
      .addCase(updateBillAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBillAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { billId, updates } = action.payload;
        const index = state.bills.findIndex((b) => b.id === billId);
        if (index !== -1) {
          state.bills[index] = { ...state.bills[index], ...updates };
        }
      })
      .addCase(updateBillAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete bill
      .addCase(deleteBillAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBillAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = state.bills.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBillAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark bill paid
      .addCase(markBillPaid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markBillPaid.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bills.findIndex((b) => b.id === action.payload);
        if (index !== -1) {
          state.bills[index].isPaid = true;
        }
      })
      .addCase(markBillPaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setBills,
  setUpcomingBills,
  addBill,
  updateBill,
  removeBill,
  setLoading,
  setError,
  clearError,
} = billSlice.actions;

export default billSlice.reducer;
