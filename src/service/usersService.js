import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../utils/contant.js";

export const usersService = createApi({
    reducerPath: 'users',
    baseQuery: fetchBaseQuery({baseUrl:BASE_URL}),
    tagTypes: ['user'],
    endpoints:(builder)=> ({
        getUsers: builder.query({
            query: ()=>'users',
            providesTags: ['user'],

        }),
        searchAndPagination : builder.query({
            query: ({search='', page=1, size=2})=>({
                url:`users`,
                params:{search,page,size},
            }),
            // transformResponse: (response)=>({
            //     data: response.content
            // })
        }),
        getUserById: builder.query({
            query: (id)=>`users/${id}`,
            providesTags: (result, error, id)=>[{type:"user", id:id}],
        }),
        addUser: builder.mutation({
            query: (user)=>({
                url: "users",
                method: "POST",
                body: JSON.stringify(user),
            }),
            invalidatesTags: ['user'],
        }),
        updateUser: builder.mutation({
            query:({id, ...user})=>( {
                url: `users/${id}`,
                method: "PUT",
                body: JSON.stringify(user),
            }),
            invalidatesTags: (result, error, {id}) =>[{type:"user", id}],
        }),
        deleteUser: builder.mutation({
            query: (id)=>( {
                url: `users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['user']
        })
    })
})

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useSearchAndPaginationQuery,

} = usersService;