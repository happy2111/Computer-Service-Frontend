import React, { useEffect, useState } from "react";
import { AlertCircle, Check } from "lucide-react";
import api from "../api/simpleApi.js";

export default function AddMasterModal({ isOpen, onClose, onMasterCreated }) {
  const [form, setForm] = useState({
    name: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post(`/user/create-master`, form);
      const data = await res
      setSuccess("Javobgar shaxs muvaffaqiyatli yaratildi!");
      setForm({ name: "", phone: "" });
      if (onMasterCreated) onMasterCreated(data);
    } catch (err) {
      const serverMsg = err.response?.data?.msg || err.response?.data?.message;
      let errorText = "Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.";

      if (serverMsg && typeof serverMsg === "string") {
        const lower = serverMsg.toLowerCase();
        if (
          lower.includes("телефоном уже существует") ||
          lower.includes("telefon raqam") ||
          (lower.includes("telefon") && lower.includes("mavjud"))
        ) {
          errorText = "Bu telefon raqamli foydalanuvchi allaqachon mavjud!";
        } else if (
          lower.includes("обязательны") ||
          lower.includes("kiritilishi shart")
        ) {
          errorText = "Ism va telefon raqami kiritilishi shart!";
        } else {
          errorText = serverMsg;
        }
      } else if (err.message && !err.message.includes("status code")) {
        errorText = err.message;
      }
      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white z-20 rounded-lg shadow-lg p-8 w-full max-w-md">

        <h2 className="text-xl font-bold mb-4">Javobgar shaxs qo'shish</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">Ismi</label>
            <input
              type="text"
              name="name"
              className="w-full border border-blue-300 px-3 py-2 rounded"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">Telefon raqami</label>
            <input
              type="text"
              name="phone"
              className="w-full border border-blue-300 px-3 py-2 rounded"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="+998901234567"
            />
          </div>
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span>{success}</span>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded"
              onClick={onClose}
              type="button"
              disabled={loading}
            >
              Yopish
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
              type="submit"
              disabled={loading}
            >
              Qo'shish
            </button>
          </div>
        </form>
      </div>
      <div className="absolute inset-0 z-10 bg-neutral-700/70" onClick={onClose}></div>
    </div>
  );
}
