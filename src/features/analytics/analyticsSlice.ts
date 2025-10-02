"use client";

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@/supabaseClient'

export type DailyData = { day: string; views: number; bookings: number }

interface AnalyticsState {
  views: number
  bookings: number
  daily: DailyData[]
  totalRequests: number
  totalSales: number
  loading: boolean
}

const initialState: AnalyticsState = {
  views: 0,
  bookings: 0,
  daily: [],
  totalRequests: 0,
  totalSales: 0,
  loading: false,
}

interface FetchArgs {
  provider_id: string
  startDate: Date
  endDate: Date
  groupBy: 'hour' | 'weekday' | 'date'
}

type AnyRow = {
  bookingDate?: string | Date | null;
  createdAt?: string | Date | null;
  created_at?: string | Date | null;
  timestamp?: string | Date | null;
  totalAmount?: number | string | null;
  subTotal?: number | string | null;
  total?: number | string | null;
  date_id?: string | Date | null;
  count?: number | null;
  [key: string]: unknown;
}

interface FetchResult {
  views: number
  bookings: number
  daily: DailyData[]
  totalRequests: number
  totalSales: number
}

const endOfDay = (d: Date) => {
  const c = new Date(d)
  c.setHours(23, 59, 59, 999)
  return c
}
const toIso = (d: Date) => d.toISOString()
const toYMD = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const normalizeTs = (r: AnyRow) =>
  r.bookingDate ?? r.createdAt ?? r.created_at ?? r.timestamp ?? null

const safeDate = (v: string | Date | null | undefined) => {
  if (!v) return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
}

const labelFromDate = (d: Date, groupBy: 'hour' | 'weekday' | 'date') => {
  if (groupBy === 'hour') return String(d.getHours()).padStart(2, '0')
  if (groupBy === 'date') return String(d.getDate()).padStart(2, '0')
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

const sumAmount = (rows: AnyRow[]) =>
  rows.reduce((sum, r) => {
    const n = parseFloat(String(r.totalAmount ?? r.subTotal ?? r.total ?? 0))
    return sum + (isNaN(n) ? 0 : n)
  }, 0)

export const fetchAnalytics = createAsyncThunk<FetchResult, FetchArgs>(
  'analytics/fetchAnalytics',
  async ({ provider_id, startDate, endDate, groupBy }, { rejectWithValue }) => {
    try {
      const startIso = toIso(startDate)
      const endIso = toIso(endOfDay(endDate))

      const startYmd = toYMD(startDate)
      const endYmd = toYMD(endDate)

      const { data: pvRows, error: pvErr } = await supabase
        .from('page_views')
        .select('date_id,count')
        .eq('provider_id', provider_id)
        .gte('date_id', startYmd)
        .lte('date_id', endYmd)

      const pageViewRows: AnyRow[] = (!pvErr && pvRows) ? pvRows : []
      const viewsTotal = pageViewRows.reduce((s, r) => s + (r.count ?? 1), 0)

      const timeFields = ['bookingDate', 'createdAt', 'created_at', 'timestamp'] as const
      let bookingRows: AnyRow[] = []
      for (const f of timeFields) {
        const { data, error } = await supabase
          .from('booked_service')
          .select('*')
          .eq('provider_id', provider_id)
          .gte(f, startIso)
          .lte(f, endIso)

        if (!error && data && data.length > 0) {
          bookingRows = data
          break
        }
      }

      if (bookingRows.length === 0) {
        const { data } = await supabase
          .from('booked_service')
          .select('*')
          .eq('provider_id', provider_id)
        if (data) {
          bookingRows = data.filter((r) => {
            const ts = safeDate(normalizeTs(r))
            return ts && ts >= startDate && ts <= endOfDay(endDate)
          })
        }
      }

      const dayMap: Record<string, DailyData> = {}

      for (const v of pageViewRows) {
        const d = safeDate(v.date_id)
        if (!d) continue
        const label =
          groupBy === 'hour'
            ? '00'
            : groupBy === 'date'
              ? String(d.getDate()).padStart(2, '0')
              : d.toLocaleDateString('en-US', { weekday: 'short' })
        if (!dayMap[label]) dayMap[label] = { day: label, views: 0, bookings: 0 }
        dayMap[label].views += v.count ?? 1
      }

      for (const b of bookingRows) {
        const d = safeDate(normalizeTs(b))
        if (!d) continue
        const label = labelFromDate(d, groupBy)
        if (!dayMap[label]) dayMap[label] = { day: label, views: 0, bookings: 0 }
        dayMap[label].bookings += 1
      }

      const daily = Object.values(dayMap).sort((a, b) => {
        if (groupBy === 'hour' || groupBy === 'date') return Number(a.day) - Number(b.day)
        return a.day.localeCompare(b.day)
      })

      const bookingsTotal = bookingRows.length
      const totalSales = sumAmount(bookingRows)

      return {
        views: viewsTotal,
        bookings: bookingsTotal,
        daily,
        totalRequests: bookingsTotal,
        totalSales,
      }
    } catch (e) {
      console.error('[analytics] fetchAnalytics error:', e)
      return rejectWithValue('Failed to fetch analytics')
    }
  }
)

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAnalytics.fulfilled, (state, action: PayloadAction<FetchResult>) => {
        state.views = action.payload.views
        state.bookings = action.payload.bookings
        state.daily = action.payload.daily
        state.totalRequests = action.payload.totalRequests
        state.totalSales = action.payload.totalSales
        state.loading = false
      })
      .addCase(fetchAnalytics.rejected, (state) => {
        state.loading = false
      })
  },
})

export default analyticsSlice.reducer
