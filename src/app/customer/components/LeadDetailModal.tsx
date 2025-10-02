// components/LeadDetailsModal.tsx
import { SalesFunnelLeadModel } from "@/models/SalesFunnelLead";
import { useEffect, useRef } from "react";
import Image from "next/image";

export type ClientDetailsProps = {
    lead: SalesFunnelLeadModel;
    open: boolean;
    onClose: () => void;

    onViewMoreHistory?: () => void;
};



export default function LeadDetailsModal({ open, onClose, lead }: ClientDetailsProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;


    return (
        <>
            <div
                data-state="open"
                className="fixed inset-0 z-50 bg-black/60"
                aria-hidden="true"
                onClick={onClose}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="client-details-title"
                className="fixed left-1/2 top-1/2 z-50 flex w-[min(92vw,720px)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl  bg-white shadow-lg"
                tabIndex={-1}
                ref={dialogRef}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative flex-1">
                    {/* Close button */}
                    <button
                        className="absolute right-3 top-3 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        onClick={onClose}
                        aria-label="Close"
                        title="Close"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>

                    {/* Header */}
                    <div className="p-5 pb-3">
                        <h2 id="client-details-title" className="text-lg font-semibold text-gray-900">
                            Client Details
                        </h2>
                        <p className="text-sm text-gray-500">Sales Funnel</p>
                    </div>

                    {lead.image != null ? (
                        <div className="mx-5 mb-4 h-28 w-[260px] rounded-lg overflow-hidden relative">
                            <Image
                                src={lead.image}
                                alt="Banner"
                                width={260}
                                height={112}
                                className="rounded-lg object-cover"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    ) : (
                        <div className="mx-5 mb-4 h-28 w-[260px] rounded-lg rounded-tl-xl rounded-tr-xl bg-gray-200 flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-600 text-center">{lead.companyName}</span>
                        </div>
                    )}

                    {/* Body (scrollable) */}
                    <div className="mt-6 border-t border-gray-200" />

                    <div className="mt-6 max-h-[60vh] overflow-y-auto  pb-6 ">
                        {/* Top details: two-column on md+ */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-4  pt-4 md:grid-cols-1 px-8">
                            <InfoRow label="Name" value={lead.customerName} />
                            <InfoRow label="Company" value={lead.companyName} />
                            <InfoRow label="Email" value={lead.email} />
                            <InfoRow label="Phone" value={lead.phoneNumber} />
                            <InfoRow label="Location" value={lead.address} />
                        </div>

                        {/* Service section */}
                        <div className="mt-6 border-t border-gray-200 " />
                        <div className="mt-6 px-5 grid grid-cols-1 gap-x-8 gap-y-4  pt-4 md:grid-cols-1">
                            <InfoRow label="Service" value={lead.service} />
                            <InfoRow label="Value" value={lead.value + '' + lead.currency} />
                            <InfoRow label="Date" value={lead.expectedCloseDate} />
                            {/* <div className="flex items-start justify-between">
                                <span className="text-sm text-gray-500">Interaction history</span>
                                <button
                                    type="button"
                                    onClick={onViewMoreHistory}
                                    className="text-sm font-medium text-blue-600 hover:underline"
                                >
                                    View more
                                </button>
                            </div> */}
                        </div>

                        {/* Notes */}
                        <div className="mt-6 border-t border-gray-200" />

                        {lead.note && (
                            <div className="mt-6  px-8 mb-8">
                                <div className="text-sm text-gray-500">Notes</div>
                                <p className="mt-1 whitespace-pre-line rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                                    {lead.note}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

/** Small helper row */
function InfoRow({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <span className="justify-center text-neutral-700 text-base font-semibold font-['Segoe_UI']">{label}</span>
            <span className="justify-center text-neutral-700 text-sm font-normal font-['Segoe_UI']">
                {value ?? "—"}
            </span>
        </div>
    );
}
