// service/commentService.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/constant';

export const commentService = createApi({
    reducerPath: 'comment',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['Comment'],
    endpoints: (builder) => ({

        // get all cmt of blog by blog id
        getCommentsByBlog: builder.query({
            query: ({ blogId, offset = 0, limit = 10 }) => ({
                url: `api/comments/${blogId}`,
                params: { offset, limit },
            }),
            providesTags: (result, error, { blogId }) => [{ type: 'Comment', id: blogId }],
        }),

        // get all reply of each comment
        getMoreReplies: builder.query({
            query: ({ parentId, offset = 0, limit = 5 }) => ({
                url: 'api/comments/replies',
                params: { parentId, offset, limit },
            }),
            providesTags: (result, error, { parentId }) => [{ type: 'Comment', id: parentId }],
        }),

        // add comment
        addComment: builder.mutation({
            query: ({ blogId, data }) => ({
                url: `api/comments?blogId=${blogId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Comment'],
        }),

        // Like / Unlike comment
        toggleLikeComment: builder.mutation({
            query: ({ commentId, userId }) => ({
                url: `api/comments/${commentId}/like?userId=${userId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Comment'],
        }),

        // delete comment
        deleteComment: builder.mutation({
            query: (commentId) => ({
                url: `api/comments/${commentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Comment'],
        }),
    }),
});

export const {
    useGetCommentsByBlogQuery,
    useGetMoreRepliesQuery,
    useAddCommentMutation,
    useToggleLikeCommentMutation,
    useDeleteCommentMutation,
} = commentService;
