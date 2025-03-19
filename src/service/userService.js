import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const usersService = createApi({
    reducerPath: "users",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["user"],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => "api/users",
            providesTags: ["user"],
        }),
        searchAndPagination: builder.query({
            query: ({ search = "", page = 1, size = 2 }) => ({
                url: `api/users`,
                params: { search, page, size },
            }),
        }),
        getUserById: builder.query({
            query: (id) => `api/users/${id}`,
            providesTags: (result, error, id) => [{ type: "user", id: id }],
        }),
        addUser: builder.mutation({
            query: (userData) => ({
                url: "api/users/add",
                method: "POST",
                body: userData,
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["user"],
        }),
        updateUser: builder.mutation({
            query: ({ user, avatar }) => {
                const formData = new FormData();
                Object.keys(user).forEach((key) => {
                    formData.append(key, user[key]);
                });
                if (avatar) {
                    formData.append("avatar", avatar);
                }
                return {
                    url: "api/users/update",
                    method: "PUT",
                    body: formData,
                };
            },
            invalidatesTags: ["user"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useSearchAndPaginationQuery,
    useGetUserByIdQuery,
    useAddUserMutation,
    useUpdateUserMutation,
} = usersService;
