import { useState } from "react";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "../api/axiosInstance";
// import axios from "axios";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(""); // новое состояние для ошибки
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await axios.post(
        `/auth/login`,
        data
      );
      if (res.status >= 200 && res.status < 300) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (res.data.user.role === "admin") {
          window.location.href = "/admin";
        } else {
          navigate("/", { replace: true });
        }
        console.log("Login successful", res);
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Ошибка входа. Попробуйте еще раз."
      );
      console.log(err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-2 py-6">
      <Helmet>
        <title>Kirish</title>
      </Helmet>
      <div className="w-full mx-auto max-w-md sm:max-w-lg overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="px-4 sm:px-8 pt-6 pb-4">
          <h2 className="text-center text-lg sm:text-2xl font-bold text-gray-800">
            Hisobingizga kiring
          </h2>
          <p className="mt-1 text-center text-xs sm:text-sm text-gray-600">
            Kirish uchun email yoki telefon va parolni kiriting
          </p>
        </div>

        {/* Ошибка сервера */}
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
            {/* Email Field */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Email yoki telefon
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <MailIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <input
                  id="login"
                  type="text"
                  placeholder="m@example.com yoki +99891234567"
                  className={`w-full rounded-md border px-3 py-2 pl-10 text-xs sm:text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.login
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  {...register("login", {
                    required: "Email yoki telefon majburiy",
                    validate: (value) => {
                      const emailPattern = /\S+@\S+\.\S+/;
                      const phonePattern = /^\+?[1-9]\d{1,15}$/;
                      if (emailPattern.test(value) || phonePattern.test(value)) {
                        return true;
                      }
                      return "Email yoki telefon raqami noto'g'ri";
                    }
                  })}
                />
              </div>
              {errors.login && (
                <p className="text-xs sm:text-sm text-red-500">
                  {errors.login.message}
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
                    required: "Parol majburiy",
                    minLength: {
                      value: 6,
                      message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
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
                  {errors.password.message}
                </p>
              )}
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
                  <span className="ml-2">Kirilmoqda...</span>
                </div>
              ) : (
                "Kirish"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-8 py-3 sm:py-4 text-center text-xs sm:text-sm">
          <span className="text-gray-600">Hisobingiz yo'qmi?</span>{" "}
          <Link
            to="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Ro'yxatdan o'tish
          </Link>
        </div>
      </div>
    </div>
  );
}
