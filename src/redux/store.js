import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { loaderMiddleware } from "./middleware/loaderMiddleware";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loaderMiddleware),
});
