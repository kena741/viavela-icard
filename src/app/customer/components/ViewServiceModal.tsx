import React from "react";
import ServiceCarousel from "./ServiceCarousel";
import type { ServiceModel } from "@/features/service/serviceSlice";

interface ViewServiceModalProps {
  open: boolean;
  service: ServiceModel;
  onClose: () => void;
  onRequest: () => void;
}

const ViewServiceModal: React.FC<ViewServiceModalProps> = ({ open, service, onClose }) => {
  if (!open || !service) return null;
  return (
    <>
      <div
        data-state="open"
        className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pointer-events-auto"
        aria-hidden="true"
        onClick={onClose}
      ></div>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-[50%] top-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%] gap-4 p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] overflow-hidden flex flex-col bg-white border border-gray-200 shadow-lg max-w-3xl"
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-md">
              {service.video ? (
                <video
                  src={service.video}
                  className="w-full h-full object-contain bg-black"
                  controls
                  controlsList="nodownload noplaybackrate"
                  preload="metadata"
                  aria-label={service.service_name ?? 'Service video'}
                />
              ) : (
                <div className="relative w-full h-full" role="region" aria-roledescription="carousel">
                  <ServiceCarousel images={service.service_image ?? []} alt={service.service_name ?? ''} />
                </div>
              )}
            </div>
            <div>
              <div className="mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-black">{service.service_name}</h2>
                  </div>

                </div>
                {service.duration && (
                  <div className="mt-2 text-sm text-black"><span className="font-medium">Duration:</span> {service.duration}</div>
                )}
                <div className="mt-4">
                  <p className="text-black whitespace-pre-line">{service.description}</p>
                </div>
              </div>
              <div className="mb-4">
                <span className="text-xl font-bold text-blue-900">ETB&nbsp;{service.price}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sticky bottom-0 left-0 right-0 mt-auto pt-3 pb-1 px-6 border-t bg-white z-10">

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-white hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 w-auto text-black"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x mr-1 h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewServiceModal;
