export type DayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
export type DaySchedule = { enabled: boolean; start: string; end: string };
export type WeeklySchedule = Record<DayKey, DaySchedule>;
export type BlockedDate = { date: string; reason?: string };
export type AvailabilityState = { weekly: WeeklySchedule; blockedDates: BlockedDate[] };

export const dayOrder: DayKey[] = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
export const labelFor: Record<DayKey, string> = {
  sunday:'Sunday', monday:'Monday', tuesday:'Tuesday', wednesday:'Wednesday', thursday:'Thursday', friday:'Friday', saturday:'Saturday'
};
export const defaultWeekly: WeeklySchedule = {
  sunday:{enabled:true,start:'09:00',end:'17:00'},
  monday:{enabled:false,start:'03:00',end:'17:00'},
  tuesday:{enabled:false,start:'09:00',end:'17:00'},
  wednesday:{enabled:false,start:'09:00',end:'17:00'},
  thursday:{enabled:false,start:'09:00',end:'17:00'},
  friday:{enabled:false,start:'09:00',end:'17:00'},
  saturday:{enabled:false,start:'09:00',end:'17:00'},
};
