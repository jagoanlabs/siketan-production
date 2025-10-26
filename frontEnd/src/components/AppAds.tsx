import { assets } from "@/assets/assets";

export const AppAds = () => {
  return (
    // Hidden on mobile, visible from lg breakpoint
    <div className="hidden lg:flex mt-50 flex-row items-center justify-evenly w-full px-6 xl:px-8 py-6 xl:py-8 gap-6 xl:gap-10 bg-sky-700 rounded-2xl h-[250px] xl:h-[283px]">
      {/* Left: App Images */}
      <div className="relative w-[30%] xl:w-[25%] flex justify-center">
        <img
          alt="Ilustrasi Aplikasi Siketan"
          className="w-full z-0 max-w-[200px] xl:max-w-[244px] h-auto absolute -top-40 xl:-top-47 object-contain"
          src={assets.imageAdsApp2}
        />
        <img
          alt="Ilustrasi Aplikasi Siketan"
          className="w-full z-1 -right-2 max-w-[200px] xl:max-w-[244px] h-auto absolute -top-40 xl:-top-47 object-contain"
          src={assets.imageAdsApp}
        />
      </div>

      {/* Right: Text and CTA */}
      <div className="flex flex-col items-start w-[65%] xl:w-[60%] text-white">
        <h1 className="mb-2 text-2xl font-semibold leading-snug xl:mb-3 xl:text-3xl">
          Unduh aplikasi <span className="font-bold text-white">Siketan</span>{" "}
          untuk Android
        </h1>
        <p className="mb-4 text-sm xl:mb-6 xl:text-base">
          Dapatkan kemudahan dalam mengakses layanan kegiatan penyuluhan
          pertanian di Kabupaten Ngawi.
        </p>

        <a
          className="flex items-center w-full justify-center gap-3 xl:gap-4 px-4 xl:px-5 py-2.5 xl:py-3 text-base xl:text-lg font-semibold text-center text-black transition bg-gray-100 rounded-full hover:bg-gray-200"
          href="https://play.google.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            alt="Get it on Google Play"
            className="h-auto w-28 xl:w-32"
            src={assets.imageGetItGoogle}
          />
        </a>
      </div>
    </div>
  );
};
