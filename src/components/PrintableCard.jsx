import React from "react";

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
));
export default PrintableCard;
