import { Separator } from "@heroui/react";

export const Divider = ({ className, orientation, ...props }: any) => {
  return (
    <Separator
      className={`bg-gray-200 dark:bg-gray-700 ${orientation === "vertical" ? "w-[1px] h-full" : "h-[1px] w-full"} ${className || ""}`}
      orientation={orientation}
      {...props}
    />
  );
};
