import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const reasonConfigService = createApi({
    reducerPath: "config",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["config"],
    endpoints: (builder) => ({

        // List category
        getConfigsByCategory: builder.query({
            query: ({ category, page = 0, size = 10 }) =>
                `api/config/${category}?page=${page}&size=${size}`,
            providesTags: (result) =>
                result?.content
                    ? [
                        ...result.content.map(({ id }) => ({ type: "config", id })),
                        { type: "config", id: "LIST" },
                    ]
                    : [{ type: "config", id: "LIST" }],
        }),

        // get by id
        getConfigById: builder.query({
            query: (id) => `api/config/detail/${id}`,
            providesTags: (result, error, id) => [{ type: "config", id }],
        }),

        // create config
        createConfig: builder.mutation({
            query: (request) => ({
                url: `api/config/create`,
                method: "POST",
                body: request,
            }),
            invalidatesTags: [{ type: "config", id: "LIST" }],
        }),

        // update config
        updateConfig: builder.mutation({
            query: ({ id, value }) => ({
                url: `api/config/update/${id}`,
                method: "PUT",
                body: { value }, // backend chỉ nhận value mới
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "config", id },
                { type: "config", id: "LIST" },
            ],
        }),

        // delete config
        deleteConfig: builder.mutation({
            query: (id) => ({
                url: `api/config/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "config", id: "LIST" }],
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
