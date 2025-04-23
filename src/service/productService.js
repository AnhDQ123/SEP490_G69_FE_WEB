import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const productService = createApi({
    reducerPath: "products",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["products"],
    endpoints: (builder) => ({
        // get all
        getProductsByShop: builder.query({
            query: ({ id, page = 1, size = 20 }) =>
                `api/product/shop/${id}?page=${page}&size=${size}`,
            providesTags: ["products"],
        }),
        getProduct: builder.query({
            query: () => "api/product/all",
            providesTags: ["products"],
        }),

        // get by id
        getProductById: builder.query({
            query: (id) => `api/product/${id}`,
            providesTags: (result, error, productId) => [
                { type: "products", productId: productId },
            ],
        }),

        // Get top-selling products by day
        getTopSellingProductsToday: builder.query({
            query: ( shopId ) => `api/product/top-selling/today?shopId=${shopId}`,
            providesTags: ["shops"],
        }),

        // Get top-selling products by month
        getTopSellingProductsThisMonth: builder.query({
            query: ( shopId ) => `api/product/top-selling/month?shopId=${shopId}`,
            providesTags: ["shops"],
        }),

        // Get top-selling products by year
        getTopSellingProductsThisYear: builder.query({
            query: ( shopId ) => `api/product/top-selling/year?shopId=${shopId}`,
            providesTags: ["shops"],
        }),
    }),
});

export const {
    useGetProductsByShopQuery,
    useGetProductQuery,
    useGetProductByIdQuery,
    useGetTopSellingProductsTodayQuery,
    useGetTopSellingProductsThisMonthQuery,
    useGetTopSellingProductsThisYearQuery,
} = productService;
