import React from "react";
import CreaterQRCode from "../CreaterQRCode.jsx";

const PrintableCard = ({ request , width, height, ref}) => (
  <div
    ref={ref}
    className={`relative w-[${width}mm] h-[${height}mm] p-2 text-[10px] bg-white text-black border print-content`}
  >
    <img
      src="/logo.PNG"
      alt="logo"
      className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
    />
    <h1 className="text-center text-[14px] font-bold">Apple Park</h1>
    <p>Ariza raqami: <b>{request.orderNumber}</b></p>
    <p>Mijoz: <b>{request.userName}</b></p>
    <p>Telefon: <b>{request.phone}</b></p>
    <p>Qoshimcha Ma'l: <b>{request.additionalInfo}</b></p>
    <p>Narxi: <b>{request.cost} so'm - {request.costOr} so'm</b></p>
    <p>Javobgar Shaxs: <b>{request.masterName}</b></p>


    <div className="!text-[11px] flex items-center mt-2">
      <p className="font-bold text-gray-500">
        Tel: <a href="tel:+998998888888" className="text-blue-500">+998998888888</a>
      </p>
      <p className="font-bold text-gray-500 mx-2">
        Web: <a href="https://applepark.uz" className="text-blue-500">applepark.uz</a>
      </p>
      <CreaterQRCode link={`https://applepark.uz`} size={50}/>
    </div>
  </div>
);

export default PrintableCard;
