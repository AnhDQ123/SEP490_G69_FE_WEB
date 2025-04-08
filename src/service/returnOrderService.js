import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/constant'; // Make sure BASE_URL is correct

export const returnOrderService = createApi({
    reducerPath: 'returnOrders',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['ReturnOrders'],

    endpoints: (builder) => ({
        // Accept Return
        acceptReturnOrder: builder.mutation({
            query: (id) => ({
                url: `/api/order/acceptReturn`,
                method: 'PUT',
                params: { id },
            }),
            invalidatesTags: [{ type: 'ReturnOrders', id: 'LIST' }],
        }),

        // Reject Return
        rejectReturnOrder: builder.mutation({
            query: (id) => ({
                url: `/api/order/rejectReturn`,
                method: 'POST',
                params: { id },
            }),
            invalidatesTags: [{ type: 'ReturnOrders', id: 'LIST' }],
        }),

        // View Return Order
        viewReturnOrder: builder.query({
            query: (id) => ({
                url: `/api/order/viewReturn?id=${id}`, // Sử dụng query string trực tiếp
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'ReturnOrders', id }],
        }),

        // Get All Pending Return Requests
        getAllPendingReturnRequests: builder.query({
            query: (pageable) => ({
                url: `/api/order/return/pending`,
                params: {
                    page: pageable.page || 1,
                    size: pageable.size || 10,
                },
                method: 'GET',
            }),
            providesTags: [{ type: 'ReturnOrders', id: 'RETURN_PENDING' }],
        }),

        // Get All Rejected Return Requests
        getAllRejectedReturnRequests: builder.query({
            query: (pageable) => ({
                url: `/api/order/return/rejected`,
                params: {
                    page: pageable.page || 1,
                    size: pageable.size || 10,
                },
                method: 'GET',
            }),
            providesTags: [{ type: 'ReturnOrders', id: 'RETURN_REJECTED' }],
        }),

        // Get All Accepted Return Requests
        getAllAcceptedReturnRequests: builder.query({
            query: (pageable) => ({
                url: `/api/order/return/accepted`,
                params: {
                    page: pageable.page || 1,
                    size: pageable.size || 10,
                },
                method: 'GET',
            }),
            providesTags: [{ type: 'ReturnOrders', id: 'RETURNED' }],
        }),
    }),
});

export const {
    useAcceptReturnOrderMutation,
    useRejectReturnOrderMutation,
    useViewReturnOrderQuery,
    useGetAllPendingReturnRequestsQuery,
    useGetAllRejectedReturnRequestsQuery,
    useGetAllAcceptedReturnRequestsQuery,
} = returnOrderService;
