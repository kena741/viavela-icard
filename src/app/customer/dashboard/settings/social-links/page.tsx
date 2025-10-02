'use client'
import { toast } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import SaveButton from "@/app/customer/components/SaveButton";
import { useSelector, useDispatch } from "react-redux";
import { SocialLink, updateProvider } from "@/features/auth/loginSlice";
import { RootState, AppDispatch } from "@/store/store";
import DashboardProfileHeader from "@/app/customer/components/DashboardProfileHeader";
export default function SocialLinksPage() {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const [isLoading, setIsLoading] = useState(false);

    // Social link toggles and values
    const [showInstagram, setShowInstagram] = useState(false);
    const [showFacebook, setShowFacebook] = useState(false);
    const [showLinkedIn, setShowLinkedIn] = useState(false);
    const [showTiktok, setShowTiktok] = useState(false);
    const [showYoutube, setShowYoutube] = useState(false);
    const [showWhatsApp, setShowWhatsApp] = useState(false);
    const [showTelegram, setShowTelegram] = useState(false);
    const [showLink, setShowLink] = useState(false);
    const [showGoogleMap, setShowGoogleMap] = useState(false);
    const [instagramValue, setInstagramValue] = useState("");
    const [facebookValue, setFacebookValue] = useState("");
    const [linkedinValue, setLinkedinValue] = useState("");
    const [tiktokValue, setTiktokValue] = useState("");
    const [youtubeValue, setYoutubeValue] = useState("");
    const [whatsappValue, setWhatsappValue] = useState("");
    const [telegramValue, setTelegramValue] = useState("");
    const [linkValue, setLinkValue] = useState("");
    const [googleMapValue, setGoogleMapValue] = useState("");

    useEffect(() => {
        if (!user?.socialLinks) return;
        const alreadyInitialized =
            showInstagram ||
            showFacebook ||
            showLinkedIn ||
            showTiktok ||
            showYoutube ||
            showWhatsApp ||
            showTelegram ||
            showLink ||
            showGoogleMap;

        if (alreadyInitialized) return;

        user.socialLinks.forEach((link: SocialLink) => {
            switch (link.type) {
                case "instagram":
                    setShowInstagram(true);
                    setInstagramValue(link.url);
                    break;
                case "facebook":
                    setShowFacebook(true);
                    setFacebookValue(link.url);
                    break;
                case "linkedin":
                    setShowLinkedIn(true);
                    setLinkedinValue(link.url);
                    break;
                case "tiktok":
                    setShowTiktok(true);
                    setTiktokValue(link.url);
                    break;
                case "youtube":
                    setShowYoutube(true);
                    setYoutubeValue(link.url);
                    break;
                case "whatsapp":
                    setShowWhatsApp(true);
                    setWhatsappValue(link.url);
                    break;
                case "telegram":
                    setShowTelegram(true);
                    setTelegramValue(link.url);
                    break;
                case "website":
                    setShowLink(true);
                    setLinkValue(link.url);
                    break;
                case "google_map":
                    setShowGoogleMap(true);
                    setGoogleMapValue(link.url);
                    break;
            }
        });
    }, [user, showInstagram, showFacebook, showLinkedIn, showTiktok, showYoutube, showWhatsApp, showTelegram, showLink, showGoogleMap]);


    // Save handler
    const handleSave = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Build socialLinks array
            const socialLinks = [];
            if (showInstagram && instagramValue) socialLinks.push({ type: "instagram", url: instagramValue });
            if (showFacebook && facebookValue) socialLinks.push({ type: "facebook", url: facebookValue });
            if (showLinkedIn && linkedinValue) socialLinks.push({ type: "linkedin", url: linkedinValue });
            if (showTiktok && tiktokValue) socialLinks.push({ type: "tiktok", url: tiktokValue });
            if (showYoutube && youtubeValue) socialLinks.push({ type: "youtube", url: youtubeValue });
            if (showWhatsApp && whatsappValue) socialLinks.push({ type: "whatsapp", url: whatsappValue });
            if (showTelegram && telegramValue) socialLinks.push({ type: "telegram", url: telegramValue });
            if (showLink && linkValue) socialLinks.push({ type: "website", url: linkValue });
            if (showGoogleMap && googleMapValue) socialLinks.push({ type: "google_map", url: googleMapValue });
            const result = await dispatch(updateProvider({ id: user?.user_id, socialLinks }));
            // Check for error in result using RTK matcher
            if (updateProvider.rejected.match(result)) {
                interface ErrorPayload { message?: string }
                toast.error((result.payload as ErrorPayload)?.message || "Failed to update profile");
            } else {
                toast.success("Profile updated successfully!");
            }
        } catch (err: unknown) {
            if (err && typeof err === "object" && "message" in err) {
                toast.error((err as { message?: string }).message || "Failed to update profile");
            } else {
                toast.error("Failed to update profile");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-3 md:px-8 pb-20 md:pb-8">
            <div className="mx-auto max-w-2xl md:max-w-3xl lg:max-w-5xl w-full">
                <DashboardProfileHeader />
                <div className="mb-6 flex flex-col items-start text-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-1 text-sky-600">
                        Social-links Settings
                    </h2>
                    <p className="mt-1 max-sm:text-sm text-gray-500">
                        General Settings
                    </p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative mx-auto max-w-2xl md:max-w-3xl lg:max-w-5xl w-full">
                <div className="space-y-4">
                    {/* Instagram */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram w-6 h-6 text-[#E4405F]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                                <span className="font-medium">Instagram</span>
                            </div>
                            <label className="peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 relative">
                                <input
                                    type="checkbox"
                                    role="switch"
                                    checked={showInstagram}
                                    onChange={() => setShowInstagram((v) => !v)}
                                    className="sr-only"
                                    aria-label="Toggle Instagram"
                                />
                                <span data-state={showInstagram ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${showInstagram ? "translate-x-6" : "translate-x-0"}`}></span>
                            </label>
                        </div>
                        {showInstagram && (
                            <div className="border-t border-gray-100 p-4 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="instagram-input">Username</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                                        <input className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-8" id="instagram-input" placeholder="username" value={instagramValue} onChange={e => setInstagramValue(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Facebook */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-6 h-6 text-[#1877F2]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                <span className="font-medium">Facebook</span>
                            </div>
                            <label className="peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 relative">
                                <input
                                    type="checkbox"
                                    role="switch"
                                    checked={showFacebook}
                                    onChange={() => setShowFacebook((v) => !v)}
                                    className="sr-only"
                                    aria-label="Toggle Facebook"
                                />
                                <span data-state={showFacebook ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${showFacebook ? "translate-x-6" : "translate-x-0"}`}></span>
                            </label>
                        </div>
                        {showFacebook && (
                            <div className="border-t border-gray-100 p-4 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="facebook-input">URL</label>
                                    <div className="relative">
                                        <input className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="facebook-input" placeholder="https://" value={facebookValue} onChange={e => setFacebookValue(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* LinkedIn */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin w-6 h-6 text-[#0A66C2]"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                <span className="font-medium">LinkedIn</span>
                            </div>
                            <label className="peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 relative">
                                <input
                                    type="checkbox"
                                    role="switch"
                                    checked={showLinkedIn}
                                    onChange={() => setShowLinkedIn((v) => !v)}
                                    className="sr-only"
                                    aria-label="Toggle LinkedIn"
                                />
                                <span data-state={showLinkedIn ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${showLinkedIn ? "translate-x-6" : "translate-x-0"}`}></span>
                            </label>
                        </div>
                        {showLinkedIn && (
                            <div className="border-t border-gray-100 p-4 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="linkedin-input">URL</label>
                                    <div className="relative">
                                        <input className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="linkedin-input" placeholder="https://" value={linkedinValue} onChange={e => setLinkedinValue(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* WhatsApp group */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
                                <span className="font-medium">WhatsApp group</span>
                            </div>
                            <label className="peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 relative">
                                <input
                                    type="checkbox"
                                    role="switch"
                                    checked={showWhatsApp}
                                    onChange={() => setShowWhatsApp((v) => !v)}
                                    className="sr-only"
                                    aria-label="Toggle WhatsApp"
                                />
                                <span data-state={showWhatsApp ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${showWhatsApp ? "translate-x-6" : "translate-x-0"}`}></span>
                            </label>
                        </div>
                        {showWhatsApp && (
                            <div className="border-t border-gray-100 p-4 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="whatsapp-input">URL</label>
                                    <div className="relative">
                                        <input className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="whatsapp-input" placeholder="https://" value={whatsappValue} onChange={e => setWhatsappValue(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Telegram group */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#229ED9"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.65.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06-.01.24-.02.27z"></path></svg>
                                <span className="font-medium">Telegram group</span>
                            </div>
                            <label className="peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 relative">
                                <input
                                    type="checkbox"
                                    role="switch"
                                    checked={showTelegram}
                                    onChange={() => setShowTelegram((v) => !v)}
                                    className="sr-only"
                                    aria-label="Toggle Telegram"
                                />
                                <span data-state={showTelegram ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${showTelegram ? "translate-x-6" : "translate-x-0"}`}></span>
                            </label>
                        </div>
                        {showTelegram && (
                            <div className="border-t border-gray-100 p-4 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="telegram-input">URL</label>
                                    <div className="relative">
                                        <input className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="telegram-input" placeholder="https://" value={telegramValue} onChange={e => setTelegramValue(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tiktok */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"></path></svg>
                                <span className="font-medium">Tiktok</span>
                            </div>
                            <label className="peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 relative">
                                <input
                                    type="checkbox"
                                    role="switch"
                                    checked={showTiktok}
                                    onChange={() => setShowTiktok((v) => !v)}
                                    className="sr-only"
                                    aria-label="Toggle Tiktok"
                                />
                                <span data-state={showTiktok ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${showTiktok ? "translate-x-6" : "translate-x-0"}`}></span>
                            </label>
                        </div>
                        {showTiktok && (
                            <div className="border-t border-gray-100 p-4 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="tiktok-input">Username</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                                        <input className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-8" id="tiktok-input" placeholder="username" value={tiktokValue} onChange={e => setTiktokValue(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Youtube */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube w-6 h-6 text-[#FF0000]"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
                                <span className="font-medium">Youtube</span>
                            </div>
                            <label className="peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-md border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 relative">
                                <input
                                    type="checkbox"
                                    role="switch"
                                    checked={showYoutube}
                                    onChange={() => setShowYoutube((v) => !v)}
                                    className="sr-only"
                                    aria-label="Toggle Youtube"
                                />
                                <span data-state={showYoutube ? "checked" : "unchecked"} className={`pointer-events-none block h-5 w-5 rounded-sm bg-white shadow-lg ring-0 transition-transform ${showYoutube ? "translate-x-6" : "translate-x-0"}`}></span>
                            </label>
                        </div>
                        {showYoutube && (
                            <div className="border-t border-gray-100 p-4 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="youtube-input">Username</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                                        <input className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-8" id="youtube-input" placeholder="username" value={youtubeValue} onChange={e => setYoutubeValue(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
                <div className="mt-6">
                    <SaveButton onClick={handleSave} label={"Save Changes"} loading={isLoading} />
                </div>
            </div>
        </div>
    );
}