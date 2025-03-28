import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const shopService = createApi({
    reducerPath: "shops",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["shops"],
    endpoints: (builder) => ({
        getShop: builder.query({
            query: () => "api/shops",
            providesTags: ["shops"],
        }),
        getShopById: builder.query({
            query: (id) => `api/shops/${id}`,
            providesTags: (result, error, shopId) => [{ type: "shops", shopId: shopId }],
        }),

        // Mutation for rejecting a shop
        rejectShop: builder.mutation({
            query: ({ shopId, reason }) => ({
                url: `api/shops/${shopId}/reject`,
                method: "PUT",
                params: { reason },
            }),
            invalidatesTags: ["shops"], // Invalidate shop data after rejection
        }),

        // Mutation for approving a shop
        approveShop: builder.mutation({
            query: (shopId) => ({
                url: `api/shops/${shopId}/approve`,
                method: "PUT",
            }),
            // Sau khi duyệt shop, lấy lại dữ liệu của shop để cập nhật trạng thái
            async onQueryStarted(shopId, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled; // Đợi mutation hoàn tất
                    // Lấy lại thông tin shop sau khi duyệt và làm mới trạng thái trong cache
                    dispatch(shopService.util.invalidateTags([{ type: "shops", shopId }]));
                } catch (error) {
                    console.error('Failed to approve shop:', error);
                }
            },
            invalidatesTags: [{ type: "shops", shopId: "LIST" }], // Invalidate list of shops
        }),

        // Mutation to update the shop's status
        updateShopStatus: builder.mutation({
            query: ({ shopId, status }) => ({
                url: `api/shops/${shopId}/status`,
                method: "PUT",
                params: { status },
            }),
            invalidatesTags: ["shops"], // Automatically refresh shop data after status update
        }),

        // Search and paginate shops
        searchAndPaginateShops: builder.query({
            query: ({ status = '', search = '', type = "", page = 1, size = 10 }) => ({
                url: 'api/shops',
                params: { status, search, type, page, size },
            }),
            providesTags: ["shops"],
        }),
    }),
});

export const {
    useGetShopQuery,
    useGetShopByIdQuery,
    useRejectShopMutation,
    useApproveShopMutation,
    useUpdateShopStatusMutation,
    useSearchAndPaginateShopsQuery,
} = shopService;
