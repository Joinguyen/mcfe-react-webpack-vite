import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: any[] = [];

export const commentSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    saveCategories: (state, action: PayloadAction<any[]>) => {
      return [...action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveCategories } = commentSlice.actions;

export default commentSlice.reducer;
