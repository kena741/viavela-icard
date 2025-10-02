// src/features/analytics/firestoreAnalytics.ts
import { supabase } from '@/supabaseClient';
import dayjs from 'dayjs';

export interface PageViewRecord {
  timestamp: Date;
  weekday: string;
  day: string;
  hour: string;
  count: number;
}

export interface PageViewsResponse {
  total: number;
  data: PageViewRecord[];
}

export async function getPageViewsInRange(
  provider_id: string,
  startDate: Date,
  endDate: Date
): Promise<PageViewsResponse> {
  const { data, error } = await supabase
    .from('page_views')
    .select('*')
    .eq('provider_id', provider_id)
    .gte('date_id', dayjs(startDate).format('YYYY-MM-DD'))
    .lte('date_id', dayjs(endDate).format('YYYY-MM-DD'));

  if (error || !data) {
    console.error('[getPageViewsInRange] Supabase error:', error);
    return { total: 0, data: [] };
  }

  const records: PageViewRecord[] = data
    .map((row) => {
      if (!row.date_id) return null;
      const parsed = dayjs(row.date_id);
      return {
        timestamp: parsed.toDate(),
        weekday: parsed.format('ddd'),
        day: parsed.format('DD'),
        hour: '00',
        count: row.count ?? 1,
      };
    })
    .filter((r): r is PageViewRecord => r !== null);

  const total = records.reduce((sum, rec) => sum + rec.count, 0);
  return { total, data: records };
}

// Booking record now from Supabase
export interface BookingRecord {
  timestamp: Date;
  weekday: string;
  day: string;
  hour: string;
  provider_id: string;
  subTotal: number;
}

export interface BookingsResponse {
  totalRequests: number;
  totalSales: number;
  data: BookingRecord[];
}

export async function getBookingsInRange(
  provider_id: string,
  startDate: Date,
  endDate: Date
): Promise<BookingsResponse> {
  const { data, error } = await supabase
    .from('booked_service')
    .select('*')
    .gte('bookingDate', startDate.toISOString())
    .lte('bookingDate', endDate.toISOString())
    .eq('provider_id', provider_id);

  if (error || !data) {
    console.error('[getBookingsInRange] Supabase error:', error);
    return { totalRequests: 0, totalSales: 0, data: [] };
  }

  const records: BookingRecord[] = data
    .map((row) => {
      const timestamp = new Date(row.bookingDate);
      if (timestamp < startDate || timestamp > endDate) return null;

      const parsed = dayjs(timestamp);
      return {
        timestamp,
        weekday: parsed.format('ddd'),
        day: parsed.format('DD'),
        hour: parsed.format('HH'),
        provider_id: row.provider_id,
        subTotal: Number(row.subTotal ?? 0),
      };
    })
    .filter((b): b is BookingRecord => b !== null);

  const totalRequests = records.length;
  const totalSales = records.reduce((sum, b) => sum + b.subTotal, 0);

  return { totalRequests, totalSales, data: records };
}

export async function bumpPageView(provider_id: string): Promise<void> {
  const dateId = dayjs().format('YYYY-MM-DD');

  const { data: existing, error: fetchError } = await supabase
    .from('page_views')
    .select('id, count')
    .eq('provider_id', provider_id)
    .eq('date_id', dateId)
    .maybeSingle();

  if (fetchError) {
    console.error('[bumpPageView] fetch error:', fetchError);
    return;
  }

  try {
    if (existing) {
      await supabase
        .from('page_views')
        .update({
          count: existing.count + 1,
          updated_at: new Date(),
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('page_views').insert({
        provider_id,
        date_id: dateId,
        count: 1,
      });
    }
  } catch (err) {
    console.error('[bumpPageView] write error:', err);
  }
}
