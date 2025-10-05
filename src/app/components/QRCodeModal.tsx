import React from "react";
import dynamic from "next/dynamic";

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false });

interface QRCodeModalProps {
    open: boolean;
    url: string;
    onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ open, url, onClose }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center relative w-80 max-w-full">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-xl font-bold"
                    onClick={onClose}
                    aria-label="Close QR code"
                >
                    &times;
                </button>
                <h3 className="text-lg font-semibold mb-4 text-blue-700">Scan QR Code</h3>
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <QRCode value={url} size={180} />
                </div>
                <p className="mt-4 text-xs text-gray-500 break-all text-center">{url}</p>
            </div>
        </div>
    );
};

export default QRCodeModal;
