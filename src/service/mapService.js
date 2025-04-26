import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const mapService = createApi({
    reducerPath: "map",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["map"],
    endpoints: (builder) => ({
        // Geocode address
        getGeocode: builder.query({
            query: (address) => `api/map/geocode/${address}`,
            providesTags: ["map"],
        }),

        // Reverse geocode
        getReverseGeocode: builder.query({
            query: ({ lat, lng }) => `api/map/reverse-geocode/${lat}/${lng}`,
            providesTags: ["map"],
        }),

        // Get route
        getRoute: builder.query({
            query: ({ origin, destination }) => ({
                url: "api/map/getRoute",
                params: { origin, destination },
            }),
            providesTags: ["map"],
        }),
    }),
});

export const {
    useGetGeocodeQuery,
    useGetReverseGeocodeQuery,
    useGetRouteQuery,
} = mapService;
