import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const shopService = createApi({
    reducerPath: "shops",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["shops"],
    endpoints: (builder) => ({

        // List shop
        getShop: builder.query({
            query: () => "api/shops",
            providesTags: ["shops"],
        }),

        // Get shop by id
        getShopById: builder.query({
            query: (id) => `api/shops/${id}`,
            providesTags: (result, error, shopId) => [{ type: "shops", shopId: shopId }],
        }),

        // Rejecting a shop
        rejectShop: builder.mutation({
            query: ({ shopId, reason }) => ({
                url: `api/shops/${shopId}/reject`,
                method: "PUT",
                params: { reason },
            }),
            invalidatesTags: ["shops"], // Invalidate shop data after rejection
        }),

        // Approving a shop
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

        // Update shop status
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

        // Active shop
        activateShop: builder.mutation({
            query: ({shopId = ''}) => ({
                url: `api/shops/${shopId}/active`,
                method: "PUT",
            }),
            invalidatesTags: (result, error, shopId) => [
                { type: "shops" },
                { type: "shops", shopId },
            ],
        }),

        // Inactive shop (with reason)
        inactivateShop: builder.mutation({
            query: ({ shopId, reason }) => ({
                url: `api/shops/${shopId}/inactive`,
                method: "PUT",
                params: { reason }, // Đảm bảo lý do được gửi qua query params
            }),
            invalidatesTags: (result, error, shopId) => [
                { type: "shops" },
                { type: "shops", shopId },
            ],
        }),

        // Counting shops by day
        getShopCountByDay: builder.query({
            query: ({ status }) => ({
                url: 'api/shops/count/day',
                params: { status },
            }),
            providesTags: ["shops"],
        }),

        // Counting shops by month
        getShopCountByMonth: builder.query({
            query: ({ status }) => ({
                url: 'api/shops/count/month',
                params: { status },
            }),
            providesTags: ["shops"],
        }),

        // Counting shops by year
        getShopCountByYear: builder.query({
            query: ({ status }) => ({
                url: 'api/shops/count/year',
                params: { status },
            }),
            providesTags: ["shops"],
        }),

        // Counting pending shops
        getShopPendingCount: builder.query({
            query: () => 'api/shops/count/pending',
            providesTags: ["shops"],
        }),

        // Calculate shop revenue by day
        getShopRevenueByDay: builder.query({
            query: ({ startDate, endDate, shopId }) => ({
                url: "api/shops/revenue/day",
                params: { startDate, endDate, shopId },
            }),
            providesTags: ["shops"],
        }),

        // Calculate shop revenue by month
        getShopRevenueByMonth: builder.query({
            query: ({ startDate, endDate, shopId }) => ({
                url: "api/shops/revenue/month",
                params: { startDate, endDate, shopId },
            }),
            providesTags: ["shops"],
        }),

        // Calculate shop revenue by year
        getShopRevenueByYear: builder.query({
            query: ({ startDate, endDate, shopId }) => ({
                url: "api/shops/revenue/year",
                params: { startDate, endDate, shopId },
            }),
            providesTags: ["shops"],
        }),
        getShopChangeRate: builder.query({
            query: () => 'api/shops/change/rate',  // Assuming your backend URL is like this
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
    useActivateShopMutation,
    useInactivateShopMutation,
    useGetShopCountByDayQuery,
    useGetShopCountByMonthQuery,
    useGetShopCountByYearQuery,
    useGetShopPendingCountQuery,
    useGetShopRevenueByDayQuery,
    useGetShopRevenueByMonthQuery,
    useGetShopRevenueByYearQuery,
    useGetShopChangeRateQuery,
} = shopService;
