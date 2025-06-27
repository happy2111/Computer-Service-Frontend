import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  HardDrive,
  Wifi,
  Settings,
  Shield,
  Clock,
  ChevronRight,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Watch,
  Cloud
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
// Define service types
const serviceTypes = [
  {
    id: "iphone-repair",
    title: "iPhone ta'mirlash",
    description:
      "Barcha smartfon brendlari uchun ekran almashtirish, batareya xizmati, suvdan zarar ko'rgan qurilmalarni tiklash va boshqa xizmatlar.",
    icon: <Smartphone className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "Ekran yorilgan",
      "Batareyani almashtirish",
      "Suvdan zarar ko'rgan",
      "Zaryadlash porti",
      "Dinamik muammolari",
    ],
  },
  {
    id: "ipad-repair",
    title: "iPad ta'mirlash",
    description:
      "Barcha planshet modellarida ekran almashtirish, batareya xizmati va dasturiy muammolarni bartaraf etish.",
    icon: <Tablet className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "Ekran yo'q",
      "Ekran miltillashi",
      "O'lik piksellar",
      "Quvvat muammolari",
      "HDMI portini ta'mirlash",
    ],
  },
  {
    id: "macbook-repair",
    title: "MacBook ta'mirlash",
    description:
      "MacBook uchun apparat yangilash, viruslardan tozalash, ma'lumotlarni tiklash va tezlikni oshirish xizmati.",
    icon: <Laptop className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "Sekin ishlash",
      "Virusdan tozalash",
      "Apparat yangilash",
      "Ma'lumotlarni tiklash",
      "Ko'k ekran muammosi",
    ],
  },
  {
    id: "apple-watch-repair",
    title: "Apple Watch ta'mirlash",
    description: "Apple Watch uchun ekran almashtirish, batareya xizmati va dasturiy muammolarni bartaraf etish.",
    icon: <Watch className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "Ekranni almashtirish",
      "Batareyani almashtirish",
      "Dasturiy muammolar",
      "Zaryadlash muammolari",
      "Suvdan zarar ko'rgan",
    ],
  },
  {
    id: "imac-repair",
    title: "iMac ta'mirlash",
    description:
      "iMac uchun to'liq ta'mirlash, ekran almashtirish va apparat yangilash xizmati.",
    icon: <Tablet className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "Ekran singan",
      "Batareya muammolari",
      "Dasturiy muammolar",
      "Zaryadlash muammolari",
      "Tugma ta'miri",
    ],
  },
  {
    id: "icloud-unlock",
    title: "iCloud blokdan chiqarish",
    description:
      "iPhone yoki iPad qurilmangizni iCloud blokidan chiqarish xizmati.",
    icon: <Cloud className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "Aktivatsiya blokini olib tashlash",
      "Apple ID-ni unutgan",
      "iCloud akkauntini tiklash",
      "iCloud'ga kirish yo'qolgan",
      "Qurilma tiklangandan so'ng bloklangan",
    ],
  },
  {
    id: "apple-diagnostic",
    title: "Apple diagnostikasi",
    description: "Barcha Apple qurilmalari uchun apparat va dasturiy muammolarni aniqlash xizmati.",
    icon: <Settings className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "Apparat tekshiruvi",
      "Dasturiy tahlil",
      "Tezlikni tekshirish",
      "Tizimni baholash",
      "Komponentlarni tekshirish",
    ],
  },
  {
    id: "data-recovery",
    title: "Ma'lumotlarni tiklash",
    description: "Barcha Apple qurilmalari uchun professional ma'lumotlarni tiklash xizmati (iPhone, iPad, Mac).",
    icon: <HardDrive className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "O'chirilgan ma'lumotlarni tiklash",
      "Disk nosozligini tiklash",
      "Zaxira nusxasini tiklash",
      "Buzilgan fayllarni tiklash",
      "Parolni tiklash",
    ],
  },
];

// Define device types
const deviceTypes = [
  "iPhone",
  "Samsung Galaxy",
  "Google Pixel",
  "Other Smartphone",
  "iPad",
  "Samsung Tablet",
  "Windows Laptop",
  "MacBook",
  "Desktop PC",
  "iMac",
  "Gaming Console",
  "Smart TV",
  "Other",
];

// Define form input types

export default function Service() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceType: "",
      deviceType: "",
      deviceModel: "",
      issueDescription: "",
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      additionalInfo: "",
    },
  });

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setValue("serviceType", serviceId); // Pre-populate the service type field
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      document
        .getElementById("service-form")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBackToServices = () => {
    setShowForm(false);
    setSubmitStatus("idle");
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    data.status = "pending"

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }
      if (!response.ok) throw response;

      setSubmitStatus("success");
      // Don't reset the form immediately so the user can see their submitted data
      setTimeout(() => {
        reset();
        setShowForm(false);
        setSelectedService(null);
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find the selected service object
  const selectedServiceObj = serviceTypes.find(
    (service) => service.id === selectedService
  );

  return (
    <div className="bg-white ">
      <Helmet>
        <title>Xizmatlar</title>
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="header">
        <div className="py-12 md:py-20">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span
              id="header"
              className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 mb-4"
            >
              Bizning xizmatlarimiz
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Barcha{" "}
              <span className="text-blue-600">raqamli ehtiyojlaringiz</span> uchun ekspert ta'mirlash xizmatlari
            </h1>
            <p className="text-lg text-gray-600">
              Boshlash uchun quyida kerakli xizmatni tanlang. Bizning sertifikatlangan mutaxassislar jamoamiz har qanday ta'mirlash yoki texnik muammoni hal qilishga tayyor.
            </p>
          </div>

          {!showForm ? (
            /* Service Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {serviceTypes.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  onSelect={handleServiceSelect}
                />
              ))}
            </div>
          ) : (
            /* Service Request Form */
            <div
              id="service-form"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8"
            >
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBackToServices}
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span>Orqaga xizmatlarga</span>
                </button>
              </div>

              <div className="flex items-center mb-8">
                {selectedServiceObj?.icon}
                <h2 className="text-2xl font-bold text-gray-900 ml-3">
                  {selectedServiceObj?.title} so'rovi
                </h2>
              </div>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Xizmat so'rovi muvaffaqiyatli yuborildi!
                    </h3>
                    <p className="mt-1 text-sm text-green-700">
                      So'rovingiz uchun rahmat. Jamoamiz tez orada siz bilan bog'lanadi va uchrashuvni tasdiqlaydi.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      So'rovni yuborishda xatolik yuz berdi
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      So'rovingizni yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring yoki biz bilan bevosita bog'laning.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/*<div className={"c"}>*/}
                      {/* Service Type (теперь на месте Device Type) */}
                      <div className="">
                        <label
                          htmlFor="serviceType"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Xizmat turi <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="serviceType"
                          className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            errors.serviceType
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          {...register("serviceType", {
                            required: "Xizmat turi majburiy",
                          })}
                        >
                          <option value="">Xizmat turini tanlang</option>
                          {serviceTypes.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.title}
                            </option>
                          ))}
                        </select>
                        {errors.serviceType && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.serviceType.message}
                          </p>
                        )}
                      </div>

                      {/* Device Model */}
                      <div>
                        <label
                          htmlFor="deviceModel"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Qurilma modeli <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="deviceModel"
                          type="text"
                          placeholder="masalan, iPhone 13 Pro, Dell XPS 15"
                          className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            errors.deviceModel
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          {...register("deviceModel", {
                            required: "Qurilma modeli majburiy",
                          })}
                        />
                        {errors.deviceModel && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.deviceModel.message}
                          </p>
                        )}
                      </div>
                    {/*</div>*/}

                  {/* Common Issues Select */}
                  <div>
                    <label
                      htmlFor="issueDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Muammo tavsifi <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="issueDescription"
                      className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        errors.issueDescription
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("issueDescription", {
                        required: "Muammo tavsifi majburiy",
                      })}
                    >
                      <option value="">Muammoni tanlang</option>
                      {selectedServiceObj?.commonIssues.map((issue) => (
                        <option key={issue} value={issue}>
                          {issue}
                        </option>
                      ))}
                      <option value="Other">
                        Boshqa (qo'shimcha ma'lumotda yozing)
                      </option>
                    </select>
                    {errors.issueDescription && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.issueDescription.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Telefon raqami <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("phone", {
                        required: "Telefon raqami majburiy",
                      })}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <label
                    htmlFor="additionalInfo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Qo'shimcha ma'lumotlar <span className="text-gray-500">(Ixtiyoriy)</span>
                  </label>
                  <textarea
                    id="additionalInfo"
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Muammo yoki maxsus talablaringiz haqida qo'shimcha ma'lumot kiriting."
                    {...register("additionalInfo")}
                  ></textarea>
                </div>

                {/* Service Guarantee */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        Our Service Guarantee
                      </h3>
                      <p className="text-sm text-gray-600">
                        We'll respond to your request within 24 hours. Most
                        repairs are completed the same day, and all our work
                        comes with a 90-day warranty.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Send className="h-4 w-4 animate-spin" /> Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> So'rovni yuborish
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Why Choose Us (Only shown on services view) */}
          {!showForm && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
                Why Choose Our Repair Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<Shield className="h-8 w-8 text-blue-600" />}
                  title="90-Day Warranty"
                  description="All our repairs come with a 90-day warranty on both parts and labor for your peace of mind."
                />
                <FeatureCard
                  icon={<Clock className="h-8 w-8 text-blue-600" />}
                  title="Fast Turnaround"
                  description="Most repairs are completed the same day, often while you wait. We value your time."
                />
                <FeatureCard
                  icon={<CheckCircle className="h-8 w-8 text-blue-600" />}
                  title="Certified Technicians"
                  description="Our repair specialists are certified professionals with years of experience and ongoing training."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ id, title, description, icon, onSelect }) {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group"
      onClick={() => onSelect(id)}
    >
      <div className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex items-center text-blue-600 text-sm font-medium">
          Request Service{" "}
          <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
