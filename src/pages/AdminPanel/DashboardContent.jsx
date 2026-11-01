import { RefreshCw, Users, MessageSquare, Wrench, Star, CreditCard, AlertTriangle } from 'lucide-react';
import MastersStatsTable from "../../components/MastersStatsTable";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from 'react';

const DashboardContent = ({
  dashboardStats,
  loading,
  fetchDashboardStats,
  fetchUsers,
  fetchContactMessages,
  fetchServiceRequests,
  serviceRequests,
  contactMessages,
  LoadingSpinner,
  formatDate,
  setActiveTab,
  activeTab
}) => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (href) => {
    setIsClicked(!isClicked);
    setTimeout(() => {
      navigate(href);
    }, 100);
  };

  // Nasiya (qarz) bo'yicha hisob-kitoblar
  const debtStats = useMemo(() => {
    const debts = (serviceRequests || []).filter((r) => r.paymentStatus === "debt");
    const totalDebtSum = debts.length > 0 
      ? debts.reduce((sum, r) => {
          const cost = Number(r.cost) || 0;
          const paid = Number(r.paidAmount) || 0;
          return sum + Math.max(0, cost - paid);
        }, 0)
      : (Number(dashboardStats?.totalDebtSum) || 0);

    const now = new Date();
    const overdueCount = debts.length > 0
      ? debts.filter((r) => r.debtDueDate && new Date(r.debtDueDate) < now).length
      : (Number(dashboardStats?.overdueDebtCount) || 0);

    const count = debts.length > 0 ? debts.length : (Number(dashboardStats?.totalDebtCount) || 0);

    return {
      count,
      totalDebtSum,
      overdueCount
    };
  }, [serviceRequests, dashboardStats]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="max-sm:hidden text-2xl font-bold text-gray-900">Boshqaruv paneli</h2>
        <button
          onClick={() => {
            fetchDashboardStats();
            fetchUsers();
            fetchContactMessages();
            fetchServiceRequests();
          }}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Yangilash
        </button>
      </div>

      {loading.dashboard ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Foydalanuvchilar */}
            <button
              onClick={() => {
                setActiveTab('users');
                handleClick("/admin/users");
              }}
              className="bg-white overflow-hidden active:bg-gray-400 relative rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jami foydalanuvchilar</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats?.totalUsers || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span
                  className={`
                    absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[30px] h-[30px] rounded-full bg-gray-500 transition-all duration-700
                    ${isClicked ? "opacity-30 w-[calc(150px*5)] h-[calc(150px*5)]" : " opacity-0"}
                  `}
                />
              </div>
            </button>

            {/* 2. Xizmat so'rovlari */}
            <Link
              to={"/admin/services"}
              onClick={() => setActiveTab('services')}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Xizmat so'rovlari</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats?.totalDevices || 0}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Wrench className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Link>

            {/* 3. Aloqa xabarlari */}
            <Link
              to={"/admin/contacts"}
              onClick={() => setActiveTab('contacts')}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aloqa xabarlari</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats?.totalMessages || 0}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Link>

            {/* 4. Nasiyalar (Qarz summasi) */}
            <Link
              to={"/admin/services?payment=debt"}
              onClick={() => setActiveTab('services')}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-rose-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nasiyalar (Qarz summasi)</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">
                    {debtStats.totalDebtSum.toLocaleString('ru-RU')} <span className="text-xs font-normal text-gray-500">so‘m</span>
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    {debtStats.count} ta buyurtma
                  </p>
                </div>
                <div className="p-3 bg-rose-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-rose-600" />
                </div>
              </div>
            </Link>

            {/* 5. Muddati o'tgan qarzlar */}
            <Link
              to={"/admin/services?payment=overdue"}
              onClick={() => setActiveTab('services')}
              className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 ${debtStats.overdueCount > 0 ? 'border-amber-500' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Muddati o‘tgan qarzlar</p>
                  <p className={`text-2xl font-bold mt-1 ${debtStats.overdueCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                    {debtStats.overdueCount} <span className="text-xs font-normal text-gray-500">ta</span>
                  </p>
                  <p className={`text-xs font-medium mt-1 ${debtStats.overdueCount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                    {debtStats.overdueCount > 0 ? "To‘lov muddati kechikkan" : "Muddati o‘tganlar yo‘q"}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${debtStats.overdueCount > 0 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
            </Link>

            {/* 6. Reyting */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reyting</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats?.rating || 4.9}</p>
                  <p className="text-xs text-gray-400 mt-1">Mijozlar bahosi</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">So'nggi xizmat so'rovlari</h3>
                <Link
                  to="/admin/services"
                  onClick={() => setActiveTab('services')}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Barchasini ko'rish →
                </Link>
              </div>
              <div className="space-y-3">
                {(serviceRequests || []).slice(0, 4).map((request) => (
                  <Link
                    to={"/admin/services"}
                    onClick={() => setActiveTab('services')}
                    key={request._id}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{request.userName}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {request.deviceModel} <span className="text-gray-500 font-normal text-xs">({request.deviceType})</span>
                      </p>
                      <p className="text-xs text-gray-500">IMEI: {request.imei || "—"}</p>
                      <p className="text-xs text-gray-500">Telefon: {request.phone}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full bg-${request.status === 'completed' ? 'green' : 'yellow'}-100 text-${request.status === 'completed' ? 'green' : 'yellow'}-800`}>
                        {request.status}
                      </span>
                      {request.paymentStatus === 'debt' && (
                        <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-100 text-rose-700">
                          Nasiya: {Math.max(0, (Number(request.cost) || 0) - (Number(request.paidAmount) || 0)).toLocaleString('ru-RU')} so‘m
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">So'nggi xabarlar</h3>
                <Link
                  to="/admin/contacts"
                  onClick={() => setActiveTab('contacts')}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Barchasini ko'rish →
                </Link>
              </div>
              <div className="space-y-3">
                {(contactMessages || []).slice(0, 4).map((message) => (
                  <Link
                    to={"/admin/contacts"}
                    onClick={() => setActiveTab('contacts')}
                    key={message.id || message._id}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-start justify-between w-full">
                      <div>
                        <p className="font-medium text-gray-900">{message.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{message.message?.substring(0, 50)}...</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formatDate(message.createdAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MastersStatsTable />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardContent;
