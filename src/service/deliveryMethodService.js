import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/constant'; // Đảm bảo BASE_URL đúng

export const deliveryMethodService = createApi({
    reducerPath: 'deliveryMethods',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['DeliveryMethods'],

    endpoints: (builder) => ({
        // GET: Lấy tất cả phương thức giao hàng (phân trang + tìm kiếm nếu cần)
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

        // GET: Lấy 1 phương thức theo ID
        getDeliveryMethodById: builder.query({
            query: (id) => `/api/delivery/${id}`,
            providesTags: (result, error, id) => [{ type: 'DeliveryMethods', id }],
        }),

        // POST: Tạo phương thức mới
        createDeliveryMethod: builder.mutation({
            query: (deliveryMethod) => ({
                url: '/api/delivery',
                method: 'POST',
                body: deliveryMethod,
            }),
            invalidatesTags: [{ type: 'DeliveryMethods', id: 'LIST' }],
        }),

        // PUT: Cập nhật
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

        // DELETE: Xóa
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
