// components/StatCard.tsx
import { ReactNode } from "react";

interface StatCardProps {
    icon: ReactNode;
    title: string;
    value: number;
    gradient?: string; // Optional gradient class
}

export default function StatCard({ icon, title, value, gradient }: StatCardProps) {
    return (
        <div
            className={`rounded-lg p-6 w-full shadow-sm ${gradient ?? 'bg-gradient-to-r from-[#E0F7FA] to-[#F1F8FF]'}`}
        >
            <div className="flex items-center justify-center mb-3">
                <div className="bg-blue-600 text-white p-3 rounded-full">
                    {icon}
                </div>
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-gray-700">{title}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
        </div>
    );
}
