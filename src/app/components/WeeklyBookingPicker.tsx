'use client';

import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';
import { fetchAvailability } from '@/features/availability/availabilitySlice';
import { addDays, endOfMonth, format, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';

type Props = {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  labelPrefix?: string; // optional label prefix like "Preferred"
};

const dayKey = (d: Date) =>
  (['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const)[d.getDay()];
const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const fromYMD = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const fmt12 = (hhmm: string) => {
  const [H, M] = hhmm.split(':').map(Number);
  const h = ((H + 11) % 12) + 1;
  const ampm = H < 12 ? 'AM' : 'PM';
  return `${h}:${String(M).padStart(2, '0')} ${ampm}`;
};
const normBlocked = (v: string) => (v.includes('T') ? toYMD(new Date(v)) : v);

export default function WeeklyBookingPicker({ date, time, onDateChange, onTimeChange, labelPrefix = 'Preferred' }: Props) {
  const dispatch = useAppDispatch();
  const weekly = useAppSelector((s: RootState) => s.availability.weekly);
  const blocked = useAppSelector((s: RootState) => s.availability.blocked);

  const [dateOpen, setDateOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));

  useEffect(() => {
    dispatch(fetchAvailability());
  }, [dispatch]);

  useEffect(() => {
    setCurrentMonth(startOfMonth(fromYMD(date)));
  }, [date]);

  const blockedSet = useMemo(() => new Set(blocked.map((b) => normBlocked(b.date))), [blocked]);

  const selectedDate = useMemo(() => {
    const d = fromYMD(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [date]);

  const dayCfg = weekly[dayKey(selectedDate)];

  const daysGrid = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfMonth(currentMonth);
    const cells: Date[] = [];
    let d = start;
    while (d <= addDays(end, 6)) {
      cells.push(d);
      d = addDays(d, 1);
    }
    return cells;
  }, [currentMonth]);

  const isPast = (d: Date) => {
    const today = new Date();
    const a = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const b = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return b < a;
  };

  const isDisabledDay = (d: Date) => {
    const ymd = toYMD(d);
    const closed = !weekly[dayKey(d)]?.enabled;
    return blockedSet.has(ymd) || closed || isPast(d) || !isSameMonth(d, currentMonth);
  };

  const slots = useMemo(() => {
    const out: { value: string; label: string; enabled: boolean }[] = [];
    const dayStart = 6 * 60; // 06:00
    const dayEnd = 22 * 60; // 22:00
    const step = 30;
    const today = new Date();
    const isToday =
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate();

    const startMins = dayCfg?.start ? minutes(dayCfg.start) : null;
    const endMins = dayCfg?.end ? minutes(dayCfg.end) : null;

    for (let m = dayStart; m <= dayEnd; m += step) {
      const hh = String(Math.floor(m / 60)).padStart(2, '0');
      const mm = String(m % 60).padStart(2, '0');
      const val = `${hh}:${mm}`;
      let enabled = !!dayCfg?.enabled && startMins !== null && endMins !== null && m >= startMins && m < endMins;
      if (enabled && isToday) {
        const nowMins = today.getHours() * 60 + today.getMinutes();
        if (m <= nowMins) enabled = false;
      }
      out.push({ value: val, label: fmt12(val), enabled });
    }
    return out;
  }, [dayCfg, selectedDate]);

  useEffect(() => {
    const found = slots.find((s) => s.value === time && s.enabled);
    if (!found) onTimeChange('');
  }, [slots, time, onTimeChange]);

  return (
    <div className="space-y-4 text-black">
      <div className="relative">
        <label className="text-sm font-medium block mb-1">{labelPrefix} Date*</label>
        <button
          type="button"
          onClick={() => setDateOpen((v) => !v)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-left"
          title={`${labelPrefix} Date`}
        >
          {format(fromYMD(date), 'MMMM do, yyyy')}
        </button>

        {dateOpen && (
          <div className="absolute mt-2 w-full bg-white rounded-md border border-gray-200 shadow-md z-50 p-3">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setCurrentMonth(addDays(startOfMonth(currentMonth), -1))}
                className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
              >
                ←
              </button>
              <div className="font-medium">{format(currentMonth, 'MMMM yyyy')}</div>
              <button
                onClick={() => setCurrentMonth(addDays(endOfMonth(currentMonth), 1))}
                className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
              >
                →
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs mb-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {daysGrid.map((d, i) => {
                const disabled = isDisabledDay(d);
                const isSelected = toYMD(d) === date;
                const base = 'h-9 rounded-md border text-sm';
                const cls = disabled
                  ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                  : isSelected
                    ? 'bg-blue-100 text-black border-blue-300'
                    : 'bg-white text-black border-gray-200 hover:bg-gray-50';
                return (
                  <button
                    key={i}
                    disabled={disabled}
                    onClick={() => {
                      onDateChange(toYMD(d));
                      onTimeChange('');
                      setDateOpen(false);
                    }}
                    className={classNames(base, cls)}
                  >
                    {format(d, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">{labelPrefix} Time </label>

        <div className="h-56 overflow-y-auto rounded-md border border-gray-200 shadow">
          <div className="sticky top-0 bg-white z-10 px-4 py-2 border-b border-gray-100">
            <span className="text-sm">{`Available times for ${format(selectedDate, 'EEEE, MMMM d')}`}</span>
          </div>
          {slots.map((s) => {
            const isSelected = time === s.value;
            return (
              <button
                key={s.value}
                type="button"
                disabled={!s.enabled}
                onClick={() => onTimeChange(s.value)}
                className={classNames(
                  'w-full text-left px-3 py-2 border-b border-gray-100 last:border-b-0 text-xs',
                  !s.enabled
                    ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                    : isSelected
                      ? 'bg-blue-100 text-black font-medium'
                      : 'hover:bg-gray-50'
                )}
              >
                {s.label}
              </button>
            );
          })}
          {slots.every((s) => !s.enabled) && (
            <div className="py-6 text-center text-sm">No available times for this date.</div>
          )}
        </div>
      </div>
    </div>
  );
}
