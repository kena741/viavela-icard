"use client";
import React, { useState, useEffect } from "react";
// import icons from lucide-react or your preferred icon library
import { Users, BadgeCheck, ShoppingCart } from "lucide-react";

// Dummy data and hooks for demonstration
const dummyTopServices = [
    { serviceName: "Room Cleaning", count: 12, revenue: 1200 },
    { serviceName: "Laundry", count: 8, revenue: 800 },
    { serviceName: "Spa", count: 5, revenue: 1500 },
];
const dummyAnalytics = {
    views: 120,
    totalRequests: 25,
    totalSales: 3500,
    daily: [],
    loading: false,
};

function AppLoader() {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
}

function StatCard({ icon, title, value, gradient }: { icon: React.ReactNode; title: string; value: number; gradient: string }) {
    return (
        <div className={`rounded-xl p-4 flex flex-col items-center ${gradient}`}>
            <div className="mb-2">{icon}</div>
            <div className="text-lg font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-600">{title}</div>
        </div>
    );
}

export default function DashboardPage() {

    const provider_id = 1;
    const topServices = dummyTopServices;
    const { views, totalRequests, totalSales, daily, loading } = dummyAnalytics;
    const [selected, setSelected] = useState("This Week");

    useEffect(() => {

    }, [selected]);

    if (!provider_id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <AppLoader />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen px-3 md:px-8 pb-20 md:pb-8 mx-auto w-full">
            {/* Profile Header Placeholder */}
            <div className="py-6 mb-4 mt-24">
                <h1 className="text-2xl font-bold text-gray-900">Welcome, Customer</h1>
            </div>

            <div className="px-2 md:px-0 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-orange-500">Dashboard Overview</h2>
                <p className="text-gray-700 max-sm:text-sm mt-1">Track your activity and service usage</p>
            </div>

            <div className="mb-6">
                <div className="bg-white border border-orange-100 rounded-lg p-4 text-orange-700 font-medium">No actions required at this time.</div>
            </div>

            <div className="flex flex-row gap-2 md:gap-4 mb-3 md:mb-6">
                {["Today", "This Week", "This Month"].map((label) => (
                    <button
                        key={label}
                        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-orange-500 h-9 rounded-md px-3 flex-1 md:flex-none cursor-pointer ${selected === label
                            ? "bg-orange-500 text-white"
                            : "bg-white text-orange-500"
                            }`}
                        onClick={() => setSelected(label)}
                        type="button"
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-6 mb-3 md:mb-6">
                <StatCard
                    icon={<Users size={20} />}
                    title="Total Views"
                    value={views}
                    gradient="bg-gradient-to-r from-orange-50 to-orange-100"
                />
                <StatCard
                    icon={<BadgeCheck size={20} />}
                    title="Service Requests"
                    value={totalRequests}
                    gradient="bg-gradient-to-r from-orange-50 to-orange-100"
                />
                <StatCard
                    icon={<ShoppingCart size={20} />}
                    title="Total Sales"
                    value={totalSales}
                    gradient="bg-gradient-to-r from-orange-50 to-orange-100"
                />
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-md sm:text-lg font-semibold mb-4 px-2 text-gray-900">Analytics Overview</h3>
                        <div className="h-60 sm:h-96 flex items-center justify-center text-gray-400">
                            {/* Replace with AnalyticsBarChart */}
                            <span>Analytics chart coming soon...</span>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-[320px] flex flex-col gap-6 max-sm:mb-24">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Top requested services</h3>
                        <div className="space-y-2 md:space-y-4">
                            {topServices.length === 0 ? (
                                <div className="text-gray-500 text-sm">No data available.</div>
                            ) : (
                                topServices.map((service) => (
                                    <div
                                        key={service.serviceName}
                                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-chart-bar w-5 h-5 text-gray-400"
                                        >
                                            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                                            <path d="M7 16h8" />
                                            <path d="M7 11h12" />
                                            <path d="M7 6h3" />
                                        </svg>
                                        <div className="flex-1">
                                            <span className="block w-full text-center text-gray-900 font-medium">
                                                {service.serviceName}
                                            </span>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-sm text-gray-900">{service.count} requests</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    ETB&nbsp;{service.revenue.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
