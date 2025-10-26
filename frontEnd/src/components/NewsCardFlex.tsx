import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";

interface NewsCardProps {
  id: string;
  imageUrl: string;
  author: string;
  title: string;
  description: string;
  createdAt: string;
}

export const NewsCardFlex: React.FC<NewsCardProps> = ({
  id,
  imageUrl,
  author,
  title,
  description,
  createdAt,
}) => {
  return (
    <Link
      className="flex h-52 w-full overflow-hidden transition-shadow duration-200 bg-white border border-gray-300 shadow cursor-pointer rounded-xl hover:shadow-lg"
      to={`/home/information/${id}`}
    >
      {/* Gambar kiri dengan lebar tetap */}
      <div className="w-40 h-auto shrink-0">
        <img
          alt={title}
          className="object-cover w-full h-full rounded-l-xl"
          src={imageUrl}
        />
      </div>

      {/* Konten kanan */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-gray-600 text-medium">
          <FaRegCircleUser size={20} />
          <span>{author}</span>
        </div>

        <h3 className="text-lg font-semibold leading-snug line-clamp-2">
          {title}
        </h3>

        <p className="text-sm leading-snug text-gray-500 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <FaRegCalendarAlt size={18} />
          <span>{createdAt}</span>
        </div>
      </div>
    </Link>
  );
};
