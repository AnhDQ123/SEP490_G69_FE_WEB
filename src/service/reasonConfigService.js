import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const reasonConfigService = createApi({
    reducerPath: "config",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["config"],
    endpoints: (builder) => ({
        // Lấy cấu hình theo danh mục
        getConfigsByCategory: builder.query({
            query: ({ category, page = 0, size = 10 }) =>
                `api/config/${category}?page=${page}&size=${size}`,
            providesTags: ["config"],
        }),

        // Lấy cấu hình theo ID
        getConfigById: builder.query({
            query: (id) => `api/config/detail/${id}`,
            providesTags: (result, error, id) => [
                { type: "config", id },
            ],
        }),

        // Tạo cấu hình mới
        createConfig: builder.mutation({
            query: (request) => ({
                url: `api/config/create`,
                method: "POST",
                body: request,
            }),
            invalidatesTags: ["config"],
        }),

        // Cập nhật cấu hình
        updateConfig: builder.mutation({
            query: ({ id, value }) => ({
                url: `api/config/update/${id}`,
                method: "PUT",
                body: { value },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "config", id },
            ],
        }),

        // Xóa cấu hình
        deleteConfig: builder.mutation({
            query: (id) => ({
                url: `api/config/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["config"],
        }),
    }),
});

export const {
    useGetConfigsByCategoryQuery,
    useGetConfigByIdQuery,
    useCreateConfigMutation,
    useUpdateConfigMutation,
    useDeleteConfigMutation,
} = reasonConfigService;
