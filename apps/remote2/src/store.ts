import { configureStore } from "@reduxjs/toolkit";
import commentReducer from "@/slices/commentsSlice";
import listPostReducer from "@/slices/listPostSlice";
import categoriesReducer from "@/slices/categorySlice";

export const store = configureStore({
  reducer: {
    comments: commentReducer,
    listPost: listPostReducer,
    categories: categoriesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
