import { hideLoader, showLoader } from "../features/uiSlice";

export const loaderMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith("/pending")) {
    store.dispatch(showLoader());
  }

  if (action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected")) {
    store.dispatch(hideLoader());
  }

  return next(action);
};
