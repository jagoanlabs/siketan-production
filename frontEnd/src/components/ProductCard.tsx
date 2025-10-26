import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  price: string | number;
  link: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  title,
  price,
  link,
}) => {
  return (
    <Link className="block group" to={link}>
      <div className="w-full overflow-hidden bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Container with Badge */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            alt={title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            src={imageUrl}
          />
        </div>

        {/* Content Container */}
        <div className="p-3 sm:p-4">
          {/* Title */}
          <h3 className="text-sm line-clamp-1 sm:text-base font-medium text-gray-800 h-16  mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {/* Price */}
          <p className="text-base sm:text-lg lg:text-xl font-bold text-green-600 mb-3">
            Rp. {price}
          </p>

          {/* Buy Button */}
          <button className="w-full py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md">
            <FiShoppingBag className="w-4 h-4" />
            Beli Sekarang
          </button>
        </div>
      </div>
    </Link>
  );
};
