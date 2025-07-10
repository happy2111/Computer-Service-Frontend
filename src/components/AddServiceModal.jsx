import React, {useState, useEffect, useRef} from "react";
import AddUserModal from "./AddUserModal";
import AddMasterModal from "./AddMasterModal.jsx";
import {X} from "lucide-react";
import api from "../api/simpleApi.js";

// Массив типов сервисов
const serviceTypes = [
  {id: "iphone-repair", title: "iPhone ta'mirlash"},
  {id: "ipad-repair", title: "iPad ta'mirlash"},
  {id: "macbook-repair", title: "MacBook ta'mirlash"},
  {id: "apple-watch-repair", title: "Apple Watch ta'mirlash"},
  {id: "imac-repair", title: "iMac ta'mirlash"},
  {id: "icloud-unlock", title: "iCloud blokdan chiqarish"},
  {id: "apple-diagnostic", title: "Apple diagnostikasi"},
  {id: "data-recovery", title: "Ma'lumotlarni tiklash"},
  {id: "other", title: "Boshqa"},
];

const appleDeviceModels = [
  "iPhone", "iPhone 3G", "iPhone 3GS",
  "iPhone 4", "iPhone 4s",
  "iPhone 5", "iPhone 5c", "iPhone 5s",
  "iPhone 6", "iPhone 6 Plus", "iPhone 6s", "iPhone 6s Plus",
  "iPhone SE (1st gen)", "iPhone 7", "iPhone 7 Plus",
  "iPhone 8", "iPhone 8 Plus", "iPhone X",
  "iPhone XR", "iPhone XS", "iPhone XS Max",
  "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
  "iPhone SE (2nd gen)", "iPhone 12", "iPhone 12 mini", "iPhone 12 Pro", "iPhone 12 Pro Max",
  "iPhone 13", "iPhone 13 mini", "iPhone 13 Pro", "iPhone 13 Pro Max",
  "iPhone SE (3rd gen)", "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
  "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",

  "iPad (1st gen)", "iPad (2nd gen)", "iPad (3rd gen)", "iPad (4th gen)", "iPad (5th gen)",
  "iPad (6th gen)", "iPad (7th gen)", "iPad (8th gen)", "iPad (9th gen)", "iPad (10th gen)",
  "iPad mini (1st gen)", "iPad mini 2", "iPad mini 3", "iPad mini 4", "iPad mini (5th gen)", "iPad mini (6th gen)",
  "iPad Air", "iPad Air 2", "iPad Air (3rd gen)", "iPad Air (4th gen)", "iPad Air (5th gen)",
  "iPad Pro 9.7-inch", "iPad Pro 10.5-inch",
  "iPad Pro 11-inch (1st gen)", "iPad Pro 11-inch (2nd gen)", "iPad Pro 11-inch (3rd gen)", "iPad Pro 11-inch (4th gen)",
  "iPad Pro 12.9-inch (1st gen)", "iPad Pro 12.9-inch (2nd gen)", "iPad Pro 12.9-inch (3rd gen)",
  "iPad Pro 12.9-inch (4th gen)", "iPad Pro 12.9-inch (5th gen)", "iPad Pro 12.9-inch (6th gen)",

  "MacBook (2006)", "MacBook (2007)", "MacBook (2008)", "MacBook (2009)", "MacBook (2010)",
  "MacBook Retina 12-inch (2015)", "MacBook Retina 12-inch (2016)", "MacBook Retina 12-inch (2017)",
  "MacBook Air (Intel)", "MacBook Air M1", "MacBook Air M2", "MacBook Air M3",
  "MacBook Pro 13-inch (Intel)", "MacBook Pro 13-inch M1", "MacBook Pro 13-inch M2",
  "MacBook Pro 14-inch M1 Pro", "MacBook Pro 14-inch M2 Pro", "MacBook Pro 14-inch M3 Pro/Max",
  "MacBook Pro 15-inch", "MacBook Pro 16-inch (Intel)", "MacBook Pro 16-inch M1 Max", "MacBook Pro 16-inch M2 Max", "MacBook Pro 16-inch M3 Max",

  "iMac (Intel)", "iMac Retina", "iMac M1", "iMac M3", "iMac Pro",

  "Mac mini (Intel)", "Mac mini M1", "Mac mini M2",
  "Mac Studio M1 Max", "Mac Studio M1 Ultra", "Mac Studio M2 Max", "Mac Studio M2 Ultra",
  "Mac Pro (Tower)", "Mac Pro 2019", "Mac Pro M2 Ultra",

  "Apple Watch (1st gen)", "Apple Watch Series 1", "Apple Watch Series 2", "Apple Watch Series 3",
  "Apple Watch Series 4", "Apple Watch Series 5", "Apple Watch Series 6", "Apple Watch Series 7",
  "Apple Watch Series 8", "Apple Watch Series 9", "Apple Watch SE (1st gen)", "Apple Watch SE (2nd gen)",
  "Apple Watch Ultra", "Apple Watch Ultra 2",

  "AirPods (1st gen)", "AirPods (2nd gen)", "AirPods (3rd gen)",
  "AirPods Pro (1st gen)", "AirPods Pro (2nd gen)", "AirPods Max",

  "Apple TV HD", "Apple TV 4K (1st gen)", "Apple TV 4K (2nd gen)", "Apple TV 4K (3rd gen)",
  "HomePod", "HomePod mini"
];


export default function AddServiceModal({isOpen, onClose}) {
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
    costFormatted: "", // строка с пробелами для input
    cost: 0,
    constOrFormatted: "",
    costOr: 0,
    master: "",
  });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddMasterModal, setShowAddMasterModal] = useState(false)

  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [filteredModels, setFilteredModels] = useState([]);
  const modelInputRef = useRef(null);


  const dropdownRef = React.useRef(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/user`);
      const data = await res.data;
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

  async function subscribeToNotifications() {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker не поддерживается в этом браузере');
      }

      if (!('Notification' in window)) {
        throw new Error('Push-уведомления не поддерживаются в этом браузере');
      }

      const registration = await navigator.serviceWorker.register('/service-worker.js');

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Разрешение на уведомления не получено');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BHJiZv8rZPX1YNJruUZatuGdsTtF3Pu-xLi-jzqoZvLesfl9f8LZPjzCPyttUZB48J2o0ztuydHpJ4pXaW2TyCc'
      });

      const response = await api.post(`/push/subscribe`, JSON.stringify(subscription));
      if (!response.ok) {
        throw new Error('Ошибка при подписке на push-уведомления');
      }
      console.log('Успешная подписка на push-уведомления');
    } catch (error) {
      console.error('Ошибка при подписке на уведомления:', error);
      throw error; // Пробрасываем ошибку дальше для обработки в handleSubmit
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      alert("Foydalanuvchini ro'yxatdan tanlang");
      return;
    }
    try {
      const { costFormatted, constOrFormatted, ...formDataToSend } = form;
      const res = await api.post(
        `/services/add`, {userId: selectedUserId, ...formDataToSend}
      );
      onClose();

    } catch (err) {
      alert("Qurilmani qo'shishda xatolik yuz berdi: " + err.message);
    }
  };


  const handleUserCreated = () => {
    setShowAddUserModal(false);

    fetchUsers(); // обновить список пользователей после добавления
  };


  const [masters, setMasters] = useState([])
  const fetchMaster = async () => {
    try {
      const response = await api.get(`/dashboard/masters`,);
      setMasters(response.data);
    } catch (error) {
      console.error('Error fetching masters:', error);
    }
  }

  const handleMasterCreated = () => {
    setShowAddMasterModal(false);
    fetchMaster();
  };


  const filterModels = (input) => {
    if (!input) {
      setFilteredModels(appleDeviceModels);
      return;
    }
    const filtered = appleDeviceModels.filter(model =>
      model.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredModels(filtered);
  };

// Обновляем handleInputChange для поля модели
  const handleModelInputChange = (e) => {
    const value = e.target.value;
    setForm({...form, deviceModel: value});
    filterModels(value);
  };

// Обработчик выбора модели из списка
  const handleModelSelect = (model) => {
    setForm({...form, deviceModel: model});
    setShowModelDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modelInputRef.current && !modelInputRef.current.contains(event.target)) {
        setShowModelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 py-3">
      <div
        className="bg-white z-20 rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{boxSizing: "border-box"}}
      >
        <button
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold p-2 my-3 rounded"
          onClick={onClose}
          type="button"
        >
          <X className="w-5 h-5 " />
        </button>
        <p className={"text-sm font-bold text-blue-600"}>
          {userPhone}
        </p>
        <div className="flex items-center mb-6 gap-3">
          <div className="relative w-full">
            <input
              type="text"
              className="border border-blue-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="Foydalanuvchi ismi"
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
                className="absolute left-0 w-3/4 bg-white border border-blue-300 rounded-b shadow max-h-96 overflow-y-auto z-10"
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
              Xizmat turi
            </label>
            <select
              required
              name="deviceType"
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.deviceType}
              onChange={handleInputChange}
            >
              <option
                className={"text-gray-600 opacity-50"}
                value=""
                disabled
                hidden
              >Xizmat turini tanlang
              </option>
              {serviceTypes.map((type) => (
                <option
                  key={type.id}
                  value={type.title}
                >{type.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Qurilma modeli
            </label>
            <div className="relative" ref={modelInputRef}>
              <input
                type="text"
                name="deviceModel"
                className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.deviceModel}
                onChange={handleModelInputChange}
                onFocus={() => {
                  setShowModelDropdown(true);
                  filterModels(form.deviceModel);
                }}
                placeholder="iPhone xs"
              />
              {showModelDropdown && (
                <ul className="absolute left-0 w-full bg-white border border-blue-300 rounded-b shadow max-h-96 overflow-y-auto z-10">
                  {filteredModels.map((model, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                      onClick={() => handleModelSelect(model)}
                    >
                      {model}
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Muammo tavsifi
            </label>
            <input
              required
              type="text"
              name="issueDescription"
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.issueDescription}
              onChange={handleInputChange}
              placeholder="Ekran singan"
            />
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Telefon raqami
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
              Qo'shimcha ma'lumot
            </label>
            <input
              type="text"
              name="additionalInfo"
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.additionalInfo}
              onChange={handleInputChange}
              placeholder="Qo'shimcha ma'lumot"
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
              placeholder="IMEI"
            />
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Narxi
            </label>
            <div className={"flex gap-3.5 items-center"}>
              <input
                type="text"
                name="cost"
                className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.costFormatted}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                  const numeric = parseInt(raw || "0", 10);
                  setForm({
                    ...form,
                    cost: numeric,
                    costFormatted: formatted,
                  });
                 }
                }
                placeholder="so'm"
              />
              yoki
              <input
                type="text"
                name="costOr"
                className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.constOrFormatted}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                  const numeric = parseInt(raw || "0", 10);

                  setForm({
                    ...form,
                    constOrFormatted: formatted,
                    costOr: numeric,
                  })
                }
                }
                placeholder="so'm"
              />
            </div>
          </div>
          <div>
            <label className="block text-neutral-900 text-sm font-bold mb-1">
              Javobgar Shaxs
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
                >Ustani tanlang
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
          </div>
        </form>
        <div className="flex justify-end space-x-2 mt-8">
          <button
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded"
            onClick={onClose}
            type="button"
          >
            Yopish
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            type="submit"
            form="addSevice"
          >
            Qo'shish
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