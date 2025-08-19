import React from "react";
import CreaterQRCode from "./CreaterQRCode";

const PrintableCard = React.forwardRef(({ request }, ref) => (
  <div
    ref={ref}
    key={request._id}
    className="
      relative w-[80mm] h-[60mm] p-2 text-[10px] bg-white text-black border print-content
      /* На экране — уводим далеко влево, но НЕ display:none */
      absolute -left-[10000px] top-0 pointer-events-none
      /* При печати — возвращаем в нормальный поток */
      print:static print:left-auto print:top-auto print:pointer-events-auto
      /* Старайтесь не ломать разбиение страниц */
      print:break-inside-avoid
    "
  >
    {/* Фоновый логотип */}
    <img
      src="/logo.PNG"
      alt="logo"
      className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
    />

    {/* Контент поверх */}
    <div className="relative z-10">
      <h1 className="text-center text-[14px] font-bold">Apple Park</h1>
      <p>Ariza raqami: <b>{request.orderNumber}</b></p>
      <p>Mijoz: <b>{request.userName}</b></p>
      <p>Telefon: <b>{request.phone}</b></p>
      <p>Qoshimcha Ma'l: <b>{request.additionalInfo}</b></p>

      {/* пример QR, если нужен */}
      <div className="mt-2">
        <CreaterQRCode link={"https://applepark.uz"} size={50}/>
      </div>
    </div>
  </div>
));

export default PrintableCard;