"use client";

import { useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <h2 className="ml-2 text-xl font-bold text-gray-900">
                  ApplePark
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                Barcha raqamli qurilmalaringiz uchun professional ta'mirlash
                xizmati. Tez, ishonchli va sifat kafolati bilan.
              </p>
              <div className="flex space-x-4 mt-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Linkedin"
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Xizmatlar
              </h3>
              <ul className="space-y-2">
                <FooterLink href="#phone-repair">Telefonni ta'mirlash</FooterLink>
                <FooterLink href="#computer-repair">
                  Kompyuterni ta'mirlash
                </FooterLink>
                <FooterLink href="#software-fixes">Dasturiy ta'mirlash</FooterLink>
                <FooterLink href="#data-recovery">Ma'lumotlarni tiklash</FooterLink>
                <FooterLink href="#screen-replacement">
                  Ekranini almashtirish
                </FooterLink>
                <FooterLink href="#battery-service">Akku xizmatlari</FooterLink>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Kompaniya
              </h3>
              <ul className="space-y-2">
                <FooterLink href="#about">Biz haqimizda</FooterLink>
                <FooterLink href="#team">Jamoamiz</FooterLink>
                <FooterLink href="#careers">Karyera</FooterLink>
                <FooterLink href="#blog">Blog</FooterLink>
                <FooterLink href="#privacy">Maxfiylik siyosati</FooterLink>
                <FooterLink href="#terms">Xizmat shartlari</FooterLink>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Biz bilan bog'laning
              </h3>
              <div className="flex items-center text-gray-600 text-sm">
                <Mail className="h-5 w-5 mr-2" />
                <span>example@email.com</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Phone className="h-5 w-5 mr-2" />
                <span>+998 90 000 00 00</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Toshkent, O'zbekiston</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="h-5 w-5 mr-2" />
                <span>Du-Yak: 09:00-21:00</span>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="md:flex md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Yangiliklar uchun obuna bo'ling
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Eng so'nggi yangiliklar, yangilanishlar va maxsus takliflar
                  to'g'ridan-to'g'ri pochta qutingizga.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <form className="flex sm:max-w-md">
                  <label htmlFor="email-address" className="sr-only">
                    Email manzili
                  </label>
                  <input
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    required
                    className="w-full min-w-0 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Emailingizni kiriting"
                  />
                  <div className="ml-3 flex-shrink-0">
                    <button
                      type="submit"
                      className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Obuna bo'lish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-center text-sm text-gray-600">
              &copy; {currentYear} ApplePark Barcha huquqlar himoyalangan.
            </p>
            <p className="mt-2 text-center text-xs text-gray-500">
              Sifatli ta'mirlash xizmatlari uchun ❤️ bilan ishlab chiqilgan va
              rivojlantirilgan.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, children, ariaLabel }) {
  return (
    <a
      href={href}
      className="text-gray-400 hover:text-blue-600 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <a
        href={href}
        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
      >
        {children}
      </a>
    </li>
  );
}

function Wrench(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
