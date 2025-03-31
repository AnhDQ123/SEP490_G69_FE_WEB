import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/constant.js';

export const paymentMethodService = createApi({
    reducerPath: 'paymentMethod',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['PaymentMethods'],
    endpoints: (builder) => ({
        // get all
        getAllPaymentMethods: builder.query({
            query: ({ page = 0, size = 10 }) =>
                `api/payment?page=${page}&size=${size}`,
            providesTags: ['PaymentMethods'],
        }),

        // get by id
        getPaymentMethodById: builder.query({
            query: (id) => `api/payment/${id}`,
            providesTags: (result, error, id) => [
                { type: 'PaymentMethods', id },
            ],
        }),

        // create
        createPaymentMethod: builder.mutation({
            query: (paymentMethod) => ({
                url: 'api/payment',
                method: 'POST',
                body: paymentMethod,
            }),
            invalidatesTags: ['PaymentMethods'],
        }),

        // update
        updatePaymentMethod: builder.mutation({
            query: ({ id, ...paymentMethod }) => ({
                url: `api/payment/${id}`,
                method: 'PUT',
                body: paymentMethod,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'PaymentMethods', id },
            ],
        }),

        // delete
        deletePaymentMethod: builder.mutation({
            query: (id) => ({
                url: `api/payment/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['PaymentMethods'],
        }),
    }),
});

export const {
    useGetAllPaymentMethodsQuery,
    useGetPaymentMethodByIdQuery,
    useCreatePaymentMethodMutation,
    useUpdatePaymentMethodMutation,
    useDeletePaymentMethodMutation,
} = paymentMethodService;
