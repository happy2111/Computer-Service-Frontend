import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  LockIcon,
  UserIcon,
} from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(""); // новое состояние для ошибки

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(""); // сброс ошибки при новом сабмите
    try {
      const { agreeToTerms, ...sendData } = data;
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        sendData
      );
      if (res.status >= 200 && res.status < 300) {
        console.log(res);
        localStorage.setItem("token", res.data.token);
        navigate("/", { replace: true });
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Ro'yxatdan o'tishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
      );
      console.log(err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-2 py-6">
      <Helmet>
        <title>Ro'yxatdan o'tish</title>
      </Helmet>
      <div className="w-full mx-auto max-w-md sm:max-w-lg overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="px-4 sm:px-8 pt-6 pb-4">
          <h2 className="text-center text-lg sm:text-2xl font-bold text-gray-800">
            Hisob yaratish
          </h2>
          <p className="mt-1 text-center text-xs sm:text-sm text-gray-600">
            Yangi hisob yaratish uchun ma'lumotlarni to'ldiring
          </p>
        </div>

        {/* Server xatolik */}
        {serverError && (
          <div className="mx-4 sm:mx-8 mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <svg
              className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01"
              />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-4 sm:px-8 pb-6 sm:pb-8"
        >
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="name"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                To'liq ism
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="Ism Familiya"
                  className={`w-full rounded-md border px-3 py-2 pl-10 text-xs sm:text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
              </div>
              {errors.name && (
                <p className="text-xs sm:text-sm text-red-500">
                  {errors.name.message === "Full name is required"
                    ? "To'liq ismni ko'rsatish kerak"
                    : "Ism kamida 2 ta belgidan iborat bo'lishi kerak"}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <MailIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className={`w-full rounded-md border px-3 py-2 pl-10 text-xs sm:text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  {...register("email", {
                    required: "Email majburiy",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Email noto'g'ri formatda",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="phone"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Telefon
              </label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  placeholder="+998 (99) 123-45-67"
                  className={`w-full rounded-md border px-3 py-2 text-xs sm:text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  {...register("phone", {
                    required: "Телефон обязателен",
                    pattern: {
                      value: /^\+?\d{10,15}$/,
                      message: "Некорректный формат телефона",
                    },
                  })}
                />
              </div>
              {errors.phone && (
                <p className="text-xs sm:text-sm text-red-500">
                  {errors.phone.message === "Телефон обязателен"
                    ? "Telefon raqami majburiy"
                    : "Noto'g'ri telefon formati"}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Parol
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <LockIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full rounded-md border px-3 py-2 pl-10 text-xs sm:text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs sm:text-sm text-red-500">
                  {errors.password.message === "Password is required"
                    ? "Parolni ko'rsatish kerak"
                    : errors.password.message === "Password must be at least 6 characters"
                    ? "Parol kamida 6 ta belgidan iborat bo'lishi kerak"
                    : "Parolda kamida bitta katta harf, bitta kichik harf va bitta raqam bo'lishi kerak"}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Parolni tasdiqlang
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <LockIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full rounded-md border px-3 py-2 pl-10 text-xs sm:text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs sm:text-sm text-red-500">
                  {errors.confirmPassword.message === "Please confirm your password"
                    ? "Iltimos, parolni tasdiqlang"
                    : "Parollar mos kelmadi"}
                </p>
              )}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  className="h-3 w-3 sm:h-4 sm:w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register("agreeToTerms", {
                    required: "You must agree to the terms and conditions",
                  })}
                />
              </div>
              <div className="ml-2 text-xs sm:text-sm">
                <label
                  htmlFor="agreeToTerms"
                  className="font-medium text-gray-700"
                >
                  Men{" "}
                  <a href="/term.html" className="text-blue-600 hover:text-blue-500">
                    Foydalanish shartlari
                  </a>{" "}
                  va{" "}
                  <a href="/privancy.html" className="text-blue-600 hover:text-blue-500">
                    Maxfiylik siyosati
                  </a>
                  ga roziman
                </label>
                {errors.agreeToTerms && (
                  <p className="text-red-500">Shartlarni qabul qilish kerak</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-md bg-blue-600 py-2 px-4 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-white"
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
                  <span className="ml-2">Hisob yaratilmoqda...</span>
                </div>
              ) : (
                "Hisob yaratish"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-8 py-3 sm:py-4 text-center text-xs sm:text-sm">
          <span className="text-gray-600">Hisobingiz bormi?</span>{" "}
          <Link
            to="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Kirish
          </Link>
        </div>
      </div>
    </div>
  );
}
