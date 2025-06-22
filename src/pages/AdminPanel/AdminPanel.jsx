import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AddServiceModal from "../../components/AddServiceModal.jsx";

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
  Plus
} from 'lucide-react';

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

const api = createApiInstance();

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

  // Состояние уведомлений
  const [notification, setNotification] = useState(null);

  // Поисковые и фильтр состояния
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  // Показать уведомление
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // API функции
  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await api.get('/user');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Ошибка загрузки пользователей', 'error');
      // Fallback data for demo
      // setUsers([
      //   { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', joinedAt: '2024-01-15', status: 'active' },
      //   { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', joinedAt: '2024-01-20', status: 'active' },
      //   { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1234567892', joinedAt: '2024-01-25', status: 'inactive' },
      // ]);
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
      console.error('Error fetching contact messages:', error);
      showNotification('Ошибка загрузки сообщений', 'error');
      // Fallback data for demo
      setContactMessages([
        {
          id: 1,
          name: 'Alice Brown',
          email: 'alice@example.com',
          message: 'I need help with my iPhone repair service. When will it be ready?',
          createdAt: '2024-06-08T10:30:00Z',
          captcha: 'verified'
        },
        {
          id: 2,
          name: 'Bob Wilson',
          email: 'bob@example.com',
          message: 'What are your rates for laptop screen replacement?',
          createdAt: '2024-06-08T14:20:00Z',
          captcha: 'verified'
        },
      ]);
    } finally {
      setLoading(prev => ({ ...prev, contacts: false }));
    }
  };

  const fetchServiceRequests = async () => {
    try {
      setLoading(prev => ({ ...prev, services: true }));
      const response = await api.get('/services/all');
      setServiceRequests(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching service requests:', error);
      showNotification('Ошибка загрузки заявок на сервис', 'error');
      // Fallback data for demo
      // setServiceRequests([
      //   {
      //     id: 1,
      //     serviceType: 'Phone Repair',
      //     deviceType: 'iPhone',
      //     deviceModel: 'iPhone 14 Pro',
      //     issueDescription: 'Screen cracked after dropping',
      //     name: 'David Lee',
      //     email: 'david@example.com',
      //     phone: '+1234567893',
      //     preferredDate: '2024-06-10T09:00:00Z',
      //     additionalInfo: 'Urgent repair needed',
      //     createdAt: '2024-06-08T16:45:00Z',
      //     status: 'pending'
      //   },
      //   {
      //     id: 2,
      //     serviceType: 'Computer Repair',
      //     deviceType: 'Laptop',
      //     deviceModel: 'MacBook Pro 2023',
      //     issueDescription: 'Won\'t turn on, possible battery issue',
      //     name: 'Sarah Connor',
      //     email: 'sarah@example.com',
      //     phone: '+1234567894',
      //     preferredDate: '2024-06-12T14:00:00Z',
      //     additionalInfo: 'Data recovery also needed',
      //     createdAt: '2024-06-08T11:20:00Z',
      //     status: 'in-progress'
      //   },
      // ]);
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(prev => ({ ...prev, dashboard: true }));
      const response = await api.get('/dashboard/stats');
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      showNotification('Ошибка загрузки статистики', 'error');
      // Fallback data for demo
      // setDashboardStats({
      //   totalUsers: users.length,
      //   totalMessages: contactMessages.length,
      //   totalRequests: serviceRequests.length,
      //   rating: 4.9
      // });
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
      console.error('Error deleting user:', error);
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
      console.error('Error deleting message:', error);
      showNotification('Ошибка удаления сообщения', 'error');
    }
  };

  const updateServiceRequestStatus = async (requestId, newStatus) => {
    try {
      await api.put(`/services/${requestId}/status`, { status: newStatus });
      setServiceRequests(serviceRequests.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
      showNotification('Статус заявки обновлен');
    } catch (error) {
      console.error('Error updating service request status:', error);
      showNotification('Ошибка обновления статуса', 'error');
    }finally {
      console.log(newStatus)
    }
  };

  const deleteServiceRequest = async (requestId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) return;

    try {
      await api.delete(`/services/${requestId}`);
      setServiceRequests(serviceRequests.filter(req => req.id !== requestId));
      showNotification('Заявка успешно удалена');
    } catch (error) {
      console.error('Error deleting service request:', error);
      showNotification('Ошибка удаления заявки', 'error');
    }
  };

  // Загрузка данных при инициализации
  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
    fetchContactMessages();
    fetchServiceRequests();
  }, []);

  // Обновление статистики при изменении данных
  useEffect(() => {
    setDashboardStats({
      totalUsers: users.length,
      totalMessages: contactMessages.length,
      totalRequests: serviceRequests.length,
      rating: 4.9
    });
  }, [users, contactMessages, serviceRequests]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'contacts', label: 'Contact Messages', icon: MessageSquare },
    { id: 'services', label: 'Service Requests', icon: Wrench },
    { id: 'settings', label: 'Settings', icon: Settings },
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


    };
    return colors[status] || 'bg-yellow-100 text-yellow-800';
  };

  // Фильтрация данных
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Фильтрация заявок с учётом новых полей
  const filteredServiceRequests = serviceRequests.filter(request => {
    const matchesSearch = request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.deviceModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.deviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.imei?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Компонент уведомлений
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

  // Компонент загрузки
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
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
          Обновить
        </button>
      </div>

      {loading.dashboard ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contact Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalMessages}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Service Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalRequests}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Wrench className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.rating}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Service Requests</h3>
              <div className="space-y-3">
                {serviceRequests.slice(0, 3).map((request) => (
                  <div key={request._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{request.userName}</p>
                      <p className="text-sm text-gray-600">{request.deviceType} {request.deviceModel}</p>
                      <p className="text-xs text-gray-500">IMEI: {request.imei}</p>
                      <p className="text-xs text-gray-500">Телефон: {request.phone}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
              <div className="space-y-3">
                {contactMessages.slice(0, 3).map((message) => (
                  <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{message.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{message.message.substring(0, 50)}...</p>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const UsersContent = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Registered Users</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={fetchUsers}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Обновить
            </button>
          </div>
        </div>
      </div>

      {loading.users ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">{user.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.joinedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      {/*<button className="text-blue-600 hover:text-blue-900">*/}
                      {/*  <Eye className="h-4 w-4" />*/}
                      {/*</button>*/}
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const ContactsContent = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Contact Messages</h2>
          <button
            onClick={fetchContactMessages}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить
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
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{message.name}</h3>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {message.email}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{message.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                          cols="30"
                          rows="1"
                          readonly
                          value={message.captcha}
                        ></textarea>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/*<button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">*/}
                    {/*  <Eye className="h-4 w-4" />*/}
                    {/*</button>*/}
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

  const ServicesContent = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Service Requests</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button
              onClick={fetchServiceRequests}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Обновить
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
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{request.deviceType} {request.deviceModel}</h3>
                    <p className="text-blue-600 font-medium">Клиент: {request.userName}</p>
                    <p className="text-gray-600 text-sm">Проблема: {request.issueDescription}</p>
                    <p className="text-gray-600 text-sm">Телефон: {request.phone}</p>
                    <p className="text-gray-600 text-sm">IMEI: {request.imei}</p>
                    <p className="text-gray-600 text-sm">Доп. информация: {request.additionalInfo}</p>
                    <p className="text-gray-600 text-sm">Мастер: {request.master}</p>
                    <p className="text-gray-600 text-sm">Стоимость: {request.cost} сум</p>
                    <p className="text-gray-600 text-sm">Статус: {request.status}</p>
                    {/*<p className="text-gray-600 text-sm">Создано: {formatDate(request.createdAt)}</p>*/}
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={request.status}
                      onChange={e => updateServiceRequestStatus(request._id, e.target.value)}
                      className={`px-3 py-1 text-sm font-medium rounded-full border-0 ${getStatusBadge(request.status)}`}
                    >
                      <option value="pending">В ожидании</option>
                      <option value="in-progress">В работе</option>
                      <option value="completed">Завершено</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    {/*<div className="flex items-center space-x-2">*/}
                    {/*  <Users className="h-4 w-4 text-gray-400" />*/}
                    {/*  <span className="text-sm text-gray-600">Customer:</span>*/}
                    {/*  <span className="text-sm font-medium text-gray-900">{request.name}</span>*/}
                    {/*</div>*/}
                    {/*<div className="flex items-center space-x-2">*/}
                    {/*  <Mail className="h-4 w-4 text-gray-400" />*/}
                    {/*  <span className="text-sm text-gray-600">Email:</span>*/}
                    {/*  <span className="text-sm font-medium text-gray-900">{request.email}</span>*/}
                    {/*</div>*/}
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="text-sm font-medium text-gray-900">{request.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {/*<div className="flex items-center space-x-2">*/}
                    {/*  <Calendar className="h-4 w-4 text-gray-400" />*/}
                    {/*  <span className="text-sm text-gray-600">Preferred Date:</span>*/}
                    {/*  <span className="text-sm font-medium text-gray-900">{formatDate(request.preferredDate)}</span>*/}
                    {/*</div>*/}
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm font-medium text-gray-900">{formatDate(request.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/*<div className="mb-4">*/}
                {/*  <h4 className="text-sm font-medium text-gray-700 mb-1">Issue Description:</h4>*/}
                {/*  <p className="text-gray-600 text-sm">{request.issueDescription}</p>*/}
                {/*</div>*/}

                {/*{request.additionalInfo && (*/}
                {/*  <div className="mb-4">*/}
                {/*    <h4 className="text-sm font-medium text-gray-700 mb-1">Additional Information:</h4>*/}
                {/*    <p className="text-gray-600 text-sm">{request.additionalInfo}</p>*/}
                {/*  </div>*/}
                {/*)}*/}

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      const newStatus = request.status === 'pending' ? 'in-progress' :
                        request.status === 'in-progress' ? 'completed' : 'pending';
                      updateServiceRequestStatus(request._id, newStatus);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => window.open(`tel:${request.phone}`)}

                    // onClick={() => window.open(`mailto:${request.email}?subject=Service Request Update&body=Hello ${request.name},%0D%0A%0D%0ARegarding your ${request.serviceType} request...`)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                  >
                    Contact Customer
                  </button>
                  <button
                    onClick={() => deleteServiceRequest(request._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
      <div className="bg-white rounded-lg shadow-sm border p-6">
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

      <div className="bg-white rounded-lg shadow-sm border p-6">
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'users':
        return <UsersContent />;
      case 'contacts':
        return <ContactsContent />;
      case 'services':
        return <ServicesContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

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
            <span className="text-xl font-bold text-gray-900">ServiceHY</span>
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
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSearchTerm('');
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
                </button>
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
                <button className="relative p-2 text-gray-400 hover:text-gray-600">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
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

