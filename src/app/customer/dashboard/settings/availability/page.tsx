'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WeeklySchedule from './components/WeeklySchedule';
import BlockDates from './components/BlockDates';
import toast, { Toaster } from 'react-hot-toast';
import type { RootState, AppDispatch } from '@/store/store';
import {
  fetchAvailability,
  upsertWeekly,
  addBlockedDate as addBlockedDateThunk,
  removeBlockedDate as removeBlockedDateThunk,
  setWeeklyLocal,
  applyBlockedLocal,
} from '@/features/availability/availabilitySlice';
import type { Weekly as WeeklyT, Blocked as BlockedT } from '@/features/availability/availabilitySlice';
import DashboardProfileHeader from '@/app/customer/components/DashboardProfileHeader';

export default function AvailabilityPage() {
  const dispatch = useDispatch<AppDispatch>();
  const weekly = useSelector((s: RootState) => s.availability.weekly);
  const blockedDates = useSelector((s: RootState) => s.availability.blocked);

  const [isSavingWeekly, setIsSavingWeekly] = useState(false);

  const prevWeeklyRef = useRef(weekly);
  const prevBlockedRef = useRef(blockedDates);

  useEffect(() => {
    if (!weekly || (Array.isArray(weekly) && weekly.length === 0)) {
      dispatch(fetchAvailability());
    }
  }, [dispatch, weekly]);


  const handleWeeklyChange = (next: WeeklyT) => {
    // Local update only; persist on Save
    dispatch(setWeeklyLocal(next));
    prevWeeklyRef.current = next;
  };

  const handleSaveWeekly = async (current: WeeklyT) => {
    setIsSavingWeekly(true);
    try {
      await dispatch(upsertWeekly({ weekly: current })).unwrap();
      await dispatch(fetchAvailability()).unwrap();
      toast.success('Availability saved');
    } catch (err) {
      console.log(err)
      toast.error('Failed to save availability');
    } finally {
      setIsSavingWeekly(false);
    }
  };

  const handleBlockedChange = async (next: BlockedT[]) => {
    dispatch(applyBlockedLocal(next));
    const prev = prevBlockedRef.current;

    const prevMap = new Map(prev.map((b) => [b.date, b]));
    const nextMap = new Map(next.map((b) => [b.date, b]));

    const addPromises: Promise<unknown>[] = [];
    for (const [date, b] of nextMap) {
      if (!prevMap.has(date) || prevMap.get(date)?.reason !== b.reason) {
        const p = dispatch(addBlockedDateThunk({ date, reason: b.reason }))
          .unwrap()
          .then(() => toast.success(`Blocked ${date}`))
          .catch(() => toast.error(`Failed to block ${date}`));
        addPromises.push(p);
      }
    }
    // Process removals silently
    for (const [date] of prevMap) {
      if (!nextMap.has(date)) dispatch(removeBlockedDateThunk({ date }));
    }

    // Await all add operations to ensure toasts fire before state moves on
    if (addPromises.length) await Promise.allSettled(addPromises);

    prevBlockedRef.current = next;
  };

  return (
    <div className="bg-gray-50 min-h-screen px-3 md:px-8 pb-20 md:pb-8 mx-auto max-w-3xl md:max-w-4xl lg:max-w-6xl w-full">
      <div className="">
        <DashboardProfileHeader />

        <Toaster position="top-right" />
        <div className="mb-6 flex flex-col items-start text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-1 text-orange-600">
            Availability</h2>
          <p className="mt-1 max-sm:text-sm text-gray-500">
            Set your business hours and scheduling preferences</p>
        </div>
      </div>
      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklySchedule
            value={weekly}
            onChange={handleWeeklyChange}
            onSave={handleSaveWeekly}
            saving={isSavingWeekly}
          />
          <BlockDates value={blockedDates} onChange={handleBlockedChange} />
        </div>
      </div>
    </div>
  );
}
