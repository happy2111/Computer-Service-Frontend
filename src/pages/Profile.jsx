"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
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
        if (!token) return navigate("/auth/login");
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
          console.log(res.data);
          setAvatar(res.data.avatar || "");
          console.log(res.data.avatar)
        }
      } catch (error) {
        console.error("Error fetching user data", error);
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

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (userData) {
      reset({ name: userData.name || "" });
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
  const handleRemoveAvatar = () => {
    setAvatar("");
    setAvatarFile(null);
    setAvatarPreview(null);
    // You might want to add API call to remove avatar on the server
    // or handle this during the profile update
  };

  // Get the correct avatar display URL
  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (avatar) {
      // If avatar is a full URL, use it directly
      if (avatar.startsWith("http")) return avatar;
      // If avatar is a server path, prepend the API base URL
      if (avatar.startsWith("/uploads")) {
        return `https://computer-service-backend.onrender.com${avatar}`;
      }
      return avatar;
    }
    return "https://img.freepik.com/premium-vector/man-empty-avatar-casual-business-style-vector-photo-placeholder-social-networks-resumes_885953-434.jpg";
  };

  if (loading) {
    return (
      <div className=" flex min-h-screen items-center justify-center bg-white">
        <Helmet>
          <title>Profile</title>
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
          <span className="text-gray-600 text-lg">Loading Profile...</span>
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
              Your Profile
            </h1>
            <p className="text-lg text-gray-600">
              Manage your account settings and change your personal information.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Avatar Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Profile Picture
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
                        src={getAvatarUrl() || "/placeholder.svg"}
                        alt="Profile avatar"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Change profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Change your profile picture
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload a new avatar. Recommended size: 400x400px.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </button>
                    {avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                    aria-label="Upload profile picture"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  Only name can be edited
                </div>
              </div>

              {profileStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Your profile information has been updated successfully.
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
                        "There was an error updating your profile. Please try again."}
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
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className={`w-full rounded-md border px-3 py-2 pl-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        profileErrors.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                      {...registerProfile("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
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
                    Email Address
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
                    Email address cannot be changed at this time.
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
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
                  <Info className="h-5 w-5 text-blue-500" /> Устройства
                </h2>
              </div>
              {userData && userData.device && userData.device.length > 0 ? (
                <div className="grid gap-6">
                  {userData.device.map((d, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-lg shadow-sm p-5 flex flex-col sm:flex-row gap-4 bg-gray-50 hover:shadow-md transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-semibold text-gray-900">{d.deviceType}</span>
                          <span className="ml-2 text-gray-500 text-sm">{d.deviceModel}</span>
                        </div>
                        <div className="text-gray-700 mb-1 flex items-center gap-2">
                          <Info className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Описание проблемы:</span> {d.issueDescription}
                        </div>
                        <div className="text-gray-700 mb-1 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Телефон:</span> {d.phone}
                        </div>
                        {d.additionalInfo && (
                          <div className="text-gray-700 mb-1 flex items-center gap-2">
                            <Info className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">Доп. информация:</span> {d.additionalInfo}
                          </div>
                        )}
                        {d.imei && (
                          <div className="text-gray-700 mb-1 flex items-center gap-2">
                            <span className="inline-block bg-gray-200 text-gray-600 rounded px-2 py-0.5 text-xs font-mono">IMEI: {d.imei}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            d.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            d.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {d.status === 'pending' && <Info className="h-3 w-3 mr-1" />}
                            {d.status === 'in-progress' && <Camera className="h-3 w-3 mr-1" />}
                            {d.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {d.status === 'pending' ? 'В ожидании' : d.status === 'in-progress' ? 'В работе' : 'Завершено'}
                          </span>
                          {d.cost !== undefined && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                              Стоимость: {d.cost} сум
                            </span>
                          )}
                          {d.master && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                              Мастер: {d.master}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Нет добавленных устройств.</div>
              )}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

