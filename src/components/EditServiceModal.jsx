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
    statusComment: "",
    paymentStatus: "unpaid",
    paidAmount: 0,
    debtDueDate: "",
    paymentComment: "",
  });
  const [localUserData, setLocalUserData] = useState(null);
  const [masters, setMasters] = useState([]);

  useEffect(() => {
    setLocalUserData(JSON.parse(localStorage.getItem("user")));
  }, []);

  useEffect(() => {
    if (service) {
      let dueDateStr = "";
      if (service.debtDueDate) {
        const d = new Date(service.debtDueDate);
        if (!isNaN(d.getTime())) {
          dueDateStr = d.toISOString().split("T")[0];
        }
      }

      setForm({
        deviceType: service.deviceType || "",
        deviceModel: service.deviceModel || "",
        issueDescription: service.issueDescription || "",
        phone: service.phone || "",
        additionalInfo: service.additionalInfo || "",
        imei: service.imei || "",
        cost: service.cost !== undefined ? service.cost : "",
        costOr: service.costOr !== undefined ? service.costOr : "",
        master: service.master || "",
        status: service.status || "pending",
        statusComment: service.statusComment || "",
        paymentStatus: service.paymentStatus || "unpaid",
        paidAmount: service.paidAmount !== undefined ? service.paidAmount : 0,
        debtDueDate: dueDateStr,
        paymentComment: service.paymentComment || "",
      });
    }
    fetchMasters();
  }, [service]);

  const fetchMasters = async () => {
    try {
      const response = await api.get(`/masters/all`);
      setMasters(response.data);
    } catch (error) {
      console.error("Error fetching masters:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service?._id) return;

    try {
      const payload = {
        ...form,
        cost: form.cost !== "" ? Number(form.cost) : undefined,
        costOr: form.costOr !== "" ? Number(form.costOr) : undefined,
        paidAmount: Number(form.paidAmount) || 0,
        debtDueDate: form.debtDueDate ? form.debtDueDate : null,
      };

      await axiosInstance.patch(
        `/services/${service._id}?userId=${userId}`,
        payload,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      onClose();
      onSave(service._id, userId, payload);
    } catch (error) {
      console.error("Error updating service:", error);
      if (error.response) {
        alert("Xatolik yuz berdi: " + (error.response.data.message || error.message));
      } else if (error.request) {
        alert("Serverga ulanib bo'lmadi. Iltimos internet aloqangizni tekshiring.");
      } else {
        alert("Xatolik yuz berdi: " + error.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Xizmatni tahrirlash</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xizmat turi</label>
            <select
              name="deviceType"
              value={form.deviceType}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              {serviceTypes.map((type) => (
                <option key={type.id} value={type.title}>
                  {type.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qurilma modeli</label>
            <input
              type="text"
              name="deviceModel"
              value={form.deviceModel}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Muammo tavsifi</label>
            <input
              type="text"
              name="issueDescription"
              value={form.issueDescription}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqami</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qo'shimcha ma'lumot</label>
            <input
              type="text"
              name="additionalInfo"
              value={form.additionalInfo}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IMEI</label>
            <input
              type="text"
              name="imei"
              value={form.imei}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Narxi (so‘m)</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleInputChange}
                placeholder="Narxi"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <input
                type="number"
                name="costOr"
                value={form.costOr}
                onChange={handleInputChange}
                placeholder="yoki taxminiy"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>

          {/* PAYMENT SECTION */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-gray-800">To‘lov va Nasiya holati</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">To‘lov holati</label>
                <select
                  name="paymentStatus"
                  value={form.paymentStatus}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm font-medium"
                >
                  <option value="unpaid">To‘lanmagan</option>
                  <option value="debt">Nasiya (Qarzga)</option>
                  <option value="partial">Qisman to‘langan</option>
                  <option value="paid">To‘liq to‘langan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">To‘langan summa (avans)</label>
                <input
                  type="number"
                  name="paidAmount"
                  value={form.paidAmount}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                />
              </div>
            </div>

            {form.paymentStatus === "debt" && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Qaytarish sanasi (muddat)</label>
                <input
                  type="date"
                  name="debtDueDate"
                  value={form.debtDueDate}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">To‘lov bo‘yicha izoh</label>
              <input
                type="text"
                name="paymentComment"
                value={form.paymentComment}
                onChange={handleInputChange}
                placeholder="To‘lov haqida eslatma..."
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
              />
            </div>
          </div>

          <div className={`${localUserData?.role === "master" ? "hidden" : ""}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Javobgar shaxs</label>
            <select
              name="master"
              value={form.master}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="" hidden>
                Javobgar Shaxsni tanlang
              </option>
              {masters.map((master, index) => (
                <option key={index} value={master._id}>
                  {master.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ta'mirlash holati</label>
            <select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="pending">Kutilmoqda</option>
              <option value="in-progress">Jarayonda</option>
              <option value="completed">Bajarildi</option>
              <option value="unrepairable">Tamirlab Bo'lmaydi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Holat izohi</label>
            <textarea
              name="statusComment"
              value={form.statusComment}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              rows="2"
              placeholder="Holat haqida qo'shimcha izoh"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-5 rounded-lg text-sm"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
      <div className="fixed inset-0 bg-black/50 -z-10" onClick={onClose}></div>
    </div>
  );
}
