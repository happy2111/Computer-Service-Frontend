import React, { useState } from 'react';
import { Search, RefreshCw, Trash2, Plus, Edit } from 'lucide-react';
import AddUserModal from "../../components/AddUserModal.jsx";
import EditUserModal from "../../components/EditUserModal.jsx";

const UsersContent = React.memo(({
  filteredUsers = [],
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  loading,
  fetchUsers,
  deleteUser,
  formatDate,
  getStatusBadge,
  LoadingSpinner
}) => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const getAvatar = (user) => {
    if (!user?.avatar || user.avatar.endsWith("empty-profile.jpg")) {
      return (user?.name?.charAt(0) || "U").toUpperCase();
    }
    return (
      <img
        src={`https://api.applepark.uz${user.avatar}`}
        alt=""
        className="w-6 h-6 rounded-full object-cover"
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm max-md:w-[calc(100vw-50px)] box-border">
      <div className="p-6 box-border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">
            Ro‘yxatdan o‘tgan foydalanuvchilar
          </h2>
          <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:scale-95 transition-all w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Qo‘shish
            </button>
            <div className="relative w-full md:w-56">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Foydalanuvchilarni qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto text-sm bg-white"
            >
              <option value="all">Hammasi (All)</option>
              <option value="admin">Admin</option>
              <option value="personal">Shaxsiy</option>
              <option value="client">Mijoz</option>
              <option value="master">Javobgar Shaxs</option>
            </select>
            <button
              onClick={() => fetchUsers()}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:scale-95 transition-all w-full md:w-auto"
              title="Yangilash"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yangilash
            </button>
          </div>
        </div>
      </div>

      {loading?.users ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foydalanuvchi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontakt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roli
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                    Foydalanuvchilar topilmadi
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">
                            {getAvatar(user)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          {user.position && (
                            <div className="text-xs text-gray-500">{user.position}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone || "—"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate ? formatDate(user.createdAt) : new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge ? getStatusBadge(user.role) : "bg-gray-100 text-gray-800"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg active:scale-95 transition-all"
                          title="Tahrirlash"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Tahrirlash</span>
                        </button>
                        <button
                          onClick={() => deleteUser(user._id || user.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 rounded-lg active:scale-95 transition-all"
                          title="O‘chirish"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>O‘chirish</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddUserModal && (
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onUserCreated={() => {
            if (fetchUsers) fetchUsers();
            setShowAddUserModal(false);
          }}
        />
      )}

      {editingUser && (
        <EditUserModal
          isOpen={Boolean(editingUser)}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={() => {
            if (fetchUsers) fetchUsers();
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
});

export default UsersContent;
