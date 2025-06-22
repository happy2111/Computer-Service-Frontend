import React, { useState, useEffect } from "react";
import AddUserModal from "./AddUserModal";

export default function AddServiceModal({ isOpen, onClose, onAddUser }) {
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [userList, setUserList] = useState([]);
  const [form, setForm] = useState({
    deviceType: "",
    deviceModel: "",
    issueDescription: "",
    phone: "",
    additionalInfo: "",
    imei: "",
    cost: "",
    master: ""
  });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const dropdownRef = React.useRef(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      const data = await res.json();
      setUserList(data.map(u => ({ id: u._id, name: u.name })));
    } catch (e) {
      setUserList([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    fetchUsers();
  }, [isOpen]);

  useEffect(() => {
    if (!showDropdown) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUserSelect = (name) => {
    setUserName(name);
    const user = userList.find(u => u.name === name);
    setSelectedUserId(user ? user.id : "");
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      alert("Выберите пользователя из списка");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/services/add`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ userId: selectedUserId, ...form })
      });
      if (!res.ok) throw new Error("Ошибка при добавлении устройства");
      onClose();
    } catch (err) {
      alert("Ошибка при добавлении устройства: " + err.message);
    }
  };

  const handleUserCreated = (user) => {
    setShowAddUserModal(false);
    fetchUsers(); // обновить список пользователей после добавления
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="bg-white z-20 rounded-lg shadow-lg p-8 w-full max-w-lg">
        <div className="flex items-center mb-6">
          <div className="relative w-full">
            <input
              type="text"
              className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-3/4"
              placeholder="User Name"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              autoComplete="off"
            />
            {showDropdown && userList.length > 0 && (
              <ul ref={dropdownRef} className="absolute left-0 w-3/4 bg-white border border-blue-300 rounded-b shadow max-h-32 overflow-y-auto z-10">
                {userList
                  .filter((user) =>
                    user.name.toLowerCase().includes(userName.toLowerCase())
                  )
                  .map((user) => (
                    <li
                      key={user.id}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                      onClick={() => handleUserSelect(user.name)}
                    >
                      {user.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-r ml-0"
            onClick={() => setShowAddUserModal(true)}
            type="button"
          >
            Add User
          </button>
        </div>
        <form className="space-y-4" id="addSevice" onSubmit={handleSubmit}>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Device Type
            </label>
            <input
              type="text"
              name="deviceType"
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.deviceType}
              onChange={handleInputChange}
              placeholder="iPhone"
            />
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Device Model
            </label>
            <input
              type="text"
              name="deviceModel"
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.deviceModel}
              onChange={handleInputChange}
              placeholder="iPhone xs"
            />
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Issue Description
            </label>
            <input
              type="text"
              name="issueDescription"
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.issueDescription}
              onChange={handleInputChange}
              placeholder="Cracked screen"
            />
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.phone}
              onChange={handleInputChange}
              placeholder="+998 (99) 123-45-67"
            />
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Additional Info
            </label>
            <input
              type="text"
              name="additionalInfo"
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.additionalInfo}
              onChange={handleInputChange}
              placeholder="Something"
            />
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              IMEI
            </label>
            <input
              type="text"
              name="imei"
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.imei}
              onChange={handleInputChange}
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Cost
            </label>
            <input
              type="number"
              name="cost"
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.cost}
              onChange={handleInputChange}
              placeholder="900000"
            />
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Master
            </label>
            <input
              type="text"
              name="master"
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.master}
              onChange={handleInputChange}
              placeholder="Master Name"
            />
          </div>
        </form>
        <div className="flex justify-end space-x-2 mt-8">
          <button
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            type="submit"
            form="addSevice"
          >
            Add
          </button>
        </div>
      </div>
      <div className="absolute inset-0 z-10 bg-neutral-700/70" onClick={onClose}></div>
      {showAddUserModal && (
        <AddUserModal isOpen={showAddUserModal} onClose={() => setShowAddUserModal(false)} onUserCreated={handleUserCreated} />
      )}
    </div>
  );
}