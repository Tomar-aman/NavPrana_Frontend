import { combineReducers } from "@reduxjs/toolkit";
import addressReducer from "./features/addressSlice";
import authReducer from "./features/authSlice";
import profileReducer from "./features/profileSlice";
import passwordReducer from "./features/passwordSlice";
import productReducer from "./features/product";
import cartReducer from "./features/cartSlice";
import couponReducer from "./features/couponSlice";
import orderReducer from "./features/createOrderSlice";
export default combineReducers({
  auth: authReducer,
  address: addressReducer,
  profile: profileReducer,
  password: passwordReducer,
  product: productReducer,
  cart: cartReducer,
  coupon: couponReducer,
  order: orderReducer,
});
