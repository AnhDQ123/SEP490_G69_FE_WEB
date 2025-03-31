import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/constant'; // Đảm bảo BASE_URL đúng

export const deliveryMethodService = createApi({
    reducerPath: 'deliveryMethods',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['DeliveryMethods'],

    endpoints: (builder) => ({
        // get all
        getAllDeliveryMethods: builder.query({
            query: ({ page = 0, size = 10, search = '' }) =>
                `/api/delivery?page=${page}&size=${size}&search=${search}`,
            providesTags: (result) =>
                result?.content
                    ? [
                        ...result.content.map(({ id }) => ({
                            type: 'DeliveryMethods',
                            id,
                        })),
                        { type: 'DeliveryMethods', id: 'LIST' },
                    ]
                    : [{ type: 'DeliveryMethods', id: 'LIST' }],
        }),

        // get by id
        getDeliveryMethodById: builder.query({
            query: (id) => `/api/delivery/${id}`,
            providesTags: (result, error, id) => [{ type: 'DeliveryMethods', id }],
        }),

        // Create
        createDeliveryMethod: builder.mutation({
            query: (deliveryMethod) => ({
                url: '/api/delivery',
                method: 'POST',
                body: deliveryMethod,
            }),
            invalidatesTags: [{ type: 'DeliveryMethods', id: 'LIST' }],
        }),

        // Update
        updateDeliveryMethod: builder.mutation({
            query: ({ id, ...deliveryMethod }) => ({
                url: `/api/delivery/${id}`,
                method: 'PUT',
                body: deliveryMethod,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'DeliveryMethods', id },
                { type: 'DeliveryMethods', id: 'LIST' },
            ],
        }),

        // delete
        deleteDeliveryMethod: builder.mutation({
            query: (id) => ({
                url: `/api/delivery/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'DeliveryMethods', id },
                { type: 'DeliveryMethods', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetAllDeliveryMethodsQuery,
    useGetDeliveryMethodByIdQuery,
    useCreateDeliveryMethodMutation,
    useUpdateDeliveryMethodMutation,
    useDeleteDeliveryMethodMutation,
} = deliveryMethodService;
