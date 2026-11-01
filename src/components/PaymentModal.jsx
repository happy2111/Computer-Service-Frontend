import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../api/simpleApi";

export default function PaymentModal({
  isOpen,
  onClose,
  service,
  userId,
  onSuccess,
  defaultAction // 'debt' | 'paid' | 'normal'
}) {
  const [paymentStatus, setPaymentStatus] = useState("debt");
  const [costValue, setCostValue] = useState(0);
  const [costFormatted, setCostFormatted] = useState("0");
  const [paidAmount, setPaidAmount] = useState(0);
  const [paidAmountFormatted, setPaidAmountFormatted] = useState("0");
  const [debtDueDate, setDebtDueDate] = useState("");
  const [paymentComment, setPaymentComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const price1 = Number(service?.cost) || 0;
  const price2 = Number(service?.costOr) || 0;

  useEffect(() => {
    if (service) {
      const initialCost = Number(service.cost) || Number(service.costOr) || 0;
      setCostValue(initialCost);
      setCostFormatted(initialCost ? initialCost.toLocaleString("ru-RU") : "0");

      const initialStatus = defaultAction === "paid"
        ? "paid"
        : defaultAction === "debt"
        ? "debt"
        : service.paymentStatus === "paid"
        ? "paid"
        : "debt";

      setPaymentStatus(initialStatus);

      let initialPaid = 0;
      if (initialStatus === "paid") {
        initialPaid = initialCost;
      } else if (service.paidAmount !== undefined) {
        initialPaid = Number(service.paidAmount) || 0;
      }
      setPaidAmount(initialPaid);
      setPaidAmountFormatted(initialPaid ? initialPaid.toLocaleString("ru-RU") : "0");

      if (service.debtDueDate) {
        const d = new Date(service.debtDueDate);
        if (!isNaN(d.getTime())) {
          setDebtDueDate(d.toISOString().split("T")[0]);
        }
      } else {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        setDebtDueDate(d.toISOString().split("T")[0]);
      }

      setPaymentComment(service.paymentComment || "");
    }
  }, [service, defaultAction, isOpen]);

  if (!isOpen || !service) return null;

  const debtRemain = Math.max(0, costValue - (Number(paidAmount) || 0));

  const handleSelectCost = (price) => {
    setCostValue(price);
    setCostFormatted(price ? price.toLocaleString("ru-RU") : "0");
    if (paymentStatus === "paid") {
      setPaidAmount(price);
      setPaidAmountFormatted(price.toLocaleString("ru-RU"));
    }
  };

  const handleCostInputChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const numeric = parseInt(raw || "0", 10);
    setCostValue(numeric);
    setCostFormatted(raw ? numeric.toLocaleString("ru-RU") : "0");
    if (paymentStatus === "paid") {
      setPaidAmount(numeric);
      setPaidAmountFormatted(raw ? numeric.toLocaleString("ru-RU") : "0");
    }
  };

  const handleStatusSelect = (status) => {
    setPaymentStatus(status);
    if (status === "paid") {
      setPaidAmount(costValue);
      setPaidAmountFormatted(costValue.toLocaleString("ru-RU"));
    } else {
      if (paidAmount === costValue) {
        setPaidAmount(0);
        setPaidAmountFormatted("0");
      }
    }
  };

  const handlePaidAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const numeric = parseInt(raw || "0", 10);
    setPaidAmount(numeric);
    setPaidAmountFormatted(raw ? numeric.toLocaleString("ru-RU") : "0");
  };

  const setQuickDays = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDebtDueDate(d.toISOString().split("T")[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        cost: costValue,
        paymentStatus,
        paidAmount: paymentStatus === "paid" ? costValue : (Number(paidAmount) || 0),
        debtDueDate: paymentStatus === "debt" && debtDueDate ? debtDueDate : null,
        paymentComment: paymentComment.trim(),
      };

      // Сохраняем статус оплаты и окончательную стоимость
      await api.put(`/services/${service._id}/payment?userId=${userId}`, payload);

      // Устройство отмечается как выданное
      await api.put(`/services/${service._id}/picked?userId=${userId}`, {
        status: true,
        cost: costValue,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving payment status:", error);
      alert("Xatolik yuz berdi: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            To‘lov holati (#{service.orderNumber})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Segmented Switcher: Paid vs Debt */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => handleStatusSelect("paid")}
              className={`py-2 text-sm font-medium rounded-lg transition-all ${
                paymentStatus === "paid"
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              To‘liq to‘landi
            </button>
            <button
              type="button"
              onClick={() => handleStatusSelect("debt")}
              className={`py-2 text-sm font-medium rounded-lg transition-all ${
                paymentStatus === "debt"
                  ? "bg-white text-red-600 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Nasiya (Qarz)
            </button>
          </div>

          {/* Xizmat narxi (Tanlash yoki kiritish) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-600">
              Yakuniy xizmat narxi:
            </label>

            {/* Быстрый выбор если есть 2 цены (cost и costOr) */}
            {price1 > 0 && price2 > 0 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectCost(price1)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    costValue === price1
                      ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {price1.toLocaleString("ru-RU")} so‘m
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCost(price2)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    costValue === price2
                      ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {price2.toLocaleString("ru-RU")} so‘m
                </button>
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                value={costFormatted}
                onChange={handleCostInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Narxini kiriting"
              />
              <span className="absolute right-3 top-2.5 text-xs text-gray-400">so‘m</span>
            </div>
          </div>

          {/* Conditional Debt Fields */}
          {paymentStatus === "debt" && (
            <div className="space-y-3 pt-1">
              {/* Advance and remaining */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-gray-600 font-medium">To‘langan (avans):</span>
                  <span className="text-red-600 font-bold">
                    Qarz: {debtRemain.toLocaleString("ru-RU")} so‘m
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={paidAmountFormatted}
                    onChange={handlePaidAmountChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400">so‘m</span>
                </div>
              </div>

              {/* Due date */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-gray-600 font-medium">Qaytarish sanasi:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setQuickDays(3)}
                      className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-[11px]"
                    >
                      +3 kun
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDays(5)}
                      className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-[11px]"
                    >
                      +5 kun
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDays(7)}
                      className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-[11px]"
                    >
                      +1 hafta
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  value={debtDueDate}
                  onChange={(e) => setDebtDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Izoh (ixtiyoriy):
                </label>
                <input
                  type="text"
                  value={paymentComment}
                  onChange={(e) => setPaymentComment(e.target.value)}
                  placeholder="Masalan: Click orqali o'tkazadi"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-1/2 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 py-2 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
