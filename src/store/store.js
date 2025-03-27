import {configureStore} from "@reduxjs/toolkit";
import {usersService} from "../service/userService.js";
import {productService} from "../service/productService.js";
import {shopService} from "../service/shopService.js";
import {rolesService} from "../service/roleService.js";
import {loginService} from "../service/loginService.js";
import {shipperService} from "../service/shipperService.js";
import {categoryService} from "../service/categoryService.js";
import {bannerService} from "../service/bannerService.js";
import {orderService} from "../service/orderService.js";
import {blogService} from "../service/blogService.js";

export const store = configureStore({
    reducer: {
        [usersService.reducerPath]: usersService.reducer,
        [productService.reducerPath]: productService.reducer,
        [shopService.reducerPath]: shopService.reducer,
        [rolesService.reducerPath]: rolesService.reducer,
        [loginService.reducerPath]: loginService.reducer,
        [shipperService.reducerPath]: shipperService.reducer,
        [categoryService.reducerPath]: categoryService.reducer,
        [bannerService.reducerPath]: bannerService.reducer,
        [orderService.reducerPath]: orderService.reducer,
        [blogService.reducerPath]: blogService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            usersService.middleware,
            productService.middleware,
            shopService.middleware,
            rolesService.middleware,
            shipperService.middleware,
            categoryService.middleware,
            bannerService.middleware,
            blogService.middleware,
            orderService.middleware,),
})