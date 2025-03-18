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
        updateShopStatus: builder.mutation({
            query: ({ shopId, status }) => ({
                url: `api/shops/${shopId}/status`,
                method: "PUT",
                params: { status }, // Gửi status dưới dạng query param
            }),
            invalidatesTags: ["shops"], // Tự động làm mới dữ liệu shop sau khi cập nhật
        }),
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
    useUpdateShopStatusMutation,
    useSearchAndPaginateShopsQuery, // Hook để tìm kiếm & phân trang
} = shopService;
