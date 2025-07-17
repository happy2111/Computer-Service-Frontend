import React, { useState } from "react";
import api from "../api/simpleApi.js";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function ChangePasswrodModal({ isOpen, onClose , userId}) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Валидация пароля
  const validateNewPassword = (password) => {
    if (password.length < 6) return "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Parolda harf va raqam bo'lishi shart";
    return "";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
    if (e.target.name === "newPassword") {
      const validationMsg = validateNewPassword(e.target.value);
      setError(validationMsg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.put(`/user/change-password`, form );
      if (res.status !== 400) {

      }
      setSuccess("Parol muvaffaqiyatli o'zgartirildi!");
      setForm({ currentPassword: "", newPassword: "" });
      // if (onUserCreated) onUserCreated(data.user);
      setTimeout(() => {
        onClose();
      },1000)
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white z-20 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Parolni o'zgartirish
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Joriy parol
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                className="w-full border border-blue-300 px-3 py-2 rounded pr-10"
                value={form.currentPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className=" right-3 center-y text-blue-400"
                tabIndex={-1}
                onClick={() => setShowCurrentPassword((v) => !v)}
              >
                {showCurrentPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Yangi parol
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                className="w-full border border-blue-300 px-3 py-2 rounded pr-10"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className=" right-3 center-y text-blue-400"
                tabIndex={-1}
                onClick={() => setShowNewPassword((v) => !v)}
              >
                {showNewPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <div className="flex justify-end space-x-2 mt-4">
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
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
      <div className="absolute inset-0 z-10 bg-neutral-700/70" onClick={onClose}></div>
    </div>
  );
}
