import React from "react";

import { HeroCard } from "./HeroCard";

import { assets } from "@/assets/assets";

export const Hero: React.FC = () => {
  return (
    <>
      <div className="relative w-full lg:mb-32 xl:mb-36" id="beranda">
        {/* Background Image */}
        <div
          className="relative mt-4 flex flex-col items-center justify-center w-full h-screen min-h-[100vh] lg:h-auto lg:min-h-0 lg:aspect-[2/1] lg:mx-4 lg:rounded-3xl bg-cover overflow-hidden"
          style={{
            backgroundImage: `url(${assets.backgroundHomePage})`,
            backgroundPosition: "center bottom",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
            style={{
              backgroundImage: `url(${assets.elipse})`,
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
          {/* Content Container */}
          <div className="">
            {/* Elips PNG dengan Blur (di belakang teks) */}

            {/* Teks Utama */}
            <div className="relative text-center p-6 md:p-8 rounded-2xl  max-w-4xl mx-auto">
              <h1
                className={`font-bold text-green-600 mb-4 lg:mb-6
                text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 
                leading-tight drop-shadow-sm transition-all duration-1000 delay-300`}
              >
                Selamat Datang di Siketan Apps
              </h1>

              <p
                className={`text-gray-800 max-w-3xl mx-auto
                text-lg sm:text-xl md:text-2xl lg:text-lg xl:text-2xl 2xl:text-2xl
                transition-all duration-1000 delay-500 leading-relaxed`}
              >
                Aplikasi untuk Sistem Informasi Kegiatan Penyuluhan Pertanian
              </p>
              {/* CTA Button for Mobile */}
              <div className="mt-8 lg:hidden space-y-3 sm:space-y-0 sm:space-x-4 transition-all duration-1000 delay-700">
                <button className="w-full sm:w-auto px-8 py-3 bg-[#1167B1] text-white font-semibold rounded-full hover:bg-[#0c3e6a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                  Mulai Sekarang
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute transform -translate-x-1/2 bottom-8 left-1/2 lg:hidden">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
              <div className="relative p-2 rounded-full animate-bounce bg-white/20 backdrop-blur">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* HeroCard for Desktop */}
        <div className="hidden lg:block">
          <HeroCard />
        </div>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden h-20 lg:block xl:h-24" />
    </>
  );
};
