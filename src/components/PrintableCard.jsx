import React from "react";
import CreaterQRCode from "./CreaterQRCode.jsx";

const PrintableCard = React.forwardRef(({request}, ref) => (
  <div
    ref={ref}
    className="
  w-[80mm]
  print:w-[60mm]
  p-2 text-[10px]
  bg-white text-black border
  "
  >
    <p><b>Mijoz:</b> {request.userName}</p>
    <p><b>Telefon:</b> {request.phone}</p>
    <p><b>Qoshimcha Ma'l.:</b> {request.additionalInfo}</p>
    <p><b>Narxi:</b> {request.cost} so'm - {request.costOr} so'm</p>
    <p><b>Javobgar Shaxs:</b> {request.master}</p>
  </div>
  // <div
  //   ref={ref}
  //   key={request._id}
  //   className="relative w-[80mm] h-[60mm] p-2 text-[10px] bg-white text-black border print-content hidden print:block "
  // >
  //   {/* Логотип на фоне */}
  //   {/*<img*/}
  //   {/*  src="/logo.PNG"*/}
  //   {/*  alt="logo"*/}
  //   {/*  className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"*/}
  //   {/*/>*/}
  //
  //   {/* Контент поверх */}
  //   <div className="relative z-10">
  //     <h1 className="text-center text-[14px] font-bold">Apple Park</h1>
  //     <p>Ariza raqami: <b>{request.orderNumber}</b></p>
  //     <p>Mijoz: <b>{request.userName}</b></p>
  //     <p>Telefon: <b>{request.phone}</b></p>
  //     <p>Qoshimcha Ma'l: <b>{request.additionalInfo}</b></p>
  //     <p>Narxi: <b>{request.cost} so'm - {request.costOr} so'm</b></p>
  //     <p>Javobgar Shaxs: <b>{request.masterName}</b></p>
  //
  //     <div className="!text-[11px] flex items-center mt-2">
  //       <p className="font-bold text-gray-500">
  //         Tel: <a href="tel:+998998888888" className="text-blue-500">+998998888888</a>
  //       </p>
  //       <p className="font-bold text-gray-500 mx-2">
  //         Web: <a href="https://applepark.uz" className="text-blue-500">applepark.uz</a>
  //       </p>
  //       {/*<CreaterQRCode link={`https://applepark.uz`} size={50}/>*/}
  //     </div>
  //   </div>
  // </div>
));
export default PrintableCard;
