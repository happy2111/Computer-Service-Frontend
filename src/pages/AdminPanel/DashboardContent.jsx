import {RefreshCw, Users, MessageSquare, Wrench, Star} from 'lucide-react';
import MastersStatsTable from "../../components/MastersStatsTable";
import {Link, useNavigate} from "react-router-dom";
import {useState} from 'react';

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
    }, 100)
  }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => {
                setActiveTab('users');
                handleClick("/admin/users")
              }}
              className="bg-white overflow-hidden active:bg-gray-400 relative rounded-lg shadow-sm p-6"
            >
              <div
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-600">Jami foydalanuvchilar</p>
                  <p className="text-2xl font-bold text-left text-gray-900">{dashboardStats.totalUsers}</p>
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
            <Link
              to={"/admin/contacts"}
              onClick={() => setActiveTab('contacts')}
              className="bg-white active:gray-500 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aloqa xabarlari</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalMessages}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Link>
            <Link
              to={"/admin/services"}
              onClick={() => setActiveTab('services')}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Xizmat so'rovlari</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalDevices}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Wrench className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Link>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reyting</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.rating}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">So'nggi xizmat so'rovlari</h3>
              <div className="space-y-3">
                {serviceRequests.slice(0, 3).map((request) => (
                  <Link
                    to={"/admin/services"}
                    onClick={() => setActiveTab('services')}
                    key={request._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{request.userName}</p>
                      <p className="text-sm text-gray-600">{request.deviceType} {request.deviceModel}</p>
                      <p className="text-xs text-gray-500">IMEI: {request.imei}</p>
                      <p className="text-xs text-gray-500">Телефон: {request.phone}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${request.status === 'completed' ? 'green' : 'yellow'}-100 text-${request.status === 'completed' ? 'green' : 'yellow'}-800`}>
                      {request.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">So'nggi xabarlar</h3>
              <div className="space-y-3">
                {contactMessages.slice(0, 3).map((message) => (
                  <Link
                    to={"/admin/contacts"}
                    onClick={() => setActiveTab('contacts')}
                    key={message.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{message.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{message.message.substring(0, 50)}...</p>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
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