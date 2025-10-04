'use client';

import React from 'react';
import type { DayKey } from '../types';
import { dayOrder, labelFor } from '../types';

type DayScheduleUI = { enabled: boolean; start: string | null; end: string | null };
type WeeklyUI = Record<DayKey, DayScheduleUI>;

type Props = {
  value: WeeklyUI;
  onChange: (next: WeeklyUI) => void;
  onSave?: (current: WeeklyUI) => void | Promise<void>;
  saving?: boolean;
};

export default function WeeklySchedule({ value, onChange, onSave, saving }: Props) {
  const toggleDay = (key: DayKey) => {
    const next = { ...value, [key]: { ...value[key], enabled: !value[key].enabled } };
    onChange(next);
  };

  const setTime = (key: DayKey, which: 'start' | 'end', time: string) => {
    const next = { ...value, [key]: { ...value[key], [which]: time || null } };
    onChange(next);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100">
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h3 className="text-base font-semibold text-black text-center">Weekly Schedule</h3>

        {dayOrder.map((key) => {
          const d = value[key];
          const dataState = d.enabled ? 'checked' : 'unchecked';
          const active = d.enabled ? 'ring-1 ring-blue-300 border-blue-300' : 'border-gray-200';

          return (
            <div
              key={key}
              className={`p-3 sm:p-4 rounded-xl transition-all border-[1px] bg-white border-gray-300  hover:border-blue-300 ${active}`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  role="switch"
                  aria-checked={d.enabled}
                  data-state={dataState}
                  onClick={() => toggleDay(key)}
                  className="inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-[8px] px-1 transition-colors
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                             data-[state=unchecked]:bg-gray-300 data-[state=checked]:bg-blue-600 relative"
                >
                  <span className="absolute left-1 text-[9px] font-semibold text-white/80 pointer-events-none opacity-0 data-[state=unchecked]:opacity-100">
                    OFF
                  </span>
                  <span className="absolute right-1 text-[9px] font-semibold text-white pointer-events-none opacity-0 data-[state=checked]:opacity-100">
                    ON
                  </span>
                  <span
                    data-state={dataState}
                    className="pointer-events-none block h-5 w-5 rounded-[6px] bg-white ring-0 transition-transform
                               data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-5"
                  />
                </button>

                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-blue-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="font-semibold text-gray-900 text-sm">{labelFor[key]}</span>
                </div>
              </div>

              <div className={`transition-all overflow-hidden ${d.enabled ? 'max-h-40 mt-3 sm:mt-4' : 'max-h-0'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="time"
                    value={d.start ?? ''}
                    onChange={(e) => setTime(key, 'start', e.target.value)}
                    className="flex h-10 rounded-lg border-[1px] bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40 border-gray-300 text-sm text-gray-900"
                    placeholder="Start time"
                    title="Start time"
                  />
                  <span className="text-gray-700 font-medium text-sm text-center sm:text-left">to</span>
                  <input
                    type="time"
                    value={d.end ?? ''}
                    onChange={(e) => setTime(key, 'end', e.target.value)}
                    className="flex h-10 rounded-lg border-[1px] bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40 border-gray-300 text-sm text-gray-900"
                    placeholder="End time"
                    title="End time"
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-2 sm:pt-4 flex justify-end">
          <button
            onClick={() => onSave?.(value)}
            disabled={!!saving}
            className="rounded-lg px-4 py-2 text-sm text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
