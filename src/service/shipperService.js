import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const shipperService = createApi({
    reducerPath: "shippers",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["shipper"],
    endpoints: (builder) => ({
        // Lấy danh sách shipper theo trạng thái
        getShippersByStatus: builder.query({
            query: ({ status, page = 0, size = 10, search = "" }) => ({
                url: `api/shippers`,
                params: { status, page, size, search },
            }),
            providesTags: ["shipper"],
        }),

        // Lấy thông tin chi tiết shipper
        getShipperById: builder.query({
            query: (userId) => `api/shippers/${userId}`,
            providesTags: (result, error, userId) => [{ type: "shipper", id: userId }],
        }),

        // Kích hoạt shipper (shipperActive)
        shipperActive: builder.mutation({
            query: (userId) => ({
                url: `api/shippers/${userId}/active`, // URL kích hoạt shipper
                method: "PUT", // Phương thức PUT
            }),
            invalidatesTags: ["shipper"], // Invalidates cache khi kích hoạt shipper
        }),

        // Vô hiệu hóa shipper (shipperInactive)
        shipperInactive: builder.mutation({
            query: ({ userId, reason }) => ({
                url: `api/shippers/${userId}/inactive`,
                method: "PUT",
                params: { reason },  // Truyền lý do vào query parameter
            }),
            invalidatesTags: ["shipper"],  // Invalidates cache khi vô hiệu hóa shipper
        }),


        // Phê duyệt shipper
        approveShipper: builder.mutation({
            query: (userId) => ({
                url: `api/shippers/approve/${userId}`,
                method: "POST",
            }),
            invalidatesTags: ["shipper"],
        }),

        // Từ chối shipper
        rejectShipper: builder.mutation({
            query: ({ userId, reason }) => ({
                url: `api/shippers/${userId}/reject`,
                method: "PUT",
                params: { reason },
            }),
            invalidatesTags: ["shipper"],
        }),

        // Cập nhật thông tin shipper
        updateShipper: builder.mutation({
            query: ({ userId, shipperData }) => {
                return {
                    url: `api/shippers/update/${userId}`,
                    method: "PUT",
                    body: shipperData,
                };
            },
            invalidatesTags: ["shipper"],
        }),
    }),
});

export const {
    useGetShippersByStatusQuery,
    useGetShipperByIdQuery,
    useShipperActiveMutation,  // Hook cho shipperActive
    useShipperInactiveMutation,  // Hook cho shipperInactive
    useApproveShipperMutation,
    useRejectShipperMutation,
    useUpdateShipperMutation,
} = shipperService;
