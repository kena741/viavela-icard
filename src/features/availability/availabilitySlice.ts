import { supabase } from '@/supabaseClient';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DayKey = 'sunday'|'monday'|'tuesday'|'wednesday'|'thursday'|'friday'|'saturday';

export type DaySchedule = { enabled: boolean; start: string | null; end: string | null };
export type Weekly = Record<DayKey, DaySchedule>;
export type Blocked = { date: string; reason?: string };

const dayOrder: DayKey[] = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

export const defaultWeekly: Weekly = {
  sunday:{enabled:true, start:'09:00', end:'17:00'},
  monday:{enabled:false, start:'09:00', end:'17:00'},
  tuesday:{enabled:false, start:'09:00', end:'17:00'},
  wednesday:{enabled:false, start:'09:00', end:'17:00'},
  thursday:{enabled:false, start:'09:00', end:'17:00'},
  friday:{enabled:false, start:'09:00', end:'17:00'},
  saturday:{enabled:false, start:'09:00', end:'17:00'},
};

type State = {
  weekly: Weekly;
  blocked: Blocked[];
  status: 'idle'|'loading'|'error';
  error?: string;
};

const initialState: State = { weekly: defaultWeekly, blocked: [], status: 'idle' };

export const fetchAvailability = createAsyncThunk(
  'availability/fetch',
  async (_, { rejectWithValue }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return rejectWithValue('Not signed in');

    // helper to normalize possibly partial/invalid shapes
    const normalizeWeekly = (w: Partial<Weekly>): Weekly => {
      const base: Weekly = { ...defaultWeekly };
      if (!w || typeof w !== 'object') return base;
      (Object.keys(base) as DayKey[]).forEach((k) => {
        const v = w[k];
        if (v && typeof v === 'object') {
          const schedule = v as DaySchedule;
          base[k] = {
            enabled: Boolean(schedule.enabled),
            start: schedule.start ? String(schedule.start).slice(0,5) : null,
            end: schedule.end ? String(schedule.end).slice(0,5) : null,
          };
        }
      });
      return base;
    };

    // JSON-based availability
    const [jsonRes, blockedRes] = await Promise.all([
      supabase
        .from('provider_availability_weekly')
        .select('weekly')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('provider_blocked_dates')
        .select('blocked_on, reason')
        .eq('user_id', user.id)
        .order('blocked_on', { ascending: true }),
    ]);

    if (blockedRes.error) return rejectWithValue(blockedRes.error.message);

    const weekly: Weekly = jsonRes?.data?.weekly
      ? normalizeWeekly(jsonRes.data.weekly as Partial<Weekly>)
      : { ...defaultWeekly };

    type BlockedResRow = { blocked_on: string; reason?: string | null };
    const blocked: Blocked[] = (blockedRes.data ?? []).map((r: BlockedResRow) => ({
      date: r.blocked_on,
      reason: r.reason ?? undefined,
    }));

    return { weekly, blocked };
  }
);

// removed per-day upsert in favor of full JSON upsert (upsertWeekly)

export const upsertWeekly = createAsyncThunk(
  'availability/upsertWeekly',
  async (payload: { weekly: Weekly }, { rejectWithValue }) => {
    const { weekly } = payload;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return rejectWithValue('Not signed in');

    // Update first; if no rows updated, insert a new row
    const { data: updated, error: updateError } = await supabase
      .from('provider_availability_weekly')
      .update({ weekly })
      .eq('user_id', user.id)
      .select('user_id');

    if (updateError) return rejectWithValue(updateError.message);
    if (Array.isArray(updated) && updated.length > 0) return weekly;

    const { error: insertError } = await supabase
      .from('provider_availability_weekly')
      .insert({ user_id: user.id, weekly });

    if (insertError) return rejectWithValue(insertError.message);
    return weekly;
  }
);

export const addBlockedDate = createAsyncThunk(
  'availability/addBlockedDate',
  async (payload: { date: string; reason?: string }, { rejectWithValue }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return rejectWithValue('Not signed in');

    const { error } = await supabase
      .from('provider_blocked_dates')
      .upsert({ user_id: user.id, blocked_on: payload.date, reason: payload.reason ?? null }, { onConflict: 'user_id,blocked_on' });

    if (error) return rejectWithValue(error.message);
    return payload;
  }
);

export const removeBlockedDate = createAsyncThunk(
  'availability/removeBlockedDate',
  async (payload: { date: string }, { rejectWithValue }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return rejectWithValue('Not signed in');

    const { error } = await supabase
      .from('provider_blocked_dates')
      .delete()
      .eq('user_id', user.id)
      .eq('blocked_on', payload.date);

    if (error) return rejectWithValue(error.message);
    return payload;
  }
);

const slice = createSlice({
  name: 'availability',
  initialState,
  reducers: {
    // optimistic updates
    setWeeklyLocal(state, action: PayloadAction<Weekly>) {
      state.weekly = action.payload;
    },
    applyBlockedLocal(state, action: PayloadAction<Blocked[]>) {
      state.blocked = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchAvailability.pending, (s)=>{ s.status='loading'; s.error=undefined; })
     .addCase(fetchAvailability.fulfilled, (s, a)=>{ s.status='idle'; s.weekly=a.payload.weekly; s.blocked=a.payload.blocked; })
     .addCase(fetchAvailability.rejected, (s, a)=>{ s.status='error'; s.error=String(a.payload ?? a.error.message); });

    b.addCase(upsertWeekly.fulfilled, (s, a) => {
      s.weekly = a.payload;
    });

    b.addCase(addBlockedDate.fulfilled, (s, a)=>{
      const idx = s.blocked.findIndex(b=>b.date===a.payload.date);
      if (idx>=0) s.blocked[idx]=a.payload; else s.blocked.push(a.payload);
      s.blocked.sort((x,y)=> x.date<y.date? -1 : x.date>y.date? 1 : 0);
    });

    b.addCase(removeBlockedDate.fulfilled, (s, a)=>{
      s.blocked = s.blocked.filter(b=>b.date!==a.payload.date);
    });
  }
});

export const { setWeeklyLocal, applyBlockedLocal } = slice.actions;
export default slice.reducer;
export { dayOrder };
