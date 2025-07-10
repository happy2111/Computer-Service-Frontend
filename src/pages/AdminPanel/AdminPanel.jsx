import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import AddServiceModal from "../../components/AddServiceModal.jsx";
import UsersContent from './UsersContent.jsx';
import ServicesContent from './ServicesContent.jsx';
import DashboardContent from './DashboardContent';
import api from "../../api/simpleApi.js"
import {
  useNavigate,
  Outlet,
  useLocation,
  Routes,
  Route,
  Navigate,
  Links, Link
} from "react-router-dom";

import {
  Users,
  MessageSquare,
  Wrench,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  Eye,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Clock,
  Star,
  Menu,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Plus,
  User
} from 'lucide-react';
import Profile from '../Profile.jsx';
import NotFound from "../NotFound.jsx";
import {HashLink} from "react-router-hash-link";

// Конфигурация API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios instance для API запросов
const createApiInstance = () => {
  const instance = {
    get: async (url) => {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { data: await response.json() };
    },

    post: async (url, data) => {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { data: await response.json() };
    },

    put: async (url, data) => {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { data: await response.json() };
    },

    delete: async (url) => {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { data: await response.json() };
    }
  };

  return instance;
};

// const api = createApiInstance();

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Состояния для данных
  const [users, setUsers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    totalRequests: 0,
    rating: 0
  });

  // Состояния загрузки
  const [loading, setLoading] = useState({
    users: false,
    contacts: false,
    services: false,
    dashboard: false
  });

  const [notification, setNotification] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await api.get('/user');
      setUsers(response.data);
    } catch (error) {
      showNotification('Ошибка загрузки пользователей', 'error');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };


  const fetchContactMessages = async () => {
    try {
      setLoading(prev => ({ ...prev, contacts: true }));
      const response = await api.get('/contact');
      setContactMessages(response.data);
    } catch (error) {
      showNotification('Ошибка загрузки сообщений', 'error');
    } finally {
      setLoading(prev => ({ ...prev, contacts: false }));
    }
  };

  const fetchServiceRequests = async () => {
    try {
      setLoading(prev => ({ ...prev, services: true }));
      const response = await api.get('/services/all');
      setServiceRequests(response.data);
      // console.log(response.data) // Удалено для предотвращения утечки данных
    } catch (error) {
      showNotification('Ошибка загрузки заявок на сервис', 'error');
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(prev => ({ ...prev, dashboard: true }));
      const response = await api.get('/dashboard/stats');
      console.log("🧪 Response:", response); // ⬅️ проверь, что здесь
      
      setDashboardStats(response.data);
    } catch (error) {
      showNotification('Ошибка загрузки статистики', 'error');
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

  // CRUD операции
  const deleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      await api.delete(`/user/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      showNotification('Пользователь успешно удален');
    } catch (error) {
      showNotification('Ошибка удаления пользователя', 'error');
    }
  };

  const deleteContactMessage = async (messageId) => {
    if (!window.confirm('Вы уверены, что хотите удалить это сообщение?')) return;

    try {
      await api.delete(`/contact/${messageId}`);
      setContactMessages(contactMessages.filter(msg => msg.id !== messageId));
      showNotification('Сообщение успешно удален��');
    } catch (error) {
      showNotification('Ошибка удаления сообщения', 'error');
    }
  };

  const updateServiceRequestStatus = async (requestId, newStatus, userId) => {
    try {
      await api.put(`/services/${requestId}/status?userId=${userId}`, { status: newStatus });
      setServiceRequests(serviceRequests.map(req =>
        (req.id === requestId || req._id === requestId) ? { ...req, status: newStatus } : req
      ));
      showNotification('Статус заявки обновлен');
    } catch (error) {
      showNotification('Ошибка обновления статуса', 'error');
    }finally {
      console.log(newStatus)
    }
  };

  const deleteServiceRequest = async (requestId, userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) return;

    try {
      await api.delete(`/services/${requestId}?userId=${userId}`);
      setServiceRequests(serviceRequests.filter(req => req.id !== requestId));
      showNotification('Заявка успешно удалена');
    } catch (error) {
      showNotification('Ошибка удаления заявки', 'error');
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
    fetchContactMessages();
    fetchServiceRequests();
  }, []);

  useEffect(() => {
    setDashboardStats({
      totalUsers: users.length,
      totalMessages: contactMessages.length,
      totalRequests: serviceRequests.length,
      rating: 4.9
    });
  }, [users, contactMessages, serviceRequests]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 , href: '/admin/dashboard'},
    { id: 'users', label: 'Users', icon: Users , href: '/admin/users'},
    { id: 'contacts', label: 'Contact Messages', icon: MessageSquare, href: '/admin/contacts' },
    { id: 'services', label: 'Service Requests', icon: Wrench, href: '/admin/services' },
    { id: 'profile', label: 'Profile', icon: User , href: "/admin/profile"},
    { id: 'settings', label: 'Settings', icon: Settings, href: "/admin/settings" },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      admin: 'bg-green-100 text-green-800',
      personal: 'bg-yellow-100 text-yellow-800',
      unrepairable: "bg-red-100 text-red-800",

    };
    return colors[status] || 'bg-yellow-100 text-yellow-800';
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  const filteredServiceRequests = serviceRequests.filter(request => {
    const matchesSearch = request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.deviceModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.deviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.imei?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const NotificationComponent = () => {
    if (!notification) return null;

    const bgColor = notification.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
    const textColor = notification.type === 'error' ? 'text-red-800' : 'text-green-800';
    const Icon = notification.type === 'error' ? AlertCircle : CheckCircle;

    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${bgColor} ${textColor} flex items-center space-x-2 shadow-lg`}>
        <Icon className="h-5 w-5" />
        <span>{notification.message}</span>
        <button
          onClick={() => setNotification(null)}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );


  const ContactsContent = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Aloqa xabarlari</h2>
          <button
            onClick={fetchContactMessages}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Yangilash
          </button>
        </div>
      </div>

      {loading.contacts ? (
        <LoadingSpinner />
      ) : (
        <div className="p-6">
          <div className="space-y-4">
            {contactMessages.map((message) => (
              <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="sm:flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{message.name}</h3>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {message.email}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{message.message}</p>
                    <div className="sm:flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(message.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <span className="h-2 w-2 bg-green-400 rounded-full mr-1"></span>
                        Captcha:
                        <textarea
                          className="resize-x"
                          name=""
                          id=""
                          cols="15"
                          rows="1"
                          readOnly
                          value={message.captcha}
                        ></textarea>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteContactMessage(message._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  

  const SettingsContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm  p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Base URL
            </label>
            <input
              type="text"
              value={API_BASE_URL}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authentication Token
            </label>
            <input
              type="password"
              value={typeof localStorage !== 'undefined' ? localStorage.getItem('token') || '' : ''}
              placeholder="Enter your API token"
              onChange={(e) => {
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem('token', e.target.value);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              fetchDashboardStats();
              fetchUsers();
              fetchContactMessages();
              fetchServiceRequests();
              showNotification('Данные обновлены с новыми настройками API');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Test Connection & Refresh Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm  p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">API Connection</span>
            <span className="flex items-center text-sm text-green-600">
              <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Last Sync</span>
            <span className="text-sm text-gray-500">{new Date().toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Version</span>
            <span className="text-sm text-gray-500">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );



  // const renderContent = () => {
  //   switch (activeTab) {
  //     case 'dashboard':
  //       return <DashboardContent
  //         dashboardStats={dashboardStats}
  //         loading={loading}
  //         fetchDashboardStats={fetchDashboardStats}
  //         fetchUsers={fetchUsers}
  //         fetchContactMessages={fetchContactMessages}
  //         fetchServiceRequests={fetchServiceRequests}
  //         serviceRequests={serviceRequests}
  //         contactMessages={contactMessages}
  //         LoadingSpinner={LoadingSpinner}
  //         formatDate={formatDate}
  //       />;
  //     case 'users':
  //       return (
  //         <UsersContent
  //           filteredUsers={filteredUsers}
  //           searchTerm={searchTerm}
  //           setSearchTerm={setSearchTerm}
  //           statusFilter={statusFilter}
  //           setStatusFilter={setStatusFilter}
  //           loading={loading}
  //           fetchUsers={fetchUsers}
  //           deleteUser={deleteUser}
  //           formatDate={formatDate}
  //           getStatusBadge={getStatusBadge}
  //           LoadingSpinner={LoadingSpinner}
  //         />
  //       );
  //     case 'contacts':
  //       return <ContactsContent />;
  //     case 'services':
  //       return (
  //         <ServicesContent
  //           filteredServiceRequests={filteredServiceRequests}
  //           searchTerm={searchTerm}
  //           setSearchTerm={setSearchTerm}
  //           statusFilter={statusFilter}
  //           setStatusFilter={setStatusFilter}
  //           loading={loading}
  //           fetchServiceRequests={fetchServiceRequests}
  //           updateServiceRequestStatus={updateServiceRequestStatus}
  //           deleteServiceRequest={deleteServiceRequest}
  //           formatDate={formatDate}
  //           getStatusBadge={getStatusBadge}
  //           setShowAddServiceModal={setShowAddServiceModal}
  //           LoadingSpinner={LoadingSpinner}
  //         />
  //       );
  //     case 'profile':
  //       return <Profile />;
  //     case 'settings':
  //       return <SettingsContent />;
  //     default:
  //       return <DashboardContent />;
  //   }
  // };


  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <NotificationComponent />

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Apple Park</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <HashLink
                  to={item.href}
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setStatusFilter('all');
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </HashLink>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                {/*<button className="relative p-2 text-gray-400 hover:text-gray-600">*/}
                {/*  <Bell className="h-6 w-6" />*/}
                {/*  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>*/}
                {/*</button>*/}
                <Link
                  to={"/admin/profile"}

                  className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => {
                    setActiveTab('profile');
                  }}
                  title="Профиль"
                >
                  <span className="text-white font-medium text-sm">A</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/*{renderContent()}*/}
          <Routes>
            <Route path="" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardContent
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              dashboardStats={dashboardStats}
              loading={loading}
              fetchDashboardStats={fetchDashboardStats}
              fetchUsers={fetchUsers}
              fetchContactMessages={fetchContactMessages}
              fetchServiceRequests={fetchServiceRequests}
              serviceRequests={serviceRequests}
              contactMessages={contactMessages}
              LoadingSpinner={LoadingSpinner}
              formatDate={formatDate}
            />} />
            <Route path="services" element={<ServicesContent
              filteredServiceRequests={filteredServiceRequests}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              loading={loading}
              fetchServiceRequests={fetchServiceRequests}
              updateServiceRequestStatus={updateServiceRequestStatus}
              deleteServiceRequest={deleteServiceRequest}
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
              setShowAddServiceModal={setShowAddServiceModal}
              LoadingSpinner={LoadingSpinner}
            />} />

            <Route path="users" element={
              <UsersContent
                filteredUsers={filteredUsers}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                loading={loading}
                fetchUsers={fetchUsers}
                deleteUser={deleteUser}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                LoadingSpinner={LoadingSpinner}
              />
            } />
            <Route path="contacts" element={<ContactsContent />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<SettingsContent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>


          {/*<Outlet />*/}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {showAddServiceModal && (
        <AddServiceModal isOpen={showAddServiceModal} onClose={() => setShowAddServiceModal(false)} />
      )}
    </div>
  );
};

export default AdminPanel;

