import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const shipperService = createApi({
    reducerPath: "shippers",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["shipper"],
    endpoints: (builder) => ({
        // get list
        getShippersByStatus: builder.query({
            query: ({ status, page = 0, size = 10, search = "" }) => ({
                url: `api/shippers`,
                params: { status, page, size, search },
            }),
            providesTags: ["shipper"],
        }),

        // get by id
        getShipperById: builder.query({
            query: (userId) => `api/shippers/${userId}`,
            providesTags: (result, error, userId) => [{ type: "shipper", id: userId }],
        }),

        // active
        shipperActive: builder.mutation({
            query: (userId) => ({
                url: `api/shippers/${userId}/active`, // URL kích hoạt shipper
                method: "PUT", // Phương thức PUT
            }),
            invalidatesTags: ["shipper"], // Invalidates cache khi kích hoạt shipper
        }),

        // inactive
        shipperInactive: builder.mutation({
            query: ({ userId, reason }) => ({
                url: `api/shippers/${userId}/inactive`,
                method: "PUT",
                params: { reason },  // Truyền lý do vào query parameter
            }),
            invalidatesTags: ["shipper"],  // Invalidates cache khi vô hiệu hóa shipper
        }),

        // approve
        approveShipper: builder.mutation({
            query: (userId) => ({
                url: `api/shippers/approve/${userId}`,
                method: "POST",
            }),
            invalidatesTags: ["shipper"],
        }),

        // reject
        rejectShipper: builder.mutation({
            query: ({ userId, reason }) => ({
                url: `api/shippers/${userId}/reject`,  // URL
                method: "POST", // Phương thức POST
                params: { reason },  // Truyền lý do qua query params
            }),
            invalidatesTags: ["shipper"], // Invalidate cache khi từ chối shipper
        }),

        // update
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
