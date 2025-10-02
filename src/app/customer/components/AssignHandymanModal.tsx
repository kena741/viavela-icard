import React, { useState, useEffect, useRef } from "react";
import toast from 'react-hot-toast';
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { assignHandymanToRequest, closeModal } from "@/features/requests/assignHandymanModalSlice";
import { fetchHandymenByProviderId } from "@/features/handyman/handymanSlice";


const AssignHandymanModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const assignModalState = useAppSelector((state) => state.assignHandymanModal);
  const { open, requestId, loading: assignLoading, error: assignError } = assignModalState;
  const handymanState = useAppSelector((state) => state.handyman);
  const user = useAppSelector((state) => state.auth.user);
  const [showError, setShowError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null | undefined>(user ? user.id : null);

  useEffect(() => {
    if (!open) return;
    if (user?.id) {
      dispatch(fetchHandymenByProviderId(user.id));
      setSelectedId(user.id); // default to provider (You)
    }
  }, [open, user?.id, dispatch]);


  // Toast and close modal on successful assignment (must be inside component body, after hooks)
  const prevAssignLoadingRef = useRef(false);
  useEffect(() => {
    if (prevAssignLoadingRef.current && !assignLoading && !assignError) {
      toast.success('Handyman assigned successfully!');
      dispatch(closeModal());
    }
    prevAssignLoadingRef.current = assignLoading ?? false;
  }, [assignLoading, assignError, dispatch]);

  if (!open) return null;
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const handleAssign = (id: string) => {
    setSelectedId(id);
  };

  const handleClose = () => {
    setSelectedId(null);
    dispatch(closeModal());
  };

  // Save handler using Redux thunk
  const handleSave = () => {
    setShowError(null);
    if (!selectedId) {
      setShowError('Please select a handyman or provider.');
      return;
    }
    if (!requestId || !user) {
      setShowError('Missing request or user info.');
      return;
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    dispatch(assignHandymanToRequest({
      requestId,
      handymanId: selectedId,
      provider_id: user.id??'',
      otp,
    }));
  };

  return createPortal(
    <>
      <div
        data-state="open"
        className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pointer-events-auto cursor-pointer"
        aria-hidden="true"
        onClick={() => dispatch(closeModal())}
      ></div>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 flex w-full max-w-md max-h-screen translate-x-[-50%] translate-y-[-50%] border bg-white p-0 shadow-lg duration-200 sm:rounded-lg overflow-y-auto"
        tabIndex={-1}
        onClick={stopPropagation}
      >
        <div className="flex-1 w-full p-0 sm:p-6">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-black mb-2">Assign Order</h2>
          <p className="text-sm text-black mb-4">Select a handyman or assign to yourself:</p>
          <div className="w-full">
            <ul className="space-y-2 mb-4">
              {user && (
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded border border-blue-500 text-black hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 ${selectedId === user.id ? 'bg-blue-100 ring-2 ring-sky-600' : ''}`}
                    onClick={() => handleAssign(user.id ?? '')}
                    type="button"
                  >
                    {user.firstName || user.userName || user.email} (You)
                  </button>
                </li>
              )}
              {handymanState.handymen && handymanState.handymen.map((h) => (
                <li key={h.id}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded border border-gray-300 text-black hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 ${selectedId === h.id ? 'bg-blue-100 ring-2 ring-sky-600' : ''}`}
                    onClick={() => handleAssign(h.id)}
                    type="button"
                  >
                    {h.firstName} {h.lastName}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-3 mb-2">
              <button type="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-gray-200 bg-white hover:bg-gray-100 h-9 rounded-md px-3 w-auto text-black" onClick={handleClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x mr-1 h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
                onClick={handleSave}
                disabled={assignLoading}
              >
                {assignLoading ? (
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save mr-1 h-4 w-4"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>
                )}
                {assignLoading ? 'Saving...' : 'Save Changes'}
              </button>
              {showError && (
                <div className="text-red-600 text-sm mt-2 w-full text-right">{showError}</div>
              )}
              {assignError && (
                <div className="text-red-600 text-sm mt-2 w-full text-right">{assignError}</div>
              )}
              
            </div>
          </div>
        </div>
        <button
          type="button"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
          onClick={() => dispatch(closeModal())}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4 text-black"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>,
    typeof window !== "undefined" && document.body ? document.body : ({} as HTMLElement)
  );
};

export default AssignHandymanModal;
