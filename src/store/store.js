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
import {reasonConfigService} from "../service/reasonConfigService.js";
import {deliveryMethodService} from "../service/deliveryMethodService.js";
import {paymentMethodService} from "../service/paymentMethodService.js";
import {commentService} from "../service/commentService.js";
import {reportService} from "../service/reportService.js";
import {returnOrderService} from "../service/returnOrderService.js";

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
        [reasonConfigService.reducerPath]: reasonConfigService.reducer,
        [deliveryMethodService.reducerPath]: deliveryMethodService.reducer,
        [paymentMethodService.reducerPath]: paymentMethodService.reducer,
        [commentService.reducerPath]: commentService.reducer,
        [reportService.reducerPath]: reportService.reducer,
        [returnOrderService.reducerPath]: returnOrderService.reducer,


    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            loginService.middleware,
            usersService.middleware,
            productService.middleware,
            shopService.middleware,
            rolesService.middleware,
            shipperService.middleware,
            categoryService.middleware,
            bannerService.middleware,
            blogService.middleware,
            reasonConfigService.middleware,
            reasonConfigService.middleware,
            deliveryMethodService.middleware,
            paymentMethodService.middleware,
            commentService.middleware,
            reportService.middleware,
            returnOrderService.middleware,
            orderService.middleware,),
})