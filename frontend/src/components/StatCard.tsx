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
    <div className="flex h-full w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-xs border border-gray-200/80 dark:border-gray-750 transition-all duration-200 hover:shadow-md group/card">
      {/* Left vertical color strip */}
      <div className={`w-1.5 sm:w-2 shrink-0 ${highlightColor}`} />

      {/* Main content */}
      <div
        className={`flex-1 ${bgColor} px-3.5 sm:px-4 lg:px-5 py-3.5 sm:py-4 flex flex-col justify-between min-h-[96px] sm:min-h-[108px] w-full`}
      >
        <p className="text-xs sm:text-sm lg:text-[15px] font-semibold text-gray-700 dark:text-gray-200 tracking-tight line-clamp-1 mb-1 sm:mb-2">
          {title}
        </p>
        <div className={`flex items-center gap-2 sm:gap-2.5 ${textColor} mt-auto`}>
          <div className="text-lg sm:text-2xl lg:text-3xl shrink-0">{icon}</div>
          {loading ? (
            <span className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md w-16 h-6 sm:w-20 sm:h-7 lg:w-24 lg:h-8 inline-block" />
          ) : (
            <span className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight break-words leading-tight">
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
