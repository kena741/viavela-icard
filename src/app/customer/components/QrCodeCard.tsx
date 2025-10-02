import React from "react";
import Image from "next/image";
import QRCode from "react-qr-code";

interface QrCodeCardProps {
  providerId: string;
  mainUrl?: string;
  logoUrl?: string;
}

const QrCodeCard: React.FC<QrCodeCardProps> = ({ providerId, mainUrl = "https://betegna.com", logoUrl = "/logo.svg" }) => {
  const qrValue = `${mainUrl}/${providerId}`;
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-xl shadow-lg bg-white max-w-xs mx-auto">
      <div className="mb-4 text-center">
        <span className="block text-lg font-bold mb-2 text-gray-800">Scan me to visit our website</span>
      </div>
      <div className="relative p-2 rounded-xl bg-orange-600">
        <div className="bg-white p-2 rounded-lg">
          <QRCode
            value={qrValue}
            size={180}
            bgColor="#ffffff"
            fgColor="#0ea5e9"
            style={{ borderRadius: 12 }}
          />
        </div>
      </div>
      <Image src={logoUrl} alt="Logo" className="w-16 h-16 mt-6 mb-2 rounded-full shadow-md bg-white p-2" width={64} height={64} />
      <div className="text-xs text-gray-500 mt-2 break-all text-center">{qrValue}</div>
    </div>
  );
};

export default QrCodeCard;
