"use client";
import type { Customer } from "@/features/provider/customerSlice";
import { Phone, Mail, CalendarDays, Pencil, Trash2, ChevronRight } from "lucide-react";

type Props = {
    customer: Customer;
    onSelect: (c: Customer) => void;
    onEdit: (c: Customer) => void;
    onDelete: (c: Customer) => void;
};

export default function CustomerCard({ customer, onSelect, onDelete, onEdit }: Props) {
    const initials = `${customer.first_name?.[0] ?? ""}${customer.last_name?.[0] ?? ""}`.toUpperCase();
    const fullName = `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim();
    // Render canonical E.164 phone
    const phoneE164 = customer.phone ?? '';
    const lastReq = customer.last_request_at
        ? new Date(customer.last_request_at).toLocaleDateString()
        : "Not yet";

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(customer);
        }
    };

    return (
        <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400" />

            {/* Clickable header area (no nested interactive elements inside) */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => onSelect(customer)}
                onKeyDown={handleKeyDown}
                className="w-full text-left p-4 pt-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                aria-label={`Open ${fullName} details`}
            >
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold">
                        {initials || "CU"}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="truncate font-semibold text-gray-900">{fullName || "Unnamed"}</h3>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-600">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span className="truncate">Last request: {lastReq}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact section (separate from clickable header) */}
            <div className="px-4 pb-4 grid grid-cols-2 gap-2 text-[12px]">
                <a
                    href={customer.phone ? `tel:${phoneE164}` : undefined}
                    className={`flex items-center gap-2 rounded-lg border px-2 py-2 ${customer.phone ? "border-gray-200 text-gray-700 hover:bg-gray-50" : "border-gray-100 text-gray-400 cursor-default"
                        }`}
                    aria-disabled={!customer.phone}
                    tabIndex={customer.phone ? 0 : -1}
                    onClick={(e) => {
                        if (!customer.phone) e.preventDefault();
                    }}
                >
                    <Phone className="h-4 w-4" />
                    <span className="truncate">{phoneE164 || "No phone"}</span>
                </a>
                <a
                    href={customer.email ? `mailto:${customer.email}` : undefined}
                    className={`flex items-center gap-2 rounded-lg border px-2 py-2 ${customer.email ? "border-gray-200 text-gray-700 hover:bg-gray-50" : "border-gray-100 text-gray-400 cursor-default"
                        }`}
                    aria-disabled={!customer.email}
                    tabIndex={customer.email ? 0 : -1}
                    onClick={(e) => {
                        if (!customer.email) e.preventDefault();
                    }}
                >
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{customer.email || "No email"}</span>
                </a>
            </div>
            {/* Actions */}
            <div className="mt-3 mb-4 flex items-center justify-end gap-2 text-sm">
                <div className="flex items-center justify-end gap-2 flex-wrap">
                    <button
                        onClick={() => onEdit(customer)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        aria-label="Edit customer"
                    >
                        <Pencil className="h-4 w-4" />
                        <span className="inline">Edit</span>
                    </button>

                    <button
                        onClick={() => onDelete(customer)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-500 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                        aria-label="Delete customer"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="inline">Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
