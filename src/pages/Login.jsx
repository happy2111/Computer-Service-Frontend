import { useState } from "react";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(""); // сброс ошибки при новом сабмите
    try {
      const res = await axios.post(
        "https://computer-service-backend.onrender.com/api/auth/login",
        data
      );
      if (res.status >= 200 && res.status < 300) {
        localStorage.setItem("token", res.data.token);
        if (res.data.user.role === "admin") {
          window.location.href = "https://app.forestadmin.com/Computer-Support";
        } else {
          navigate("/", { replace: true });
        }

        console.log("Login successful", res);
      }
    } catch (err) {
      // обработка ошибки от сервера
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
    <div className="w-full mx-auto mt-3 sm:mt-10 max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
      <div className="px-6 sm:px-8 pt-6 pb-4">
        <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-800">
          Sign in to your account
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-gray-600">
          Enter your email and password to login
        </p>
      </div>

      {/* Ошибка сервера */}
      {serverError && (
        <div className="mx-6 sm:mx-8 mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
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
        className="px-6 sm:px-8 pb-6 sm:pb-8"
      >
        <div className="space-y-4">
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
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Email is invalid",
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

          {/* Password Field */}
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="password"
              className="block text-xs sm:text-sm font-medium text-gray-700"
            >
              Password
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
                <span className="ml-2">Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="bg-gray-50 px-6 sm:px-8 py-3 sm:py-4 text-center text-xs sm:text-sm">
        <span className="text-gray-600">Don't have an account?</span>{" "}
        <Link
          to="/auth/register"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Create one
        </Link>
      </div>
    </div>
  );
}
