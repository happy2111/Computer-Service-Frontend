import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PrintableCard from "../components/PrintableCard.jsx";

export default function PrintPage() {
  const { id } = useParams(); // orderNumber или _id
  const [request, setRequest] = useState(null);

  useEffect(() => {
    // получаем данные из API
    fetch(`${import.meta.env.VITE_API_BASE_URL}/services/${id}`)
      .then(res => res.json())
      .then(data => {
        setRequest(data);
        setTimeout(() => window.print(), 500); // печать после загрузки
      });
  }, [id]);

  if (!request) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 print:bg-white">
      <PrintableCard request={request} />
    </div>
  );
}
