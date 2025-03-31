// service/categoryService.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/constant';

export const categoryService = createApi({
    reducerPath: 'category',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        // get all
        getAllCategories: builder.query({
            query: ({ search = '', page = 1, size = 10 } = {}) => ({
                url: 'api/category',
                params: { search, page, size },
            }),
            providesTags: ['Category'],
        }),

        // get by id
        getCategoryById: builder.query({
            query: (id) => `api/category/${id}`,
            providesTags: (result, error, id) => [{ type: 'Category', id }],
        }),

        // create
        createCategory: builder.mutation({
            query: ({ data, file }) => {
                const formData = new FormData();
                for (const key in data) {
                    formData.append(key, data[key]);
                }
                if (file) {
                    formData.append('file', file);
                }

                return {
                    url: 'api/category/create',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Category'],
        }),

        // update
        updateCategory: builder.mutation({
            query: ({ id, data, file }) => {
                const formData = new FormData();
                for (const key in data) {
                    formData.append(key, data[key]);
                }
                if (file) {
                    formData.append('file', file);
                }

                return {
                    url: `api/category/update/${id}`,
                    method: 'PUT',
                    body: formData,
                };
            },
            invalidatesTags: ['Category'],
        }),

        // delete
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `api/category/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryService;
