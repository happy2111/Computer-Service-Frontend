import React from "react";
import CreaterQRCode from "./CreaterQRCode";

const PrintableCard = React.forwardRef(({ request }, ref) => (
  <div
    ref={ref}
    className="
      print-content bg-white text-black border text-[10px]
      w-[80mm] h-[60mm] p-2
      absolute -left-[10000px] top-0 pointer-events-none
      print:static print:left-auto print:top-auto print:pointer-events-auto
      print:break-inside-avoid
    "
  >
    <img
      src="/logo.PNG"  // проверьте точное имя файла на сервере
      alt="logo"
      className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
    />
    <div className="relative z-10">
      <h1 className="text-center text-[14px] font-bold">Apple Park</h1>
      <p>Ariza raqami: <b>{request.orderNumber}</b></p>
      <p>Mijoz: <b>{request.userName}</b></p>
      <p>Telefon: <b>{request.phone}</b></p>
      <p>Qoshimcha Ma'l: <b>{request.additionalInfo}</b></p>
      <div className="mt-2">
        <CreaterQRCode link={"https://applepark.uz"} size={88} />
      </div>
    </div>
  </div>
));

export default PrintableCard;