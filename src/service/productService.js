import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const productService = createApi({
    reducerPath: "products",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["products"],
    endpoints: (builder) => ({
        // Lấy tất cả sản phẩm của một cửa hàng
        getProductsByShop: builder.query({
            query: ({ id, page = 1, size = 20 }) =>
                `api/product/shop/${id}?page=${page}&size=${size}`,
            providesTags: ["products"],
        }),
        getProduct: builder.query({
            query: () => "api/product/all",
            providesTags: ["products"],
        }),
        getProductById: builder.query({
            query: (id) => `api/product/${id}`,
            providesTags: (result, error, productId) => [
                { type: "products", productId: productId },
            ],
        }),
    }),
});

export const {
    useGetProductsByShopQuery,
    useGetProductQuery,
    useGetProductByIdQuery,
} = productService;
