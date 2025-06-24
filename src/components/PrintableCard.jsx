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
    <p>Клиент: {request.userName}</p>
    <p>Телефон: {request.phone}</p>
    <p>Мастер: {request.master}</p>
    <p>Доп. инфо: {request.additionalInfo}</p>
    <p>Стоимость: {request.cost} сум</p>
  </div>
));
export default PrintableCard;
