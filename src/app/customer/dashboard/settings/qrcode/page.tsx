/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";
import DashboardProfileHeader from "@/app/customer/components/DashboardProfileHeader";

const mainUrl = "https://lolelink.com/services";

export default function QrCodeSettingsPage() {
  const user = useAppSelector((state) => state.auth.user);
  console.log("User data:", user);
  const providerId = user?.id || user?.user_id || "";
  console.log("Provider ID:", providerId);
  const serviceUrl = providerId ? `${mainUrl}/${providerId}` : "";
  const qrUrl = serviceUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(serviceUrl)}`
    : "";
  if (!providerId) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(serviceUrl);
      toast.success("Link copied to clipboard");
    } catch (e) {
      console.log(e)
      toast.error("Failed to copy link");
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };



  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = document.createElement("img");
      if (/^https?:\/\//.test(src)) img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  };

  const downloadStyledQR = async () => {
    if (!qrUrl) return;
    const width = 1080;
    const height = 1400;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient matching UI (from sky-600 via cyan-500 to teal-400)
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, "#0284c7"); // sky-600
    grad.addColorStop(0.5, "#06b6d4"); // cyan-500
    grad.addColorStop(1, "#14b8a6"); // teal-400
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Text headings
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 72px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText("SCAN ME", width / 2, 140);
    ctx.font = "500 36px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText("TO VISIT OUR WEBSITE", width / 2, 200);

    // QR container
    const qrBoxSize = 640;
    const qrBoxX = (width - qrBoxSize) / 2;
    const qrBoxY = 260;
    drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 24);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Draw QR inside with padding
    try {
      const res = await fetch(qrUrl, { mode: "cors" });
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const qrImg = await loadImage(objUrl);
      const pad = 40;
      const inner = qrBoxSize - pad * 2;
      ctx.drawImage(qrImg, qrBoxX + pad, qrBoxY + pad, inner, inner);
      URL.revokeObjectURL(objUrl);
    } catch { }

    // Remove business name display
    // ctx.fillStyle = "#ffffff";
    // ctx.font = "bold 56px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    // ctx.fillText(businessName, width / 2, qrBoxY + qrBoxSize + 100);

    // Adjust footer positions upward since name is removed
    ctx.font = "600 44px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText("Powered by LoleLink", width / 2, qrBoxY + qrBoxSize + 120);
    ctx.font = "500 34px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText("Get your own QR at lolelink.com", width / 2, qrBoxY + qrBoxSize + 170);

    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `qr-styled-${providerId}.png`);
        toast.success("Styled QR downloaded");
      } else {
        toast.error("Download failed");
      }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen px-3 md:px-8 pb-20 md:pb-8 mx-auto max-w-3xl md:max-w-4xl lg:max-w-6xl w-full">
      <div className="">
        <DashboardProfileHeader />
        <div className="mb-6 flex flex-col items-start text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-1 text-sky-600">
            QR Code & Marketing</h2>
          <p className="mt-1 max-sm:text-sm text-gray-500">
            Promote your business and share your services</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative ">
          <div className="rounded-xl bg-card text-card-foreground shadow-sm">
            <div className="p-3 md:p-6 space-y-4 pt-3 md:pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 flex items-center gap-2 min-w-0 w-full break-all md:break-normal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link h-5 w-5 text-gray-400 flex-shrink-0"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
                  <span title="Click to copy" onClick={copyLink} className="text-gray-600 truncate text-sm md:text-base w-full cursor-pointer hover:underline" role="button">{serviceUrl}</span>
                </div>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 w-full md:w-auto mt-2 md:mt-0"
                  onClick={copyLink}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link h-4 w-4 mr-2"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
                  Copy
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 rounded-xl bg-card text-card-foreground shadow-sm">
            <div className="p-3 md:p-6 space-y-4 pt-3 md:pt-6">
              <div className="mb-6 text-center">
                <h3 className="text-xl font-bold text-black mb-1">Download QR code</h3>
                <p className="text-gray-500 text-sm">Get your QR code ready for your physical stores</p>
              </div>
              <div className="max-w-md w-full mx-auto">
                {/* Styled QR */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 p-4 md:p-8 rounded-2xl shadow-md flex flex-col items-center space-y-4">
                    <h3 className="text-white text-xl md:text-2xl font-bold">SCAN ME</h3>
                    <p className="text-white text-xs md:text-sm">TO VISIT OUR WEBSITE</p>
                    <Image
                      src={qrUrl}
                      alt="Styled QR Code"
                      width={192}
                      height={192}
                      className="w-36 h-36 md:w-48 md:h-48 object-contain"
                      unoptimized
                    />
                    <img src={qrUrl} alt="Styled QR Code" className="w-36 h-36 md:w-48 md:h-48 object-contain" />
                  </div>
                  <p className="text-white font-semibold text-lg md:text-xl text-center break-words w-full">Powered by LoleLink</p>
                  <p className="text-white text-sm md:text-base text-center">Get your own QR at lolelink.com</p>
                </div>
                <div className="flex justify-center">
                  <button onClick={downloadStyledQR} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-sky-600 hover:bg-sky-700 text-white h-10 px-4 py-2 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download h-4 w-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                    Download QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
