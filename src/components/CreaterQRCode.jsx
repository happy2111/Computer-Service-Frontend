import { QRCodeSVG } from "qrcode.react";

export default function CreaterQRCode({ link, size = 100 }) {
  const value = String(link ?? "");
  return (
    <div>
      <QRCodeSVG
        value={value}
        size={size}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
        includeMargin={true}
      />
    </div>
  );
}