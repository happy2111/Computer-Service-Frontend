import React, { useState, useEffect } from "react";
import api from "../api/simpleApi.js";
import { X, Eye, EyeOff } from "lucide-react";

export default function EditUserModal({ isOpen, onClose, user, onUserUpdated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "client",
    position: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "client",
        position: user.position || "",
        password: ""
      });
      setError("");
      setSuccess("");
      setShowPassword(false);
    }
  }, [user, isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Ismni kiritish majburiy");
      return;
    }

    if (!form.email.trim()) {
      setError("Email manzilini kiritish majburiy");
      return;
    }

    if (form.password && form.password.trim().length > 0 && form.password.trim().length < 6) {
      setError("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setLoading(true);

    try {
      const userId = user._id || user.id;
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        position: form.position.trim()
      };

      if (form.password && form.password.trim() !== "") {
        payload.password = form.password.trim();
      }

      const res = await api.put(`/user/${userId}`, payload);
      const updatedUser = res.data?.user || res.data;

      setSuccess("Foydalanuvchi muvaffaqiyatli yangilandi!");

      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      const message =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Ma'lumotlarni saqlashda xatolik yuz berdi";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 py-3">
      <div
        className="bg-white z-20 rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ boxSizing: "border-box" }}
      >
        <button
          className="bg-red-400 duration-100 hover:bg-red-500 active:bg-red-500 text-white font-bold p-2 my-3 rounded"
          onClick={onClose}
          type="button"
        >
          <X className="w-5 h-5 " />
        </button>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Ism va familiya
            </label>
            <input
              type="text"
              name="name"
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.name}
              onChange={handleChange}
              placeholder="Ism va familiya"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-900 text-sm font-bold mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.email}
                onChange={handleChange}
                placeholder="user@applepark.uz"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-900 text-sm font-bold mb-1">
                Telefon raqami
              </label>
              <input
                type="text"
                name="phone"
                className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.phone}
                onChange={handleChange}
                placeholder="+998901234567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-900 text-sm font-bold mb-1">
                Roli
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              >
                <option value="client">Mijoz</option>
                <option value="master">Javobgar shaxs</option>
                <option value="admin">Admin</option>
                <option value="personal">Shaxsiy</option>
                <option value="user">Foydalanuvchi</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-900 text-sm font-bold mb-1">
                Lavozimi
              </label>
              <input
                type="text"
                name="position"
                className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.position}
                onChange={handleChange}
                placeholder="Lavozimi"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Yangi parol
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full border border-blue-300 px-3 py-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.password}
                onChange={handleChange}
                placeholder="Yangi parol (bo'sh qoldirilsa o'zgarmaydi)"
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none"
                title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
          {success && <div className="text-green-600 text-sm font-medium">{success}</div>}

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
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>

      <div
        className="absolute inset-0 z-10 bg-neutral-700/70"
        onClick={onClose}
      ></div>
    </div>
  );
}
