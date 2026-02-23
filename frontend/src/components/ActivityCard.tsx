import { Chip } from "@heroui/chip";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoMdShare } from "react-icons/io";
const monthMap = {
  Januari: 0,
  Februari: 1,
  Maret: 2,
  April: 3,
  Mei: 4,
  Juni: 5,
  Juli: 6,
  Agustus: 7,
  September: 8,
  Oktober: 9,
  November: 10,
  Desember: 11,
};

interface ActivityCardProps {
  imageUrl: string;
  title: string;
  date: string;
  time: string;
  location: string;
  shareActivity?: string | null;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  imageUrl,
  title,
  date,
  time,
  location,
  shareActivity = null,
}) => {
  // Parsing "13 Agustus 2024" → Date object
  const parseDate = (str: string) => {
    const [day, monthName, year] = str.split(" ");

    return new Date(
      Number(year),
      monthMap[monthName as keyof typeof monthMap],
      Number(day),
    );
  };

  const eventDate = parseDate(date);
  const isExpired = eventDate < new Date();

  return (
    <div className="flex w-full h-56 overflow-hidden border-gray-300 shadow-md border-1 rounded-xl">
      {/* Gambar kiri dengan overlay chip */}
      <div className="relative flex-shrink-0 w-1/3 h-full">
        <img
          alt={title}
          className="object-cover w-full h-full"
          src={imageUrl}
        />
        {/* Chip positioned on image */}
        {isExpired && (
          <div className="absolute top-3 left-3">
            <Chip
              className="bg-red-500 text-xs text-white"
              size="sm"
              variant="solid"
            >
              Sudah Berakhir
            </Chip>
          </div>
        )}
      </div>

      {/* Konten kanan */}
      <div className="flex flex-col justify-between w-2/3 p-4">
        {/* Header dengan title dan chip alternatif */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold line-clamp-2 flex-grow">
              {title}
            </h3>
            {/* Alternative chip position - top right of content */}
          </div>
        </div>

        {/* Info details */}
        <div className="space-y-3 text-gray-600 text-medium">
          <div className="flex items-center gap-2">
            <FaRegCalendarAlt className="text-gray-500" size={20} />
            <span>{date}</span>
            {/* Chip inline dengan tanggal */}
          </div>

          <div className="flex items-center gap-2">
            <FaRegClock className="text-gray-500" size={20} />
            <span>{time}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineLocationMarker className="text-gray-500" size={20} />
              <span className="">{location}</span>
            </div>

            {shareActivity && (
              <button className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
                <IoMdShare className="text-green-500" size={20} />
                <span className="text-green-500 text-sm">Bagikan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
