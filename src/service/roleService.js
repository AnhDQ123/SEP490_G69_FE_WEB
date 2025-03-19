import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const rolesService = createApi({
    reducerPath: "roles",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["role"],
    endpoints: (builder) => ({
        getRoles: builder.query({
            query: () => "api/role",
            providesTags: ["role"],
        }),

    }),
});

export const {
    useGetRolesQuery,

} = rolesService;
