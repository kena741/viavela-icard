import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";

interface ImageCropperProps {
  image: string;
  aspect: number;
  onCancel: () => void;
  onCropComplete: (croppedBlob: Blob, croppedUrl: string) => void;
  cropShape?: "rect" | "round";
}



// Helper: proxy any remote/cross-origin image through Next.js API
function isAbsoluteUrl(u: string) { try { new URL(u); return true; } catch { return false; } }
function isSameOrigin(u: string) { if (!isAbsoluteUrl(u)) return true; try { const url = new URL(u); return url.origin === window.location.origin; } catch { return true; } }
function toProxied(url: string) { return `/api/proxy-image?url=${encodeURIComponent(url)}`; }

async function resolveToObjectUrl(src: string): Promise<{ url: string, revoke: boolean }> {
  if (src.startsWith('blob:') || src.startsWith('data:')) {
    return { url: src, revoke: false };
  }
  // Proxy if not same-origin
  const safeSrc = isSameOrigin(src) ? src : toProxied(src);
  const res = await fetch(safeSrc, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  return { url, revoke: true };
}

// Helper: load image with crossOrigin and decode
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function getCroppedImg(imageSrc: string, crop: Area): Promise<{ blob: Blob; url: string }> {
  const { url, revoke } = await resolveToObjectUrl(imageSrc);
  const image = await loadImage(url);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (revoke) URL.revokeObjectURL(url);
      if (!blob) return reject();
      resolve({ blob, url: URL.createObjectURL(blob) });
    }, "image/jpeg");
  });
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, aspect, onCancel, onCropComplete, cropShape = "rect" }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const onCropChange = (c: { x: number; y: number }) => setCrop(c);
  const onZoomChange = (z: number) => setZoom(z);
  const onCropAreaChange = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    setLoading(true);
    try {
      const { blob, url } = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(blob, url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-start sm:items-center justify-center pt-4 sm:pt-0">
      <div className="bg-white rounded-lg shadow-lg w-[92vw] max-w-lg max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] overflow-y-auto p-4 flex flex-col items-center">
        <div className="relative w-full h-[52vh] sm:h-[60vh] min-h-64 bg-gray-100 rounded-md overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaChange}
          />
        </div>

        <div className="flex gap-4 mt-2 w-full items-center">
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
            title="Zoom"
          />
          <span className="text-xs">Zoom</span>
        </div>

        <div className="flex gap-2 mt-4 pb-[max(env(safe-area-inset-bottom),0px)]">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button onClick={handleDone} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
            {loading ? "Cropping..." : "Crop & Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
