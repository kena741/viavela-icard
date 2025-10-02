"use client";

import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "./ServiceCarousel.module.css";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface ServiceCarouselProps {
    images: string[];
    alt: string;
}

const ServiceCarousel: React.FC<ServiceCarouselProps> = ({ images, alt }) => {
    const [current, setCurrent] = useState(0);
    const hasImages = images && images.length > 0;
    const placeholder = "https://placehold.co/600x600";

    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slides: { perView: 1 },
        created(s) {
            setCurrent(s.track.details.rel);
        },
        slideChanged(s) {
            setCurrent(s.track.details.rel);
        },
    });

    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchStartTime = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        const t = e.touches[0];
        touchStartX.current = t.clientX;
        touchStartY.current = t.clientY;
        touchStartTime.current = Date.now();
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const t = e.changedTouches[0];
        const startX = touchStartX.current ?? t.clientX;
        const startY = touchStartY.current ?? t.clientY;
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        const dt = Date.now() - (touchStartTime.current ?? Date.now());

        const threshold = 30;
        const verticalLimit = 60;
        const maxDuration = 1000;

        if (dt <= maxDuration && adx >= threshold && ady <= verticalLimit) {
            if (dx < 0) {
                // swipe left -> next
                if (instanceRef && instanceRef.current) {
                    try { instanceRef.current.next(); } catch { }
                } else {
                    goTo(current + 1);
                }
            } else if (dx > 0) {
                // swipe right -> prev
                if (instanceRef && instanceRef.current) {
                    try { instanceRef.current.prev(); } catch { }
                } else {
                    goTo(current - 1);
                }
            }
        }

        // reset
        touchStartX.current = null;
        touchStartY.current = null;
        touchStartTime.current = null;
    };

    const goTo = useCallback((idx: number) => {
        const normalized = (idx + images.length) % images.length;
        if (instanceRef && instanceRef.current) {
            try { instanceRef.current.moveToIdx(normalized); } catch { }
        }
        setCurrent(normalized);
    }, [images.length, instanceRef]);

    if (!hasImages) {
        return (
            <div className={styles["carousel-no-image"]}>No Image</div>
        );
    }

    return (
        <div
            ref={sliderRef}
            className="relative aspect-square overflow-hidden group keen-slider"
            role="region"
            aria-roledescription="carousel"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {images.map((img, idx) => (
                <div
                    key={idx}
                    role="group"
                    aria-roledescription="slide"
                    className={`${styles["carousel-slide"]} keen-slider__slide`}
                >
                    <div className="relative w-full h-full">
                        <Image
                            src={img || placeholder}
                            alt={alt}
                            className="w-full h-full object-cover transition-opacity duration-300 opacity-100"
                            width={600}
                            height={600}
                            loading="lazy"
                            draggable={false}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = placeholder;
                            }}
                        />
                    </div>
                </div>
            ))}

            {images.length > 1 && (
                <>
                    <button
                        className="items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-input hover:text-accent-foreground absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 border-0 shadow-lg w-10 h-10 rounded-full opacity-70 hover:opacity-100 transition-opacity duration-200 hidden sm:flex"
                        onClick={() => { if (instanceRef && instanceRef.current) try { instanceRef.current.prev(); } catch { } else goTo(current - 1); }}
                        aria-label="Previous slide"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
                        <span className="sr-only">Previous slide</span>
                    </button>
                    <button
                        className="items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-input hover:text-accent-foreground absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 border-0 shadow-lg w-10 h-10 rounded-full opacity-70 hover:opacity-100 transition-opacity duration-200 hidden sm:flex"
                        onClick={() => { if (instanceRef && instanceRef.current) try { instanceRef.current.next(); } catch { } else goTo(current + 1); }}
                        aria-label="Next slide"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        <span className="sr-only">Next slide</span>
                    </button>
                    {/* Pagination dots */}
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${current === idx ? "bg-white scale-125" : "bg-white/50"}`}
                                aria-label={`Go to slide ${idx + 1}`}
                                onClick={() => { if (instanceRef && instanceRef.current) try { instanceRef.current.moveToIdx(idx); } catch { } else goTo(idx); }}
                                type="button"
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ServiceCarousel;
