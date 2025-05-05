import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

// Blog Service API using Redux Toolkit Query
export const blogService = createApi({
    reducerPath: "blogs",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["blog"], // Tagging to invalidate specific cache
    endpoints: (builder) => ({
        getBlogs: builder.query({
            query: ({ search = "", page = 0, size = 10 }) => ({
                url: "api/blogs",
                params: { search, page, size },  // Make sure these parameters are passed correctly
            }),
            providesTags: ["blog"],
        }),

        // get by id
        getBlogById: builder.query({
            query: (id) => `api/blogs/${id}`,  // Truyền id qua query parameter
            providesTags: (result, error, id) => [{ type: "blog", id: id }],
        }),

        // update
        updateBlog: builder.mutation({
            query: ({ id, blogDTO, files }) => ({
                url: `api/blogs/${id}`,
                method: "PUT",
                body: {
                    ...blogDTO,
                    files: files, // Send files if any
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
            // Invalidate the blog cache upon update
            invalidatesTags: (result, error, { id }) => [{ type: "blog", id: id }],
        }),

        // delete
        deleteBlog: builder.mutation({
            query: (id) => ({
                url: `api/blogs/${id}`,
                method: "DELETE",
            }),
            // Invalidate the blog cache after deletion
            invalidatesTags: ["blog"],
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetBlogByIdQuery,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = blogService;
