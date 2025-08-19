function PrintButton({ request }) {
  const handlePrint = () => {
    window.open(`/print/${request.orderNumber}`, "_blank");
  };

  return (
    <button
      onClick={handlePrint}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
    >
      Print
    </button>
  );
}

export default PrintButton;
