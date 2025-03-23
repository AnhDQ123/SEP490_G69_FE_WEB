// service/categoryService.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/constant'; // Đảm bảo BASE_URL là http://localhost:8080 hoặc tương ứng

export const categoryService = createApi({
    reducerPath: 'category',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: () => 'api/category', // khớp với controller @GetMapping
            providesTags: ['Category'],
        }),
    }),
});

export const { useGetAllCategoriesQuery } = categoryService;
