import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosNotificationsOutline, IoMdClose, IoMdMenu } from "react-icons/io";

import { DropdownDashboard } from "./DropdownDashboard";

import { useAuth } from "@/hook/UseAuth";
import { assets } from "@/assets/assets";
const navItems = [
  { name: "Beranda", id: "beranda", link: "/" },
  { name: "Data", id: "data-pertanian", link: "/home/data" },
  { name: "Informasi", id: "info-pertanian", link: "/home/information" },
  { name: "Toko", id: "toko-pertanian", link: "/home/toko" },
];

export const Navbar: React.FC<{ index: number | null }> = ({
  index = null,
}) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState(index);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setActiveMenu(index);
  }, [index]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (i: number) => {
    setActiveMenu(i);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <div
        className={`fixed z-11 flex items-center justify-between w-[95%] md:w-[90%] lg:w-full 
        px-4 md:px-5 lg:px-6 py-3 md:py-3.5 lg:py-4 -translate-x-1/2 bg-white shadow-md 
        transition-all duration-300 ${
          isScrolled ? "top-2 md:top-4" : "top-4 md:top-6 lg:top-10"
        } left-1/2 rounded-xl md:rounded-2xl max-w-7xl`}
      >
        {/* Logo */}
        <Link className="flex-shrink-0" to="/">
          <img
            alt="Logo"
            className="w-28 sm:w-32 md:w-36 lg:w-40"
            src={assets.imageLogo}
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="relative hidden gap-4 text-sm font-medium lg:flex xl:gap-6">
          {navItems.map((item, i) => (
            <li key={item.id}>
              <Link
                className={`relative px-2.5 xl:px-3 py-2 transition-colors duration-300 hover:cursor-pointer ${
                  activeMenu === i
                    ? "text-[#1167B1] font-semibold"
                    : "text-gray-700 hover:text-[#1167B1]"
                }`}
                to={item.link}
                onClick={() => setActiveMenu(i)}
              >
                {item.name}
                {activeMenu === i && (
                  <span className="absolute bottom-[-70%] left-0 w-full h-[4px] bg-[#1167B1] rounded-t-2xl animate-slideIn" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Section */}
        <div className="hidden lg:block">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 xl:gap-4">
              {/* Notifikasi */}
              <button className="relative p-2 transition rounded-full hover:bg-gray-100">
                <IoIosNotificationsOutline size={24} />
                {/* Optional: badge notif */}
                <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1 animate-pulse" />
              </button>

              {/* Profile Info */}
              <div className="flex items-center gap-2 xl:gap-3">
                {/* Profile Picture */}
                <div className="overflow-hidden border border-gray-300 rounded-full w-9 h-9 xl:w-10 xl:h-10">
                  <img
                    alt="Profile"
                    className="object-cover w-full h-full"
                    src={
                      (user && user.foto ? user.foto : undefined) ||
                      assets.defaultPicture
                    }
                  />
                </div>

                {/* Name and Role */}
                <div className="hidden leading-tight xl:block">
                  <h1 className="text-sm font-medium">Halo, {user?.nama}</h1>
                  <p className="text-xs text-green-400 uppercase">
                    {user?.peran}
                  </p>
                </div>
              </div>
              <DropdownDashboard />
            </div>
          ) : (
            <Link
              className="bg-[#1167B1] px-4 xl:px-5 py-2.5 xl:py-3 duration-300 hover:bg-[#0c3e6a] text-white rounded-full text-sm"
              to="/login"
            >
              Login | Register
            </Link>
          )}
        </div>

        {/* Mobile Menu Button & Notification for Authenticated Users */}
        <div className="flex items-center gap-2 lg:hidden">
          {isAuthenticated && (
            <button className="relative p-2 transition rounded-full hover:bg-gray-100">
              <IoIosNotificationsOutline size={22} />
              <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1 animate-pulse" />
            </button>
          )}

          <button
            aria-label="Toggle menu"
            className="p-2 transition-colors rounded-lg hover:bg-gray-100"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <IoMdClose className="text-gray-700" size={24} />
            ) : (
              <IoMdMenu className="text-gray-700" size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <button
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] sm:w-[75%] md:w-[60%] max-w-sm bg-white z-40 lg:hidden 
        transform transition-transform duration-300 ease-out shadow-xl ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="p-4 border-b border-gray-200">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 overflow-hidden border-2 border-gray-300 rounded-full">
                <img
                  alt="Profile"
                  className="object-cover w-full h-full"
                  src={
                    (user && user.foto ? user.foto : undefined) ||
                    assets.defaultPicture
                  }
                />
              </div>
              <div className="flex-1">
                <h1 className="font-medium text-gray-900">
                  Halo, {user?.nama}
                </h1>
                <p className="text-sm text-green-400 uppercase">
                  {user?.peran}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="mb-3 text-lg font-semibold text-gray-800">
                Selamat Datang
              </h2>
              <Link
                className="block w-full bg-[#1167B1] px-4 py-3 text-center text-white rounded-lg hover:bg-[#0c3e6a] transition-colors"
                to="/login"
                onClick={toggleMobileMenu}
              >
                Login | Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation Items */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item, i) => (
              <li key={item.id}>
                <Link
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeMenu === i
                      ? "bg-[#1167B1] text-white font-semibold shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  to={
                    item.link
                  }
                  onClick={() => handleMenuClick(i)}
                >
                  <span className="flex items-center justify-between">
                    {item.name}
                    {activeMenu === i && (
                      <span className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Actions for Authenticated Users */}
        {isAuthenticated && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2">
              <Link
                className="block px-4 py-3 text-gray-700 transition-colors rounded-lg hover:bg-white"
                to="/profile"
                onClick={toggleMobileMenu}
              >
                <span className="flex items-center gap-3">
                  <span className="text-gray-500">👤</span>
                  Profile
                </span>
              </Link>

              <Link
                className="block px-4 py-3 text-gray-700 transition-colors rounded-lg hover:bg-white"
                to={
                  user?.peran === "petani"
                    ? "/laporan-petani"
                    : "/laporan-penyuluh"
                }
                onClick={toggleMobileMenu}
              >
                <span className="flex items-center gap-3">
                  <span className="text-gray-500">📝</span>
                  Isi Formulir Laporan
                </span>
              </Link>

              <button
                className="w-full px-4 py-3 text-left text-red-600 transition-colors rounded-lg hover:bg-red-50"
                onClick={() => {
                  logout();
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.reload();
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="text-red-500">🚪</span>
                  Keluar
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};
