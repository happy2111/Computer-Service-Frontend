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
    <div className="bg-white rounded-xl shadow-xs sm:shadow-sm">
      {/* Header, Search, Filter, Controls */}
      <div className="p-3 sm:p-6 border-b border-gray-100 sm:border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Title and Mobile Refresh Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Ro‘yxatdan o‘tgan foydalanuvchilar
            </h2>
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={fetchUsers}
                title="Yangilash"
                className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95 transition"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Control elements: Search, Filter, Desktop Refresh & Add */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-2.5 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Foydalanuvchilarni qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-xs sm:text-sm"
              />
            </div>

            {/* Role Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm font-medium bg-white text-gray-700 w-full md:w-auto truncate"
            >
              <option value="all">Roli: Barchasi</option>
              <option value="admin">Admin</option>
              <option value="personal">Shaxsiy</option>
              <option value="client">Mijoz</option>
              <option value="master">Javobgar Shaxs</option>
            </select>

            {/* Desktop Refresh button */}
            <button
              onClick={fetchUsers}
              title="Ro'yxatni yangilash"
              className="hidden md:inline-flex items-center justify-center p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95 transition"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Desktop Add User button */}
            <button
              onClick={() => setShowAddUserModal(true)}
              className="hidden md:inline-flex items-center px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Qo‘shish
            </button>
          </div>
        </div>
      </div>

      {loading?.users ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
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
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                            title="Tahrirlash"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id || user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                            title="O‘chirish"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View (No horizontal scroll) */}
          <div className="block md:hidden divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Foydalanuvchilar topilmadi
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id || user.id}
                  className="p-4 space-y-3 hover:bg-gray-50/60 transition-colors"
                >
                  {/* Avatar, Name, Position, Date & Role */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">
                          {getAvatar(user)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-gray-900 truncate">
                          {user.name}
                        </div>
                        {user.position && (
                          <div className="text-xs text-gray-500 truncate">
                            {user.position}
                          </div>
                        )}
                        <div className="text-[11px] text-gray-400">
                          {formatDate ? formatDate(user.createdAt) : new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full shrink-0 ${getStatusBadge ? getStatusBadge(user.role) : "bg-gray-100 text-gray-800"}`}
                    >
                      {user.role}
                    </span>
                  </div>

                  {/* Contact details */}
                  <div className="bg-gray-50/80 rounded-xl p-2.5 text-xs space-y-1.5 text-gray-700 border border-gray-100">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-400 shrink-0">Email:</span>
                      <span className="font-medium text-gray-900 truncate">{user.email || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-400 shrink-0">Telefon:</span>
                      <span className="font-medium text-gray-900">{user.phone || "—"}</span>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-0.5">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 active:scale-95 rounded-lg transition-all"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Tahrirlash</span>
                    </button>
                    <button
                      onClick={() => deleteUser(user._id || user.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 active:scale-95 rounded-lg transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>O‘chirish</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Modals */}
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

      {/* Fixed '+' button bottom-left for mobile (as in Services) */}
      <button
        type="button"
        onClick={() => setShowAddUserModal(true)}
        title="Foydalanuvchi qo'shish"
        className="md:hidden fixed bottom-6 left-6 z-40 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all group hover:ring-4 hover:ring-blue-300/50"
      >
        <Plus className="w-7 h-7 transition-transform group-hover:rotate-90 duration-200" />
      </button>
    </div>
  );
});

export default UsersContent;
