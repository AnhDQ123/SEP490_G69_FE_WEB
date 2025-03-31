import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const bannerService = createApi({
    reducerPath: "banners",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["banner"],
    endpoints: (builder) => ({

        // get all
        getBanners: builder.query({
            query: ({ page = 0, size = 10 }) => ({
                url: `api/banners`,
                params: { page, size },
            }),
            providesTags: ["banner"],
        }),

        // get by id
        getBannerById: builder.query({
            query: (bannerId) => `api/banners/${bannerId}`,
            providesTags: (result, error, bannerId) => [{ type: "banner", id: bannerId }],
        }),

        // create
        createBanner: builder.mutation({
            query: (formData) => ({
                url: `api/banners/create`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["banner"],
        }),

        // update
        updateBanner: builder.mutation({
            query: ({ bannerId, formData }) => ({
                url: `api/banners/update/${bannerId}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["banner"],
        }),

        // delete
        deleteBanner: builder.mutation({
            query: (bannerId) => ({
                url: `api/banners/delete/${bannerId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["banner"],
        }),
    }),
});

export const {
    useGetBannersQuery,
    useGetBannerByIdQuery,
    useCreateBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} = bannerService;
