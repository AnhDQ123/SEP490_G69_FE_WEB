import {configureStore} from "@reduxjs/toolkit";
import {usersService} from "../service/userService.js";
import {productService} from "../service/productService.js";
import {shopService} from "../service/shopService.js";
import {rolesService} from "../service/roleService.js";

export const store = configureStore({
  reducer: {
    [usersService.reducerPath]: usersService.reducer,
    [productService.reducerPath]: productService.reducer,
    [shopService.reducerPath]: shopService.reducer,
    [rolesService.reducerPath]: rolesService.reducer,


  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
          usersService.middleware,
          productService.middleware,
          shopService.middleware,
          rolesService.middleware,),
})