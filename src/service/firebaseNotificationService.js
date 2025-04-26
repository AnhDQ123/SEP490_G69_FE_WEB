import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/constant'; // Ensure BASE_URL is correct

export const firebaseNotificationService = createApi({
    reducerPath: 'firebaseNotifications',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['FirebaseNotifications'],

    endpoints: (builder) => ({
        // Send notification
        sendNotification: builder.mutation({
            query: ({ token, title, body }) => ({
                url: '/api/noti/sendNotification',
                method: 'POST',
                body: { token, title, body },
            }),
            // You can modify invalidation or tags based on requirements
        }),
    }),
});

export const {
    useSendNotificationMutation,
} = firebaseNotificationService;
