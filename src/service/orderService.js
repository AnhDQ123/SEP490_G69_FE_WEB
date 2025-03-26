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

        getOrderById: builder.query({
            query: (orderId) => `api/order/${orderId}`,
            providesTags: ['order'],
        }),
    }),
});

export const {
    useGetOrdersByFilterQuery,
    useGetOrderByIdQuery,
} = orderService;