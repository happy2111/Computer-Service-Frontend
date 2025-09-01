import React from "react";
import CreaterQRCode from "../CreaterQRCode.jsx";

const PrintableCard = React.forwardRef(({
                                          request,
                                          visibleFields,
                                          width,
                                          height,
                                          rotation = 0,
                                          fontSize
                                        }, ref) => {
  // Generate size class name for CSS targeting
  const getSizeClass = (w, h) => {
    return `print-size-${w}x${h}`;
  };

  // Determine size category
  const getSizeCategory = (w, h) => {
    const area = w * h;
    if (area <= 1600) return 'small';
    if (area <= 3600) return 'medium';
    return 'large';
  };

  return (
    <div
      ref={ref}
      className={`inline-block block-transform ${getSizeClass(width, height)}`}
      style={{
        "--card-font-size": `${fontSize}px`,
        fontSize: "var(--card-font-size)",
        // Применяем поворот только для предварительного просмотра на экране
        // При печати CSS @media print перезапишет этот стиль
        transform: window.matchMedia && window.matchMedia('print').matches
          ? 'none'
          : `rotate(${rotation}deg)`,
        transformOrigin: 'center center'
      }}
    >
      <div
        data-card-content="true"
        data-rotation={rotation}
        data-size={getSizeCategory(width, height)}
        style={{
          "--print-width": `${width}mm`,
          "--print-height": `${height}mm`,
          width: `${width}mm`,
          height: `${height}mm`,
        }}
        className="relative p-2 bg-white text-black border print-content"
      >
        <img
          src="/logo.PNG"
          alt="logo"
          className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
        />
        {visibleFields.logo && (
        <h1 className="text-center font-bold">Apple Park</h1>
        )}

        {visibleFields.orderNumber && (
          <p>Ariza raqami: <b>{request.orderNumber}</b></p>
        )}

        {visibleFields.userName && (
          <p>Mijoz: <b>{request.userName}</b></p>
        )}

        {visibleFields.phone && (
          <p>Telefon: <b>{request.phone}</b></p>
        )}

        {visibleFields.additionalInfo && (
          <p>Qoshimcha Ma'l: <b>{request.additionalInfo}</b></p>
        )}

        {visibleFields.cost && (
          <p>Narx: <b>{request.cost || 'N/A'}</b></p>
        )}

        {visibleFields.masterName && (
          <p>Javobgar: <b>{request.masterName || 'N/A'}</b></p>
        )}

        {visibleFields.contacts && (
          <div className="!text-[11px] flex flex-wrap items-center mt-2">
            <div className={""}>
              <p className="font-bold text-gray-500">
                Tel: <a
                href="tel:+998998888888"
                className="text-blue-500"
              >+998998888888</a>
              </p>
              <p className="font-bold text-gray-500">
                Web: <a
                href="https://applepark.uz"
                className="text-blue-500"
              >applepark.uz</a>
              </p>
            </div>
            <CreaterQRCode
              link={`https://applepark.uz`}
              size={50}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default PrintableCard;