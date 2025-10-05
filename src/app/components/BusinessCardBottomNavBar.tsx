
import React, { useState } from "react";
import QRCodeModal from "@/app/components/QRCodeModal";
import { User } from "lucide-react";
import { QrCode, Save, Share2 } from "lucide-react";

import type { UserModel } from "@/features/auth/loginSlice";

interface BusinessCardBottomNavBarProps {
    user?: UserModel | null;
}

const BusinessCardBottomNavBar: React.FC<BusinessCardBottomNavBarProps> = ({ user }) => {
    const [qrOpen, setQrOpen] = useState(false);
    const url = typeof window !== 'undefined' ? window.location.href : '';
    // user info now available as props
    return (
        <>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white z-50 border-t border-blue-100">
                <div className="flex items-stretch w-full">
                    <button
                        className="flex-1 flex flex-col items-center justify-center py-2 text-blue-600 hover:text-blue-800"
                        aria-label="Profile"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <User className="w-6 h-6 mb-1" />
                        <span className="text-xs">Profile</span>
                    </button>
                    <button
                        className="flex-1 flex flex-col items-center justify-center py-2 text-blue-600 hover:text-blue-800"
                        aria-label="Scan QR"
                        onClick={() => setQrOpen(true)}
                    >
                        <QrCode className="w-6 h-6 mb-1" />
                        <span className="text-xs">Scan QR</span>
                    </button>
                    <button
                        className="flex-1 flex flex-col items-center justify-center py-2 text-blue-600 hover:text-blue-800"
                        aria-label="Save Contact"
                        onClick={() => {
                            if (!user) return;
                            // vCard generation
                            const vCard = [
                                'BEGIN:VCARD',
                                'VERSION=3.0',
                                `FN:${user.company_name || user.first_name || ''}`,
                                user.phone_number ? `TEL;TYPE=WORK,VOICE:${user.phone_number}` : '',
                                user.email ? `EMAIL;TYPE=INTERNET:${user.email}` : '',
                                `ORG:${user.company_name || ''}`,
                                `URL:${typeof window !== 'undefined' ? window.location.href : ''}`,
                                'END:VCARD',
                            ].filter(Boolean).join('\r\n');

                            const blob = new Blob([vCard], { type: 'text/vcard' });
                            const fileName = `${user.company_name || user.first_name || 'contact'}.vcf`;
                            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

                            if (isIOS) {
                                // iOS: open vCard in new tab (triggers add to contacts)
                                const url = URL.createObjectURL(blob);
                                window.open(url, '_blank');
                                setTimeout(() => URL.revokeObjectURL(url), 2000);
                            } else {
                                // Android & desktop: trigger download
                                const link = document.createElement('a');
                                link.href = URL.createObjectURL(blob);
                                link.download = fileName;
                                document.body.appendChild(link);
                                link.click();
                                setTimeout(() => {
                                    URL.revokeObjectURL(link.href);
                                    document.body.removeChild(link);
                                }, 2000);
                            }
                        }}
                    >
                        <Save className="w-6 h-6 mb-1" />
                        <span className="text-xs">Save Contact</span>
                    </button>
                    <button
                        className="flex-1 flex flex-col items-center justify-center py-2 text-blue-600 hover:text-blue-800"
                        aria-label="Share"
                        onClick={async () => {
                            const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
                            const shareTitle = user?.company_name || user?.first_name || 'Business Card';
                            const shareText = `Check out this business card for ${shareTitle}!`;
                            if (navigator.share) {
                                try {
                                    await navigator.share({
                                        title: shareTitle,
                                        text: shareText,
                                        url: shareUrl,
                                    });
                                } catch (err) {
                                    if (err instanceof Error && err.message) {
                                        alert('Share failed: ' + err.message);
                                    } else {
                                        alert('Share failed.');
                                    }
                                }
                            } else {
                                // Fallback: copy link to clipboard
                                try {
                                    await navigator.clipboard.writeText(shareUrl);
                                    alert('Link copied to clipboard!');
                                } catch {
                                    alert('Unable to share. Please copy the link manually.');
                                }
                            }
                        }}
                    >
                        <Share2 className="w-6 h-6 mb-1" />
                        <span className="text-xs">Share</span>
                    </button>
                </div>
            </nav>
            <QRCodeModal open={qrOpen} url={url} onClose={() => setQrOpen(false)} />
        </>
    );
};

export default BusinessCardBottomNavBar;
