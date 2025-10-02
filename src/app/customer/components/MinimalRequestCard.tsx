'use client';
import React from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { RequestsState } from "@/features/requests/requestsSlice";

export interface ServiceCardProps {

  req: RequestsState;
  isDragging?: boolean;
  onViewDetails?: () => void;
}

export const MinimalRequestCard: React.FC<ServiceCardProps> = ({
  req,
  isDragging = false,
  onViewDetails,
}) => {
  const placeholder = 'https://placehold.co/221x119';
  const imgSrc = req.serviceImage || placeholder;
  return (
    <>
      <div className={`w-60 pb-2.5 bg-white rounded-xl shadow outline outline-offset-[-1px] outline-orange-100 inline-flex flex-col justify-start items-center gap-2.5 overflow-hidden ${isDragging ? 'ring-2 ring-orange-500' : ''}`}>
        <Image
          className="w-60 h-28 rounded-tl-xl rounded-tr-xl object-cover"
          src={imgSrc}
          alt="Service"
          width={240}
          height={112}
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholder;
          }}
        />
        <div className="self-stretch px-5 py-0.5 border-b border-gray-200 inline-flex justify-between items-center">
          <div className="w-48 flex justify-start items-center">
            <div className="pb-[0.67px] flex justify-center items-center gap-6">
              <div className="w-28 justify-center text-gray-900 text-base font-semibold font-['Segoe_UI']">{
                req.serviceName
                  ? req.serviceName.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                  : ''
              }</div>
              <div className="justify-center text-orange-700 text-base font-bold font-['Segoe_UI']">{req.price} ETB</div>
            </div>
          </div>
        </div>
        <div className="self-stretch px-5 inline-flex justify-between items-center">
          <div className="flex-1 flex justify-start items-center">
            <div className="pb-[0.67px] flex justify-center items-center gap-6">
              <div className="justify-center text-gray-700 text-sm font-normal font-['Segoe_UI'] line-clamp-2 break-words">{req.description ? req.description.charAt(0).toUpperCase() + req.description.slice(1) : ''}</div>
            </div>
          </div>
        </div>
        <div className="px-5 w-full">
          <div className="px-5 py-2 bg-orange-50 rounded-md flex flex-col justify-center items-start gap-2">
            <div className="inline-flex justify-start items-center gap-2.5">
              <div className="self-stretch flex justify-center items-center gap-1.5">
                <div className="inline-flex flex-col justify-center items-start gap-0.5">
                  <div className="inline-flex justify-start items-start gap-1">
                    <div className="justify-center text-neutral-700 text-[10px] font-bold font-['Inter']">Client:  </div>
                    <div className="justify-center text-neutral-700 text-[10px] font-normal font-['Inter']">{req.firstName + ' ' + req.lastName}</div>
                  </div>
                  <div className="inline-flex justify-start items-start gap-1">
                    <div className="justify-center text-neutral-700 text-[10px] font-bold font-['Inter']">Phone:  </div>
                    <div className="justify-center text-neutral-700 text-[10px] font-normal font-['Inter']">{req.phoneNumber}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch px-5 py-2.5 border-t border-gray-200 inline-flex justify-start items-center gap-[5px]">
          <Clock size={16} className="text-zinc-600 mr-1" />
          <div className="justify-center text-zinc-600 text-xs font-normal font-['Inter']">{req.createdAt ? new Date(req.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</div>
        </div>
        <button
          className="cursor-pointer w-52 p-1.5 rounded-[10px] outline outline-offset-[-1px] outline-orange-500 inline-flex justify-center items-start gap-14 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          onClick={onViewDetails}
          type="button"
        >
          <div className="justify-center text-orange-500 text-xs font-normal font-['Inter']">View</div>
        </button>
      </div>
    </>
  );
};