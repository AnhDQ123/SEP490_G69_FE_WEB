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
            query: ({ status }) => ({
                url: "api/users/count/year",
                params: {  status },
            }),
            providesTags: ["user"],
        }),

        // Count by month
        getUserCountByMonth: builder.query({
            query: ({ status }) => ({
                url: "api/users/count/month",
                params: { status },
            }),
            providesTags: ["user"],
        }),

        // Count by day
        getUserCountByDay: builder.query({
            query: ({ status }) => ({
                url: "api/users/count/day",
                params: {  status },
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

        // Count all user
        getAllUserCount: builder.query({
            query: () => "api/users/count/all",
            providesTags: ["user"],
        }),

        // Get User Rate
        getUserRate: builder.query({
            query: () => "api/users/change/rate",
        }),

        // Get Shipper Rate
        getShipperRate: builder.query({
            query: () => "api/users/shipper/change/rate", // Đảm bảo API này đúng
        }),

        // Get User Register Rate
        getUserRegisterPending: builder.query({
            query: () => "api/users/pending/change/rate",
        }),

        changePassword: builder.mutation({
            query: ({ id, oldPassword, newPassword, confirmPassword }) => ({
                url: `api/users/changePassword`,
                method: "PUT",
                params: { id, oldPassword, newPassword, confirmPassword },
            }),
        }),

        // Forgot Password
        forgotPassword: builder.mutation({
            query: ({ phone, password, confirmPassword }) => ({
                url: `api/users/forgot`,
                method: "PUT",
                params: { phone, password, confirmPassword },
            }),
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
    useGetAllUserCountQuery,
    useGetUserRateQuery,
    useGetShipperRateQuery,
    useGetUserRegisterPendingQuery,
    useChangePasswordMutation,
    useForgotPasswordMutation,
} = usersService;
