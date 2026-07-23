import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice";
import usersReducer from "./userSlice";

const store = configureStore({
  reducer: {
    loader: loaderReducer,
    users: usersReducer,
  },
});

export default store;
