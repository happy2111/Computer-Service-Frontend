import React, {useRef, useState} from "react";
import api from "../../api/simpleApi.js";
import {Printer, Upload, X} from "lucide-react";
import html2canvas from "html2canvas";
import PrintableCard from "./PrintableCard.jsx";

export default function PrintModal({isOpen, onClose, data, refresh}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [width, setWidth] = useState(60);
  const [height, setHeight] = useState(40);
  const cardRef = useRef();

  const handlePrint2 = () => {
    window.open(`/print/${data.orderNumber}`, "_blank");
  };

  const handleDownloadImage = async () => {
    const canvas = await html2canvas(cardRef.current, {
      scale: 2, // для четкости
    });
    const dataUrl = canvas.toDataURL("image/png");

    // создать ссылку для скачивания
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `device-${data.orderNumber}.png`;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white z-20 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <button
            className="bg-red-400 duration-100 hover:bg-red-500 active:bg-red-500 text-white font-bold p-2 my-3 rounded"
            onClick={onClose}
            type="button"
          >
            <X className="w-5 h-5 " />
          </button>
          <h2 className="text-2xl font-bold ">Print Document</h2>
        </div>

        <section className={"flex gap-3"}>
          <input
            className={"w-1/2 min-h-5 border border-gray-300 rounded  p-2 mb-3"}
            type="number"
            placeholder="Width (mm)"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            id="width"
            name="width"
          />
          <input
            className={"w-1/2 min-h-5 border border-gray-300 rounded p-2 mb-3"}
            type="number"
            placeholder="Height (mm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            id="height"
            name="height"
          />
        </section>

        <main className={"flex flex-col gap-3"}>
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

          <button
            className="w-full py-3 flex justify-center gap-2 items-center  active:scale-103 active:opacity-75 bg-yellow-600 text-white text-lg rounded-lg hover:bg-yellow-700"
          >
            <Printer className="h-6 w-6" /> SVG/PNG Yuklab olish
          </button>
          <button
            className="w-full py-3 flex justify-center gap-2 items-center  active:scale-103 active:opacity-75 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700"
          >
            <Printer className="h-6 w-6" /> Chop etish (1)
          </button>

          <button
            onClick={handlePrint2}
            className="w-full py-3 flex justify-center gap-2 items-center  active:scale-103 active:opacity-75 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700"
          >
            <Printer className="h-6 w-6" /> Chop etish (2)
          </button>

          <button
            className="w-full py-3 flex justify-center gap-2 items-center  active:scale-103 active:opacity-75 bg-orange-600 text-white text-lg rounded-lg hover:bg-orange-700"
          >
            <Printer className="h-6 w-6" /> Mini
          </button>
        </main>
        <div className="flex justify-center mt-6">
          <PrintableCard request={data} width={width} height={height} ref={cardRef} />
        </div>
      </div>
      <div
        className="absolute inset-0 z-10 bg-neutral-700/70"
        onClick={onClose}
      ></div>
    </div>
  );
}
