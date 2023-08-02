import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


const initialState: any = {};

export const listPostSlice = createSlice({
  name: "postList",
  initialState,
  reducers: {
    saveScrollY: (state, action: PayloadAction<any[]>) => {
      return {
        ...state,
        ... action.payload
    }
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveScrollY} = listPostSlice.actions;

export default listPostSlice.reducer;
