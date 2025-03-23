import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constant.js";

export const orderService = createApi({
    reducerPath: "orders",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ["order"],
    endpoints: (builder) => ({
        // Xem thông tin đơn theo id
        getCheckout: builder.query({
            query: (id) => `api/order/checkout?id=${id}`,
            providesTags: ["order"],
        }),

        // Lọc đơn hàng theo trạng thái (khách hàng)
        getOrdersByStatus: builder.query({
            query: ({ id, status, page = 0, size = 10 }) => ({
                url: "api/order/status",
                params: { id, status, page, size },
            }),
            providesTags: ["order"],
        }),

        // Lấy danh sách đơn hàng của shop theo trạng thái
        getShopOrdersByStatus: builder.query({
            query: ({ id, status, page = 0, size = 10 }) => ({
                url: "api/order/shop/status",
                params: { id, status, page, size },
            }),
            providesTags: ["order"],
        }),

        // Lấy danh sách đơn hàng của shipper
        getOrdersByShipper: builder.query({
            query: ({ id, page = 0, size = 10 }) => ({
                url: "api/order/shipper",
                params: { id, page, size },
            }),
            providesTags: ["order"],
        }),

        // Shipper nhận đơn
        acceptShip: builder.mutation({
            query: ({ id, userId }) => ({
                url: "api/order/acceptShip",
                method: "POST",
                params: { id, userId },
            }),
            invalidatesTags: ["order"],
        }),

        // Shipper trả hàng
        returnOrder: builder.mutation({
            query: ({ id, userId, reason, avatar }) => {
                const formData = new FormData();
                formData.append("avatar", avatar);
                return {
                    url: "api/order/returnOrder",
                    method: "POST",
                    params: { id, userId, reason },
                    body: formData,
                };
            },
            invalidatesTags: ["order"],
        }),

        // Xem đơn trả hàng
        viewReturnOrder: builder.query({
            query: (id) => `api/order/viewReturn?id=${id}`,
            providesTags: ["order"],
        }),

        // Lọc đơn hàng theo status và khoảng thời gian
        getOrdersByStatusAndDate: builder.query({
            query: ({ status, startDate, endDate, page = 0, size = 10 }) => ({
                url: "api/order",
                params: { status, startDate, endDate, page, size },
            }),
            providesTags: ["order"],
        }),
    }),
});

export const {
    useGetCheckoutQuery,
    useGetOrdersByStatusQuery,
    useGetShopOrdersByStatusQuery,
    useGetOrdersByShipperQuery,
    useAcceptShipMutation,
    useReturnOrderMutation,
    useViewReturnOrderQuery,
    useGetOrdersByStatusAndDateQuery,
} = orderService;
