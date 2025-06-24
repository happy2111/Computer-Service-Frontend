import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintableCard from "./PrintableCard"; // импорт твоего печатного компонента

function ServiceRequests({ filteredServiceRequests }) {
  const printRef = useRef();
  const currentPrintData = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Ремонт-карточка",
    removeAfterPrint: true
  });

  const triggerPrint = (request) => {
    currentPrintData.current = request;
    setTimeout(handlePrint, 100); // небольшая задержка
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {filteredServiceRequests.map((request) => (
          <div key={request._id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
            <h3 className="text-lg font-semibold">{request.deviceType} {request.deviceModel}</h3>
            <p className="text-blue-600 font-medium">Клиент: {request.userName}</p>
            <p className="text-sm text-gray-600">Проблема: {request.issueDescription}</p>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => triggerPrint(request)}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                Печать
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Скрытый элемент, только для печати */}
      <div className="hidden print:block absolute top-0 left-0">
        {currentPrintData.current && (
          <PrintableCard ref={printRef} request={currentPrintData.current} />
        )}
      </div>
    </div>
  );
}

export default ServiceRequests;
