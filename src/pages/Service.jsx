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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
// Define service types
const serviceTypes = [
  {
    id: "phone-repair",
    title: "Phone Repair",
    description:
      "Screen replacement, battery service, water damage recovery, and more for all smartphone brands.",
    icon: <Smartphone className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "Cracked Screen",
      "Battery Replacement",
      "Water Damage",
      "Charging Port",
      "Speaker Issues",
    ],
  },
  {
    id: "computer-repair",
    title: "Computer Repair",
    description:
      "Hardware upgrades, virus removal, data recovery, and performance optimization for PCs and Macs.",
    icon: <Laptop className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "Slow Performance",
      "Virus Removal",
      "Hardware Upgrade",
      "Data Recovery",
      "Blue Screen",
    ],
  },
  {
    id: "tablet-repair",
    title: "Tablet Repair",
    description:
      "Expert repair services for iPads, Samsung tablets, and other tablet devices.",
    icon: <Tablet className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "Broken Screen",
      "Battery Issues",
      "Software Problems",
      "Charging Issues",
      "Button Repair",
    ],
  },
  {
    id: "monitor-repair",
    title: "Monitor & TV Repair",
    description:
      "Repair services for monitors, TVs, and other display devices.",
    icon: <Monitor className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "No Display",
      "Flickering Screen",
      "Dead Pixels",
      "Power Issues",
      "HDMI Port Repair",
    ],
  },
  {
    id: "data-recovery",
    title: "Data Recovery",
    description:
      "Professional data recovery services for all types of storage devices.",
    icon: <HardDrive className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "Accidental Deletion",
      "Corrupted Drive",
      "Physical Damage",
      "Virus Attack",
      "Formatted Drive",
    ],
  },
  {
    id: "network-setup",
    title: "Network Setup",
    description: "Setup and troubleshooting for home and business networks.",
    icon: <Wifi className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "Slow Connection",
      "WiFi Setup",
      "Router Configuration",
      "Network Security",
      "Range Extension",
    ],
  },
  {
    id: "software-support",
    title: "Software Support",
    description:
      "Installation, updates, and troubleshooting for operating systems and applications.",
    icon: <Settings className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "OS Installation",
      "Software Updates",
      "Driver Issues",
      "Application Errors",
      "System Optimization",
    ],
  },
  {
    id: "maintenance",
    title: "Preventative Maintenance",
    description:
      "Regular maintenance to keep your devices running smoothly and prevent future issues.",
    icon: <Shield className="h-10 w-10 text-blue-600" />,
    commonIssues: [
      "System Cleanup",
      "Hardware Inspection",
      "Software Updates",
      "Dust Removal",
      "Performance Tuning",
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
    data.status = "Pending"

    try {
      const response = await fetch(
        "https://computer-service-backend.onrender.com/api/services",
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
        <title>Services</title>
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="header">
        <div className="py-12 md:py-20">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span
              id="header"
              className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 mb-4"
            >
              Our Services
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Expert Repair Services for All Your{" "}
              <span className="text-blue-600">Digital Needs</span>
            </h1>
            <p className="text-lg text-gray-600">
              Select the service you need below to get started. Our team of
              certified technicians is ready to help with any repair or
              technical issue.
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
                  <span>Back to services</span>
                </button>
              </div>

              <div className="flex items-center mb-8">
                {selectedServiceObj?.icon}
                <h2 className="text-2xl font-bold text-gray-900 ml-3">
                  {selectedServiceObj?.title} Request
                </h2>
              </div>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Service request submitted successfully!
                    </h3>
                    <p className="mt-1 text-sm text-green-700">
                      Thank you for your request. Our team will contact you
                      shortly to confirm your appointment.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Failed to submit request
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      There was an error submitting your request. Please try
                      again or contact us directly.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Service Type */}
                  <div>
                    <label
                      htmlFor="serviceType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="serviceType"
                      className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        errors.serviceType
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("serviceType", {
                        required: "Service type is required",
                      })}
                    >
                      <option value="">Select a service type</option>
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

                  {/* Device Type */}
                  <div>
                    <label
                      htmlFor="deviceType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Device Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="deviceType"
                      className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        errors.deviceType ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("deviceType", {
                        required: "Device type is required",
                      })}
                    >
                      <option value="">Select your device</option>
                      {deviceTypes.map((device) => (
                        <option key={device} value={device}>
                          {device}
                        </option>
                      ))}
                    </select>
                    {errors.deviceType && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.deviceType.message}
                      </p>
                    )}
                  </div>

                  {/* Device Model */}
                  <div>
                    <label
                      htmlFor="deviceModel"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Device Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="deviceModel"
                      type="text"
                      placeholder="e.g., iPhone 13 Pro, Dell XPS 15"
                      className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        errors.deviceModel
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("deviceModel", {
                        required: "Device model is required",
                      })}
                    />
                    {errors.deviceModel && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.deviceModel.message}
                      </p>
                    )}
                  </div>

                  {/* Common Issues Select */}
                  <div>
                    <label
                      htmlFor="issueDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Issue Description <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="issueDescription"
                      className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        errors.issueDescription
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("issueDescription", {
                        required: "Issue description is required",
                      })}
                    >
                      <option value="">Select the issue</option>
                      {selectedServiceObj?.commonIssues.map((issue) => (
                        <option key={issue} value={issue}>
                          {issue}
                        </option>
                      ))}
                      <option value="Other">
                        Other (please specify in additional info)
                      </option>
                    </select>
                    {errors.issueDescription && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.issueDescription.message}
                      </p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("phone", {
                        required: "Phone number is required",
                      })}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label
                      htmlFor="preferredDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Preferred Service Date{" "}
                      <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      id="preferredDate"
                      type="date"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      {...register("preferredDate")}
                      min={new Date().toISOString().split("T")[0]} // Set min date to today
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <label
                    htmlFor="additionalInfo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Additional Information{" "}
                    <span className="text-gray-500">(Optional)</span>
                  </label>
                  <textarea
                    id="additionalInfo"
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Please provide any additional details about your issue or special requirements."
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
                  disabled={isSubmitting}
                  className="w-full sm:w-auto rounded-md bg-blue-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center"
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
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Service Request
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
