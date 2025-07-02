"use client";

import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import {Helmet} from "react-helmet";

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle"); // "idle" | "success" | "error"

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
      // phone: "",
    },
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaError, setCaptchaError] = useState("");

  function onCaptchaChange(value) {
    setCaptchaValue(value);
    setCaptchaError("");
  }

  const onSubmit = async (data) => {
    if (!captchaValue) {
      setCaptchaError("Please complete the captcha.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted with:", data);
      console.log("Captcha value:", captchaValue);
      const res = await axios.post(
        "https://computer-service-backend.onrender.com/api/contact",
        {
          ...data,
          captcha: captchaValue, 
        }
      );
      if (res.status >= 200 && res.status < 300) {
        console.log("successful", res);
        setSubmitStatus("success");
        reset();
        setCaptchaError("");
        setCaptchaValue(null);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white max-sm:pt-9">
      <Helmet>
        <link rel="canonical" href="https://www.applepark.uz/contact-us/" />
        <title>Apple Park - Biz bilan bog'lanish</title>
        <meta name="description" content="Apple Park - Bizning xizmatlarimiz, ta'mirlash so'rovlari va aloqa ma'lumotlari. Biz bilan bog'laning!" />
        <meta name="keywords" content="Apple Park, aloqa, xizmatlar, ta'mirlash so'rovlari, telefon raqami, elektron pochta" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Apple Park - Biz bilan bog'lanish" />
        <meta property="og:description" content="Apple Park - Bizning xizmatlarimiz, ta'mirlash so'rovlari va aloqa ma'lumotlari. Biz bilan bog'laning!" />
        <meta property="og:url" content="https://www.applepark.uz/contact-us" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.applepark.uz/logo.PNG" />



      </Helmet>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="header">
        <div className="py-12 md:py-20">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Biz bilan bog'lanish
            </h1>
            <p className="text-lg text-gray-600">
              Savollaringiz bormi yoki yordam kerakmi? Biz yordam berishga tayyormiz. Quyidagi formani to'ldiring va jamoamiz imkon qadar tezroq siz bilan bog'lanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Bizga xabar yuboring
              </h2>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Xabaringiz muvaffaqiyatli yuborildi!
                    </h3>
                    <p className="mt-1 text-sm text-green-700">
                      Biz bilan bog'langaningiz uchun rahmat. Xabaringizga imkon qadar tezroq javob beramiz.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Xabar yuborishda xatolik yuz berdi
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      Xabaringizni yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring yoki biz bilan to'g'ridan-to'g'ri bog'laning.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    To'liq ism <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("name", {
                      required: "Ism majburiy",
                      minLength: {
                        value: 2,
                        message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak",
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Elektron pochta <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("email", {
                      required: "Email majburiy",
                      pattern: {
                        value: /\S+@\S+\.\S+/, // regex unchanged
                        message: "Iltimos, to'g'ri email manzilini kiriting",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                {/* Phone Field (Optional) */}
                {/* <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Telefon raqam{" "}
                    <span className="text-gray-400">(Ixtiyoriy)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    {...register("phone")}
                  />
                </div> */}
                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Xabar <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      errors.message
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("message", {
                      required: "Xabar majburiy",
                      minLength: {
                        value: 10,
                        message: "Xabar kamida 10 ta belgidan iborat bo‘lishi kerak",
                      },
                    })}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <ReCAPTCHA
                  sitekey="6LeA404rAAAAAOQOr0lMf80yss6ZNgy4RviNg1_E"
                  onChange={onCaptchaChange}
                />
                {captchaError && (
                  <p className="mt-1 text-sm text-red-500">{captchaError}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center"
                >
                  {isSubmitting ? (
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
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Xabar yuborish
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Branches Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Filiallarimiz</h2>
              <div className="mb-6 flex items-start gap-4">
                <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <div className="font-bold text-gray-900">Boburshox ko’chasi, 24b uy</div>
                  <div className="text-gray-600">Uzbekistan, Andijon shahri</div>
                  <div className="text-gray-600">Telefon: <a href="tel:+998772111110" className="text-blue-600 hover:underline">+998 77 211 11 10</a></div>
                  <div className="text-gray-600">Ish vaqti: 9:00 - 22:00</div>
                </div>
              </div>
              <div className="mb-6 flex items-start gap-4">
                <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <div className="font-bold text-gray-900">Xalis Savdo Markazi, 2-qavat, 9-dokon</div>
                  <div className="text-gray-600">Uzbekistan, Andijon shahri</div>
                  <div className="text-gray-600">Telefon: <a href="tel:+998952111110" className="text-blue-600 hover:underline">+998 95 211 11 10</a></div>
                  <div className="text-gray-600">Ish vaqti: 9:00 - 22:00</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <div className="font-bold text-gray-900">Email</div>
                  <div className="text-gray-600"><a href="mailto:support@applepark.uz" className="text-blue-600 hover:underline">support@applepark.uz</a></div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section
          <div className="mt-12">
            <div className="bg-gray-200 rounded-lg h-80 w-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  Map would be displayed here
                </p>
                <p className="text-sm text-gray-500">
                  (In a real implementation, you would integrate Google Maps or
                  another map service here)
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
