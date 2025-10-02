'use client';

import React, { useEffect, useState } from 'react';
import { Customer } from "@/features/provider/customerSlice";

interface CustomerSidebarProps {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerSidebar({ customer, onClose }: CustomerSidebarProps) {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const openTimeout = setTimeout(() => setVisible(true), 20); // delay to trigger slide-in
    return () => {
      document.body.style.overflow = '';
      clearTimeout(openTimeout);
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />

      <div
        className={`
          fixed top-0 right-0 h-full z-50 w-3/4 sm:max-w-lg bg-white shadow-lg rounded-l-sm overflow-y-auto hide-scrollbar
          transition-all duration-300 transform
          ${visible && !closing ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex justify-between items-center p-6">
          <h2 className="text-lg font-semibold">Customer Details</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Close sidebar"
            title="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="rounded-lg border border-gray-200 text-gray-100 shadow-xs">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold tracking-tight text-lg text-black">
                {customer.first_name} {customer.last_name}
              </h3>
            </div>

            <div className="p-6 pt-0 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.19 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <span>+{customer.country_code}{customer.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                <span>{customer.email || "N/A"}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
                <span>
                  Last request: {customer.last_request_at ? new Date(customer.last_request_at).toLocaleDateString() : "Not yet"}
                </span>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100">
                {/* <button
                  className="cursor-pointer h-9 w-full font-semibold flex items-center justify-center gap-1 rounded-md text-sm text-white bg-[#25D366] hover:bg-[#128C7E] transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.202 0-2.346-.213-3.37-.596L3 21l1.775-4.726C4.28 15.201 4 14.123 4 13c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>Chat</span>
                </button> */}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium mb-3">Service Request History</h3>
            <div className="text-gray-500 text-center py-4">No service history found</div>
          </div>
        </div>
      </div>
    </>
  );
}
