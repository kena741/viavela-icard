"use client";

import React from "react";
import Image from "next/image";

// Inline ServiceCard component (scoped to this file only)
type ServiceCardProps = {
    thumbnailSrc: string;
    title: string;
    description: string;
    price: string;
    duration: string;
    isActive?: boolean;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onCreate?: () => void;
};

function IconButton({
    label,
    icon,
    onClick,
    color = "blue",
}: {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    color?: "blue" | "orange";
}) {
    const scheme =
        color === "blue"
            ? "text-sky-600 border-sky-200 hover:bg-sky-50"
            : "text-orange-400 border-orange-200 hover:bg-orange-50";
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            onClick={onClick}
            className={`
        inline-flex h-[28px] w-[28px] items-center justify-center
        rounded-[6px] border bg-white
        transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-sky-600 ${scheme}
      `}
        >
            {icon}
        </button>
    );
}

export function ServiceCard({
    thumbnailSrc,
    title,
    description,
    price,
    duration,
    isActive = false,
    onView,
    onEdit,
    onDelete,
    onCreate,
}: ServiceCardProps) {
    return (
        <div
            className="w-full max-w-[980px] rounded-[12px] border border-gray-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] px-[16px] py-[12px] flex items-center gap-[16px]"
            role="group"
            aria-label={`${title} card`}
        >
            {/* Thumbnail */}
            <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[8px] border border-gray-200">
                <Image
                    src={thumbnailSrc}
                    alt={`${title} cover`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    priority
                />
            </div>

            {/* Title & Description */}
            <div className="min-w-0 flex-1">
                <h3 className="truncate text-[16px] font-semibold leading-[22px] text-gray-900">
                    {title}
                </h3>
                <p className="mt-[2px] line-clamp-2 text-[14px] leading-[20px] text-gray-600">
                    {description}
                </p>
            </div>

            {/* Price */}
            <div className="hidden sm:flex sm:items-start sm:gap-[10px] sm:pl-[12px] sm:pr-[6px] sm:ml-[4px] sm:border-l-3 sm:border-sky-600">
                <div className="flex flex-col">
                    <span className="text-[12px] leading-[16px] font-medium text-gray-600">Price</span>
                    <span className="text-[14px] leading-[20px] text-gray-900">{price}</span>
                </div>
            </div>

            {/* Duration */}
            <div className="hidden sm:flex sm:items-start sm:gap-[10px] sm:pl-[12px] sm:pr-[6px] sm:ml-[8px] sm:border-l-3 sm:border-sky-600">
                <div className="flex flex-col">
                    <span className="text-[12px] leading-[16px] font-medium text-gray-600">Duration</span>
                    <span className="text-[14px] leading-[20px] text-gray-900">{duration}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="ml-[8px] flex items-center gap-[6px]">
                <IconButton
                    label="Create Request"
                    color="blue"
                    onClick={onCreate}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-plus h-4 w-4"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>

                    }
                />
                <IconButton
                    label="Toggle Status"
                    color="blue"
                    onClick={onView}
                    icon={
                        isActive ? (
                            // Eye with slash (active -> hide)
                            <svg
                                width="18" height="18" viewBox="0 0 24 24"
                                className="stroke-current"
                                fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                                <circle cx="12" cy="12" r="3" />
                                <line x1="2" y1="2" x2="22" y2="22" />
                            </svg>
                        ) : (
                            // Eye (inactive -> show)
                            <svg
                                width="18" height="18" viewBox="0 0 24 24"
                                className="stroke-current"
                                fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                            >
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )
                    }
                />
                <IconButton
                    label="Edit"
                    color="blue"
                    onClick={onEdit}
                    icon={
                        <svg
                            width="18" height="18" viewBox="0 0 24 24"
                            className="stroke-current"
                            fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                        </svg>
                    }
                />
                <IconButton
                    label="Delete"
                    color="orange"
                    onClick={onDelete}
                    icon={
                        <svg
                            width="18" height="18" viewBox="0 0 24 24"
                            className="stroke-current"
                            fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                    }
                />
            </div>
        </div>
    );
}