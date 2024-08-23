import { configureStore } from "@reduxjs/toolkit";
import { productAPI } from "./api/productAPI";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";


export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    // we take reducer name dynamic because in future if we change the name of reducer in slice here it is automatically change
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]:productAPI.reducer,
    [userReducer.name] : userReducer.reducer,
    [cartReducer.name] : cartReducer.reducer,
  },
  middleware: (mid) => [
    ...mid(),
    userAPI.middleware,
    productAPI.middleware,
  ],
});