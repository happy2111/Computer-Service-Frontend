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
                  ServiceHY
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                Professional repair services for all your digital devices. Fast,
                reliable, and guaranteed quality.
              </p>
              <div className="flex space-x-4">
                <SocialLink href="https://facebook.com" ariaLabel="Facebook">
                  <Facebook className="h-5 w-5" />
                </SocialLink>
                <SocialLink href="https://twitter.com" ariaLabel="Twitter">
                  <Twitter className="h-5 w-5" />
                </SocialLink>
                <SocialLink href="https://instagram.com" ariaLabel="Instagram">
                  <Instagram className="h-5 w-5" />
                </SocialLink>
                <SocialLink href="https://linkedin.com" ariaLabel="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </SocialLink>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Services
              </h3>
              <ul className="space-y-2">
                <FooterLink href="#phone-repair">Phone Repair</FooterLink>
                <FooterLink href="#computer-repair">Computer Repair</FooterLink>
                <FooterLink href="#software-fixes">Software Fixes</FooterLink>
                <FooterLink href="#data-recovery">Data Recovery</FooterLink>
                <FooterLink href="#screen-replacement">
                  Screen Replacement
                </FooterLink>
                <FooterLink href="#battery-service">Battery Service</FooterLink>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Company
              </h3>
              <ul className="space-y-2">
                <FooterLink href="#about">About Us</FooterLink>
                <FooterLink href="#team">Our Team</FooterLink>
                <FooterLink href="#careers">Careers</FooterLink>
                <FooterLink href="#blog">Blog</FooterLink>
                <FooterLink href="#privacy">Privacy Policy</FooterLink>
                <FooterLink href="#terms">Terms of Service</FooterLink>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="ml-2 text-sm text-gray-600">Tashken</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <a
                    href="tel:+998934474009"
                    className="ml-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    +998 (93) 447-40-09
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <a
                    href="mailto:me@info.com"
                    className="ml-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    me@info.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="ml-2 text-sm text-gray-600">
                    Mon-Fri: 9AM-7PM, Sat: 10AM-5PM
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="md:flex md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Subscribe to our newsletter
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Get the latest news, updates and special offers delivered
                  directly to your inbox.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <form className="flex sm:max-w-md">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    required
                    className="w-full min-w-0 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                  <div className="ml-3 flex-shrink-0">
                    <button
                      type="submit"
                      className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-center text-sm text-gray-600">
              &copy; {currentYear} RepairPro. All rights reserved.
            </p>
            <p className="mt-2 text-center text-xs text-gray-500">
              Designed and developed with ❤️ for quality repair services.
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
