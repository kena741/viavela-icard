"use client";

import DashboardProfileHeader from "../../../components/DashboardProfileHeader";

import { useState } from "react";

export default function ServicesCategoryPage() {
  const [activeTab, setActiveTab] = useState<'visible' | 'hidden'>('visible');
  return (
    <div className="px-2 md:px-8 pb-2 md:pb-8">
      <DashboardProfileHeader />
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="min-h-screen bg-gradient-to-br from-white to-pink-50">
          {/* Category Actions */}
          <div className="container mx-auto px-2 sm:px-4 pt-16 sm:pt-20 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex items-center gap-2"></div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-black bg-white text-black h-10 px-4 py-2 text-sm sm:text-base">Change sequence</button>
              </div>
            </div>
            {/* Tabs */}
            <div dir="ltr" data-orientation="horizontal" className="space-y-4">
              <div role="tablist" aria-orientation="horizontal" className="inline-flex h-10 items-center justify-center rounded-md p-1 bg-white border border-lolelink-purple/20 w-full sm:w-auto overflow-hidden" tabIndex={0} data-orientation="horizontal">
                {/* Visible Tab */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'visible'}
                  aria-controls="radix-:r3q:-content-visible"
                  data-state={activeTab === 'visible' ? 'active' : 'inactive'}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm  ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 font-bold
                    ${activeTab === 'visible' ? 'tab-active' : 'tab-inactive'}`}
                  tabIndex={activeTab === 'visible' ? 0 : -1}
                  data-orientation="horizontal"
                  data-radix-collection-item=""
                  onClick={() => setActiveTab('visible')}
                >
                  Visible
                </button>
                {/* Hidden Tab */}
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'hidden'}
                  aria-controls="radix-:r3q:-content-hidden"
                  data-state={activeTab === 'hidden' ? 'active' : 'inactive'}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 font-bold
                    ${activeTab === 'hidden' ? 'tab-active' : 'tab-inactive'}`}
                  tabIndex={activeTab === 'hidden' ? 0 : -1}
                  data-orientation="horizontal"
                  data-radix-collection-item=""
                  onClick={() => setActiveTab('hidden')}
                >
                  Hidden
                </button>
              </div>
              {/* Visible Tab Content */}
              {activeTab === 'visible' && (
                <div data-state="active" data-orientation="horizontal" role="tabpanel" aria-labelledby="radix-:r3q:-trigger-visible" id="radix-:r3q:-content-visible" tabIndex={0} className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-6">
                  <div className="bg-white rounded-lg shadow-lg border border-lolelink-purple/10 overflow-hidden">
                    <div className="overflow-x-auto">
                      <div className="flex items-center border-b last:border-b-0 hover:bg-gray-50 p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <span className="text-sm sm:text-base truncate flex-1 text-left text-black">Graphic Designer</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-md">
                            {/* Pencil Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil h-4 w-4"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path></svg>
                          </button>
                          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-md">
                            {/* Eye Off Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off h-4 w-4"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path></svg>
                          </button>
                          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md">
                            {/* Trash Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Hidden Tab Content (empty for now) */}
              {activeTab === 'hidden' && (
                <div data-state="active" data-orientation="horizontal" role="tabpanel" aria-labelledby="radix-:r3q:-trigger-hidden" id="radix-:r3q:-content-hidden" tabIndex={0} className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-6">
                  {/* Hidden tab content goes here */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
