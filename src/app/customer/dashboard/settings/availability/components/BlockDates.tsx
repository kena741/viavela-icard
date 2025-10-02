'use client';

import React, { useMemo, useState } from 'react';
import {
  addDays,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  isBefore,
  startOfToday,
} from 'date-fns';
import type { BlockedDate } from '../types';

type Props = { value: BlockedDate[]; onChange: (next: BlockedDate[]) => void };

const toISO = (d: Date) => format(d, 'yyyy-MM-dd');

export default function BlockDates({ value, onChange }: Props) {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const today = startOfToday();

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

  const selectDay = (date: Date) => {
    if (!isSameMonth(date, currentMonth)) return;
    setSelectedDate(toISO(date));
  };

  const addBlockedDate = () => {
    if (!selectedDate) return;
    const idx = value.findIndex((b) => b.date === selectedDate);
    const next = [...value];
    const item = { date: selectedDate, reason: reason.trim() || undefined };
    if (idx >= 0) next[idx] = item;
    else next.push(item);
    next.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    onChange(next);
    setReason('');
  };

  const removeBlockedDate = (iso: string) => onChange(value.filter((b) => b.date !== iso));

  const selectedIsPast = selectedDate ? isBefore(new Date(selectedDate), today) : false;
  const selectedIsBlocked = selectedDate ? value.some((b) => b.date === selectedDate) : false;

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 sm:p-5">
      <h3 className="text-base font-semibold text-center pb-3 text-black">Block Dates</h3>

      <div className="border border-gray-200 rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setCurrentMonth(addDays(startOfMonth(currentMonth), -1))}
            className="px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs"
          >
            ←
          </button>
          <div className="font-medium text-gray-900 text-sm">{format(currentMonth, 'MMMM yyyy')}</div>
          <button
            onClick={() => setCurrentMonth(addDays(endOfMonth(currentMonth), 1))}
            className="px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-[10px] text-gray-500 mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysGrid.map((d, i) => {
            const iso = toISO(d);
            const outside = !isSameMonth(d, currentMonth);
            const isBlocked = value.some((b) => b.date === iso);
            const isPast = isBefore(d, today);
            const disabled = outside || isPast || isBlocked;
            const isSelected = selectedDate === iso && !disabled;

            const base = 'h-8 rounded-md border text-xs transition-colors';
            const state = outside
              ? 'text-gray-300 bg-gray-50'
              : disabled
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : isSelected
                  ? 'bg-sky-100 border-sky-300 text-gray-900'
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900';

            return (
              <button
                key={i}
                disabled={disabled}
                onClick={() => !disabled && selectDay(d)}
                className={`${base} ${state}`}
                title={iso}
              >
                {format(d, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-3 mb-5">
        <div className="font-medium text-gray-900 mb-2 text-sm">
          {`Select a date to block ${selectedDate ? format(new Date(selectedDate), 'MMMM d, yyyy') : ''}`}
        </div>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          className="w-full min-h-[64px] rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
        />
        <button
          onClick={addBlockedDate}
          disabled={!selectedDate || selectedIsPast || selectedIsBlocked}
          className="mt-3 w-full rounded-lg px-3 py-2 text-xs text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-sky-600 to-teal-400 hover:from-sky-700 hover:to-teal-500"
        >
          Block Date
        </button>
      </div>

      <div className="text-center font-semibold text-sky-700 mb-2 text-sm">Blocked Dates</div>
      <div className="space-y-2.5">
        {value.length === 0 && <div className="text-xs text-gray-500 text-center">No blocked dates yet.</div>}
        {value.map(({ date, reason }) => (
          <div key={date} className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2">
            <div>
              <div className="font-medium text-gray-900 text-sm">{format(new Date(date), 'MMMM d, yyyy')}</div>
              {reason && <div className="text-[11px] text-gray-500 mt-0.5">{reason}</div>}
            </div>
            <button
              onClick={() => removeBlockedDate(date)}
              className="text-red-500 hover:text-red-600 text-sm"
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
