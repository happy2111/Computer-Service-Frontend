import {Search, RefreshCw, Plus,Phone, Calendar,  Trash2, AlertCircle, Hash, Info, UserCog, DollarSign} from 'lucide-react';
import React, { useRef , useState} from "react";
import { useReactToPrint } from "react-to-print";
import PrintableCard from "../../components/PrintableCard";

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
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Ta'mirlash"
  });

  const triggerPrint = (request) => {
    setPrintData(request);
    setTimeout(handlePrint, 100);
  };



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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
            >
              <option value="all">Barcha holatlar</option>
              <option value="pending">Kutilmoqda</option>
              <option value="in-progress">Jarayonda</option>
              <option value="completed">Bajarildi</option>
            </select>
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
            {filteredServiceRequests.map((request) => (
              <div key={request._id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                <div className="flex flex-wrap sm:flex-col items-start justify-between mb-4">
                  <div className={"max-sm:order-1"}>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      {/*<Info className="h-5 w-5 mr-2 text-blue-500" />*/}
                      <span className="">{request.deviceType} {request.deviceModel}</span>
                    </h3>
                    <p className="text-blue-600 font-medium flex items-center">
                      {/*<User className="h-4 w-4 mr-1" />*/}
                      <span className="">Mijoz:</span>&nbsp;<span className="font-bold text-gray-900">{request.userName}</span>
                    </p>
                    <br/>
                    <p className="text-gray-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                      <span className="font-bold">Muammo:</span>&nbsp;<span className="font-bold text-gray-900">{request.issueDescription}</span>
                    </p>
                    <p className="text-gray-600 text-sm flex items-center">
                      <Hash className="h-4 w-4 mr-1 text-purple-500" />
                      <span className="font-bold">IMEI:</span>&nbsp;<span className="font-bold text-gray-900">{request.imei}</span>
                    </p>
                    <p className="text-gray-600 text-sm flex items-center">
                      <Info className="h-4 w-4 mr-1 text-cyan-500" />
                      <span className="font-bold">Qo'shimcha ma'lumotlar:</span>&nbsp;<span className="font-bold text-gray-900">{request.additionalInfo}</span>
                    </p>
                    <p className="text-gray-600 text-sm flex items-center">
                      <UserCog className="h-4 w-4 mr-1 text-orange-500" />
                      <span className="font-bold">Javobgar:</span>&nbsp;<span className="font-bold text-gray-900">{request.master}</span>
                    </p>
                    <p className="text-gray-600 text-sm flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                      <span className="font-bold">Narx:</span>&nbsp;<span className="font-bold text-gray-900">{request.cost} so'm {request.costOr && `- ${request.costOr} so'm`}</span>
                    </p>
                  </div>


                  <div className="max-sm:order-3 flex items-center space-x-2 my-4">
                    <select
                      value={request.status}
                      onChange={e => updateServiceRequestStatus(request._id, e.target.value, request.userId)}
                      className={`px-3 py-1 text-sm font-medium rounded-full border-0 ${getStatusBadge(request.status)}`}
                    >
                      <option value="pending">Kutilmoqda</option>
                      <option value="in-progress">Jarayonda</option>
                      <option value="completed">Bajarildi</option>
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
                </div>

                <div className="flex flex-wrap gap-3.5 items-center space-x-3">
                  <button
                    onClick={() => {
                      const newStatus = request.status === 'pending' ? 'in-progress' :
                        request.status === 'in-progress' ? 'completed' : 'pending';
                      updateServiceRequestStatus(request._id, newStatus, request.userId);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    Holatni yangilash
                  </button>
                  <button
                    onClick={() => window.open(`tel:${request.phone}`)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                  >
                    Mijozga qo‘ng‘iroq qilish
                  </button>
                  <button
                    onClick={() =>
                      triggerPrint(request)
                    }
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    Chop etish
                  </button>

                  <button
                    onClick={() => deleteServiceRequest(request._id, request.userId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "none" }}>
            {printData && (
              <PrintableCard ref={componentRef} request={printData} />
            )}
          </div>
        </div>

      )}
    </div>
  );
});

export default ServicesContent;
