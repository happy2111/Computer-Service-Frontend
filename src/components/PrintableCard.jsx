import React from "react";

const PrintableCard = React.forwardRef(({ request }, ref) => (
  <div ref={ref} className="p-6 w-[80mm] text-[14px] print:bg-white bg-white text-black border border-gray-300 rounded-lg">
    <h2 className="text-lg font-bold mb-2">Карточка ремонта</h2>
    <p><span className="font-medium">Клиент:</span> {request.userName}</p>
    <p><span className="font-medium">Телефон:</span> {request.phone}</p>
    <p><span className="font-medium">Мастер:</span> {request.master}</p>
    <p><span className="font-medium">Доп. информация:</span> {request.additionalInfo}</p>
    <p><span className="font-medium">Стоимость:</span> {request.cost} сум</p>
  </div>
));
export default PrintableCard;
