"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
const ImageCropper = dynamic(() => import("../../components/ImageCropper"), { ssr: false });
const CropperModal = dynamic(() => import("./CropperModal"), { ssr: false });
import AppLoader from '@/app/components/AppLoader';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addMenuItem, closeAddMenuItemModal, selectAddMenuItemLoading, selectAddMenuItemError } from '@/features/menu/addMenuItemSlice';
import { fetchMenuItems } from '@/features/menu/fetchmenuItemsSlice';
import CancelButton from "./CancelButton";
import { toast } from 'sonner';
import type { RootState } from "@/store/store";
import styles from './AddServiceModal.module.css';
import Image from "next/image";



export default function AddMenuItemModal() {
    const dispatch = useAppDispatch();
    const open = useAppSelector((state: RootState) => (state as RootState & { addMenuItemModal?: { open: boolean } }).addMenuItemModal?.open);
    const loading = useAppSelector(selectAddMenuItemLoading);
    const error = useAppSelector(selectAddMenuItemError);
    const { user } = useAppSelector((state: RootState) => state.auth);
    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [discount_percent, setDiscountPercent] = useState("");
    type ImageFileWithPreview = { file: File; preview: string };
    const [imageFiles, setImageFiles] = useState<ImageFileWithPreview[]>([]);
    const imageFilesRef = useRef<ImageFileWithPreview[]>([]);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [cropperImage, setCropperImage] = useState<string | null>(null);
    const [pendingFilename, setPendingFilename] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        imageFilesRef.current = imageFiles;
    }, [imageFiles]);

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



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        if (file) {
            startCropForFile(file);
        }
    };
    const handleDeleteImage = (idx: number) => {
        setImageFiles((prev) => {
            const toDelete = prev[idx];
            if (toDelete) URL.revokeObjectURL(toDelete.preview);
            return prev.filter((_, i) => i !== idx);
        });
    };



    const resetForm = React.useCallback(() => {
        setItemName("");
        setDescription("");
        setPrice("");
        setDiscountPercent("");
        imageFilesRef.current.forEach(img => URL.revokeObjectURL(img.preview));
        setImageFiles([]);
        setIsCropperOpen(false);
        setCropperImage(null);
        setPendingFilename(null);
        setUploading(false);
    }, []);


    const resetPrimitives = useCallback(() => {
        setDescription("");
        setPrice("");
        setDiscountPercent("");
        setIsCropperOpen(false);
        setCropperImage(null);
        setPendingFilename(null);
        setUploading(false);
    }, []);

    useEffect(() => {
        if (open) resetPrimitives();
    }, [open, resetPrimitives]);

    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();


    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setUploading(false);
        if (!itemName.trim()) {
            toast.error("Missing Item Name", { description: "Please enter a name for your menu item." });
            return;
        }
        if (!description.trim()) {
            toast.error("Missing Description", { description: "Please provide a description for the menu item." });
            return;
        }
        if (!category.trim()) {
            toast.error("Category missing", { description: "Please enter a category for your menu item." });
            return;
        }
        const priceNum = Number(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            toast.error("Invalid Price", { description: "Price must be a number greater than 0." });
            return;
        }


        // Validate discount_percent
        const discountNum = Number(discount_percent);
        if (isNaN(discountNum) || discountNum < 0 || discountNum > 99) {
            toast.error("Invalid Discount", { description: "Discount percent must be a number between 0 and 99." });
            return;
        }

        if (imageFiles.length === 0) {
            toast.error("Missing image", { description: "Please upload at least one image for your menu item." });
            return;
        }


        // Dispatch addMenuItem thunk from the slice

        const result = await dispatch(addMenuItem({
            item: {
                name: itemName,
                description,
                category,
                price: priceNum,
                discount_percent: discountNum,
                customer_id: user?.id || "",
            },
            imageFiles: imageFiles.map(img => img.file)
        }));

        if (result && result.meta && result.meta.requestStatus === 'fulfilled') {
            toast.success("Menu Item Added", { description: "Your menu item has been added successfully." });
            resetForm();
            if (user?.id) {
                dispatch(fetchMenuItems(user.id));
            }
        } else {
            toast.error("Submission Failed", { description: "Something went wrong while saving your menu item." });
        }
    };


    return (
        <>
            <div
                data-state="open"
                className="fixed inset-0 z-[9998] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pointer-events-auto cursor-pointer"
                onClick={() => dispatch(closeAddMenuItemModal())}
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
                        <CancelButton onClick={() => dispatch(closeAddMenuItemModal())} label="Cancel" />
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  bg-blue-600 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
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
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm">1</div>
                        <h2 className="text-lg md:text-xl font-semibold text-black">Menu Item Information</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-1 h-full -mr-2 ">
                        <div>
                            <label className="text-sm font-medium leading-none text-black" htmlFor="itemName">Menu Item Name *</label>
                            <input
                                type="text"
                                id="itemName"
                                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-background text-black placeholder:text-gray-400 focus-visible:outline-none  mt-1"
                                value={itemName}
                                onChange={e => setItemName(e.target.value)}
                                placeholder="Menu Item Name"
                                maxLength={50}
                            />
                            <div className="flex justify-end ">
                                <span className="text-xs text-black">{itemName.length}/50</span>
                            </div>
                        </div>

                        {/* CATEGORY (free text) */}
                        <div className="mb-5">
                            <label className="text-sm font-medium leading-none text-black" htmlFor="category">Menu Category *</label>
                            <input
                                type="text"
                                id="category"
                                className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-background text-black placeholder:text-gray-400 focus-visible:outline-none  mt-1"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                placeholder="Enter category (e.g. Starters, Main Course)"
                                maxLength={50}
                            />
                            <div className="flex justify-end ">
                                <span className="text-xs text-black">{category.length}/50</span>
                            </div>
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
                                value={discount_percent}
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    if (!isNaN(val) && val >= 0 && val <= Number(price)) {
                                        setDiscountPercent(e.target.value);
                                    }
                                }}

                                placeholder="Discount"
                            />
                        </div>



                        <div>
                            <div>
                                <div className="flex items-center gap-3 mt-8 mb-5">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm">3</div>
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



                            {/* Video upload and preview */}



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
                                                className="w-full aspect-square object-cover rounded-lg ring-2 ring-blue-600"
                                                style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                                                unoptimized
                                            />
                                            {/* Cover Icon Button */}
                                            <button
                                                type="button"
                                                title="Select as cover image"
                                                className={`absolute top-2 left-2 p-1.5 rounded-full shadow-md transition-opacity border-2 ${idx === 0 ? 'bg-blue-600 text-white border-blue-500' : 'bg-white text-black border-gray-300 opacity-80 hover:opacity-100'}`}
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
                                <CancelButton onClick={() => dispatch(closeAddMenuItemModal())} label="Cancel" />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  bg-blue-600 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
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