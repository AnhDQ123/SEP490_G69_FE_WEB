import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../utils/contant.js";

export const roleService = createApi({
    reducerPath: 'roles',
    baseQuery: fetchBaseQuery({baseUrl:BASE_URL}),
    tagTypes:["roles"],
    endpoints: (builder)=>({
        getRoles: builder.query({
            query: ({search='', page=1, size=20})=>({
                url:`/api/roles`,
                params:{search,page,size},
            }),
            // transformResponse: (response)=>({
            //     data: response.content
            // })
        }),
    })
})
export const {
    useGetRolesQuery,
} = roleService;