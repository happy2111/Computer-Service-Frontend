"use client";

import {useState, useRef, useEffect} from "react";
import {useForm} from "react-hook-form";
import {
  User,
  Mail,
  Camera,
  CheckCircle,
  AlertCircle,
  Save,
  Upload,
  X,
  Info,
  Hammer,
  Phone
} from "lucide-react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Helmet} from "react-helmet";

export default function Profile() {
  // State for avatar
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const [userData, setUser] = useState(null);
  const [profileStatus, setProfileStatus] = useState("idle");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/login");
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status >= 200 && res.status < 300) {
          setUser(res.data);
          setAvatar(res.data.avatar || "");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // // Проверка прав доступа
  // if (!loading && userData && userData.role !== 'admin') {
  //   return (
  //     <div className="flex items-center justify-center min-h-[40vh]">
  //       <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg text-lg font-semibold">Нет доступа</div>
  //     </div>
  //   );
  // }

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: {errors: profileErrors, isSubmitting: isSubmittingProfile},
    reset,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (userData) {
      reset({name: userData.name || ""});
    }
  }, [userData, reset]);

  // Handle profile form submission
  const onSubmitProfile = async (data) => {
    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth/login");

      // Create FormData object to handle file upload
      const formData = new FormData();
      formData.append("name", data.name);

      // Only append avatar if a new file was selected
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      // Update user data with the response
      if (res.data) {
        setUser(res.data);
        // Update avatar if it was changed
        if (res.data.avatar) {
          setAvatar(res.data.avatar);
        }
      }

      setProfileStatus("success");
      setTimeout(() => setProfileStatus("idle"), 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      setProfileStatus("error");
      setErrorMessage(
        error.response?.data?.msg ||
        "Failed to update profile. Please try again."
      );
    } finally {
      setIsUploading(false);
      // Reset avatar file state after submission
      setAvatarFile(null);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
      setErrorMessage("Please select a valid image file (JPEG, PNG, GIF)");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size should be less than 5MB");
      return;
    }

    setAvatarFile(file);
    setErrorMessage("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setAvatar(reader.result); // Set preview as current avatar
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle avatar removal
  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth/login");
      // Отправляем запрос на обновление профиля с флагом removeAvatar
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/profile`,
        { removeAvatar: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data) {
        setUser(res.data);
        console.log(res.data.avatar)
        setAvatar(res.data.avatar || "/public/empty-profile.jpg");
      } else {
        setAvatar("/public/empty-profile.jpg");
      }
      setAvatarFile(null);
      setAvatarPreview(null);
      setProfileStatus("success");
      setTimeout(() => setProfileStatus("idle"), 3000);
    } catch (error) {
      setProfileStatus("error");
      setErrorMessage(
        error.response?.data?.msg ||
        "Avatarni o'chirishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Get the correct avatar display URL
  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (avatar) {
      // If avatar is a full URL, use it directly
      if (avatar.startsWith("http")) return avatar;
      // If avatar is a server path, prepend the API base URL
      if (avatar.startsWith("/uploads") || avatar.startsWith("/public")) {
        return `https://api.applepark.uz${avatar}`;
      }
      return avatar;
    }
    return "https://api.applepark.uz/public/empty-profile.jpg";
  };

  if (loading) {
    return (
      <div className=" flex min-h-screen items-center justify-center bg-white">
        <Helmet>
          <title>Apple Park - Profil</title>
        </Helmet>
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-gray-600 text-lg">Profil yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white max-sm:pt-9  ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-20">
          {/* Page Header */}
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Profilingiz
            </h1>
            <p className="text-lg text-gray-600">
              Hisob sozlamalaringizni boshqaring va shaxsiy ma'lumotlaringizni o'zgartiring.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Avatar Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Profil rasmi
              </h2>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden bg-gray-200">
                    {isUploading ? (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    ) : (
                      <img
                        src={getAvatarUrl() || "https://api.applepark.uz/public/empty-profile.jpg"}
                        alt="Profil rasmi"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Profil rasmini o'zgartirish"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Profil rasmini o'zgartirish
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Yangi avatar yuklang. Tavsiya etilgan o'lcham: 400x400px.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Yuklash
                    </button>
                    {avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <X className="h-4 w-4 mr-2" />
                        O'chirish
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                    aria-label="Profil rasmini yuklash"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
              <div className="flex flex-wrap justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Shaxsiy ma'lumotlar
                </h2>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  Faqat ismni tahrirlash mumkin
                </div>
              </div>

              {profileStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Profil ma'lumotlaringiz muvaffaqiyatli yangilandi.
                    </p>
                  </div>
                </div>
              )}

              {profileStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {errorMessage ||
                        "Profilni yangilashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."}
                    </p>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmitProfile(onSubmitProfile)}
                className="space-y-5"
              >
                {/* Name Field - Editable */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    To'liq ism
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      placeholder="Ismingiz"
                      className={`w-full rounded-md border px-3 py-2 pl-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        profileErrors.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                      {...registerProfile("name", {
                        required: "Ism majburiy",
                        minLength: {
                          value: 2,
                          message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak",
                        },
                      })}
                    />
                  </div>
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {profileErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field - Disabled */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-500 mb-1"
                  >
                    Telefon raqam
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      id="phone"
                      type="phone"
                      value={userData?.phone || ""}
                      disabled
                      className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pl-10 text-sm text-gray-500 shadow-sm cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Telefon raqamni hozircha o'zgartirib bo'lmaydi.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-500 mb-1"
                  >
                    Email manzili
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={userData?.email || ""}
                      disabled
                      className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pl-10 text-sm text-gray-500 shadow-sm cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Email manzilini hozircha o'zgartirib bo'lmaydi.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingProfile || isUploading}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                  >
                    {isSubmittingProfile || isUploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saqlanmoqda...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        O'zgarishlarni saqlash
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/*  devices */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" /> Qurilmalar
                </h2>
              </div>
              {userData && userData.device && userData.device.length > 0 ? (
                <div className="grid gap-4 sm:gap-6">
                  {userData.device.map((d, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded-2xl shadow-sm p-3 sm:p-5 flex flex-col gap-2 sm:flex-row sm:gap-4 bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <span className="text-base sm:text-lg font-bold text-gray-900 break-all leading-tight">{d.deviceType}</span>
                          <span className="text-gray-500 text-sm sm:text-base font-normal">{d.deviceModel}</span>
                        </div>
                        <div className="text-gray-700 mb-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="flex items-center gap-1 text-sm sm:text-base"><Info className="h-4 w-4 text-gray-400" /><span className="font-medium">Muammo:</span></span>
                          <span className="break-all text-sm sm:text-base font-normal">{d.issueDescription}</span>
                        </div>
                        <div className="text-gray-700 mb-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="flex items-center gap-1 text-sm sm:text-base"><Phone className="h-4 w-4 text-gray-400" /><span className="font-medium">Telefon:</span></span>
                          <span className="break-all text-sm sm:text-base font-normal">{d.phone}</span>
                        </div>
                        {d.additionalInfo && (
                          <div className="text-gray-700 mb-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="flex items-center gap-1 text-sm sm:text-base"><Info className="h-4 w-4 text-gray-400" /><span className="font-medium">Qo'shimcha:</span></span>
                            <span className="break-all bg-gray-200 text-gray-600 rounded px-2 py-0.5 text-sm sm:text-base font-normal">{d.additionalInfo}</span>
                          </div>
                        )}
                        {d.imei && (
                          <div className="text-gray-700 mb-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="inline-block bg-gray-200 text-gray-600 rounded px-2 py-0.5 text-sm font-mono">IMEI: {d.imei}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-semibold whitespace-nowrap tracking-tight ${
                              d.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                d.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                            }`}
                          >
                            {d.status === 'pending' &&
                              <Info className="h-3 w-3 mr-1" />}
                            {d.status === 'in-progress' &&
                              <Hammer className="h-3 w-3 mr-1" />}
                            {d.status === 'completed' &&
                              <CheckCircle className="h-3 w-3 mr-1" />}
                            {d.status === 'pending' ? 'Kutilmoqda' : d.status === 'in-progress' ? 'Jarayonda' : 'Bajarildi'}
                          </span>
                          {d.cost !== undefined && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-gray-100 text-gray-700 whitespace-nowrap tracking-tight">
                              Narxi: {d.cost} so'm
                            </span>
                          )}
                          {d.master && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-gray-100 text-gray-700 whitespace-nowrap tracking-tight">
                              Javobgar: {d.master}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Qo'shilgan qurilmalar yo'q.</div>
              )}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
