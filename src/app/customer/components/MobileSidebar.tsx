// MobileSidebar.tsx
'use client';

import Image from "next/image";

type Props = {
    open: boolean;
    onClose: () => void;
    userId?: string;
    onShare: () => void;
    onLogout: () => Promise<void> | void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    profileImage?: string | null;
    logoSrc?: string;          // NEW
    logoVersion?: number;      // NEW (use Date.now())
};

export default function MobileSidebar({
    open,
    onClose,
    userId,
    onShare,
    onLogout,
    handleImageUpload,
    profileImage,
    logoSrc = "/img/logo.svg",
    logoVersion,
}: Props) {
    return (
        <>
            <div className={`lg:hidden fixed inset-0 z-40 transition-opacity ${open == true ? "opacity-100 pointer-events-auto bg-black/40" : "opacity-0 pointer-events-none"}`} onClick={onClose} aria-hidden={open == false ? 'false' : 'true'} />
            <aside className={`lg:hidden fixed top-0 right-0 z-50 h-full w-64 bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-modal="true">
                <div className="h-14 sm:h-16 px-4 sm:px-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image
                            src={`${logoSrc}${logoVersion ? `?v=${logoVersion}` : ""}`}
                            alt="Logo"
                            width={100}
                            height={60}
                            className="h-24 w-24 object-contain"
                            priority
                            unoptimized
                        />
                        <span className="hidden sm:inline font-semibold text-lg text-gray-800">Betegna</span>
                    </div>
                    <button aria-label="Close menu" className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-gray-50" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex flex-col items-center gap-2 py-6 border-b border-gray-200">
                    <button
                        onClick={() => document.getElementById("mobile-profile-upload")?.click()}
                        className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-blue-600 focus:outline-none"
                        aria-label="Change profile picture"
                        title="Change profile picture"
                    >
                        <Image src={profileImage || "/img/logo.svg"} alt="Profile" fill className="object-cover" />
                    </button>
                    <label htmlFor="mobile-profile-upload" className="text-xs text-blue-600 cursor-pointer hover:underline">Change picture</label>
                    <input id="mobile-profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>

                <nav className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-sm" onClick={() => { if (userId) window.open(`/services/${userId}`, "_blank"); onClose(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pl-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        View My Site
                    </button>


                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-sm" onClick={() => { window.location.href = "/customer/dashboard/menu"; onClose(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        Menu
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-sm" onClick={() => { window.location.href = "/customer/dashboard/subscription"; onClose(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card h-5 w-5"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
                        Subscription
                    </button>

                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-sm" onClick={() => { onShare(); onClose(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" className="text-blue-600" viewBox="0 0 24 24"><path d="M9.99998 15.1701L9.87198 18.0971C10.121 18.0971 10.2302 17.9901 10.359 17.8631L11.792 16.4901L14.683 18.6121C15.213 18.9061 15.591 18.7581 15.724 18.1101L17.956 7.56206L17.957 7.56106C18.112 6.82106 17.683 6.53806 17.163 6.73406L4.54898 11.5561C3.82898 11.8421 3.83998 12.2521 4.42598 12.4301L7.65598 13.4371L15.092 8.78706C15.442 8.55806 15.759 8.68406 15.497 8.91206L9.99998 15.1701Z" /></svg>
                        Share
                    </button>

                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-sm text-red-600" onClick={async () => { await onLogout(); onClose(); }}>
                        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1.5A2.25 2.25 0 0110.75 20.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25h5.5A2.25 2.25 0 0113 6.75V8" /></svg>
                        Logout
                    </button>
                </nav>
            </aside>
        </>
    );
}
