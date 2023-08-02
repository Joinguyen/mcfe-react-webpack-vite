import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


const initialState: any[] = [];

export const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    saveComments: (state, action: PayloadAction<any[]>) => {
      return [... action.payload]
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveComments} = commentSlice.actions;

export default commentSlice.reducer;
