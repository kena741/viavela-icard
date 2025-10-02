"use client";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import styles from "./EditServiceModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { closeEditModal, setCoverIdx, setImages, updateService } from "@/features/service/editServiceSlice";

import { toast } from "sonner";
import ImageCropper from "@/app/components/ImageCropper";
import AppLoader from '@/app/components/AppLoader';
import CropperModal from "./CropperModal";

export default function EditServiceModal() {
  const dispatch = useDispatch<AppDispatch>();
  const { open, service, coverIdx, images, loading, error, success } = useSelector((state: RootState) => state.editService);
  const user = useSelector((state: RootState) => state.auth.user);

  // ADD from second file: smarter duration normalization
  const toMinutesString = (val: string | number | undefined | null): string => {
    if (val == null) return "";
    const s = String(val).toLowerCase().trim();
    if (/^\d+$/.test(s)) return s;
    const hrMatch = s.match(/(\d+)\s*h/);
    const minMatch = s.match(/(\d+)\s*m/);
    let minutes = 0;
    if (hrMatch) minutes += parseInt(hrMatch[1], 10) * 60;
    if (minMatch) minutes += parseInt(minMatch[1], 10);
    if (minutes > 0) return String(minutes);
    const onlyNums = s.replace(/[^\d]/g, "");
    return onlyNums;
  };

  const [formState, setFormState] = React.useState({
    serviceName: service?.service_name || "",
    type: service?.type || "Fixed",
    price: service?.price || "",
    discount: service?.discount || "",
    duration: toMinutesString(service?.duration ?? ""),
    description: service?.description || "",
    serviceLocationMode: service?.service_location_mode || 'my-location',
  });

  // keep video + image behavior from the first file
  const [mediaType, setMediaType] = useState<'images' | 'video'>(() => {
    if (service?.video) return 'video';
    return 'images';
  });
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(service?.video ?? null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [removeVideo, setRemoveVideo] = useState(false);



  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropIndex, setCropIndex] = useState<number | null>(null);

  const [showError, setShowError] = useState<string | null>(null);

  const openCropper = (img: string, idx: number | null = null) => {
    setCropImage(img);
    setCropIndex(idx);
    setCropperOpen(true);
  };

  const handleCropDone = async (_blob: Blob, croppedUrl: string) => {
    const urlToUse = croppedUrl;
    if (cropIndex === null) {
      const next = [urlToUse, ...(images || [])];
      dispatch(setImages(next));
      dispatch(setCoverIdx(0));
    } else {
      const next = [...(images || [])];
      next[cropIndex] = urlToUse;
      dispatch(setImages(next));
    }
    setCropperOpen(false);
    setCropImage(null);
    setCropIndex(null);
  };

  const closeCropper = () => {
    setCropperOpen(false);
    setCropImage(null);
    setCropIndex(null);
  };

  useEffect(() => {
    if (service) {
      setFormState({
        serviceName: service.service_name || "",
        type: service.type || "Fixed",
        price: service.price || "",
        discount: service.discount || "",
        duration: service.duration || "",
        description: service.description || "",
        serviceLocationMode: service.service_location_mode || 'my-location',
      });
      setExistingVideoUrl(service.video ?? null);
      setRemoveVideo(false);
      setVideoFile(null);
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
        setVideoPreviewUrl(null);
      }
    }
  }, [service, videoPreviewUrl]);

  useEffect(() => {
    if (success) {
      dispatch(closeEditModal());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) setShowError(error);
    else setShowError(null);
  }, [error]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

  if (!open || !service) return null;

  const handleChange = (field: keyof typeof formState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value: string = e.target.value;
    if (field === 'price' || field === 'discount') value = value.replace(/[^\d.]/g, '');
    setFormState(prev => ({ ...prev, [field]: value }));
  };




  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const localUrl = URL.createObjectURL(file);
    openCropper(localUrl, null);
    for (let i = 1; i < e.target.files.length; i++) {
      const url = URL.createObjectURL(e.target.files[i]);
      dispatch(setImages([url, ...images]));
    }
    e.currentTarget.value = "";
  };

  // KEEP all original video logic from first file
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
    }
    setVideoFile(null);
    setRemoveVideo(false);
    if (!file) return;
    const maxBytes = 100 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error('Video too large', { description: 'Please upload a video under 100MB.' });
      e.currentTarget.value = '';
      return;
    }
    const url = URL.createObjectURL(file);
    const probe = document.createElement('video');
    probe.preload = 'metadata';
    probe.src = url;
    probe.onloadedmetadata = () => {
      const d = probe.duration;
      if (Number.isFinite(d) && d > 60.5) {
        URL.revokeObjectURL(url);
        toast.error('Video too long', { description: 'Please upload a video up to 60 seconds.' });
        e.currentTarget.value = '';
      } else {
        setVideoFile(file);
        setVideoPreviewUrl(url);
        setExistingVideoUrl(null);
      }
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      toast.error('Invalid video file', { description: 'Could not read video metadata.' });
      e.currentTarget.value = '';
    };
  };

  const handleRemoveVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
    }
    setVideoFile(null);
    if (existingVideoUrl) {
      setRemoveVideo(true);
    }
    setExistingVideoUrl(null);
  };

  const handleSave = async () => {
    setShowError(null);
    if (!formState.serviceName.trim()) {
      return toast.error("Missing Service Name", { description: "Please enter a name for your service." });
    }
    if (!formState.description.trim()) {
      return toast.error("Missing Description", { description: "Please provide a description for the service." });
    }
    const priceNum = Number(formState.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return toast.error("Invalid Price", { description: "Price must be a number greater than 0." });
    }
    if (mediaType === 'video') {
      if (!videoFile && !existingVideoUrl && !removeVideo) {
        return toast.error("Missing video", { description: "Upload a clip (up to 60s) or switch to Images." });
      }
    }
    // Ensure any images that are external AI URLs or blob/data URLs are uploaded to Supabase
    const finalImages = images ? [...images] : [];
    try {
      const toUpload: { idx: number; file: File }[] = [];
      for (let i = 0; i < finalImages.length; i++) {
        const img = finalImages[i];
        if (!img) continue;
        const isBlob = img.startsWith('blob:') || img.startsWith('data:');
        const isSupabase = img.includes('supabase.co') || img.includes('betegnabucket');
        const isLocalApi = img.startsWith('/api/') || img.startsWith(window.location.origin);
        if (isSupabase || isLocalApi) continue; // already stored or proxied local
        if (isBlob) {
          try {
            const b = await fetch(img).then(r => r.blob());
            const file = new File([b], `image_${Date.now()}.png`, { type: b.type || 'image/png' });
            toUpload.push({ idx: i, file });
          } catch (e) {
            console.warn('Failed to fetch blob image for upload', e);
          }
        } else if (/^https?:\/\//.test(img)) {
          // remote http(s) image (likely AI URL) - proxy then upload
          try {
            const proxyRes = await fetch(`/api/proxy-image?url=${encodeURIComponent(img)}`);
            const b = await proxyRes.blob();
            const file = new File([b], `image_${Date.now()}.png`, { type: b.type || 'image/png' });
            toUpload.push({ idx: i, file });
          } catch (e) {
            console.warn('Failed to proxy/fetch remote image for upload', e);
          }
        }
      }

      if (toUpload.length > 0) {
        const { uploadFilesToSupabase } = await import('@/features/uploadFilesToSupabase');
        const folderPath = `customer/${service?.customer_id || user?.id || 'unknown'}`;
        const files = toUpload.map(t => t.file);
        const uploadedUrls = await uploadFilesToSupabase(files, folderPath);
        for (let i = 0; i < uploadedUrls.length; i++) {
          const map = toUpload[i];
          const url = uploadedUrls[i];
          if (!url) continue;
          // verify the uploaded public URL is reachable
          try {
            const res = await fetch(url);
            if (res.ok) {
              finalImages[map.idx] = url;
            } else {
              console.warn('Uploaded URL responded with non-ok status', url, res.status);
            }
          } catch (e) {
            console.warn('Error fetching uploaded URL', url, e);
          }
        }
      }
    } catch (e) {
      console.warn('Error uploading images before save', e);
    }

    // Ensure cover image is first
    if (coverIdx > 0 && finalImages.length > coverIdx) {
      const [cover] = finalImages.splice(coverIdx, 1);
      finalImages.unshift(cover);
    }


    dispatch(updateService({
      ...service,
      ...formState,
      duration: formState.duration,
      service_image: finalImages,
      videoFile: mediaType === 'video' ? (videoFile ?? undefined) : undefined,
      removeVideo: mediaType === 'video' ? (removeVideo ? true : undefined) : (existingVideoUrl ? true : undefined),
    }));
    // Removed cleanupTempGeneratedImages (AI cleanup logic)
  };

  const handleClose = async () => {
    // Removed cleanupTempGeneratedImages (AI cleanup logic)
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl(null);
    dispatch(closeEditModal());
  };

  return (
    <>
      <div
        data-state="open"
        className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pointer-events-auto cursor-pointer"
        data-aria-hidden="true"
        aria-hidden="true"
        onClick={handleClose}
      ></div>

      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 flex w-full max-w-3xl max-h-screen translate-x-[-50%] translate-y-[-50%] border bg-white p-0 shadow-lg duration-200 sm:rounded-lg overflow-y-auto edit-service-modal"
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-1 w-full p-0 px-3 py-6 sm:p-6">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-black">Edit Service</h2>
          <p className="text-sm text-black">Update your service details below.</p>

          <div className="w-full">
            <form>
              <div className="flex justify-end gap-3 mb-6 mt-8">
                <button type="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-gray-200 bg-white hover:bg-gray-100 h-9 rounded-md px-3 w-auto text-black" onClick={handleClose}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x mr-1 h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <AppLoader />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save mr-1 h-4 w-4"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>
                  )}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                {showError && (
                  <div className="text-red-600 text-sm mt-2 w-full text-right">{showError}</div>
                )}
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white font-semibold text-sm">1</div>
                  <h2 className="text-lg md:text-xl font-semibold text-black">Basic Information</h2>
                </div>
                <div className="space-y-3 md:space-y-6">
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="text-sm font-medium leading-none text-black" htmlFor="name">Service Name</label>
                      <input
                        className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white text-black placeholder:text-gray-400 focus-visible:outline-none mt-1"
                        id="name"
                        placeholder="Enter service name"
                        maxLength={50}
                        value={formState.serviceName}
                        onChange={handleChange("serviceName")}
                      />
                      <div className="flex justify-end mt-1"><span className="text-xs text-black">{formState.serviceName.length}/50</span></div>
                    </div>



                    <div>
                      <label className="text-sm font-medium leading-none text-black" htmlFor="type">{'Type'}</label>
                      <select
                        id="type"
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white text-black focus:outline-none mt-1"
                        value={formState.type}
                        onChange={e => setFormState(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="Fixed">{'Fixed'}</option>
                        <option value="Hourly">{'Hourly'}</option>
                      </select>
                    </div>


                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white font-semibold text-sm">2</div>
                  <h2 className="text-lg md:text-xl font-semibold text-black">Pricing & Duration</h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium leading-none text-black" htmlFor="price">Price</label>
                      <input
                        type="number"
                        className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white text-black focus-visible:outline-none mt-1"
                        id="price"
                        inputMode="decimal"
                        placeholder="Enter price"
                        value={formState.price}
                        min={1}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === "" || (/^\d*\.?\d*$/.test(val) && Number(val) > 0)) {
                            setFormState(prev => ({ ...prev, price: val }));
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none text-black" htmlFor="discount">Discount</label>
                      <input
                        type="number"
                        className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white text-black focus-visible:outline-none mt-1"
                        id="discount"
                        inputMode="decimal"
                        placeholder={'Discount (%)'}
                        value={formState.discount}
                        min={0}
                        max={100}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === "" || (/^\d{0,3}$/.test(val) && Number(val) >= 0 && Number(val) <= 100)) {
                            setFormState(prev => ({ ...prev, discount: val }));
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none text-black" htmlFor="duration">Duration</label>
                      <input
                        type="text"
                        id="duration"
                        className="max-sm:text-sm flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white text-black placeholder:text-gray-400 focus-visible:outline-none mt-1"
                        value={formState.duration}
                        onChange={(e) => setFormState(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="Duration (e.g. 3 hours, 1 month, 3 days/week)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white font-semibold text-sm">3</div>
                  <h2 className="text-lg md:text-xl font-semibold text-black">Description & Media</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="max-sm:text-sm text-sm font-medium leading-none text-black" htmlFor="description">
                          Description
                        </label>
                        {/* Removed AI description generation button */}
                      </div>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white text-black focus-visible:outline-none mt-1 h-32"
                        id="description"
                        placeholder="Enter service description"
                        value={formState.description}
                        onChange={handleChange("description")}
                      />
                    </div>

                    <div className="mt-2">
                      <label className="text-sm font-medium leading-none text-black">Media</label>
                      <div className="flex items-center gap-2 mt-2">
                        <button type="button" onClick={() => setMediaType('images')} className={`px-3 py-1.5 rounded-md text-sm border ${mediaType === 'images' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-black border-gray-300'}`}>Images</button>
                        <button type="button" onClick={() => setMediaType('video')} className={`px-3 py-1.5 rounded-md text-sm border ${mediaType === 'video' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-black border-gray-300'}`}>Video</button>
                      </div>
                    </div>

                    {mediaType === 'images' && (
                      <div>
                        <label className="text-sm font-medium leading-none">Images / Portfolio</label>
                        <p className="text-sm text-gray-500 mb-2">Click the ‘star’ icon to set an image as the cover photo.</p>
                        <div className="mt-1">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                            {images && images.length > 0 && images.map((img: string, idx: number) => (
                              <div key={idx} className="relative">
                                <Image
                                  src={img}
                                  alt={`Service image ${idx + 1}`}
                                  width={400}
                                  height={400}
                                  className="w-full aspect-square object-cover rounded-lg ring-2 ring-sky-600"
                                  onError={(e) => { e.currentTarget.onerror = null; (e.currentTarget as HTMLImageElement).src = "https://placehold.co/400x400"; }}
                                  unoptimized={img.startsWith('blob:') || img.startsWith('data:')}
                                />
                                <button
                                  type="button"
                                  title="Select as cover image"
                                  className={`absolute top-2 left-2 p-1.5 rounded-full shadow-md transition-opacity border-2 ${coverIdx === idx
                                    ? "bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white"
                                    : "bg-white text-black border-gray-300 opacity-80 hover:opacity-100"}`}
                                  onClick={() => {
                                    // move selected image to front so it's the cover like in AddServiceModal
                                    if (idx !== 0) {
                                      const next = [...(images || [])];
                                      const [sel] = next.splice(idx, 1);
                                      next.unshift(sel);
                                      dispatch(setImages(next));
                                    }
                                    dispatch(setCoverIdx(0));
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                                </button>
                                <button
                                  type="button"
                                  title="Crop image"
                                  className="absolute bottom-2 left-2 p-1.5 bg-white rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity"
                                  onClick={() => openCropper(img, idx)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M20 4L8.12 15.88"></path><path d="M14.47 14.48L20 20"></path>
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  title="Remove image"
                                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity"
                                  onClick={() => dispatch(setImages(images.filter((_, i) => i !== idx)))}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                </button>
                              </div>
                            ))}
                            <label className="cursor-pointer">
                              <div className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg border-sky/20 hover:border-sky/40 hover:bg-pink-50/30 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload w-8 h-8 text-sky-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
                                <span className="mt-2 text-sm text-gray-500">Upload images</span>
                                <span className="text-xs text-gray-400">Maximum size: 5MB</span>
                              </div>
                              <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                            </label>
                            {/* Removed AI-powered image generation button */}
                          </div>
                        </div>
                      </div>
                    )}

                    {mediaType === 'video' && (
                      <div className="mt-2">
                        <label className="text-sm font-medium leading-none text-black" htmlFor="videoUpload">Upload a video (max 1 min)</label>
                        <input
                          id="videoUpload"
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border file:border-gray-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-gray-50"
                          onChange={handleVideoChange}
                        />
                        {(videoPreviewUrl || existingVideoUrl) && (
                          <div className="mt-3 flex items-start justify-start gap-4">
                            <div className="w-full max-w-xs">
                              <video
                                src={videoPreviewUrl || existingVideoUrl || undefined}
                                controls
                                playsInline
                                className="w-full rounded-md bg-black"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveVideo}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-red-200 bg-white hover:bg-red-50 h-9 rounded-md px-3 text-red-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              Remove video
                            </button>
                          </div>
                        )}
                        {(!videoPreviewUrl && !existingVideoUrl) && (
                          <p className="text-xs text-gray-500 mt-2">No video selected.</p>
                        )}
                      </div>
                    )}

                    {cropperOpen && cropImage && (
                      <CropperModal open={cropperOpen} onClose={closeCropper}>
                        <ImageCropper
                          image={cropImage}
                          aspect={1}
                          cropShape="rect"
                          onCancel={closeCropper}
                          onCropComplete={handleCropDone}
                        />
                      </CropperModal>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white font-semibold text-sm">4</div>
                  <h2 className="text-lg md:text-xl font-semibold text-black">Service Mode &amp; Location</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <div role="radiogroup" aria-required="false" dir="ltr" className="gap-2 flex flex-col space-y-2 outline-none" tabIndex={0}>
                        <div
                          className={`flex items-start space-x-2 p-3 rounded-lg border transition-colors cursor-pointer ${formState.serviceLocationMode === 'my-location' ? 'bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white' : 'bg-white border-gray-100 hover:border-gray-200 text-black'}`}
                          onClick={() => setFormState(prev => ({ ...prev, serviceLocationMode: 'my-location' }))}
                        >
                          <span
                            className={`aspect-square h-4 w-4 rounded-full border flex items-center justify-center mt-1 ${formState.serviceLocationMode === 'my-location' ? 'border-white bg-white' : 'border-black bg-white'}`}
                          >
                            {formState.serviceLocationMode === 'my-location' && <span className="block w-2 h-2 rounded-full bg-sky-600" />}
                          </span>
                          <input
                            type="radio"
                            aria-hidden="true"
                            tabIndex={-1}
                            value="my-location"
                            className={styles['sr-only-radio']}
                            checked={formState.serviceLocationMode === 'my-location'}
                            onChange={handleChange('serviceLocationMode')}
                          />
                          <div className="flex-1">
                            <label className={`peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-base font-medium cursor-pointer ${formState.serviceLocationMode === 'my-location' ? 'text-white' : 'text-black'}`} htmlFor="my-location">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-house mr-2 h-5 w-5 ${formState.serviceLocationMode === 'my-location' ? 'text-white' : 'text-black'}`}><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path></svg>
                              At my location
                            </label>
                            <p className={`max-sm:text-xs text-sm mt-1 ${formState.serviceLocationMode === 'my-location' ? 'text-white' : 'text-black'}`}>Clients will come to your specified location for the service</p>
                          </div>
                        </div>

                        <div
                          className={`flex items-start space-x-2 p-3 rounded-lg border transition-colors cursor-pointer ${formState.serviceLocationMode === 'client-location' ? 'bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white' : 'bg-white border-gray-100 hover:border-gray-200 text-black'}`}
                          onClick={() => setFormState(prev => ({ ...prev, serviceLocationMode: 'client-location' }))}
                        >
                          <span
                            className={`aspect-square h-4 w-4 rounded-full border flex items-center justify-center mt-1 ${formState.serviceLocationMode === 'client-location' ? 'border-white bg-white' : 'border-black bg-white'}`}
                          >
                            {formState.serviceLocationMode === 'client-location' && <span className="block w-2 h-2 rounded-full bg-sky-600" />}
                          </span>
                          <input
                            type="radio"
                            aria-hidden="true"
                            tabIndex={-1}
                            value="client-location"
                            className={styles['sr-only-radio']}
                            checked={formState.serviceLocationMode === 'client-location'}
                            onChange={handleChange('serviceLocationMode')}
                          />
                          <div className="flex-1">
                            <label className={`peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-base font-medium cursor-pointer ${formState.serviceLocationMode === 'client-location' ? 'text-white' : 'text-black'}`} htmlFor="client-location">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-map-pin mr-2 h-5 w-5 ${formState.serviceLocationMode === 'client-location' ? 'text-white' : 'text-black'}`}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                              At client&apos;s location
                            </label>
                            <p className={`max-sm:text-xs text-sm mt-1 ${formState.serviceLocationMode === 'client-location' ? 'text-white' : 'text-black'}`}>You will travel to the client&apos;s location to provide the service</p>
                          </div>
                        </div>

                        <div
                          className={`flex items-start space-x-2 p-3 rounded-lg border transition-colors cursor-pointer ${formState.serviceLocationMode === 'no-location' ? 'bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white' : 'bg-white border-gray-100 hover:border-gray-200 text-black'}`}
                          onClick={() => setFormState(prev => ({ ...prev, serviceLocationMode: 'no-location' }))}
                        >
                          <span
                            className={`aspect-square h-4 w-4 rounded-full border flex items-center justify-center mt-1 ${formState.serviceLocationMode === 'no-location' ? 'border-white bg-white' : 'border-black bg-white'}`}
                          >
                            {formState.serviceLocationMode === 'no-location' && <span className="block w-2 h-2 rounded-full bg-sky-600" />}
                          </span>
                          <input
                            type="radio"
                            aria-hidden="true"
                            tabIndex={-1}
                            value="no-location"
                            className={styles['sr-only-radio']}
                            checked={formState.serviceLocationMode === 'no-location'}
                            onChange={handleChange('serviceLocationMode')}
                          />
                          <div>
                            <label className={`peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center text-base font-medium cursor-pointer ${formState.serviceLocationMode === 'no-location' ? 'text-white' : 'text-black'}`} htmlFor="no-location">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-map-pin-off mr-2 h-5 w-5 ${formState.serviceLocationMode === 'no-location' ? 'text-white' : 'text-black'}`}><path d="M12.75 7.09a3 3 0 0 1 2.16 2.16"></path><path d="M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568"></path><path d="m2 2 20 20"></path><path d="M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533"></path><path d="M9.13 9.13a3 3 0 0 0 3.74 3.74"></path></svg>
                              No specific location
                            </label>
                            <p className={`max-sm:text-xs text-sm mt-1 ${formState.serviceLocationMode === 'no-location' ? 'text-white' : 'text-black'}`}>This service doesn&apos;t require a physical location (e.g., online services)</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-10 pb-20 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-white hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 w-auto text-black"
                  onClick={handleClose}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x mr-1 h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white hover:opacity-90 h-9 rounded-md px-3 w-auto transition-opacity disabled:opacity-60"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <AppLoader />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save mr-1 h-4 w-4"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>
                  )}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <button type="button" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none" onClick={handleClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4 text-black"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
}
