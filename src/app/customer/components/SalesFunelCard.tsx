'use client';

import type { SalesFunnelLeadModel } from "@/models/SalesFunnelLead";
import { Phone, Mail } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export type SalesFunelCardProps = {
    lead: SalesFunnelLeadModel;
    isDragging: boolean,
    onViewDetails?: () => void;
};


export const SalesFunelCard: React.FC<SalesFunelCardProps> = ({
    lead,
    isDragging,
    onViewDetails,
}) => {

    // Clipboard copy handlers with feedback
    const [copied, setCopied] = useState<string | null>(null);
    const handleCopyPhone = () => {
        if (lead.phoneNumber) {
            navigator.clipboard.writeText(lead.phoneNumber);
            setCopied('phone');
            setTimeout(() => setCopied(null), 1200);
        }
    };
    const handleMailClick = () => {
        if (lead.email) {
            // Open Gmail compose window with receiver
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(lead.email)}`, '_blank');
        }
    };

    return (
        <div className={`w-60 pb-2.5 bg-white rounded-xl shadow outline-1 outline-offset-[-1px] outline-gray-100 flex flex-col justify-start items-center gap-2.5 ${isDragging ? 'ring-2 ring-sky-600' : ''}`}>
            {lead.image ? (
                <Image
                    className="w-60 h-28 rounded-tl-xl rounded-tr-xl object-cover"
                    src={lead.image}
                    alt="Service"
                    width={240}
                    height={112}
                />
            ) : (
                <div className="w-60 h-28 rounded-tl-xl rounded-tr-xl bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-600 text-center">{lead.customerName}</span>
                </div>
            )}
            <div className="self-stretch px-5 py-0.5 border-b border-gray-200 inline-flex justify-between items-center">
                <div className="w-48 inline-flex flex-col justify-center items-center">
                    <div className="self-stretch pb-[0.67px] inline-flex justify-start items-center gap-5">
                        <div className="inline-flex flex-col justify-center items-start">
                            <div className="justify-center text-black text-base font-semibold font-['Segoe_UI']">{lead.customerName}</div>
                            <div className="justify-center text-neutral-700 text-[10px] font-normal font-['Segoe_UI']">{lead.companyName}</div>
                        </div>
                        <div className="flex justify-start items-center gap-2.5">
                            <div className="relative">
                                <div className="p-2 rounded-[200px] outline-1 outline-offset-[-1px] outline-zinc-100 cursor-pointer" title={lead.phoneNumber || ''} onClick={handleCopyPhone}>
                                    <Phone size={16} className="text-sky-600 " />
                                </div>
                                {copied === 'phone' && (
                                    <span className="absolute left-1/2 -translate-x-1/2 top-10 bg-black text-white text-xs rounded px-2 py-1 z-10">Copied!</span>
                                )}
                            </div>
                            <div className="relative">
                                <div className="p-2 rounded-[200px] outline-1 outline-offset-[-1px] outline-zinc-100 cursor-pointer" title={lead.email || ''} onClick={handleMailClick}>
                                    <Mail size={16} className="text-sky-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ...existing code... */}
            <div className="w-48 h-24 p-2.5 bg-gray-50 rounded-md flex flex-col justify-start items-start gap-2">
                <div className="inline-flex justify-start items-center gap-2.5">
                    <div className="self-stretch flex justify-center items-center gap-1.5">
                        <div className="inline-flex flex-col justify-center items-start gap-0.5">
                            <div className="inline-flex justify-start items-start gap-1 mt-2">
                                <div className="justify-center text-neutral-700 text-xs font-bold font-['Inter']">Service:</div>
                                <div className="justify-center text-neutral-700 text-xs font-normal font-['Inter']">{lead.service}</div>
                            </div>
                            <div className="inline-flex justify-start items-start gap-1">
                                <div className="justify-center text-neutral-700 text-xs font-bold font-['Inter']">Value:</div>
                                <div className="justify-center text-neutral-700 text-xs font-normal font-['Inter']">{lead.value}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-44 justify-center text-black text-xs font-normal font-['Segoe_UI'] line-clamp-1">
                    {lead.note}
                </div>
            </div>
            <div className="w-48 h-9 px-3 py-[3px] bg-sky-600 rounded-md flex justify-center items-center gap-1">
                <div className="flex flex-col justify-start items-center">
                    <div className="text-center justify-center text-white text-sm font-normal font-['Segoe_UI'] cursor-pointer" onClick={onViewDetails}>View Details</div>
                </div>
            </div>
        </div>
    );
};