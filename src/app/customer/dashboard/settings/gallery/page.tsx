"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCustomer } from "@/features/auth/loginSlice";
import { uploadFilesToSupabase, deleteImageFromSupabase } from "@/features/uploadFilesToSupabase";
import Image from "next/image";


export default function GallerySettingsPage() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    type ImageFileWithPreview = { file: File; preview: string };
    const [imageFiles, setImageFiles] = useState<ImageFileWithPreview[]>([]);
    const [uploading, setUploading] = useState(false);


    // Upload images to Supabase and update gallery
    const handleUpload = async () => {
        if (!user?.id || imageFiles.length === 0) return;
        setUploading(true);
        try {
            const urls = await uploadFilesToSupabase(imageFiles.map(img => img.file), `public/gallery/${user.id}`);
            const newGallery = [...(user.gallery || []), ...urls];
            await dispatch(updateCustomer({ id: user.user_id, gallery: newGallery }));
            setImageFiles([]);
        } finally {
            setUploading(false);
        }
    };

    // Delete image from gallery
    const handleDelete = async (img: string) => {
        if (!user) return;
        setUploading(true);
        try {
            await deleteImageFromSupabase(img);
            const newGallery = (user.gallery || []).filter((g) => g !== img);
            await dispatch(updateCustomer({ id: user.user_id, gallery: newGallery }));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen px-3 md:px-8 pb-20 md:pb-8 mx-auto max-w-3xl md:max-w-4xl lg:max-w-6xl w-full">
            <div className="mb-6 flex flex-col items-start text-center">
                <h2 className="text-xl md:text-2xl font-bold mb-1 text-blue-600">Gallery</h2>
                <p className="mt-1 max-sm:text-sm text-gray-500">Upload and manage your business gallery images.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative ">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Add Images</label>
                    <div className="flex flex-wrap gap-4">
                        {imageFiles.map((img, idx) => (
                            <div key={img.preview} className="relative group border rounded overflow-hidden w-28 h-28">
                                <Image src={img.preview} alt="Preview" fill className="object-cover" />
                                {/* Delete Icon Button */}
                                <button
                                    type="button"
                                    title="Remove image"
                                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                        setImageFiles(prev => {
                                            const toDelete = prev[idx];
                                            if (toDelete) URL.revokeObjectURL(toDelete.preview);
                                            return prev.filter((_, i) => i !== idx);
                                        });
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-x w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path d="M18 6L6 18" />
                                        <path d="M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        {/* Upload Button */}
                        <label className="cursor-pointer w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed rounded-lg border-sky/20 hover:border-sky/40 hover:bg-pink-50/30 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-upload w-8 h-8 text-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span className="mt-2 text-sm text-gray-500">Upload images</span>
                            <input type="file" className="hidden" accept="image/*" onChange={e => {
                                if (!e.target.files) return;
                                const file = e.target.files[0];
                                if (file) {
                                    const url = URL.createObjectURL(file);
                                    setImageFiles(prev => [...prev, { file, preview: url }]);
                                }
                            }} />
                        </label>
                    </div>
                    {imageFiles.length > 0 && (
                        <button
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-60"
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading…" : "Upload to Gallery"}
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
                    {(user?.gallery || []).map((img) => (
                        <div
                            key={img}
                            className="relative group bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden aspect-square flex items-center justify-center transition-transform hover:scale-105 hover:shadow-lg"
                        >
                            <Image
                                src={img}
                                alt="Gallery"
                                fill
                                className="object-cover object-center transition-transform duration-200 group-hover:scale-105"
                                style={{ minHeight: 0, minWidth: 0 }}
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                priority={true}
                            />
                            <button
                                className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                onClick={() => handleDelete(img)}
                                disabled={uploading}
                                title="Delete image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path d="M18 6L6 18" />
                                    <path d="M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
