import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const loginService = createApi({
    reducerPath: 'loginService',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ username, password }) => ({
                url: '/api/auth/login',
                method: 'POST',
                body: { username, password },
            }),
            transformResponse: (response) => {
                // Chúng ta nhận JWT token, không cần parse nó như JSON
                return response; // Trả về chuỗi JWT token (không phải JSON)
            }
        }),
    }),
});


export const { useLoginMutation } = loginService;
