import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const shipperService = createApi({
    reducerPath: "shippers",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["shipper"],
    endpoints: (builder) => ({
        // Shipper list by status
        getShippersByStatus: builder.query({
            query: ({ status, page = 0, size = 10, search = '' }) => ({
                url: `api/shippers`, // The endpoint to fetch the list of shippers
                params: { status, page, size, search }, // Query parameters passed
            }),
            providesTags: ["shipper"], // Used to manage cache invalidation for this query
        }),

        // Shipper detail
        getShipperById: builder.query({
            query: (userId) => `api/shippers/${userId}`,
            providesTags: (result, error, userId) => [{ type: "shipper", id: userId }],
        }),

        // Active shipper
        activateShipper: builder.mutation({
            query: (userId) => ({
                url: `api/shippers/${userId}/active`,
                method: "PUT",
            }),
            invalidatesTags: ["shipper"],
        }),

        // Inactive shipper
        deactivateShipper: builder.mutation({
            query: (userId) => ({
                url: `api/shippers/${userId}/inactive`,
                method: "PUT",
            }),
            invalidatesTags: ["shipper"],
        }),

        // Accept shipper
        approveShipper: builder.mutation({
            query: (userId) => ({
                url: `api/shippers/approve/${userId}`,
                method: "POST",
            }),
            invalidatesTags: ["shipper"],
        }),

        // Reject Shipper
        rejectShipper: builder.mutation({
            query: ({ userId, reason }) => ({
                url: `api/shippers/${userId}/reject`,
                method: "POST",
                params: { reason },
            }),
            invalidatesTags: ["shipper"],
        }),

        // Cập nhật thông tin shipper (FormData)
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
    useActivateShipperMutation,
    useDeactivateShipperMutation,
    useApproveShipperMutation,
    useRejectShipperMutation,
    useUpdateShipperMutation,
} = shipperService;
