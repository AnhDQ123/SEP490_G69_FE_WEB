import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/constant'; // Đảm bảo BASE_URL đúng với URL API của bạn

export const deliveryMethodService = createApi({
    reducerPath: 'deliveryMethods',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }), // Base URL cho API
    tagTypes: ['DeliveryMethods'], // Để xác định các tag cho invalidate hoặc refetch
    endpoints: (builder) => ({
        // Lấy tất cả phương thức giao hàng với phân trang
        getAllDeliveryMethods: builder.query({
            query: (page = 0, size = 10) => `/api/delivery?page=${page}&size=${size}`, // Gọi API với phân trang
            providesTags: ['DeliveryMethods'],
        }),

        // Lấy phương thức giao hàng theo ID
        getDeliveryMethodById: builder.query({
            query: (id) => `/api/delivery/${id}`, // Gọi API với ID
            providesTags: (result, error, id) => [{ type: 'DeliveryMethods', id }],
        }),

        // Tạo phương thức giao hàng mới
        createDeliveryMethod: builder.mutation({
            query: (deliveryMethod) => ({
                url: '/api/delivery',
                method: 'POST',
                body: deliveryMethod, // Dữ liệu để gửi lên API
            }),
            invalidatesTags: ['DeliveryMethods'], // Khi tạo thành công, làm mới danh sách
        }),

        // Cập nhật phương thức giao hàng
        updateDeliveryMethod: builder.mutation({
            query: ({ id, deliveryMethod }) => ({
                url: `/api/delivery/${id}`,
                method: 'PUT',
                body: deliveryMethod, // Dữ liệu cần cập nhật
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'DeliveryMethods', id }],
        }),

        // Xóa phương thức giao hàng
        deleteDeliveryMethod: builder.mutation({
            query: (id) => ({
                url: `/api/delivery/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DeliveryMethods'], // Khi xóa thành công, làm mới danh sách
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
