import { QRCodeCanvas } from "qrcode.react";

export default function CreaterQRCode({link, size = 100}) {

  return (
    <div className="">
      <QRCodeCanvas
        value={link}
        size={size}          // размер в пикселях
        bgColor="#ffffff"   // фон
        fgColor="#000000"   // цвет QR-кода
        level="H"           // уровень коррекции ошибок (L, M, Q, H)
        includeMargin={true}
      />
      {/*<p className="max-w-[100px] text-sm whitespace-break-spaces break-all text-gray-600">{link}</p>*/}
    </div>
  );
}
