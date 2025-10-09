"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Image from "next/image";
import DashboardProfileHeader from "../../components/DashboardProfileHeader";

const basePlans = [
    {
        key: "menu",
        title: "Digital Menu (QR & NFC)",
        icon: "/img/logo.png",
        description: (
            <>
                <span className="block mb-2">A modern digital menu for your business, accessible via QR code and NFC chip. Customers can scan or tap to view your menu instantly on their phone—no app required.</span>
                <ul className="list-disc list-inside text-blue-700 text-sm pl-2 text-left">
                    <li>Custom QR code for tables, flyers, or windows</li>
                    <li>NFC chip for touch-to-view menu (no QR needed)</li>
                    <li>Easy updates, analytics, and mobile-friendly design</li>
                </ul>
            </>
        ),
        bg: "from-blue-100 to-blue-50",
    },
    {
        key: "business_card",
        title: "Business Card (NFC)",
        icon: "/img/logoicon.png",
        description: (
            <>
                <span className="block mb-2">A smart business card with an embedded NFC chip. Share your contact details, website, or menu with a simple tap—no QR code or app needed.</span>
                <ul className="list-disc list-inside text-blue-700 text-sm pl-2 text-left">
                    <li>Tap to share your info instantly</li>
                    <li>Custom branding and design</li>
                    <li>Works with all modern smartphones</li>
                </ul>
            </>
        ),
        bg: "from-blue-50 to-blue-100",
    },
];

export default function SubscriptionPage() {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    // Demo prices for each plan
    const planPrices = {
        "Digital Menu (QR & NFC)": "2999ETB/year",
        "Business Card (NFC)": "2999ETB/year",
    };
    const supportPhone = "+251 912323811";
    const supportEmail = "support@blink-card.com";

    // Set current plan based on user.subscription_plan
    const plans = basePlans.map((plan) => ({
        ...plan,
        current: user?.subscription_plan === plan.key,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-3 md:px-8 pb-20 md:pb-8 mx-auto max-w-3xl md:max-w-4xl lg:max-w-6xl w-full font-sans">
            <div>
                <DashboardProfileHeader />
                <div className="mb-8 flex flex-col items-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-1 text-center">Subscription</h2>
                    <p className="text-blue-500 mt-1 max-sm:text-sm text-center">Choose the best plan for your business</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-7 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.title}
                            className={`flex flex-col items-center rounded-2xl shadow-lg bg-gradient-to-br ${plan.bg} p-7 transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative`}
                        >
                            {plan.current && (
                                <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">Current Plan</span>
                            )}
                            <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center shadow mb-5">
                                <Image src={plan.icon} alt={plan.title} width={56} height={56} className="object-contain" />
                            </div>
                            <h2 className="text-xl font-bold text-blue-800 mb-3 text-center">{plan.title}</h2>
                            <div className="text-blue-700 text-sm text-center mb-4">{plan.description}</div>
                            <button
                                className={`mt-auto px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow ${plan.current ? 'bg-blue-200 text-blue-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                disabled={plan.current}
                                onClick={() => {
                                    if (!plan.current) {
                                        setSelectedPlan(plan.title);
                                        setShowPopup(true);
                                    }
                                }}
                            >
                                {plan.current ? 'Subscribed' : 'Subscribe'}
                            </button>
                        </div>
                    ))}
                </div>
                {/* Popup for price and contact */}
                {showPopup && (
                    <>
                        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setShowPopup(false)} />
                        <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-2xl shadow-2xl p-7 flex flex-col items-center justify-center gap-4 translate-x-[-50%] translate-y-[-50%] border border-blue-100">
                            <h3 className="text-xl font-bold text-blue-700 mb-2 text-center">{selectedPlan}</h3>
                            <div className="text-blue-600 text-lg font-semibold mb-2">{selectedPlan && planPrices[selectedPlan as keyof typeof planPrices] ? planPrices[selectedPlan as keyof typeof planPrices] : ""}</div>
                            <div className="text-gray-700 text-sm text-center mb-2">To subscribe, please contact our customer support:</div>
                            <div className="flex flex-col items-center gap-1 mb-2">
                                <a href={`tel:${supportPhone}`} className="text-blue-700 font-medium hover:underline">{supportPhone}</a>
                                <a href={`mailto:${supportEmail}`} className="text-blue-700 font-medium hover:underline">{supportEmail}</a>
                            </div>
                            <button
                                className="mt-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow"
                                onClick={() => setShowPopup(false)}
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
