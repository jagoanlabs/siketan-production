import type { Swiper as SwiperCore } from "swiper";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface ImageCarouselProps {
  images: string[];
  className?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  className = "",
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Carousel */}
      <Swiper
        className="mb-3 rounded-lg shadow-md"
        loop={true}
        modules={[FreeMode, Navigation, Thumbs]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        spaceBetween={10}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {images.map((img, index) => (
          <SwiperSlide key={`main-${index}`}>
            <div className="relative aspect-square">
              <img
                alt={`Product view ${index + 1}`}
                className="object-cover w-full h-full rounded-xl"
                loading={index === 0 ? "eager" : "lazy"}
                src={img}
              />
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="absolute z-10 p-2 transition-all -translate-y-1/2 rounded-full cursor-pointer swiper-button-prev-custom top-1/2 left-3 bg-white/80 hover:bg-white backdrop-blur-sm">
          <IoChevronBack className="text-gray-800" size={24} />
        </div>
        <div className="absolute z-10 p-2 transition-all -translate-y-1/2 rounded-full cursor-pointer swiper-button-next-custom top-1/2 right-3 bg-white/80 hover:bg-white backdrop-blur-sm">
          <IoChevronForward className="text-gray-800" size={24} />
        </div>
      </Swiper>

      {/* Thumbnail Carousel */}
      <Swiper
        className="!py-2 !px-1"
        freeMode={true}
        loop={false}
        modules={[FreeMode, Navigation, Thumbs]}
        slidesPerView={4}
        spaceBetween={8}
        watchSlidesProgress={true}
        onSwiper={setThumbsSwiper}
      >
        {images.map((img, index) => (
          <SwiperSlide key={`thumb-${index}`}>
            <div
              className={`relative aspect-square transition-all border-2 rounded-md cursor-pointer ${
                activeIndex === index
                  ? "border-green-500"
                  : "border-transparent"
              }`}
            >
              <img
                alt={`Thumbnail ${index + 1}`}
                className={`object-cover w-full h-full rounded-md transition-opacity ${
                  activeIndex === index
                    ? "opacity-100"
                    : "opacity-70 hover:opacity-90"
                }`}
                loading="lazy"
                src={img}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
