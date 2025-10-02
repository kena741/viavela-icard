import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/supabaseClient';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/notifications' }),
  endpoints: (builder) => ({
    getNotificationsByUserId: builder.query({
      async queryFn(userId: string) {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          return {
            error: {
              status: 500,
              data: error.message || 'Unknown error',
            },
            data: undefined,
          };
        }
        return {
          data: data ?? [],
          error: undefined,
        };
      },
    }),
  }),
});

export const { useGetNotificationsByUserIdQuery } = notificationApi;
