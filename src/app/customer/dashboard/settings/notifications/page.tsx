"use client";

import { useState } from "react";
import DashboardProfileHeader from "../../../components/DashboardProfileHeader";

export default function NotificationsSettingsPage() {
  const [toggles, setToggles] = useState({
    serviceRequest: true,
    serviceAccepted: true,
    serviceReminder: true,
    dailySummary: true,
    serviceReschedule: true,
    customerReminder: true,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative hide-scrollbar overflow-y-auto h-full px-3 md:px-16 pt-0 md:pt-10 pb-24 md:pb-8">
      <DashboardProfileHeader />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#F72585]">Notifications Settings</h2>
        <p className="text-gray-500 mt-1">Notification Settings</p>
      </div>
      <div className="space-y-6 relative mx-auto max-w-2xl md:max-w-3xl lg:max-w-5xl w-full">
        <div className="rounded-lg border bg-white text-black shadow-sm">
          <div className="p-6 space-y-4 pt-6">
            {/* Service Request Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell h-5 w-5 text-gray-500 mt-0.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                <div>
                  <h4 className="font-medium text-black">Service Request Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications when a customer requests your service</p>
                </div>
              </div>
              <label className={`peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 relative ${toggles.serviceRequest ? "bg-[#F72585]" : "bg-pink-200"}`}>
                <input
                  type="checkbox"
                  role="switch"
                  checked={toggles.serviceRequest}
                  onChange={() => handleToggle("serviceRequest")}
                  className="sr-only"
                  aria-label="Toggle Service Request Notifications"
                />
                <span className={`absolute left-1 text-[10px] font-bold text-white/80 z-10 pointer-events-none transition-opacity duration-200 ${!toggles.serviceRequest ? "opacity-100" : "opacity-0"}`}>OFF</span>
                <span className={`absolute right-1 text-[10px] font-bold text-white z-10 pointer-events-none transition-opacity duration-200 ${toggles.serviceRequest ? "opacity-100" : "opacity-0"}`}>ON</span>
                <span data-state={toggles.serviceRequest ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${toggles.serviceRequest ? "translate-x-6" : "translate-x-0"}`}></span>
              </label>
            </div>
            {/* Service Accepted Notifications */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell h-5 w-5 text-gray-500 mt-0.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                <div>
                  <h4 className="font-medium text-black">Service Accepted Notifications</h4>
                  <p className="text-sm text-gray-500">Notify customers when you accept their service requests</p>
                </div>
              </div>
              <label className={`peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 relative ${toggles.serviceAccepted ? "bg-[#F72585]" : "bg-pink-200"}`}>
                <input
                  type="checkbox"
                  role="switch"
                  checked={toggles.serviceAccepted}
                  onChange={() => handleToggle("serviceAccepted")}
                  className="sr-only"
                  aria-label="Toggle Service Accepted Notifications"
                />
                <span className={`absolute left-1 text-[10px] font-bold text-white/80 z-10 pointer-events-none transition-opacity duration-200 ${!toggles.serviceAccepted ? "opacity-100" : "opacity-0"}`}>OFF</span>
                <span className={`absolute right-1 text-[10px] font-bold text-white z-10 pointer-events-none transition-opacity duration-200 ${toggles.serviceAccepted ? "opacity-100" : "opacity-0"}`}>ON</span>
                <span data-state={toggles.serviceAccepted ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${toggles.serviceAccepted ? "translate-x-6" : "translate-x-0"}`}></span>
              </label>
            </div>
            {/* Service Reminder Notifications */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell h-5 w-5 text-gray-500 mt-0.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                <div>
                  <h4 className="font-medium text-black">Service Reminder Notifications</h4>
                  <p className="text-sm text-gray-500">Send reminders to customers about upcoming appointments</p>
                </div>
              </div>
              <label className={`peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 relative ${toggles.serviceReminder ? "bg-[#F72585]" : "bg-pink-200"}`}>
                <input
                  type="checkbox"
                  role="switch"
                  checked={toggles.serviceReminder}
                  onChange={() => handleToggle("serviceReminder")}
                  className="sr-only"
                  aria-label="Toggle Service Reminder Notifications"
                />
                <span className={`absolute left-1 text-[10px] font-bold text-white/80 z-10 pointer-events-none transition-opacity duration-200 ${!toggles.serviceReminder ? "opacity-100" : "opacity-0"}`}>OFF</span>
                <span className={`absolute right-1 text-[10px] font-bold text-white z-10 pointer-events-none transition-opacity duration-200 ${toggles.serviceReminder ? "opacity-100" : "opacity-0"}`}>ON</span>
                <span data-state={toggles.serviceReminder ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${toggles.serviceReminder ? "translate-x-6" : "translate-x-0"}`}></span>
              </label>
            </div>
            {/* Daily Summary */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell h-5 w-5 text-gray-500 mt-0.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                <div>
                  <h4 className="font-medium text-black">Daily Summary</h4>
                  <p className="text-sm text-gray-500">Receive a daily summary of your upcoming appointments</p>
                </div>
              </div>
              <label className={`peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 relative ${toggles.dailySummary ? "bg-[#F72585]" : "bg-pink-200"}`}>
                <input
                  type="checkbox"
                  role="switch"
                  checked={toggles.dailySummary}
                  onChange={() => handleToggle("dailySummary")}
                  className="sr-only"
                  aria-label="Toggle Daily Summary Notifications"
                />
                <span className={`absolute left-1 text-[10px] font-bold text-white/80 z-10 pointer-events-none transition-opacity duration-200 ${!toggles.dailySummary ? "opacity-100" : "opacity-0"}`}>OFF</span>
                <span className={`absolute right-1 text-[10px] font-bold text-white z-10 pointer-events-none transition-opacity duration-200 ${toggles.dailySummary ? "opacity-100" : "opacity-0"}`}>ON</span>
                <span data-state={toggles.dailySummary ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${toggles.dailySummary ? "translate-x-6" : "translate-x-0"}`}></span>
              </label>
            </div>
            {/* Service Reschedule Notifications */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell h-5 w-5 text-gray-500 mt-0.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                <div>
                  <h4 className="font-medium text-black">Service Reschedule Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications when appointments are rescheduled</p>
                </div>
              </div>
              <label className={`peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 relative ${toggles.serviceReschedule ? "bg-[#F72585]" : "bg-pink-200"}`}>
                <input
                  type="checkbox"
                  role="switch"
                  checked={toggles.serviceReschedule}
                  onChange={() => handleToggle("serviceReschedule")}
                  className="sr-only"
                  aria-label="Toggle Service Reschedule Notifications"
                />
                <span className={`absolute left-1 text-[10px] font-bold text-white/80 z-10 pointer-events-none transition-opacity duration-200 ${!toggles.serviceReschedule ? "opacity-100" : "opacity-0"}`}>OFF</span>
                <span className={`absolute right-1 text-[10px] font-bold text-white z-10 pointer-events-none transition-opacity duration-200 ${toggles.serviceReschedule ? "opacity-100" : "opacity-0"}`}>ON</span>
                <span data-state={toggles.serviceReschedule ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${toggles.serviceReschedule ? "translate-x-6" : "translate-x-0"}`}></span>
              </label>
            </div>
            {/* Customer Reminder Notifications */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell h-5 w-5 text-gray-500 mt-0.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                <div>
                  <h4 className="font-medium text-black">Customer Reminder Notifications</h4>
                  <p className="text-sm text-gray-500">Send appointment reminders directly to customers</p>
                </div>
              </div>
              <label className={`peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 relative ${toggles.customerReminder ? "bg-[#F72585]" : "bg-pink-200"}`}>
                <input
                  type="checkbox"
                  role="switch"
                  checked={toggles.customerReminder}
                  onChange={() => handleToggle("customerReminder")}
                  className="sr-only"
                  aria-label="Toggle Customer Reminder Notifications"
                />
                <span className={`absolute left-1 text-[10px] font-bold text-white/80 z-10 pointer-events-none transition-opacity duration-200 ${!toggles.customerReminder ? "opacity-100" : "opacity-0"}`}>OFF</span>
                <span className={`absolute right-1 text-[10px] font-bold text-white z-10 pointer-events-none transition-opacity duration-200 ${toggles.customerReminder ? "opacity-100" : "opacity-0"}`}>ON</span>
                <span data-state={toggles.customerReminder ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${toggles.customerReminder ? "translate-x-6" : "translate-x-0"}`}></span>
              </label>
            </div>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gradient-to-r from-[#F72585] to-[#FFB457] hover:opacity-90 transition-opacity text-white h-10 px-4 py-2 mt-4">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
