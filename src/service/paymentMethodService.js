import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/constant.js';

export const paymentMethodService = createApi({
    reducerPath: 'paymentMethod', // Đặt tên cho API slice
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }), // Cấu hình URL gốc
    tagTypes: ['PaymentMethods'], // Các tag để invalidates các cache
    endpoints: (builder) => ({
        // Lấy danh sách các phương thức thanh toán
        getAllPaymentMethods: builder.query({
            query: ({ page = 0, size = 10, search = '' }) =>
                `api/payment?page=${page}&size=${size}&search=${search}`, // Thêm tham số tìm kiếm
            providesTags: ['PaymentMethods'], // Tag để thông báo invalidation
        }),

        // Lấy phương thức thanh toán theo ID
        getPaymentMethodById: builder.query({
            query: (id) => `api/payment/${id}`, // Lấy theo ID
            providesTags: (result, error, id) => [
                { type: 'PaymentMethods', id },
            ],
        }),

        // Tạo mới phương thức thanh toán
        createPaymentMethod: builder.mutation({
            query: (paymentMethod) => ({
                url: 'api/payment', // API endpoint cho tạo mới
                method: 'POST',
                body: paymentMethod, // Dữ liệu gửi đi
            }),
            invalidatesTags: ['PaymentMethods'], // Invalidate khi có thay đổi
        }),

        // Cập nhật phương thức thanh toán
        updatePaymentMethod: builder.mutation({
            query: ({ id, ...paymentMethod }) => ({
                url: `api/payment/${id}`, // Endpoint cho cập nhật
                method: 'PUT',
                body: paymentMethod, // Cập nhật dữ liệu
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'PaymentMethods', id },
            ],
        }),

        // Xóa phương thức thanh toán
        deletePaymentMethod: builder.mutation({
            query: (id) => ({
                url: `api/payment/${id}`, // Endpoint xóa
                method: 'DELETE',
            }),
            invalidatesTags: ['PaymentMethods'], // Invalidate khi xóa thành công
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
