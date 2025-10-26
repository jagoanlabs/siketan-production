import { FiMapPin, FiStopCircle } from "react-icons/fi";
import { IoStorefrontOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
// Enhanced Store Card Component
interface StoreCardProps {
  imageUrl: string;
  description: string;
  title: string;
  link: string;
  location: string;
}
/**
 * Enhanced Store Card Component
 * @param {string} imageUrl - The store's logo URL
 * @param {string} title - The store's name
 * @param {string} description - A short description of the store
 * @param {string} link - The link to the store's detail page
 * @param {string} location - The store's location
 * @param {number} products - The number of products sold by the store
 * @returns {ReactElement} The StoreCard component
 */
export const StoreCard: React.FC<StoreCardProps> = ({
  title,
  link,
  location,
}) => {
  return (
    <Link className="block group" to={link}>
      <div className="w-full h-full overflow-hidden bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1">
        {/* Store Header Image */}
        <div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden bg-gradient-to-br from-blue-100 to-green-100">
          {/* <img
            alt={title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            src={imageUrl}
            loading="lazy"
          /> */}
          <IoStorefrontOutline className="w-full h-full text-gray-600" />
        </div>

        {/* Store Info */}
        <div className="p-3 sm:p-4">
          {/* Store Name */}
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mb-2">
            <FiMapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{location}</span>
          </div>

          {/* Visit Button */}
          <button className="w-full py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md">
            <FiStopCircle className="w-4 h-4" />
            Kunjungi Toko
          </button>
        </div>
      </div>
    </Link>
  );
};
