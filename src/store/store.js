import {configureStore} from "@reduxjs/toolkit";
import {usersService} from "../service/usersService.js";
import {roleService} from "../service/roleService.js";
import {authService} from "../service/authService.js";

export const store = configureStore({
    reducer: {
        [usersService.reducerPath]: usersService.reducer,
        [roleService.reducerPath]: roleService.reducer,
        [authService.reducerPath]: authService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(usersService.middleware,
            employeeService.middleware,
            departmentService.middleware,
            roleService.middleware,
            authService.middleware,
            ),
})