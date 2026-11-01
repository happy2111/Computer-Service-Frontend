import {
  Search,
  RefreshCw,
  Plus,
  Phone,
  Check,
  Calendar,
  Trash2,
  AlertCircle,
  Hash,
  Info,
  UserCog,
  Edit,
  DollarSign,
  Upload,
  Printer,
  PhoneForwarded,
  RefreshCcwDot,
  AlertTriangle,
  CreditCard,
  Clock,
  ChevronDown
} from 'lucide-react';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import PrintableCard from "../../components/PrintableCard";
import CreaterQRCode from "../../components/CreaterQRCode";
import SortOrderSelect from "../../components/SortOrderSelect";
import pickedUp from "../../assets/food-delivery.png";
import EditServiceModal from "../../components/EditServiceModal";
import PaymentModal from "../../components/PaymentModal.jsx";
import api from "../../api/simpleApi.js";
import { FcFinePrint } from "react-icons/fc";
import UploadModal from "../../components/UploadModal.jsx";
import DeviceFilesSwiper from "../../components/DeviceFilesSwiper.jsx";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PrintButton from "../../components/PrintButton.jsx";
import PrintModal from "../../components/print/PrintModal.jsx";

const ServicesContent = React.memo(({
  filteredServiceRequests,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  loading,
  fetchServiceRequests,
  updateServiceRequestStatus,
  deleteServiceRequest,
  formatDate,
  getStatusBadge,
  setShowAddServiceModal,
  LoadingSpinner
}) => {

  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedId, setExpandedId] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState(null);
  const [swiperData, setSwiperData] = useState(null);
  const [showFileSwiper, setShowFileSwiper] = useState(false);

  // PAYMENT MODAL & FILTERS --------------------------------
  const [searchParams] = useSearchParams();
  const [paymentFilter, setPaymentFilter] = useState(() => searchParams.get('payment') || 'all');
  const [selectedPaymentService, setSelectedPaymentService] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentDefaultAction, setPaymentDefaultAction] = useState('normal');

  useEffect(() => {
    const p = searchParams.get('payment');
    if (p) {
      setPaymentFilter(p);
    }
  }, [searchParams]);

  // PRINT -----------------------------------------------
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printData, setPrintData] = useState(null);
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    removeAfterPrint: true,
    pageStyle: `
      @page { size: 55mm 40mm; margin: 0; }
      @media print {
        html, body {
          width: auto !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color-adjust: exact;
          background: transparent !important;
        }
        .print-content { break-inside: avoid; }
        img { max-width: 100% !important; }
      }
    `,
    documentTitle: "Ta'mirlash"
  });

  const triggerPrint = (request) => {
    setPrintData(request);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // REQUESTS -----------------------------------------------

  const handlePackedUp = async (deviceId, userId, currentPackedUp) => {
    try {
      await api.put(
        `/services/${deviceId}/picked?userId=${userId}`, { status: !currentPackedUp }
      );
      fetchServiceRequests();
    } catch (error) {
      alert("Xatolik yuz berdi: " + error.message);
    }
  };

  const handlePackedUpClick = (e, request) => {
    e.stopPropagation();
    // Если еще не забрали и оплата не закрыта — открываем окно с предложением оформить долг / оплату
    if (!request.packedUp && request.paymentStatus !== "paid") {
      setSelectedPaymentService(request);
      setPaymentDefaultAction("debt");
      setPaymentModalOpen(true);
    } else {
      // Иначе просто переключаем
      handlePackedUp(request._id, request.userId, request.packedUp);
    }
  };

  const handleQuickPay = async (e, request) => {
    e.stopPropagation();
    const cost = Number(request.cost) || 0;
    if (!window.confirm(`Buyurtma #${request.orderNumber} uchun to'lov to'liq (${cost.toLocaleString("ru-RU")} so'm) qabul qilindimi?`)) {
      return;
    }
    try {
      await api.put(`/services/${request._id}/payment?userId=${request.userId}`, {
        paymentStatus: "paid",
        paidAmount: cost,
      });
      fetchServiceRequests();
    } catch (err) {
      alert("Xatolik: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditService = async (serviceId, userId, updates) => {
    try {
      await api.patch(`/services/${serviceId}?userId=${userId}`, updates);
      fetchServiceRequests(); // Обновляем список сервисов
      setEditingService(null); // Закрываем модальное окно
    } catch (error) {
      alert("Xatolik yuz berdi: " + error.message);
    }
  };

  function getSortedRequests(requests, order) {
    return [...requests].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (order === 'asc') return dateA - dateB;
      return dateB - dateA;
    });
  }

  // Def -----------------------------------------------

  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!filteredServiceRequests || filteredServiceRequests.length === 0) return;

    if (hash) {
      const elementId = hash.replace("#", "");
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [filteredServiceRequests, hash]);

  // Statistics for debts
  const debtStats = useMemo(() => {
    const list = filteredServiceRequests || [];
    const debts = list.filter((r) => r.paymentStatus === "debt");
    const totalSum = debts.reduce((sum, r) => {
      const cost = Number(r.cost) || 0;
      const paid = Number(r.paidAmount) || 0;
      return sum + Math.max(0, cost - paid);
    }, 0);
    const now = new Date();
    const overdueCount = debts.filter(
      (r) => r.debtDueDate && new Date(r.debtDueDate) < now
    ).length;

    return {
      count: debts.length,
      totalSum,
      overdueCount,
    };
  }, [filteredServiceRequests]);

  // Filter requests by paymentStatus as well
  const displayedRequests = useMemo(() => {
    let list = filteredServiceRequests || [];
    const now = new Date();

    if (paymentFilter === "debt") {
      list = list.filter((r) => r.paymentStatus === "debt");
    } else if (paymentFilter === "overdue") {
      list = list.filter((r) => r.paymentStatus === "debt" && r.debtDueDate && new Date(r.debtDueDate) < now);
    } else if (paymentFilter === "paid") {
      list = list.filter((r) => r.paymentStatus === "paid");
    } else if (paymentFilter === "partial") {
      list = list.filter((r) => r.paymentStatus === "partial");
    } else if (paymentFilter === "unpaid") {
      list = list.filter((r) => !r.paymentStatus || r.paymentStatus === "unpaid");
    }
    return list;
  }, [filteredServiceRequests, paymentFilter]);

  return (
    <div className="bg-white rounded-xl shadow-xs sm:shadow-sm">
      <div className="p-3 sm:p-6 border-b border-gray-100 sm:border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Sarlavha va Mobile Refresh */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Xizmat so‘rovlari</h2>
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={fetchServiceRequests}
                title="Yangilash"
                className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95 transition"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Boshqaruv elementlari: Qidiruv, Filterlar, Saralash */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-2.5 w-full md:w-auto">
            {/* Qidiruv + Mobile Saralash */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-56">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Qidirish (ism, IMEI, model)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-xs sm:text-sm"
                />
              </div>
              <div className="md:hidden">
                <SortOrderSelect
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                />
              </div>
            </div>

            {/* Filterlar: Mobil qurilmalarda 2 ustun, kompyuterda inline */}
            <div className="grid grid-cols-2 md:flex md:items-center gap-2 w-full md:w-auto">
              {/* Ta'mirlash holati filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm font-medium bg-white text-gray-700 w-full md:w-auto truncate"
                title="Ta'mirlash holati"
              >
                <option value="all">Holat: Barchasi</option>
                <option value="pending">Holat: Kutilmoqda</option>
                <option value="in-progress">Holat: Jarayonda</option>
                <option value="completed">Holat: Bajarildi</option>
                <option value="unrepairable">Holat: Tuzalmaydi</option>
              </select>

              {/* To'lov holati filter */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm font-medium bg-white text-gray-700 w-full md:w-auto truncate"
                title="To'lov holati"
              >
                <option value="all">To‘lov: Barchasi</option>
                <option value="debt">To‘lov: Nasiyalar</option>
                <option value="overdue">To‘lov: Muddati o‘tgan</option>
                <option value="paid">To‘lov: To‘langan</option>
                <option value="unpaid">To‘lov: To‘lanmagan</option>
              </select>
            </div>

            {/* Desktop Saralash */}
            <div className="hidden md:block">
              <SortOrderSelect
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </div>

            {/* Desktop Yangilash tugmasi (faqat ixcham icon) */}
            <button
              onClick={fetchServiceRequests}
              title="Ro'yxatni yangilash"
              className="hidden md:inline-flex items-center justify-center p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95 transition"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Desktop Qo'shish tugmasi (mobilda pastki fixed + tugmasi bor) */}
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="hidden md:inline-flex items-center px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Qo‘shish
            </button>
          </div>
        </div>

        {/* Qarzdorlik umumiy hisoblagichi */}
        {debtStats.count > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-sm animate-fade-in">
            <div className="flex items-center gap-2 text-red-900 font-medium">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>
                Qarzdorlikdagi buyurtmalar: <strong className="text-red-950 font-bold">{debtStats.count} ta</strong>
                {" • "}Jami qarz summasi: <strong className="text-red-950 font-bold">{debtStats.totalSum.toLocaleString("ru-RU")} so‘m</strong>
                {debtStats.overdueCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-bold">
                    {debtStats.overdueCount} ta muddati o‘tgan!
                  </span>
                )}
              </span>
            </div>
            <button
              onClick={() => setPaymentFilter(paymentFilter === "debt" ? "all" : "debt")}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              {paymentFilter === "debt" ? "Barcha to‘lovlarni ko‘rish" : "Faqat qarzdorlarni ko‘rish"}
            </button>
          </div>
        )}
      </div>

      {loading.services ? (
        <LoadingSpinner />
      ) : (
        <div className="p-2 sm:p-5 md:p-6">
          <div className="space-y-2.5 sm:space-y-4">
            {getSortedRequests(displayedRequests, sortOrder).map((request) => {
              const isExpanded = expandedId === request._id || (expandedId === null && hash === `#${request.orderNumber}`);
              const totalCost = Number(request.cost) || 0;
              const paidAmount = Number(request.paidAmount) || 0;
              const debtRemain = Math.max(0, totalCost - paidAmount);
              const isOverdue = request.paymentStatus === "debt" && request.debtDueDate && new Date(request.debtDueDate) < new Date();

              // Цвет фона карточки в зависимости от статуса
              let cardBg = '';
              switch (request.status) {
                case 'pending':
                  cardBg = 'bg-yellow-50 border-yellow-200';
                  break;
                case 'in-progress':
                  cardBg = 'bg-blue-50 border-blue-200';
                  break;
                case 'completed':
                  cardBg = 'bg-green-50 border-green-200';
                  break;
                case 'unrepairable':
                  cardBg = 'bg-red-50 border-red-200';
                  break;
                default:
                  cardBg = 'bg-gray-50 border-gray-200';
              }

              // Если долг просрочен, подсвечиваем рамку
              if (isOverdue) {
                cardBg += ' ring-2 ring-red-500/80';
              }

              return (
                <div
                  id={request.orderNumber}
                  key={request._id}
                  className={`relative border rounded-xl p-3 sm:p-5 md:p-6 hover:bg-opacity-80 active:bg-gray-200 transition-all duration-200 cursor-pointer ${cardBg} ${isExpanded ? 'shadow-lg' : ''}`}
                  onClick={() => {
                    if (isExpanded) {
                      setExpandedId("");
                      navigate({ hash: "" }, { replace: true });
                    } else {
                      setExpandedId(request._id);
                      navigate({ hash: `${request.orderNumber}` }, { replace: true });
                    }
                  }}
                >
                  <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-300 ${isExpanded ? 'mb-4' : 'mb-0'}`}>
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 font-bold text-sm">
                          #{request.orderNumber}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 flex flex-wrap items-center gap-1.5">
                          <span>{request.deviceModel}</span>
                          <span className="text-gray-500 text-sm font-normal">({request.deviceType})</span>
                        </h3>
                      </div>
                      <span className="flex items-center gap-1 text-blue-700 font-bold text-sm">
                        <span>{request.userName}</span>
                      </span>
                    </div>

                    {/* Quick Badges in Header */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status badge */}
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                        {request.status === 'pending' ? 'Kutilmoqda' :
                         request.status === 'in-progress' ? 'Jarayonda' :
                         request.status === 'completed' ? 'Bajarildi' : 'Tamirlab Bo\'lmaydi'}
                      </span>

                      {/* Payment badge */}
                      {request.paymentStatus === 'paid' && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaymentService(request);
                            setPaymentDefaultAction('normal');
                            setPaymentModalOpen(true);
                          }}
                          title="To'lov holatini ko'rish"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300 hover:scale-105 transition-transform"
                        >
                          <Check className="w-3.5 h-3.5 text-green-700" />
                          To‘langan
                        </span>
                      )}

                      {request.paymentStatus === 'debt' && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaymentService(request);
                            setPaymentDefaultAction('debt');
                            setPaymentModalOpen(true);
                          }}
                          title="Qarz ma'lumotlarini ko'rish / to'lash"
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-transform hover:scale-105 ${
                            isOverdue
                              ? "bg-red-600 text-white shadow-sm"
                              : "bg-red-100 text-red-800 border border-red-300"
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Nasiya: {debtRemain.toLocaleString("ru-RU")} so‘m
                          {request.debtDueDate && (
                            <span className="opacity-90 font-normal">
                              ({isOverdue ? "Muddati o‘tgan!" : new Date(request.debtDueDate).toLocaleDateString("ru-RU")})
                            </span>
                          )}
                        </span>
                      )}

                      {request.paymentStatus === 'partial' && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaymentService(request);
                            setPaymentDefaultAction('normal');
                            setPaymentModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300 hover:scale-105 transition-transform"
                        >
                          <Clock className="w-3.5 h-3.5 text-yellow-700" />
                          Qisman: {paidAmount.toLocaleString("ru-RU")} so‘m
                        </span>
                      )}

                      {(!request.paymentStatus || request.paymentStatus === 'unpaid') && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaymentService(request);
                            setPaymentDefaultAction('normal');
                            setPaymentModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300 hover:scale-105 transition-transform"
                        >
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          To‘lanmagan
                        </span>
                      )}

                      {/* Picked up badge */}
                      {request.packedUp && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          Olib ketilgan
                        </span>
                      )}

                      {/* Smooth Chevron Indicator */}
                      <div className="flex items-center gap-1 ml-auto md:ml-1 pl-1 text-gray-400">
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
                            isExpanded ? "rotate-180 text-blue-600" : "text-gray-400 hover:text-gray-600"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Smooth Collapsible Content Container */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="overflow-hidden min-h-0">
                      <div className="pt-3 border-t border-gray-200/60">
                        <div className={"gap-2 flex flex-wrap"}>
                        {request?.images?.map((image, index) => (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowFileSwiper(true);
                              setSwiperData(request.images);
                            }}
                            key={index}
                            className={"h-20 w-20 rounded-xl overflow-hidden hover:opacity-75 active:opacity-90 border border-gray-200"}
                          >
                            <img
                              className={"object-cover w-full h-full"}
                              loading={"lazy"}
                              src={`${import.meta.env.VITE_STATIC_BASE_URL}${image}`}
                              alt="device image"
                            />
                          </div>
                        ))}
                        {request?.videos?.map((video, index) => (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowFileSwiper(true);
                              setSwiperData(request.videos);
                            }}
                            key={index}
                            className="h-20 w-20 rounded-xl overflow-hidden hover:opacity-75 active:opacity-90 border border-gray-200"
                          >
                            <video className="w-full h-full object-cover" muted>
                              <source
                                src={`${import.meta.env.VITE_STATIC_BASE_URL}${video}`}
                                type="video/mp4"
                              />
                            </video>
                          </div>
                        ))}
                        {!request?.images?.length && !request?.videos?.length && (
                          <p className="text-sm text-gray-500 italic">Rasm yoki video mavjud emas.</p>
                        )}
                      </div>

                      <div className={"max-md:hidden absolute right-1 top-1"}>
                        <CreaterQRCode link={`https://applepark.uz/admin/services#${request.orderNumber}`} />
                      </div>
                      <br />

                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <AlertCircle className="h-4 w-4 mr-1 text-red-500 flex-shrink-0" />
                        <span className="font-bold">Muammo:</span>&nbsp;
                        <span className="font-bold text-gray-900">{request.issueDescription}</span>
                      </p>
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <Hash className="h-4 w-4 mr-1 text-purple-500 flex-shrink-0" />
                        <span className="font-bold">IMEI:</span>&nbsp;
                        <span className="font-bold inline-block bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs font-mono break-all">{request.imei || "Yo'q"}</span>
                      </p>
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <Info className="h-4 w-4 mr-1 text-cyan-500 flex-shrink-0" />
                        <span className="font-bold break-all">Qo'shimcha ma'lumotlar:</span>&nbsp;
                        <span className="font-bold break-all inline-block bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs font-mono">{request.additionalInfo || "Yo'q"}</span>
                      </p>
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <UserCog className="h-4 w-4 mr-1 text-orange-500 flex-shrink-0" />
                        <span className="font-bold">Javobgar:</span>&nbsp;
                        <span className="font-bold text-gray-900">{request.masterName || "Belgilanmagan"}</span>
                      </p>
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600 flex-shrink-0" />
                        <span className="font-bold">Xizmat narxi:</span>&nbsp;
                        <span className="font-bold text-gray-900">
                          {totalCost ? `${totalCost.toLocaleString("ru-RU")} so'm` : "Ko'rsatilmagan"}
                          {request.costOr ? ` yoki ${Number(request.costOr).toLocaleString("ru-RU")} so'm` : ""}
                        </span>
                      </p>

                      {request.paymentStatus === "debt" && (
                        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 my-2 bg-red-50/90 border border-red-200 rounded-lg text-sm">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <span className="text-red-700">Qarz: <strong className="font-bold text-red-950">{debtRemain.toLocaleString("ru-RU")} so‘m</strong></span>
                            {request.debtDueDate && (
                              <span className="text-xs text-red-600 font-medium">
                                ({new Date(request.debtDueDate).toLocaleDateString("ru-RU")} gacha)
                              </span>
                            )}
                            {paidAmount > 0 && (
                              <span className="text-xs text-gray-500">
                                • Avans: {paidAmount.toLocaleString("ru-RU")} so‘m
                              </span>
                            )}
                            {request.paymentComment && (
                              <span className="text-xs text-gray-500 italic">
                                • "{request.paymentComment}"
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPaymentService(request);
                              setPaymentDefaultAction('debt');
                              setPaymentModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-semibold shadow-xs transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" /> Qarzni o‘zgartirish
                          </button>
                        </div>
                      )}

                      <div className="max-sm:order-3 flex items-center space-x-2 my-4">
                        <select
                          value={request.status}
                          onChange={e => updateServiceRequestStatus(request._id, e.target.value, request.userId)}
                          className={`px-3 py-1 text-sm font-medium rounded-full border-0 ${getStatusBadge(request.status)}`}
                          onClick={e => e.stopPropagation()}
                        >
                          <option value="pending">Kutilmoqda</option>
                          <option value="in-progress">Jarayonda</option>
                          <option value="completed">Bajarildi</option>
                          <option value="unrepairable">Tamirlab Bolmaydi</option>
                        </select>
                      </div>

                      <div className="max-sm:order-2 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 font-bold">Telefon:</span>
                            <span className="text-sm font-bold text-gray-900">{request.phone}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 font-bold">Yaratilgan:</span>
                            <span className="text-sm font-bold text-gray-900">{formatDate(request.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3.5 items-center space-x-3">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            const newStatus = request.status === 'pending' ? 'in-progress' :
                              request.status === 'in-progress' ? 'completed' : 'pending';
                            updateServiceRequestStatus(request._id, newStatus, request.userId);
                          }}
                          className="px-4 py-2 items-center active:scale-103 active:opacity-75 flex gap-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                        >
                          <RefreshCcwDot className="h-4 w-4" /> Holatni yangilash
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setShowUploadModal(true);
                            setUploadData({
                              userId: request.userId,
                              deviceId: request._id
                            });
                          }}
                          className="px-4 py-2 items-center active:scale-103 active:opacity-75 flex gap-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-500"
                        >
                          <Upload className="h-4 w-4" /> Rasm/Video Yuklash
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            window.open(`tel:${request.phone}`);
                          }}
                          className="px-4 py-2 border items-center active:scale-103 active:opacity-75 flex gap-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                        >
                          <PhoneForwarded className="h-4 w-4" /> Mijozga qo‘ng‘iroq qilish
                        </button>

                        <button
                          onClick={() => {
                            setShowPrintModal(true);
                            setPrintData(request);
                          }}
                          className="px-4 py-2 flex gap-2 items-center active:scale-103 active:opacity-75 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          <Printer className="h-4 w-4" /> Chop etish
                        </button>

                        {/* Погасить долг (показывается только когда техника отдана и висит долг) */}
                        {request.paymentStatus === "debt" && (
                          <button
                            onClick={e => handleQuickPay(e, request)}
                            className="px-4 py-2 items-center active:scale-103 active:opacity-75 flex gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm"
                          >
                            <Check className="h-4 w-4" /> Qarzni yopish
                          </button>
                        )}
                        {/* Кнопка "Olib ketilgan" (если не оплачено - открывает окно оформления долга/оплаты) */}
                        <button
                          onClick={e => handlePackedUpClick(e, request)}
                          className={`${request.packedUp ? "bg-blue-600/50 border-1 border-blue-600 text-white" : "text-gray-700"} px-4 active:scale-103 active:opacity-75 hover:opacity-75 flex gap-2 py-2 border-gray-300 border text-sm font-medium rounded-lg`}
                        >
                          <img
                            className={"w-5"}
                            src={pickedUp}
                            alt="taked away"
                            loading="lazy"
                          />
                          Olib Ketilgan
                          {request.packedUp &&
                            <Check className="w-4 h-4 text-green-600" />}
                        </button>

                        <button
                          className="p-2 text-yellow-600 border hover:opacity-75 active:opacity-90 active:scale-103 hover:bg-red-50 rounded-lg"
                          onClick={e => {
                            e.stopPropagation();
                            setEditingService(request);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            deleteServiceRequest(request._id, request.userId);
                          }}
                          className="p-2 text-red-600 border hover:opacity-75 active:opacity-90 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              );
            })}
          </div>
          {printData && (
            <PrintableCard
              ref={componentRef}
              request={printData}
            />
          )}
        </div>
      )}

      {editingService && (
        <EditServiceModal
          isOpen={Boolean(editingService)}
          onClose={() => setEditingService(null)}
          service={editingService}
          userId={editingService.userId}
          onSave={handleEditService}
        />
      )}

      {/* MODAL NASIYA VA TO'LOV */}
      {paymentModalOpen && selectedPaymentService && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedPaymentService(null);
          }}
          service={selectedPaymentService}
          userId={selectedPaymentService.userId}
          defaultAction={paymentDefaultAction}
          onSuccess={() => {
            fetchServiceRequests();
          }}
        />
      )}

      {showUploadModal && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          data={uploadData}
          refresh={fetchServiceRequests}
        />
      )}
      {showFileSwiper && (
        <div className={"device-swiper fixed inset-0 z-90"}>
          <DeviceFilesSwiper
            isOpen={showFileSwiper}
            onClose={() => setShowFileSwiper(false)}
            data={swiperData}
            setData={setSwiperData}
          />
        </div>
      )}
      <PrintModal isOpen={showPrintModal} onClose={() => setShowPrintModal(false)} data={printData} />

      {/* Fixed '+' button bottom-left for adding service */}
      <button
        type="button"
        onClick={() => setShowAddServiceModal(true)}
        title="Yangi xizmat qo'shish"
        className="fixed bottom-6 left-6 lg:left-72 z-40 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all group hover:ring-4 hover:ring-blue-300/50"
      >
        <Plus className="w-7 h-7 transition-transform group-hover:rotate-90 duration-200" />
      </button>
    </div>
  );
});

export default ServicesContent;
