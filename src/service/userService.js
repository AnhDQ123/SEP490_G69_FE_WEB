import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const usersService = createApi({
    reducerPath: "users",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["user"],
    endpoints: (builder) => ({
        // get list
        getUsers: builder.query({
            query: () => "api/users",
            providesTags: ["user"],
        }),

        // get list + search + page
        searchAndPagination: builder.query({
            query: ({ search = "", page = 1, size = 2 }) => ({
                url: `api/users`,
                params: { search, page, size },
            }),
            providesTags: ["user"],
        }),

        // get by id
        getUserById: builder.query({
            query: (id) => `api/users/${id}`,
            providesTags: (result, error, id) => [{ type: "user", id: id }],
        }),

        // create
        addUser: builder.mutation({
            query: (userData) => ({
                url: "api/users/add",
                method: "POST",
                body: userData,
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["user"],
        }),

        // inactive
        inactiveUser: builder.mutation({
            query: (id) => ({
                url: "api/users/inactive",
                method: "POST",
                params: { id },
            }),
            invalidatesTags: ["user"],
        }),

        // active
        activeUser: builder.mutation({
            query: (id) => ({
                url: "api/users/active",
                method: "POST",
                params: { id },
            }),
            invalidatesTags: ["user"],
        }),

        // Count by year
        getUserCountByYear: builder.query({
            query: ({ startDate, endDate, status }) => ({
                url: "api/users/count/year",
                params: { startDate, endDate, status },
            }),
            providesTags: ["user"],
        }),

        // Count by month
        getUserCountByMonth: builder.query({
            query: ({ startDate, endDate, status }) => ({
                url: "api/users/count/month",
                params: { startDate, endDate, status },
            }),
            providesTags: ["user"],
        }),

        // Count by day
        getUserCountByDay: builder.query({
            query: ({ startDate, endDate, status }) => ({
                url: "api/users/count/day",
                params: { startDate, endDate, status },
            }),
            providesTags: ["user"],
        }),

        // Count user is shopkeeper
        getUserHaveShopCount: builder.query({
            query: () => "api/users/count/shop",
            providesTags: ["user"],
        }),

        // Count user is shipper
        getUserAreShipperCount: builder.query({
            query: () => "api/users/count/shipper",
            providesTags: ["user"],
        }),

        // Get all shipper pending
        getPendingShipper: builder.query({
            query: () => "api/users/count/pendingshipper",
            providesTags: ["user"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useSearchAndPaginationQuery,
    useGetUserByIdQuery,
    useAddUserMutation,
    useInactiveUserMutation,
    useActiveUserMutation,
    useGetUserCountByYearQuery,
    useGetUserCountByMonthQuery,
    useGetUserCountByDayQuery,
    useGetUserHaveShopCountQuery,
    useGetUserAreShipperCountQuery,
    useGetPendingShipperQuery,
} = usersService;
