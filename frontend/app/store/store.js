import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/UserSlice.js";


export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});