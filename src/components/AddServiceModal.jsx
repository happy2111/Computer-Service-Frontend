import React, {useState, useEffect} from "react";
import AddUserModal from "./AddUserModal";
import axios from "axios";
import AddMasterModal from "./AddMasterModal.jsx";

export default function AddServiceModal({isOpen, onClose, onAddUser}) {
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState(null)
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
    costOr: "",
    master: ""
  });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddMasterModal, setShowAddMasterModal] = useState(false)

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
      setUserList(data.map(u => ({id: u._id, name: u.name, phone: u.phone})));
    } catch (e) {
      setUserList([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMaster()
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
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleUserSelect = (name) => {
    setUserName(name);
    const user = userList.find(u => u.name === name);
    setSelectedUserId(user ? user.id : "");
    setUserPhone(user ? user.phone : "");
    setForm({...form, phone: user ? user.phone : ""}); // обновляем phone в форме
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
        body: JSON.stringify({userId: selectedUserId, ...form})
      });
      // console.log({userId: selectedUserId, ...form})
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


  const [masters, setMasters] = useState([])
  const fetchMaster = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/masters`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );
      if (response.statusText !== "OK") {
        throw new Error('Failed to fetch masters');
      }
      setMasters(response.data);
    } catch (error) {
      console.error('Error fetching masters:', error);
    }
  }

  const handleMasterCreated = () => {
    setShowAddMasterModal(false);
    fetchMaster(); // обновить список мастеров
  };

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="bg-white z-20 rounded-lg shadow-lg p-8 w-full max-w-lg">
        <div className="flex items-center mb-6 gap-3">
          <div className="relative w-full">
            <input
              type="text"
              className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
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
              <ul
                ref={dropdownRef}
                className="absolute left-0 w-3/4 bg-white border border-blue-300 rounded-b shadow max-h-32 overflow-y-auto z-10"
              >
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
            <p>
              {userPhone}
            </p>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-r ml-0"
            onClick={() => setShowAddUserModal(true)}
            type="button"
          >
            +
          </button>
        </div>
        <form
          className="space-y-4"
          id="addSevice"
          onSubmit={handleSubmit}
        >
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
            <div className={"flex gap-3.5 items-center"}>
              <input
                type="number"
                name="cost"
                className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.cost}
                onChange={handleInputChange}
                placeholder="sum"
              />
              yoki
              <input
                type="number"
                name="costOr"
                className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.costOr}
                onChange={handleInputChange}
                placeholder="sum"
              />
            </div>
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Master
            </label>
            <div className={"flex items-center gap-3"}>
              <select
                className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                name="master"
                id="master"
                onChange={handleInputChange}
              >
                <option
                  disabled
                  selected
                  hidden
                  className={"text-gray-500"}
                >Select Master
                </option>
                {masters.map((master, index) => (
                  <option
                    key={index}
                    value={master.name}
                  >
                    {master.name}
                  </option>
                ))}
              </select>
              <button
                type={"button"}
                onClick={() => setShowAddMasterModal(true)}
                className={
                  "bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-r ml-0"
                }
              >
                +
              </button>
            </div>
            {/*<input*/}
            {/*  type="text"*/}
            {/*  name="master"*/}
            {/*  className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"*/}
            {/*  value={form.master}*/}
            {/*  onChange={handleInputChange}*/}
            {/*  placeholder="Master Name"*/}
            {/*/>*/}
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
      <div
        className="absolute inset-0 z-10 bg-neutral-700/70"
        onClick={onClose}
      ></div>
      {showAddUserModal && (
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onUserCreated={handleUserCreated}
        />
      )}

      {showAddMasterModal && (
        <AddMasterModal
          isOpen={showAddMasterModal}
          onClose={() => setShowAddMasterModal(false)}
          onMasterCreated={handleMasterCreated}
        />
      )}
    </div>
  );
}