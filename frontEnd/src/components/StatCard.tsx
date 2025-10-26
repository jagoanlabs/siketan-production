import React from "react";
interface StatCardProps {
  title: string;
  value?: string | number;
  icon: React.ReactNode;
  bgColor?: string;
  highlightColor?: string;
  textColor?: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  bgColor = "bg-gray-50",
  highlightColor = "bg-gray-600",
  textColor = "text-gray-600",
  loading = false,
}) => {
  return (
    <div className="flex w-full overflow-hidden rounded-lg shadow-md">
      {/* Left vertical color strip */}
      <div className={`w-1.5 sm:w-2 ${highlightColor} rounded-s-xl`} />

      {/* Main content - Responsive padding and font sizes */}
      <div
        className={`flex-1 ${bgColor} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 flex flex-col items-start`}
      >
        <p className="mb-1 text-xs font-semibold text-gray-800 sm:text-sm lg:text-lg sm:mb-2">
          {title}
        </p>
        <div className={`flex items-center gap-1 sm:gap-2 ${textColor}`}>
          <div className="text-lg sm:text-2xl lg:text-3xl">{icon}</div>
          {loading ? (
            <span className="animate-pulse bg-gray-300 rounded w-16 h-7 sm:w-20 sm:h-8 lg:w-24 lg:h-9 inline-block" />
          ) : (
            <span className="text-lg font-bold sm:text-2xl lg:text-3xl">
              {value === undefined || value === null || value === ""
                ? "-"
                : typeof value === "number"
                  ? value.toLocaleString("id-ID")
                  : value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
