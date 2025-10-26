import { MdAttachEmail } from "react-icons/md";
import { BiSolidPhone } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa6";
import { FaFax } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ChatPanel } from "./ChatPanel";

import { AppAds } from "@/components/AppAds";
import { assets } from "@/assets/assets";

// Main Footer Component - Fully Responsive
export const Footer = () => {
  // const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const socialLinks = [
    { icon: FaInstagram, name: "Instagram", url: "#" },
    { icon: FaTiktok, name: "Tiktok", url: "#" },
    { icon: FaYoutube, name: "Youtube", url: "#" },
    { icon: FaXTwitter, name: "Twitter", url: "#" },
    { icon: FaFacebookF, name: "Facebook", url: "#" },
  ];

  const navigationLinks = [
    { label: "Beranda", to: "/" },
    { label: "Data Pertanian", to: "/home/data" },
    { label: "Info Pertanian", to: "/home/information" },
    { label: "Toko Pertanian", to: "/home/toko" },
  ];

  const contactInfo = [
    { icon: MdAttachEmail, title: "Email", info: "pertanian@ngawikab.go.id" },
    { icon: BiSolidPhone, title: "Nomor Telepon", info: "(0351) 749026" },
    { icon: FaWhatsapp, title: "WhatsApp", info: "(0351) 749026" },
    { icon: FaFax, title: "FAX", info: "pertanian@ngawikab.go.id" },
  ];

  return (
    <>
      {/* Chat Panel */}
      {/* {showChat && <ChatPanel setShowChat={setShowChat} showChat={showChat} />} */}

      <footer className="w-full bg-[#003F75] text-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 mt-20 sm:mt-32 lg:mt-40">
        <div className="container w-full mx-auto lg:w-11/12">
          {/* AppAds - Desktop Only */}
          <div className="relative -top-16 lg:-top-25">
            <AppAds />
          </div>

          {/* Header Section - Logo and Chat Button */}
          <div className="flex flex-col items-center justify-between gap-4 mb-8 sm:flex-row lg:mb-10">
            <img
              alt="logo-white"
              className="w-48 sm:w-52 lg:w-60"
              src={assets.logoWhite}
            />
            {/* <Button
              className="flex items-center justify-center gap-2 text-sm text-white shadow-lg bg-gradient-to-tr from-green-400 to-green-500 sm:text-base"
              radius="full"
              onPress={() => setShowChat(true)}
            >
              Chat Admin
              <BiMessageDetail className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button> */}
          </div>

          {/* Main Content Grid - Responsive */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {/* Social Media Section */}
            <div className="space-y-4">
              <h3 className="mb-4 text-lg font-semibold sm:text-xl">
                Kunjungi Kami
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm sm:text-base text-white border border-white rounded-lg hover:bg-white hover:text-[#003F75] transition-colors"
                    href={social.url}
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h3 className="mb-4 text-lg font-semibold sm:text-xl">
                Navigasi
              </h3>
              <ul className="space-y-2 space-x-2 text-sm sm:text-base">
                {navigationLinks.map((link, index) => (
                  <button
                    key={index}
                    className="transition-colors cursor-pointer mr1 hover:text-gray-300"
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate(link.to);
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 md:col-span-2 lg:col-span-1">
              <h3 className="mb-4 text-lg font-semibold sm:text-xl">
                Kontak Kami
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <contact.icon className="flex-shrink-0 w-5 h-5 mt-1" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold">{contact.title}</h4>
                      <p className="text-xs text-gray-300 break-all sm:text-sm">
                        {contact.info}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Section */}
      <div className="w-full bg-[#1167B1] text-white py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="container w-full mx-auto lg:w-11/12">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            <p className="text-xs text-center sm:text-sm lg:text-left">
              Copyright © 2010 - 2025 Pemerintah Kabupaten Ngawi.
              <span className="block sm:inline">
                {" "}
                Hak Cipta dilindungi oleh undang-undang.
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs sm:gap-4 sm:text-sm">
              <Link className="transition-colors hover:text-gray-200" to="#">
                FAQ
              </Link>
              <Link className="transition-colors hover:text-gray-200" to="#">
                Term of Use
              </Link>
              <Link className="transition-colors hover:text-gray-200" to="#">
                Privacy Policy
              </Link>
              <Link className="transition-colors hover:text-gray-200" to="#">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Alternative Mobile-Optimized Footer
export const FooterMobileFirst = () => {
  const [showChat, setShowChat] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      {showChat && <ChatPanel setShowChat={setShowChat} showChat={showChat} />}

      <footer className="w-full bg-[#003F75] text-white">
        {/* AppAds - Desktop Only */}
        <div className="container relative hidden w-11/12 mx-auto lg:block -top-25">
          <AppAds />
        </div>

        <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="container w-full mx-auto lg:w-11/12">
            {/* Logo and Chat Button */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <img
                alt="logo-white"
                className="w-44 sm:w-52"
                src={assets.logoWhite}
              />
              {/* <Button
                className="text-white shadow-lg bg-gradient-to-r from-green-400 to-green-500"
                radius="full"
                size="md"
                onPress={() => setShowChat(true)}
              >
                <BiMessageDetail className="w-5 h-5" />
                Chat Admin
              </Button> */}
            </div>

            {/* Mobile Accordion Style */}
            <div className="space-y-4 lg:hidden">
              {/* Social Media Accordion */}
              <div className="pb-4 border-b border-white/20">
                <button
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => toggleSection("social")}
                >
                  <h3 className="text-lg font-semibold">Kunjungi Kami</h3>
                  <span className="text-xl">
                    {expandedSection === "social" ? "−" : "+"}
                  </span>
                </button>
                {expandedSection === "social" && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {[
                      "Instagram",
                      "TikTok",
                      "YouTube",
                      "Twitter",
                      "Facebook",
                    ].map((social) => (
                      <Link
                        key={social}
                        className="px-3 py-2 text-sm text-center border rounded border-white/50 hover:bg-white/10"
                        to="#"
                      >
                        {social}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Accordion */}
              <div className="pb-4 border-b border-white/20">
                <button
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => toggleSection("nav")}
                >
                  <h3 className="text-lg font-semibold">Navigasi</h3>
                  <span className="text-xl">
                    {expandedSection === "nav" ? "−" : "+"}
                  </span>
                </button>
                {expandedSection === "nav" && (
                  <ul className="mt-4 space-y-2 text-sm">
                    <li>Beranda</li>
                    <li>Data Pertanian</li>
                    <li>Info Pertanian</li>
                    <li>Toko Pertanian</li>
                  </ul>
                )}
              </div>

              {/* Contact Accordion */}
              <div className="pb-4">
                <button
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => toggleSection("contact")}
                >
                  <h3 className="text-lg font-semibold">Kontak</h3>
                  <span className="text-xl">
                    {expandedSection === "contact" ? "−" : "+"}
                  </span>
                </button>
                {expandedSection === "contact" && (
                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <strong>Email:</strong> pertanian@ngawikab.go.id
                    </div>
                    <div>
                      <strong>Telepon:</strong> (0351) 749026
                    </div>
                    <div>
                      <strong>WhatsApp:</strong> (0351) 749026
                    </div>
                    <div>
                      <strong>FAX:</strong> pertanian@ngawikab.go.id
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden gap-10 lg:grid lg:grid-cols-3">
              {/* Desktop content here - same as main Footer */}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-[#1167B1] px-4 py-4 text-center text-xs sm:text-sm">
          <p>© 2010-2025 Pemerintah Kabupaten Ngawi</p>
          <div className="mt-2 space-x-3">
            <Link className="hover:underline" to="#">
              FAQ
            </Link>
            <Link className="hover:underline" to="#">
              Privacy
            </Link>
            <Link className="hover:underline" to="#">
              About
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};
