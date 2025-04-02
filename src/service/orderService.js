import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from "../utils/constant.js";

export const orderService = createApi({
    reducerPath: 'orders',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['order'],
    endpoints: (builder) => ({

        getOrdersByFilter: builder.query({
            query: ({ status, startDate, endDate, orderCode, page = 0, size = 10 }) => {
                const params = {
                    page,
                    size,
                };

                if (status) params.status = status;
                if (startDate) params.startDate = startDate;
                if (endDate) params.endDate = endDate;
                if (orderCode) params.orderCode = orderCode;

                return {
                    url: 'api/order',
                    params,
                };
            },
            providesTags: ['order'],
        }),

        // Get order by id
        getOrderById: builder.query({
            query: (orderId) => `api/order/${orderId}`,
            providesTags: ['order'],
        }),

        // Get order count by status and day
        getOrderCountByStatusAndDay: builder.query({
            query: ({ status }) => ({
                url: "api/order/count/day",
                params: { status },
            }),
            providesTags: ['order'],
        }),

        // Get order count by status and month
        getOrderCountByStatusAndMonth: builder.query({
            query: ({ status }) => ({
                url: "api/order/count/month",
                params: { status },
            }),
            providesTags: ['order'],
        }),

        // Get order count by status and year
        getOrderCountByStatusAndYear: builder.query({
            query: ({ status }) => ({
                url: "api/order/count/year",
                params: { status },
            }),
            providesTags: ['order'],
        }),

        // Get top-selling products today
        getTopSellingProductsToday: builder.query({
            query: () => ({
                url: "api/order/top-selling/today",
            }),
            providesTags: ['order'],
        }),

        // Get top-selling products this month
        getTopSellingProductsThisMonth: builder.query({
            query: () => ({
                url: "api/order/top-selling/month",
            }),
            providesTags: ['order'],
        }),

        // Get top-selling products this year
        getTopSellingProductsThisYear: builder.query({
            query: () => ({
                url: "api/order/top-selling/year",
            }),
            providesTags: ['order'],
        }),

        // Get the total count of orders
        countAllOrders: builder.query({
            query: () => ({
                url: "api/order/count/orders",
            }),
            providesTags: ['order'],
        }),
    }),
});

export const {
    useGetOrdersByFilterQuery,
    useGetOrderByIdQuery,
    useGetOrderCountByStatusAndDayQuery,
    useGetOrderCountByStatusAndMonthQuery,
    useGetOrderCountByStatusAndYearQuery,
    useGetTopSellingProductsTodayQuery,
    useGetTopSellingProductsThisMonthQuery,
    useGetTopSellingProductsThisYearQuery,
    useCountAllOrdersQuery,
} = orderService;