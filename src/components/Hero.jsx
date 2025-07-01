import React from "react";
import { Smartphone, Laptop, Cloud, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function RepairServiceHero() {
  return (
    <div className="bg-white  max-sm:pt-9">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-20">
          {/* Hero Content */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6 md:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Raqamli qurilmalaringiz uchun{" "}
                <span className="text-primary">mutaxassis ta'mirlash yechimlari</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Smartfonlar, kompyuterlar va dasturiy ta'minot muammolari uchun tez va ishonchli ta'mirlash. Bizning sertifikatlangan mutaxassislarimiz sifatli xizmat va kafolat beradi.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/services/#header"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                >
                  Bizning xizmatlarimiz
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contact-us"
                  className="inline-flex items-center justify-center rounded-md border border-primary bg-white px-6 py-3 text-base font-medium text-primary shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-colors"
                >
                  Biz bilan bog'laning
                </Link>
              </div>
            </div>

            {/* Right Column - Service Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ServiceCard
                icon={<Smartphone className="h-8 w-8 text-primary" />}
                title="iPhone ta'mirlash"
                description="Ekran almashtirish, batareya muammolari, suvdan zarar ko'rgan qurilmalar"
                href="/services"
              />
              <ServiceCard
                icon={<Laptop className="h-8 w-8 text-primary" />}
                title="MacBook ta'mirlash"
                description="Dasturiy ta'minotni tiklash, apparatni yangilash, ma'lumotlarni tiklash"
                href="/services"
              />
              <ServiceCard
                icon={<Cloud className="h-8 w-8 text-primary" />}
                title="iCloud blokdan chiqarish"
                description="iCloud akkauntingizni mutaxassislar yordamida oching"
                href="/services"
              />
              <ServiceCard
                icon={
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-light text-primary font-bold">
                    24
                  </div>
                }
                title="24/7 Qo'llab-quvvatlash"
                description="Istalgan vaqtda favqulodda ta'mirlash va texnik yordam"
                href="/contact-us"
              />
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 items-center text-gray-500">
              <p className="text-sm font-medium text-gray-600">
                Minglab mijozlar ishonch bildirgan
              </p>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm font-medium">
                  4.9/5 (500+ sharh)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm">Sertifikatlangan mutaxassislar</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm">30 kunlik kafolat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ icon, title, description, href}) {
  return (
    <Link
      to={href}
      className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col gap-4">
        <div>{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="h-5 w-5 text-primary" />
      </div>
    </Link>
  );
}
