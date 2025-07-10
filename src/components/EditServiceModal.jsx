import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance.js";
import { toast } from "react-hot-toast";
import api from "../api/simpleApi.js";

const serviceTypes = [
  { id: "iphone-repair", title: "iPhone ta'mirlash" },
  { id: "ipad-repair", title: "iPad ta'mirlash" },
  { id: "macbook-repair", title: "MacBook ta'mirlash" },
  { id: "apple-watch-repair", title: "Apple Watch ta'mirlash" },
  { id: "imac-repair", title: "iMac ta'mirlash" },
  { id: "icloud-unlock", title: "iCloud blokdan chiqarish" },
  { id: "apple-diagnostic", title: "Apple diagnostikasi" },
  { id: "data-recovery", title: "Ma'lumotlarni tiklash" },
  { id: "other", title: "Boshqa" },
];

export default function EditServiceModal({ isOpen, onClose, service, userId, onSave }) {
  const [form, setForm] = useState({
    deviceType: "",
    deviceModel: "",
    issueDescription: "",
    phone: "",
    additionalInfo: "",
    imei: "",
    cost: "",
    costOr: "",
    master: "",
    status: "",
    statusComment: ""
  });
  const [masters, setMasters] = useState([]);

  useEffect(() => {
    if (service) {
      setForm({
        deviceType: service.deviceType || "",
        deviceModel: service.deviceModel || "",
        issueDescription: service.issueDescription || "",
        phone: service.phone || "",
        additionalInfo: service.additionalInfo || "",
        imei: service.imei || "",
        cost: service.cost || "",
        costOr: service.costOr || "",
        master: service.master || "",
        status: service.status || "",
        statusComment: service.statusComment || ""
      });
    }
    fetchMasters();
  }, [service]);

  const fetchMasters = async () => {
    try {
      const response = await api.get(`/dashboard/masters`);
      setMasters(response.data);
    } catch (error) {
      console.error('Error fetching masters:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service?._id) return;

    try {
      const response = await axiosInstance.patch(
        `/services/${service._id}?userId=${userId}`,
        form,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      onClose();
      onSave(service._id, userId, form);
    } catch (error) {
      console.error('Error updating service:', error);
      if (error.response) {
        // Если есть ответ от сервера
        alert("Xatolik yuz berdi: " + (error.response.data.message || error.message));
      } else if (error.request) {
        // Если запрос был сделан, но ответ не получен
        alert("Serverga ulanib bo'lmadi. Iltimos internet aloqangizni tekshiring.");
      } else {
        // Что-то случилось при настройке запроса
        alert("Xatolik yuz berdi: " + error.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Xizmatni tahrirlash</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Xizmat turi</label>
            <select
              name="deviceType"
              value={form.deviceType}
              onChange={handleInputChange}
              className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              {serviceTypes.map(type => (
                <option key={type.id} value={type.title}>{type.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Qurilma modeli</label>
            <input
              type="text"
              name="deviceModel"
              value={form.deviceModel}
              onChange={handleInputChange}
              className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Muammo tavsifi</label>
            <input
              type="text"
              name="issueDescription"
              value={form.issueDescription}
              onChange={handleInputChange}
              className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefon raqami</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Qo'shimcha ma'lumot</label>
            <input
              type="text"
              name="additionalInfo"
              value={form.additionalInfo}
              onChange={handleInputChange}
              className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">IMEI</label>
            <input
              type="text"
              name="imei"
              value={form.imei}
              onChange={handleInputChange}
              className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Narxi</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleInputChange}
                placeholder="Narxi"
                className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <input
                type="number"
                name="costOr"
                value={form.costOr}
                onChange={handleInputChange}
                placeholder="yoki"
                className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Javobgar shaxs</label>
            <select
              name="master"
              value={form.master}
              onChange={handleInputChange}
              className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="">Ustani tanlang</option>
              {masters.map((master, index) => (
                <option key={index} value={master.name}>
                  {master.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Holat</label>
            <select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="pending">Kutilmoqda</option>
              <option value="in-progress">Jarayonda</option>
              <option value="completed">Bajarildi</option>
              <option value="unrepairable">Tamirlab Bo'lmaydi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Holat izohi</label>
            <textarea
              name="statusComment"
              value={form.statusComment}
              onChange={handleInputChange}
              className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              rows="3"
              placeholder="Holat haqida qo'shimcha izoh"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
      <div className="fixed inset-0 bg-black/50 bg-opacity-25 -z-10" onClick={onClose}></div>
    </div>
  );
}
