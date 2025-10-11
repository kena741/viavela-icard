"use client";
import React, { useState, useEffect } from "react";
import { Users, BadgeCheck, ShoppingCart } from "lucide-react";


const dummyAnalytics = {
    views: 120,
    totalRequests: 25,
    totalSales: 3500,
    daily: [],
    loading: false,
};

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
    const { views, totalRequests, totalSales } = dummyAnalytics;
    const [selected, setSelected] = useState("This Week");

    useEffect(() => { }, [selected]);

    if (!provider_id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center py-10 text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-3 md:px-8 pb-20 md:pb-8 mx-auto w-full font-sans">
            {/* Profile Header Placeholder */}
            <div className="py-10 mb-4 mt-24 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-2 tracking-tight">Welcome, Customer</h1>
            </div>

            <div className="px-2 md:px-0 mb-8 flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-700">Dashboard Overview</h2>
                <p className="text-blue-500 max-sm:text-sm mt-1">Track your activity and service usage</p>
            </div>

            <div className="mb-8 flex flex-col items-center">
                <div className="bg-white rounded-2xl shadow p-5 text-blue-700 font-medium w-full max-w-2xl text-center">No actions required at this time.</div>
            </div>

            <div className="flex flex-row gap-3 md:gap-6 mb-6 justify-center">
                {["Today", "This Week", "This Month"].map((label) => (
                    <button
                        key={label}
                        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-500 h-10 rounded-lg px-4 flex-1 md:flex-none cursor-pointer ${selected === label
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-600"
                            }`}
                        onClick={() => setSelected(label)}
                        type="button"
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-8">
                <StatCard
                    icon={<Users size={20} />}
                    title="Total Views"
                    value={views}
                    gradient="bg-gradient-to-r from-blue-50 to-blue-100"
                />
                <StatCard
                    icon={<BadgeCheck size={20} />}
                    title="Service Requests"
                    value={totalRequests}
                    gradient="bg-gradient-to-r from-blue-50 to-blue-100"
                />
                <StatCard
                    icon={<ShoppingCart size={20} />}
                    title="Total Sales"
                    value={totalSales}
                    gradient="bg-gradient-to-r from-blue-50 to-blue-100"
                />
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-2xl shadow p-7">
                        <h3 className="text-lg font-semibold mb-4 px-2 text-blue-800">Analytics Overview</h3>
                        <div className="h-60 sm:h-96 flex items-center justify-center text-blue-200">
                            {/* Replace with AnalyticsBarChart */}
                            <span>Analytics chart coming soon...</span>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-[320px] flex flex-col gap-6 max-sm:mb-24">
                    <div className="bg-white rounded-2xl shadow px-5 py-5">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">Top Viewed profiles</h3>
                        <div className="space-y-4">
                            <div className="text-blue-400 text-base text-center">Coming soon...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
