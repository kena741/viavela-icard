"use client";
import Image from "next/image";
import Link from "next/link";
import type { HandyManModel } from "@/features/handyman/handymanSlice";
import { Mail, Phone, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";

type Props = {
  handyman: HandyManModel;
  onEdit: (h: HandyManModel) => void;
  onToggle: (h: HandyManModel) => void;
  onDelete: (h: HandyManModel) => void;
};

export default function HandymanCard({ handyman, onEdit, onToggle, onDelete }: Props) {
  const initials = `${handyman.firstName?.[0] ?? ""}${handyman.lastName?.[0] ?? ""}`.toUpperCase();
  const fullName = `${handyman.firstName ?? ""} ${handyman.lastName ?? ""}`.trim();

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Accent top border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400" />

      <div className="p-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {handyman.profileImage ? (
              <Image
                src={handyman.profileImage}
                alt={fullName || "Handyman"}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover border border-gray-200"
                unoptimized
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-semibold">
                {initials || "HM"}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-gray-900">
                <Link href={`/provider/dashboard/handyman/${handyman.id}`} className="hover:underline">{fullName || "Unnamed"}</Link>
              </h3>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${handyman.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
              >
                {handyman.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-600">
              {handyman.category && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5">{handyman.category}</span>
              )}
              {handyman.subCategory && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5">{handyman.subCategory}</span>
              )}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
          <a
            href={handyman.phoneNumber ? `tel:${handyman.phoneNumber}` : undefined}
            className={`flex items-center gap-2 rounded-lg border px-2 py-2 ${handyman.phoneNumber ? "border-gray-200 text-gray-700 hover:bg-gray-50" : "border-gray-100 text-gray-400 cursor-default"
              }`}
            aria-disabled={!handyman.phoneNumber}
            tabIndex={handyman.phoneNumber ? 0 : -1}
          >
            <Phone className="h-4 w-4" />
            <span className="truncate">{handyman.phoneNumber || "No phone"}</span>
          </a>
          <a
            href={handyman.email ? `mailto:${handyman.email}` : undefined}
            className={`flex items-center gap-2 rounded-lg border px-2 py-2 ${handyman.email ? "border-gray-200 text-gray-700 hover:bg-gray-50" : "border-gray-100 text-gray-400 cursor-default"
              }`}
            aria-disabled={!handyman.email}
            tabIndex={handyman.email ? 0 : -1}
          >
            <Mail className="h-4 w-4" />
            <span className="truncate">{handyman.email || "No email"}</span>
          </a>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(handyman)}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
              aria-label="Edit handyman"
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button
              onClick={() => onToggle(handyman)}
              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-[12px] font-medium ${handyman.isActive
                ? "border-orange-400 text-orange-600 hover:bg-orange-50"
                : "border-green-500 text-green-600 hover:bg-green-50"
                }`}
              aria-label={handyman.isActive ? "Hide handyman" : "Show handyman"}
              title={handyman.isActive ? "Hide" : "Show"}
            >
              {handyman.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {handyman.isActive ? "Hide" : "Show"}
            </button>
          </div>
          <button
            onClick={() => onDelete(handyman)}
            className="inline-flex items-center gap-1 rounded-md border border-red-500 bg-white px-2.5 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-50"
            aria-label="Delete handyman"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
