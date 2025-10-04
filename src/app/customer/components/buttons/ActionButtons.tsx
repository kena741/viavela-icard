"use client";
import React from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type ActionButtonsProps<T> = {
    item: T;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onToggle?: (item: T) => void;
    isActive?: boolean; // only needed if toggle is shown
};

export default function ActionButtons<T>({
    item,
    onEdit,
    onDelete,
    onToggle,
    isActive,
}: ActionButtonsProps<T>) {
    return (
        <div className="flex justify-end gap-2">
            {onEdit && (
                <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                    title="Edit"
                >
                    <Pencil className="h-4 w-4" /> Edit
                </button>
            )}

            {onToggle && (
                <button
                    type="button"
                    onClick={() => onToggle(item)}
                    className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs ${isActive
                        ? "border-blue-400 text-blue-600 hover:bg-blue-50"
                        : "border-green-500 text-green-600 hover:bg-green-50"
                        }`}
                    title={isActive ? "Hide" : "Show"}
                >
                    {isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {isActive ? "Hide" : "Show"}
                </button>
            )}

            {onDelete && (
                <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="inline-flex items-center gap-1 rounded-md border border-red-500 bg-white px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" /> Delete
                </button>
            )}
        </div>
    );
}
