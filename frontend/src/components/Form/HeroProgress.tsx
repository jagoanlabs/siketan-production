import { ProgressBar } from "@heroui/react";

export const Progress = ({ value, showValueLabel, size, color, classNames, ...props }: any) => {
  return (
    <ProgressBar value={value} size={size} color={color} className={classNames?.base || ""} {...props}>
      <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mb-1">
        {showValueLabel && <ProgressBar.Output />}
      </div>
      <ProgressBar.Track className={`w-full h-2 bg-gray-200 rounded ${classNames?.track || ""}`}>
        <ProgressBar.Fill className={`h-full rounded bg-green-600 ${classNames?.indicator || ""}`} />
      </ProgressBar.Track>
    </ProgressBar>
  );
};
