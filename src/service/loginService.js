import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const loginService = createApi({
    reducerPath: "auth",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "api/auth/login",
                method: "POST",
                body: credentials,
                headers: { "Content-Type": "application/json" },
            }),
        }),
    }),
});

export const { useLoginMutation } = loginService;
