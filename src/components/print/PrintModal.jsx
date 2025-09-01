import React, {useEffect, useRef, useState} from "react";
import {Printer, ArrowDownToLine, X, RotateCw} from "lucide-react";
import PrintableCard from "./PrintableCard.jsx";
import {domToPng} from 'modern-screenshot';
import FieldSelector from "./FieldSelector.jsx";
import FontSizeSlider from "./FontSizeSlider.jsx";

export default function PrintModal({isOpen, onClose, data}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [width, setWidth] = useState(80);
  const [height, setHeight] = useState(65);
  const [rotation, setRotation] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const cardRef = useRef();

  // Function to update @page size dynamically
  const updatePageSize = (w, h) => {
    // Remove existing print styles
    const existingStyle = document.getElementById('dynamic-print-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const style = document.createElement('style');
    style.id = 'dynamic-print-styles';

    // Calculate rotated dimensions for @page
    let pageWidth = w;
    let pageHeight = h;

    // For rotation, we need to swap dimensions for the @page rule
    if (rotation === 90 || rotation === 270) {
      pageWidth = h;
      pageHeight = w;
    }

    style.textContent = `
      @media print {
        @page {
          size: ${pageWidth}mm ${pageHeight}mm;
          margin: 0 !important;
        }
        
        /* Reset all elements */
        * {
          box-sizing: border-box !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Page setup */
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: ${pageWidth}mm !important;
          height: ${pageHeight}mm !important;
          overflow: hidden !important;
          background: white !important;
          position: relative !important;
        }
        
        /* Hide everything by default */
        body * {
          visibility: hidden !important;
        }
        
        /* Show only print content */
        .print-content,
        .print-content * {
          visibility: visible !important;
        }
        
        /* Print container - центрируем контент */
        body {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }
        
        /* Rotation wrapper - используем absolute позиционирование для точного центрирования */
        .print-content {
          font-size: ${fontSize}px !important;
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          width: ${w}mm !important;
          height: ${h}mm !important;
          transform: translate(-50%, -50%) rotate(${rotation}deg) !important;
          transform-origin: center center !important;
          background: white !important;
          page-break-inside: avoid !important;
          page-break-before: avoid !important;
          page-break-after: avoid !important;
          overflow: visible !important;
          box-sizing: border-box !important;
          padding: 2mm !important;
          font-size: ${Math.max(10, Math.min(16, w * h / 300))}px !important;
          line-height: 1.2 !important;
          margin: 0 !important;
          border: none !important;
        }
        
        /* Ensure content fits properly */
        .print-content * {
          max-width: 100% !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        
        /* Scale elements based on card size */
        .print-content h1 {
          font-size: calc(${fontSize}px * 1.2) !important;
          margin: 0 0 1mm 0 !important;
          text-align: center !important;
          font-weight: bold !important;
        }
        
        .print-content p {
          font-size: ${fontSize}px !important;
          margin: 0.5mm 0 !important;
          line-height: 1.3 !important;
        }
        
        /* QR Code scaling */
        .print-content canvas,
        .print-content img[src*="qr"] {
          width: ${Math.max(20, Math.min(50, w * 0.3))}px !important;
          height: ${Math.max(20, Math.min(50, w * 0.3))}px !important;
          display: block !important;
          margin: 1mm auto !important;
        }
        
        /* Logo scaling */
        .print-content img[alt="logo"] {
          opacity: 0.05 !important;
          position: absolute !important;
          z-index: -1 !important;
        }
        
        /* Color and background adjustments */
        .print-content {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Убираем все возможные отступы от элементов */
        .print-content > * {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        
        /* Для флекс контейнеров */
        .print-content .flex,
        .print-content [class*="flex"] {
          justify-content: center !important;
          align-items: center !important;
          text-align: center !important;
        }
      }
    `;

    document.head.appendChild(style);
  };

  // Update page size whenever width, height, or rotation changes
  useEffect(() => {
    if (isOpen) {
      updatePageSize(width, height);
    }

    // Cleanup on unmount
    return () => {
      const existingStyle = document.getElementById('dynamic-print-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [width, height, rotation, isOpen]);

  // Handle width change
  const handleWidthChange = (e) => {
    setWidth(e.target.value)
  };

  // Handle height change
  const handleHeightChange = (e) => {
    setHeight(e.target.value);
  };

  // Handle rotation change
  const handleRotationChange = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
  };


  // Enhanced print function for external page
  const handlePrint2 = () => {
    // Save current settings to localStorage for the external page
    localStorage.setItem(
      "printConf",
      JSON.stringify({
        visibleFields,
        width,
        height,
        rotation,
        fontSize,
        version: 1,
      })
    );

    // Small delay to ensure localStorage is saved
    setTimeout(() => {
      window.open(`/print/${data.orderNumber}`, "_blank");
    }, 100);
  };

  // Print current modal content directly
  const handlePrintDirect = () => {
    // Ensure page size is updated before printing
    updatePageSize(width, height);

    // Small delay to ensure styles are applied
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Rest of your existing code...
  const handleDownloadImageModern = async () => {
    if (!cardRef.current) return;

    setLoading(true);
    try {
      const unrotatedCard = cardRef.current.querySelector('[data-card-content]');
      const targetElement = unrotatedCard || cardRef.current;

      const dataUrl = await domToPng(targetElement, {
        scale: 3,
        quality: 1,
        backgroundColor: "#ffffff",
        pixelRatio: window.devicePixelRatio || 1,
        style: {
          transform: 'none'
        }
      });

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const rotRad = (rotation * Math.PI) / 180;
        const cos = Math.abs(Math.cos(rotRad));
        const sin = Math.abs(Math.sin(rotRad));

        const newWidth = img.width * cos + img.height * sin;
        const newHeight = img.width * sin + img.height * cos;

        canvas.width = Math.ceil(newWidth);
        canvas.height = Math.ceil(newHeight);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotRad);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        const rotatedUrl = canvas.toDataURL("image/png", 1.0);

        const link = document.createElement("a");
        link.href = rotatedUrl;
        link.download = `device-${data.orderNumber}-${rotation}deg.png`;
        link.click();

        setSuccess("Image downloaded successfully!");
        setTimeout(() => setSuccess(""), 3000);
      };

      img.onerror = () => {
        setError("Failed to process image rotation");
        setTimeout(() => setError(""), 3000);
        setLoading(false);
      };

      img.src = dataUrl;

    } catch (error) {
      console.error("Error generating image:", error);
      setError("Failed to generate image. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const [visibleFields, setVisibleFields] = useState({
    logo: false,
    orderNumber: true,
    userName: true,
    phone: true,
    additionalInfo: true,
    cost: true,
    masterName: true,
    contacts: false,
  });

  const fields = [
    {key: "logo", label: "Logotip"},
    {key: "orderNumber", label: "Ariza raqami"},
    {key: "userName", label: "Mijoz"},
    {key: "phone", label: "Telefon"},
    {key: "additionalInfo", label: "Qoshimcha Ma'l."},
    {key: "cost", label: "Narx"},
    {key: "masterName", label: "Javobgar Shaxs"},
    {key: "contacts", label: "Kontaktlar"},
  ];

  const toggleField = (key) => {
    setVisibleFields((prev) => ({...prev, [key]: !prev[key]}));
  };

  useEffect(() => {
    localStorage.setItem(
      "printConf",
      JSON.stringify({
        visibleFields,
        width,
        height,
        rotation,
        fontSize,
        version: 1,
      })
    );
  }, [visibleFields, width, height, rotation, fontSize]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 py-3">
      <div className="bg-white z-20 rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <button
            className="bg-red-400 duration-100 hover:bg-red-500 active:bg-red-500 text-white font-bold p-2 my-3 rounded"
            onClick={onClose}
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Chop etish usuli</h2>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
          </div>
        )}

        <FieldSelector
          visibleFields={visibleFields}
          toggleField={toggleField}
          fields={fields}
        />

        <section className="flex gap-3 items-end my-5">
          <label
            className="w-1/3 font-medium text-gray-600"
            htmlFor="width"
          >
            Kengligi (mm)

            <input
              className="w-full min-h-full border border-gray-300 rounded p-2"
              type="number"
              placeholder="Width (mm)"
              value={width}
              onChange={handleWidthChange}
              min="10"
              max="300"
              id="width"
              name="width"
            />
          </label>

          <label
            className="w-1/3 font-medium text-gray-600"
            htmlFor="width"
          >
            Balandligi (mm)

            <input
              className="w-full min-h-full border border-gray-300 rounded p-2"
              type="number"
              placeholder="Height (mm)"
              value={height}
              onChange={handleHeightChange}
              min="10"
              max="300"
              id="height"
              name="height"
            />
          </label>
          <label
            className="w-1/3 font-medium text-gray-600"
            htmlFor="width"
          >
            Aylantirish
          <div className="w-1/3 flex items-center min-h-full gap-2">
            <button
              onClick={handleRotationChange}
              className="px-3 py-3 border rounded border-gray-300 hover:bg-gray-50 active:bg-gray-100"
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500">{rotation}°</span>
          </div>

          </label>
        </section>

        <section className="flex gap-3 items-end my-5">
          <FontSizeSlider fontSize={fontSize} setFontSize={setFontSize} />

        </section>

        <main className="flex flex-col gap-3">
          <button
            onClick={handleDownloadImageModern}
            disabled={loading}
            className={`w-full py-3 flex justify-center gap-2 items-center active:scale-103 active:opacity-75 text-white text-lg rounded-lg ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            <ArrowDownToLine className="h-6 w-6" />
            {loading ? 'Processing...' : 'Rasmni yuklab olish (PNG)'}
          </button>

          <button
            onClick={handlePrintDirect}
            className="w-full py-3 flex justify-center gap-2 items-center active:scale-103 active:opacity-75 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700"
          >
            <Printer className="h-6 w-6" /> Ushbu Sahifada Chop Etish
          </button>

          <button
            onClick={handlePrint2}
            className="w-full py-3 flex justify-center gap-2 items-center active:scale-103 active:opacity-75 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700"
          >
            <Printer className="h-6 w-6" /> Boshqa Sahifada Chop Etish
          </button>
        </main>

        <div
          className="flex justify-center items-center  mt-6 fit-content"
          style={{height: `${rotation == 90 || rotation == 270 ? width * 3.77 : height * 3.77}px`}}
        >

          <PrintableCard
            request={data}
            visibleFields={visibleFields}
            width={width}
            height={height}
            ref={cardRef}
            rotation={rotation}
            fontSize={fontSize}
          />
        </div>
      </div>
      <div
        className="absolute inset-0 z-10 bg-neutral-700/70"
        onClick={onClose}
      ></div>
    </div>
  );
}