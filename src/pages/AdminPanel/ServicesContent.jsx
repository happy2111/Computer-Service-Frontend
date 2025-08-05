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
  RefreshCcwDot
} from 'lucide-react';

import React, {useRef, useState} from "react";
import {useReactToPrint} from "react-to-print";
import PrintableCard from "../../components/PrintableCard";
import SortOrderSelect from "../../components/SortOrderSelect";
import pickedUp from "../../assets/food-delivery.png"
import EditServiceModal from "../../components/EditServiceModal";
import api from "../../api/simpleApi.js";
import {FcFinePrint} from "react-icons/fc";
import UploadModal from "../../components/UploadModal.jsx";
import DeviceFilesSwiper from "../../components/DeviceFilesSwiper.jsx";

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

  const componentRef = useRef(null);
  const [printData, setPrintData] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc')
  const [expandedId, setExpandedId] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadData, setUploadData] = useState(null)
  const [swiperData, setSwiperData] = useState(null)
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Ta'mirlash"
  });
  const [showFileSwiper, setShowFileSwiper] = useState(false)

  const triggerPrint = (request) => {
    setPrintData(request);
    setTimeout(handlePrint, 100);
  };

  const handlePackedUp = async (deviceId, userId, currentPackedUp) => {
    try {
      await api.put(
        `/services/${deviceId}/picked?userId=${userId}`, {status: !currentPackedUp}
      );
      fetchServiceRequests();
    } catch (error) {
      alert("Xatolik yuz berdi: " + error.message);
    }
  };


  const handleEditService = async (serviceId, userId, updates) => {
    try {
      const response = await api.patch(`/services/${serviceId}?userId=${userId}`, updates);
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


  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">Xizmat so‘rovlari</h2>
          <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Qo‘shish
            </button>
            <div className="relative w-full md:w-56">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="So‘rovlarni qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setStatusFilter('all')}
                onBlur={() => setStatusFilter('all')}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto flex items-center"
            >
              <option value="all">Barcha holatlar</option>
              <option value="pending">Kutilmoqda</option>
              <option value="in-progress">Jarayonda</option>
              <option value="completed">Bajarildi</option>
              <option value="unrepairable">Tamirlab Bolmaydi</option>
            </select>
            <SortOrderSelect
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <button
              onClick={fetchServiceRequests}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 w-full md:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yangilash
            </button>
          </div>
        </div>
      </div>

      {loading.services ? (
        <LoadingSpinner />
      ) : (
        <div className="p-6">
          <div className="space-y-6">
            {getSortedRequests(filteredServiceRequests, sortOrder).map((request) => {
              const expanded = expandedId === request._id;
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
              return (
                <div
                  key={request._id}
                  className={`border rounded-lg p-6 hover:bg-opacity-80 active:bg-gray-200 transition-all duration-200 cursor-pointer ${cardBg} ${expanded ? 'shadow-lg' : ''}`}
                  onClick={() => setExpandedId(expanded ? null : request._id)}
                >
                  <div className="flex  flex-col items-start justify-between mb-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold">
                        {request.orderNumber}
                    </span>
                    <div className={"flex items-center gap-2"}>

                      <h3 className="text-lg font-semibold text-gray-900 flex flex-wrap max-sm:gap-2 items-center">
                        <span className="">{request.deviceType}</span>
                        <span className="text-gray-500 text-sm">({request.deviceModel})</span>
                      </h3>

                    </div>

                    <span className=" flex items-center gap-1 text-blue-700 font-bold">
                      <span className="font-bold ">{request.userName}</span>
                      {/*<p>{request.userId}</p>*/}
                    </span>
                  </div>
                  {expanded && (
                    <div className="animate-fade-in">
                      <div className={"gap-2 flex flex-wrap"}>
                        {request?.images?.map((image, index) => (
                          <div
                            onClick={() => {
                              setShowFileSwiper(true);
                              setSwiperData(request.images)
                            }}
                            key={index}
                            className={"h-20 w-20 rounded-xl overflow-hidden hover:opacity-75 active:opacity-90"}
                          >
                            <img
                              className={"object-cover w-full  h-full"}
                              loading={"lazy"}
                              src={`${import.meta.env.VITE_STATIC_BASE_URL}${image}`}
                              alt="device image"
                            />
                          </div>
                        ))}
                        {request?.videos?.map((video, index) => (
                          <div
                            onClick={() => {
                              setShowFileSwiper(true);
                              setSwiperData(request.videos)
                            }}
                            key={index}
                            className="h-20 w-20 rounded-xl overflow-hidden hover:opacity-75 active:opacity-90"
                          >
                            <video
                              className="w-full h-full object-cover"
                              muted
                              // loop
                              // controls
                            >
                              <source
                                src={`${import.meta.env.VITE_STATIC_BASE_URL}${video}`}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ))}
                        {!request?.images?.length && !request?.videos?.length && (
                          <p className="text-sm text-gray-500 italic">Rasm yoki video mavjud emas.</p>
                        )}

                      </div>
                      <br />
                      <p className="text-gray-600 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                        <span className="font-bold">Muammo:</span>&nbsp;
                        <span className="font-bold text-gray-900">{request.issueDescription}</span>
                      </p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <Hash className="h-4 w-4 mr-1 text-purple-500" />
                        <span className="font-bold">IMEI:</span>&nbsp;
                        <span className="font-bold inline-block bg-gray-200 text-gray-600 rounded px-2 py-0.5 text-xs font-mono text-gray-900 break-all">{request.imei}</span>
                      </p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <Info className="h-4 w-4 mr-1 text-cyan-500" />
                        <span className="font-bold break-all ">Qo'shimcha ma'lumotlar:</span>&nbsp;
                        <span className="font-bold break-all inline-block bg-gray-200 text-gray-600 rounded px-2 py-0.5 text-xs font-mono text-gray-900">{request.additionalInfo}</span>
                      </p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <UserCog className="h-4 w-4 mr-1 text-orange-500" />
                        <span className="font-bold">Javobgar:</span>&nbsp;
                        <span className="font-bold text-gray-900">{request.masterName} </span>
                      </p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-bold">Narx:</span>&nbsp;
                        <span className="font-bold text-gray-900">{request.cost} so'm {request.costOr && `- ${request.costOr} so'm`}</span>
                      </p>
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
                          className="px-4 py-2 items-center  flex gap-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                        >
                          <RefreshCcwDot className="h-4 w-4" /> Holatni yangilash
                        </button>
                        <button
                          onClick={e => {
                            setShowUploadModal(true);
                            setUploadData(
                              {
                                userId: request.userId,
                                deviceId: request._id
                              }
                            )
                            // setUploadModalDatas({userId: })
                          }}
                          className="px-4 py-2 items-center  flex gap-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-500"
                        >
                          <Upload className="h-4 w-4" /> Rasm/Video Yuklash
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            window.open(`tel:${request.phone}`)
                          }}
                          className="px-4 py-2 border items-center  flex gap-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                        >
                          <PhoneForwarded className="h-4 w-4" /> Mijozga qo‘ng‘iroq qilish
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            triggerPrint(request)
                          }}
                          className="px-4 py-2 flex gap-2 items-center  bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          <Printer className="h-4 w-4" /> Chop etish
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handlePackedUp(request._id, request.userId, request.packedUp)
                          }}
                          className={`${request.packedUp ? "bg-blue-600/50 border-1 border-blue-600" : " "} px-4 hover:opacity-75 flex gap-2 py-2 border-gray-300 border  text-gray-700 text-sm font-medium rounded-lg`}
                        >
                          <img
                            className={"w-5"}
                            src={pickedUp}
                            alt="taked away"
                            width=""
                            height=""
                            loading="lazy"
                          />
                          Olib Ketilgan
                          {request.packedUp &&
                            <Check className="w-4 h-4 text-green-600" />}
                        </button>
                        <button
                          className="p-2 text-yellow-600 border hover:opacity-75 active:opacity-90 hover:bg-red-50 rounded-lg"
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
                            deleteServiceRequest(request._id, request.userId)
                          }}
                          className="p-2 text-red-600 border hover:opacity-75 active:opacity-90 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{display: "none"}}>
            {printData && (
              <PrintableCard
                ref={componentRef}
                request={printData}
              />
            )}
          </div>
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
      {showUploadModal && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          data={uploadData}
          refresh={fetchServiceRequests}
        />
      )}
      {
        showFileSwiper && (
          <div className={"device-swiper fixed inset-0 z-90"}>
            <DeviceFilesSwiper
              isOpen={showFileSwiper}
              onClose={() => setShowFileSwiper(false)}
              data={swiperData}
              setData={setSwiperData}
            />
          </div>
        )
      }

    </div>
  );
});

export default ServicesContent;
