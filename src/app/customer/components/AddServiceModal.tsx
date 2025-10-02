"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
const ImageCropper = dynamic(() => import("../../components/ImageCropper"), { ssr: false });
const CropperModal = dynamic(() => import("./CropperModal"), { ssr: false });
import AppLoader from '@/app/components/AppLoader';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addService, closeAddServiceModal } from '@/features/service/addServiceSlice';
import CancelButton from "./CancelButton";
import { getCustomerServices } from "@/features/service/serviceSlice";
import { toast } from 'sonner';

import type { RootState } from "@/store/store";

import styles from './AddServiceModal.module.css';
// TikTok removed; using local video uploads instead
import Image from "next/image";

export default function AddServiceModal() {
    // Removed unused generateError state
    const dispatch = useAppDispatch();
    const open = useAppSelector((state: RootState) => (state as RootState & { addServiceModal?: { open: boolean } }).addServiceModal?.open);
    const { loading, error } = useAppSelector((state: RootState) => state.service ?? { loading: false, error: null });
    const { user } = useAppSelector((state: RootState) => state.auth);
    const [selectedLocation, setSelectedLocation] = React.useState<string>('my-location');
    const [serviceName, setServiceName] = useState("");
    const [description, setDescription] = useState("");
    // Category is now a free text field
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [duration, setDuration] = useState("");
    const [type, setType] = useState("");
    const [mediaType, setMediaType] = useState<'images' | 'video'>('images');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
    type ImageFileWithPreview = { file: File; preview: string };
    const [imageFiles, setImageFiles] = useState<ImageFileWithPreview[]>([]);
    const imageFilesRef = useRef<ImageFileWithPreview[]>([]);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [cropperImage, setCropperImage] = useState<string | null>(null);
    const [pendingFilename, setPendingFilename] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    // AI image generation removed

    // keep a ref to imageFiles and videoPreviewUrl so we can reset safely
    const videoPreviewUrlRef = useRef<string | null>(null);

    useEffect(() => {
        imageFilesRef.current = imageFiles;
    }, [imageFiles]);

    useEffect(() => {
        videoPreviewUrlRef.current = videoPreviewUrl;
    }, [videoPreviewUrl]);

    const startCropForFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setCropperImage(e.target?.result as string);
            setPendingFilename(file.name);
            setIsCropperOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropDone = (croppedBlob: Blob) => {
        const url = URL.createObjectURL(croppedBlob);
        const file = new File([croppedBlob], pendingFilename || "cropped.png", { type: croppedBlob.type });
        setImageFiles((prev) => [...prev, { file, preview: url }]);
        setIsCropperOpen(false);
        setCropperImage(null);
        setPendingFilename(null);
    };
    const cancelCrop = () => {
        setIsCropperOpen(false);
        setCropperImage(null);
        setPendingFilename(null);
    };

    // AI image generation removed




    // 4. Update handleImageChange to open cropper for selected file
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        if (file) {
            startCropForFile(file);
        }
    };
    // 7. Ensure delete button revokes blob URLs to free memory
    const handleDeleteImage = (idx: number) => {
        setImageFiles((prev) => {
            const toDelete = prev[idx];
            if (toDelete) URL.revokeObjectURL(toDelete.preview);
            return prev.filter((_, i) => i !== idx);
        });
    };

    // Reset form state (used after successful submit). Keeps dependencies
    // since it revokes object URLs stored in state.
    const resetForm = React.useCallback(() => {
        setServiceName("");
        setDescription("");
        setPrice("");
        setDiscount("");
        setDuration("");
        setType("");
        setMediaType('images');
        setVideoFile(null);
        if (videoPreviewUrlRef.current) URL.revokeObjectURL(videoPreviewUrlRef.current);
        setVideoPreviewUrl(null);
        imageFilesRef.current.forEach(img => URL.revokeObjectURL(img.preview));
        setImageFiles([]);
        setIsCropperOpen(false);
        setCropperImage(null);
        setPendingFilename(null);
        setUploading(false);
    }, []);

    // Stable reset used when opening the modal to clear primitive fields
    // without accidentally revoking URLs mid-edit.
    const resetPrimitives = useCallback(() => {
        setServiceName("");
        setDescription("");
        setPrice("");
        setDiscount("");
        setDuration("");
        setType("");
        setMediaType('images');
        setVideoFile(null);
        setIsCropperOpen(false);
        setCropperImage(null);
        setPendingFilename(null);
        setUploading(false);
    }, []);

    useEffect(() => {
        if (open) resetPrimitives();
    }, [open, resetPrimitives]);

    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
    // subcategories removed

    useEffect(() => {
        return () => {
            if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
        };
    }, [videoPreviewUrl]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setUploading(false);
        if (!serviceName.trim()) {
            toast.error("Missing Service Name", { description: "Please enter a name for your service." });
            return;
        }
        if (!description.trim()) {
            toast.error("Missing Description", { description: "Please provide a description for the service." });
            return;
        }
        if (!category.trim()) {
            toast.error("Category missing", { description: "Please enter a category for your service." });
            return;
        }
        const priceNum = Number(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            toast.error("Invalid Price", { description: "Price must be a number greater than 0." });
            return;
        }

        // Validate discount
        const discountNum = Number(discount);
        if (!isNaN(discountNum) && discountNum > priceNum) {
            toast.error("Invalid Discount", { description: "Discount cannot be greater than the price." });
            return;
        }


        // No category/subcategory lookup needed

        // Media validation and preparation
        if (mediaType === 'images') {
            if (imageFiles.length === 0) {
                toast.error("Missing media", { description: "Please upload at least one image or switch to Video and upload a clip." });
                return;
            }
        } else if (mediaType === 'video') {
            if (!videoFile) {
                toast.error("Missing media", { description: "Please upload a video up to 1 minute." });
                return;
            }
        }


        const result = await dispatch(addService({
            service: {
                service_name: serviceName,
                description,
                price: priceNum,
                discount,
                duration: duration,
                feature: false,
                type,
                customer_id: user?.id || "",
                review_count: null,
                review_sum: null,
                active: true,
                service_location_mode: selectedLocation,
                service_image: undefined,
                video: undefined,
            },
            imageFiles: mediaType === 'images' ? imageFiles.map(img => img.file) : undefined,
            videoFile: mediaType === 'video' ? videoFile ?? undefined : undefined
        }));

        if (addService.fulfilled.match(result) && user?.id) {
            dispatch(getCustomerServices(user.id));
            toast.success("Service Added", { description: "Your service has been added successfully." });
            resetForm();
        } else {
            toast.error("Submission Failed", { description: "Something went wrong while saving your service." });
        }
    };


    return (
        <>
            <div
                data-state="open"
                className="fixed inset-0 z-[9998] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pointer-events-auto cursor-pointer"
                onClick={() => dispatch(closeAddServiceModal())}
            />
            <div
                role="dialog"
                aria-modal="true"
                className="fixed left-1/2 max-md:pl-4  top-1/2 z-[9999] grid w-[100%] h-full overflow-x-hidden max-w-3xl max-h-screen translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white pr-10 shadow-lg duration-200 sm:rounded-lg overflow-y-auto"
                onClick={stopPropagation}
            >
                <div className={` -mr-4 py-6 sm:p-6 ${styles['max-h-modal-form-body']}`}>
                    {/* Sticky footer */}
                    <div className="bg-white flex justify-end gap-3 p-4 -mr-3 md:-mr-8 -mt-3 max-sm:-mt-5">
                        <CancelButton onClick={() => dispatch(closeAddServiceModal())} label="Cancel" />
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  bg-orange-600 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
                            disabled={loading}
                            onClick={handleSubmit}
                        >
                            {loading ? (
                                <AppLoader />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save mr-1 h-4 w-4"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>
                            )}
                            {loading ? "Saving…" : "Add Service"}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white font-semibold text-sm">1</div>
                        <h2 className="text-lg md:text-xl font-semibold text-black">Basic Information</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 h-full -mr-2 ">
                        <div>
                            <label className="text-sm font-medium leading-none text-black" htmlFor="serviceName">Service Name *</label>
                            <input
                                type="text"
                                id="serviceName"
                                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-background text-black placeholder:text-gray-400 focus-visible:outline-none  mt-1"
                                value={serviceName}
                                onChange={e => setServiceName(e.target.value)}
                                placeholder="Service Name"
                                maxLength={50}
                            />
                            <div className="flex justify-end ">
                                <span className="text-xs text-black">{serviceName.length}/50</span>
                            </div>
                        </div>

                        {/* CATEGORY (free text) */}
                        <div className="mb-5">
                            <label className="text-sm font-medium leading-none text-black" htmlFor="category">Category *</label>
                            <input
                                type="text"
                                id="category"
                                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-background text-black placeholder:text-gray-400 focus-visible:outline-none  mt-1"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                placeholder="Enter category (e.g. Cleaning, Plumbing)"
                                maxLength={50}
                            />
                            <div className="flex justify-end ">
                                <span className="text-xs text-black">{category.length}/50</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-10 mb-5">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white font-semibold text-sm">2</div>
                            <h2 className="max-sm:text-lg md:text-xl font-semibold text-black">Pricing & Duration</h2>
                        </div>


                        {/* PRICE */}
                        <div>
                            <label className="text-sm font-medium leading-none text-black" htmlFor="price">Price *</label>
                            <input
                                type="number"
                                id="price"
                                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-background text-black placeholder:text-gray-400 focus-visible:outline-none  mt-1"
                                value={price}
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    if (val >= 0) setPrice(e.target.value);
                                }}
                                placeholder="Price"
                            />
                        </div>

                        {/* DISCOUNT */}
                        <div className="mt-4">
                            <label className="text-sm font-medium leading-none text-black" htmlFor="discount">Discount</label>
                            <input
                                type="text"
                                id="discount"
                                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-background text-black placeholder:text-gray-400 focus-visible:outline-none  mt-1"
                                value={discount}
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    if (!isNaN(val) && val >= 0 && val <= Number(price)) {
                                        setDiscount(e.target.value);
                                    }
                                }}

                                placeholder="Discount"
                            />
                        </div>

                        {/* DURATION */}
                        <div className="mt-4">
                            <label className="text-sm font-medium leading-none text-black" htmlFor="duration">Duration</label>
                            <input
                                type="text"
                                id="duration"
                                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-background text-black placeholder:text-gray-400 focus-visible:outline-none  mt-1"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                                placeholder="Duration (e.g. 1h 30m or 90)"
                            />
                        </div>

                        {/* TYPE */}
                        <div className="mt-4">
                            <label className="text-sm font-medium leading-none text-black" htmlFor="type">Type</label>
                            <select
                                id="type"
                                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white text-black focus:outline-none mt-1"
                                value={type}
                                onChange={e => setType(e.target.value)}
                                title="Type"
                            >
                                <option value="">Select Type</option>
                                <option value="Fixed">Fixed</option>
                                <option value="Hourly">Hourly</option>
                            </select>
                        </div>


                        <div>
                            <div>
                                <div className="flex items-center gap-3 mt-8 mb-5">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white font-semibold text-sm">3</div>
                                    <h2 className="text-lg md:text-xl font-semibold text-black">Service Description & Media</h2>
                                </div>

                                <div className="relative mt-2">
                                    <label className="text-sm font-medium leading-none text-black pb-5" htmlFor="description">Description *</label>
                                    {/* AI description generation button removed */}

                                    {/* Textarea */}
                                    <textarea
                                        id="description"
                                        className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 pr-32 text-sm ring-offset-background text-black placeholder:text-gray-400 focus-visible:outline-none  mt-1 h-32"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Description"
                                    />
                                    {/* AI error message removed */}
                                </div>
                            </div>


                            {/* Media Type Switch */}
                            <div className="mt-6">
                                <label className="text-sm font-medium leading-none text-black">Media</label>
                                <div className="flex items-center gap-2 mt-2">
                                    <button type="button" onClick={() => setMediaType('images')} className={`px-3 py-1.5 rounded-md text-sm border ${mediaType === 'images' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-black border-gray-300'}`}>Images</button>
                                    <button type="button" onClick={() => setMediaType('video')} className={`px-3 py-1.5 rounded-md text-sm border ${mediaType === 'video' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-black border-gray-300'}`}>Video</button>
                                </div>
                            </div>

                            {/* Video upload and preview */}
                            {mediaType === 'video' && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium leading-none text-black" htmlFor="videoUpload">Upload a video (max 1 min)</label>
                                    <input
                                        id="videoUpload"
                                        type="file"
                                        accept="video/mp4,video/webm,video/quicktime"
                                        className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border file:border-gray-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-gray-50"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
                                            setVideoFile(null);
                                            setVideoPreviewUrl(null);
                                            if (!file) return;
                                            // Basic size guard (~100MB max)
                                            const maxBytes = 100 * 1024 * 1024;
                                            if (file.size > maxBytes) {
                                                toast.error('Video too large', { description: 'Please upload a video under 100MB.' });
                                                return;
                                            }
                                            const url = URL.createObjectURL(file);
                                            // Validate duration <= 60s via metadata load
                                            const probe = document.createElement('video');
                                            probe.preload = 'metadata';
                                            probe.src = url;
                                            probe.onloadedmetadata = () => {
                                                const duration = probe.duration;
                                                if (Number.isFinite(duration) && duration > 60.5) {
                                                    URL.revokeObjectURL(url);
                                                    toast.error('Video too long', { description: 'Please upload a video up to 60 seconds.' });
                                                    (e.target as HTMLInputElement).value = '';
                                                } else {
                                                    setVideoFile(file);
                                                    setVideoPreviewUrl(url);
                                                }
                                            };
                                            probe.onerror = () => {
                                                URL.revokeObjectURL(url);
                                                toast.error('Invalid video file', { description: 'Could not read video metadata.' });
                                                (e.target as HTMLInputElement).value = '';
                                            };
                                        }}
                                    />
                                    {videoPreviewUrl && (
                                        <div className="mt-3 flex justify-center">
                                            <div className="w-full max-w-xs">
                                                <video src={videoPreviewUrl} controls playsInline className="w-full rounded-md bg-black" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Images / Portfolio Section (conditional) */}
                            {mediaType === 'images' && (
                                <div className="md:col-span-2 mt-5">
                                    <label className="text-sm font-medium leading-none mb-3">Images / Portfolio</label>
                                    <p className="max-sm:text-xs text-sm text-gray-500 mb-2">Click the &apos;star&apos; icon to set an image as the cover photo.</p>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                                        {imageFiles.map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <Image
                                                    src={img.preview}
                                                    alt={`Service image ${idx + 1}`}
                                                    width={400}
                                                    height={400}
                                                    className="w-full aspect-square object-cover rounded-lg ring-2 ring-orange-600"
                                                    style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                                                    unoptimized
                                                />
                                                {/* Cover Icon Button */}
                                                <button
                                                    type="button"
                                                    title="Select as cover image"
                                                    className={`absolute top-2 left-2 p-1.5 rounded-full shadow-md transition-opacity border-2 ${idx === 0 ? 'bg-orange-600 text-white border-orange-500' : 'bg-white text-black border-gray-300 opacity-80 hover:opacity-100'}`}
                                                    onClick={() => {
                                                        if (idx !== 0) {
                                                            setImageFiles(prev => {
                                                                const arr = [...prev];
                                                                const [sel] = arr.splice(idx, 1);
                                                                arr.unshift(sel);
                                                                return arr;
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-image w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                                        <circle cx="9" cy="9" r="2" />
                                                        <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21" />
                                                    </svg>
                                                </button>
                                                {/* Delete Icon Button */}
                                                <button
                                                    type="button"
                                                    title="Remove image"
                                                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity"
                                                    onClick={() => handleDeleteImage(idx)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-x w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path d="M18 6L6 18" />
                                                        <path d="M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}

                                        {/* Upload Button */}
                                        <label className="cursor-pointer">
                                            <div className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg border-sky/20 hover:border-sky/40 hover:bg-pink-50/30 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="lucide lucide-upload w-8 h-8 text-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                                <span className="mt-2 text-sm text-gray-500">Upload images</span>
                                                <span className="text-xs text-gray-400">Maximum size: 5MB</span>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            {/* 6. Render ImageCropper modal at the bottom */}
                                            {isCropperOpen && cropperImage && (
                                                <ImageCropper
                                                    image={cropperImage}
                                                    aspect={1}
                                                    cropShape="rect"
                                                    onCropComplete={handleCropDone}
                                                    onCancel={cancelCrop}
                                                />
                                            )}
                                            <CropperModal open={isCropperOpen} onClose={cancelCrop}>
                                                {cropperImage && (
                                                    <ImageCropper
                                                        image={cropperImage}
                                                        aspect={1}
                                                        cropShape="rect"
                                                        onCancel={cancelCrop}
                                                        onCropComplete={handleCropDone}
                                                    />
                                                )}
                                            </CropperModal>
                                        </label>

                                        {/* AI image generation button removed */}
                                    </div>

                                    {uploading && <div className="text-xs text-blue-600">Uploading…</div>}
                                </div>
                            )}

                            <div className="mb-8 mt-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white font-semibold text-sm">4</div>
                                    <h2 className="text-lg md:text-xl font-semibold text-black">Service Mode &amp; Location</h2>
                                </div>

                                <div className="max-sm:space-y-3 space-y-6">
                                    <div className="max-sm:space-y-3 space-y-6">
                                        <div>
                                            <div role="radiogroup" aria-required="false" dir="ltr" className="gap-2 flex flex-col space-y-2 outline-none" tabIndex={0}>
                                                <div
                                                    className={`flex items-start space-x-2 p-3 rounded-lg border transition-colors cursor-pointer ${selectedLocation === 'my-location' ? 'bg-orange-600  text-white' : 'bg-white border-gray-100 hover:border-gray-200 text-black'}`}
                                                    onClick={() => setSelectedLocation('my-location')}
                                                >
                                                    <span className={`aspect-square h-4 w-4 rounded-full border flex items-center justify-center mt-1 ${selectedLocation === 'my-location' ? 'border-white bg-white' : 'border-black bg-white'}`}>
                                                        {selectedLocation === 'my-location' && <span className="block w-2 h-2 rounded-full bg-orange-600" />}
                                                    </span>
                                                    <div className="flex-1">
                                                        <label className={`peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-base font-medium cursor-pointer ${selectedLocation === 'my-location' ? 'text-white' : 'text-black'}`} htmlFor="my-location">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-house mr-2 h-5 w-5 ${selectedLocation === 'my-location' ? 'text-white' : 'text-black'}`}><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8z"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path></svg>
                                                            At my location
                                                        </label>
                                                        <p className={`text-xs md:text-sm mt-1 ${selectedLocation === 'my-location' ? 'text-white' : 'text-black'}`}>Clients will come to your specified location for the service</p>
                                                    </div>
                                                </div>
                                                {/* At client location */}
                                                <div
                                                    className={`flex items-start space-x-2 p-3 rounded-lg border transition-colors cursor-pointer ${selectedLocation === 'client-location' ? 'bg-orange-600  text-white' : 'bg-white border-gray-100 hover:border-gray-200 text-black'}`}
                                                    onClick={() => setSelectedLocation('client-location')}
                                                >
                                                    <span className={`aspect-square h-4 w-4 rounded-full border flex items-center justify-center mt-1 ${selectedLocation === 'client-location' ? 'border-white bg-white' : 'border-black bg-white'}`}>
                                                        {selectedLocation === 'client-location' && <span className="block w-2 h-2 rounded-full bg-orange-600" />}
                                                    </span>
                                                    <div className="flex-1">
                                                        <label className={`peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-base font-medium cursor-pointer ${selectedLocation === 'client-location' ? 'text-white' : 'text-black'}`} htmlFor="client-location">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-map-pin mr-2 h-5 w-5 ${selectedLocation === 'client-location' ? 'text-white' : 'text-black'}`}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                            At client&apos;s location
                                                        </label>
                                                        <p className={`text-xs md:text-sm mt-1 ${selectedLocation === 'client-location' ? 'text-white' : 'text-black'}`}>You will travel to the client&apos;s location to provide the service</p>
                                                    </div>
                                                </div>
                                                {/* No specific location */}
                                                <div
                                                    className={`flex items-start space-x-2 p-3 rounded-lg border transition-colors cursor-pointer ${selectedLocation === 'no-location' ? 'bg-orange-600  text-white' : 'bg-white border-gray-100 hover:border-gray-200 text-black'}`}
                                                    onClick={() => setSelectedLocation('no-location')}
                                                >
                                                    <span className={`aspect-square h-4 w-4 rounded-full border flex items-center justify-center mt-1 ${selectedLocation === 'no-location' ? 'border-white bg-white' : 'border-black bg-white'}`}>
                                                        {selectedLocation === 'no-location' && <span className="block w-2 h-2 rounded-full bg-orange-600" />}
                                                    </span>
                                                    <div>
                                                        <label className={`peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-base font-medium cursor-pointer ${selectedLocation === 'no-location' ? 'text-white' : 'text-black'}`} htmlFor="no-location">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-map-pin-off mr-2 h-5 w-5 ${selectedLocation === 'no-location' ? 'text-white' : 'text-black'}`}><path d="M12.75 7.09a3 3 0 0 1 2.16 2.16"></path><path d="M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568"></path><path d="m2 2 20 20"></path><path d="M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533"></path><path d="M9.13 9.13a3 3 0 0 0 3.74 3.74"></path></svg>
                                                            No specific location
                                                        </label>
                                                        <p className={`text-xs md:text-sm mt-1 ${selectedLocation === 'no-location' ? 'text-white' : 'text-black'}`}>This service doesn&apos;t require a physical location (e.g., online services)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CHECKBOXES */}
                            {/* <div>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={prePayment}
                                        onChange={e => setPrePayment(e.target.checked)}
                                    />
                                    Pre-payment Required
                                </label>
                            </div>
                            <div>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={feature}
                                        onChange={e => setFeature(e.target.checked)}
                                    />
                                    Feature
                                </label>
                            </div>
                            <div>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={status}
                                        onChange={e => setStatus(e.target.checked)}
                                    />
                                    Status (Active)
                                </label>
                            </div> */}

                            {error && (
                                <div className="md:col-span-2 text-red-600 text-sm mt-2">
                                    {error}
                                </div>
                            )}
                            {/* Sticky footer */}
                            <div className="bg-white flex justify-end max-md:mb-16 gap-3 p-4 border-t border-gray-200 mb-5">
                                <CancelButton onClick={() => dispatch(closeAddServiceModal())} label="Cancel" />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  bg-orange-600 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <AppLoader />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save mr-1 h-4 w-4"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>
                                    )}
                                    {loading ? "Saving" : "Add Service"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </>
    );
}