import React, { useEffect, useState } from "react";
import { Wrench } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MastersStatsTable() {
  const [masterStats, setMasterStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${API_BASE_URL}/dashboard/masters/stats`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Ошибка загрузки статистики мастеров");
        return res.json();
      })
      .then(data => setMasterStats(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Wrench className="h-5 w-5 text-blue-600" /> Мастера и их устройства
      </h3>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <span className="animate-spin h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></span>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-4">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Мастер</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Телефон</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Устройств</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {masterStats.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-gray-400">Нет данных</td>
                </tr>
              )}
              {masterStats.map((m, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 font-medium text-gray-900">{m.master}</td>
                  <td className="px-4 py-2 text-blue-700">{m.phone}</td>
                  <td className="px-4 py-2 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold">
                      {m.deviceCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
