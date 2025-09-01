import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import PrintableCard from "../components/print/PrintableCard.jsx";

export default function PrintPage() {
  const {id} = useParams(); // orderNumber или _id
  const [request, setRequest] = useState(null);
  const [printConf, setPrintConf] = useState(null);

  useEffect(() => {
    const conf = JSON.parse(localStorage.getItem("printConf")) || {
      visibleFields: {},
      width: 60,
      height: 40,
      rotation: 0,
      fontSize: 12
    };
    setPrintConf(conf);

    // Create dynamic print styles
    const createPrintStyles = (w, h, rotation, fontSize) => {
      // Remove existing print styles
      const existingStyle = document.getElementById('print-page-styles');
      if (existingStyle) {
        existingStyle.remove();
      }

      // Create new style element
      const style = document.createElement('style');
      style.id = 'print-page-styles';

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
          
          /* Rotation wrapper - убираем лишние отступы */
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
            font-size: calc(${fontSize}px * 1.2);
            font-size: ${Math.max(12, Math.min(18, w * h / 250))}px !important;
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
        
        @media screen {
          /* Screen preview styles */
          .print-preview-container {
            font-size: ${fontSize}px !important;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f5f5f5;
            padding: 20px;
          }
          
          .print-content {
            font-size: ${fontSize}px !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border: 1px solid #ddd;
            background: white;
          }
        }
      `;

      document.head.appendChild(style);
    };

    // Apply print styles immediately
    createPrintStyles(conf.width, conf.height, conf.rotation, conf.fontSize);

    // получаем данные из API
    fetch(`${import.meta.env.VITE_API_BASE_URL}/services/${id}`)
      .then(res => res.json())
      .then(data => {
        setRequest(data);
        // Auto-print after a short delay to allow styles to load
        setTimeout(() => {
          window.print();
        }, 500);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    // Cleanup styles on unmount
    return () => {
      const existingStyle = document.getElementById('print-page-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [id]);

  if (!request || !printConf) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="print-preview-container">
      <PrintableCard
        request={request}
        visibleFields={printConf.visibleFields}
        width={printConf.width}
        height={printConf.height}
        rotation={printConf.rotation}
        fontSize={printConf.fontSize}
      />
    </div>
  );
}