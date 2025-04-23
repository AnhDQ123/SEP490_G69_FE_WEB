import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const reportService = createApi({
    reducerPath: "reports",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["reports"],
    endpoints: (builder) => ({
        // Fetch a report by ID
        getReportById: builder.query({
            query: (id) => `api/report/${id}`,
            providesTags: (result, error, id) => [{ type: "reports", id }],
        }),

        // Create a new report
        createReport: builder.mutation({
            query: ({ reportCreateDTO, option }) => ({
                url: "api/report/create",
                method: "POST",
                body: reportCreateDTO,
                params: { option },
            }),
            invalidatesTags: ["reports"], // Invalidate report data after creation
        }),

        // Add a file to an existing report
        addToReport: builder.mutation({
            query: ({ id, option }) => ({
                url: "api/report/add",
                method: "POST",
                params: { id, option },
            }),
            invalidatesTags: [{ type: "reports", id: "LIST" }], // Invalidate report list after adding to report
        }),

        // Fetch all reports for a specific shop
        getAllReportsByShop: builder.query({
            query: ({ shopId, page = 1, size = 20 }) => ({
                url: `api/report/shop/${shopId}`,
                params: { shopId, page, size },
            }),
            providesTags: ["reports"],
        }),

        // Fetch all reports
        getAllReports: builder.query({
            query: ({ page = 1, size = 20 }) => ({
                url: "api/report/all",
                params: { page, size },
            }),
            providesTags: ["reports"],
        }),

        // Get count of reports by day
        getReportCountByDay: builder.query({
            query: ({ status, type }) => ({
                url: "api/report/count/day",
                params: { status, type },
            }),
            providesTags: ["reports"],
        }),

        // Get count of reports by month
        getReportCountByMonth: builder.query({
            query: ({ status, type }) => ({
                url: "api/report/count/month",
                params: { status, type },
            }),
            providesTags: ["reports"],
        }),

        // Get count of reports by year
        getReportCountByYear: builder.query({
            query: ({ status, type }) => ({
                url: "api/report/count/year",
                params: { status, type },
            }),
            providesTags: ["reports"],
        }),

        // Get the total count of pending reports
        getReportPendingCount: builder.query({
            query: () => "api/report/count/pending",
            providesTags: ["reports"],
        }),

        // Fetch all reports by status
        getAllReportsByStatus: builder.query({
            query: ({ status, page = 1, size = 20 }) => ({
                url: "api/report/status",
                params: { status, page, size },
            }),
            providesTags: ["reports"],
        }),

        // Update the status of a report
        updateReportStatus: builder.mutation({
            query: (id ) => ({
                url: "api/report/update",
                method: "PUT",
                params: { id: id }, // passing status and id as query params
            }),
            invalidatesTags: [{ type: "reports", id: "LIST" }], // Invalidate the report list after status update
        }),

        // Fetch all reports by type
        getAllReportsByType: builder.query({
            query: ({ type = 4, page = 1, size = 20 }) => ({
                url: `api/report/type`,
                params: { type, page, size },
            }),
            providesTags: ["reports"],
        }),
    }),
});

export const {
    useGetReportByIdQuery,
    useCreateReportMutation,
    useAddToReportMutation,
    useGetAllReportsByShopQuery,
    useGetAllReportsQuery,
    useGetReportCountByDayQuery,
    useGetReportCountByMonthQuery,
    useGetReportCountByYearQuery,
    useGetReportPendingCountQuery,
    useGetAllReportsByStatusQuery,
    useUpdateReportStatusMutation,
    useGetAllReportsByTypeQuery,

} = reportService;
