"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import AppLoader from "./AppLoader";

export default function ResetPasswordModal({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const id = requestAnimationFrame(() => setIsOpen(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const startClose = () => setIsOpen(false);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") startClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        if (e.target !== containerRef.current) return;
        if (!isOpen) onClose();
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        setLoading(false);

        if (error) {
            toast.error("Failed to send reset link.");
        } else {
            toast.success("Check your email inbox for the reset link.");
setTimeout(() => startClose(), 10); // short delay to allow toast to render

        }
    };

    const onBackdropClick = () => startClose();
    const stop = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <div
            ref={containerRef}
            onClick={onBackdropClick}
            onTransitionEnd={handleTransitionEnd}
            className={[
                "fixed inset-0 z-50 flex items-center justify-center",
                // Backdrop fade (GPU + easing)
                "bg-black/70 transition-opacity",
                isOpen ? "opacity-100 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" : "opacity-0 duration-200 ease-in",
                "will-change-opacity",
            ].join(" ")}
            aria-hidden={!isOpen}
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={stop}
                className={[
                    "relative z-50 text-balck grid w-9/12 max-w-md gap-4 bg-white p-6 shadow-lg sm:rounded-lg",
                    "max-h-[90vh] overflow-y-auto",
                    // Panel pop (opacity + scale + slight translate)
                    "transition-[opacity,transform]",
                    isOpen
                        ? "opacity-100 scale-100 translate-y-0 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        : "opacity-0 scale-95 translate-y-2 duration-200 ease-in",
                    // Smoother frames
                    "transform-gpu will-change-transform will-change-opacity",
                ].join(" ")}
            >
                {/* Close Button */}
                <button
                    type="button"
                    className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={startClose}
                >
                    <svg className="lucide lucide-x h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                    <span className="sr-only">Close</span>
                </button>

                {/* Header */}
                <div className="flex flex-col space-y-1.5 text-black text-center sm:text-left">
                    <h2 className="text-lg font-semibold">Reset your password</h2>
                    <p className="text-sm text-muted-foreground">
                        Enter your email address and we’ll send you a link to reset your password.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="reset-email" className="text-sm text-black font-medium">
                            Email
                        </label>
                        <div className="relative">
                            <svg
                                className="lucide lucide-mail absolute left-3 top-3 h-4 w-4 text-black"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            <input
                                type="email"
                                id="reset-email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10 flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-black focus:outline-none focus:ring-0 focus:ring-sky-600"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="text-black flex flex-col-reverse sm:flex-row sm:justify-start sm:space-x-2 gap-4 sm:gap-0">
                        <button
                            type="button"
                            className="cursor-pointer inline-flex items-start justify-start border border-gray-200 bg-white hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md text-sm font-medium"
                            onClick={startClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer w-full inline-flex items-center justify-center bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white h-10 px-4 py-2 ml-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-60"
                        >
                            {loading ? <AppLoader /> : "Send Reset Link"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
