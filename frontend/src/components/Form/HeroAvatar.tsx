import { useRef } from "react";
import { Avatar as RACAvatar } from "@heroui/react";

export const Avatar = ({ name, src, className, size }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  
  let sizeClass = "w-10 h-10";
  if (size === "sm") sizeClass = "w-8 h-8";
  if (size === "md") sizeClass = "w-10 h-10";
  if (size === "lg") sizeClass = "w-12 h-12";

  return (
    <RACAvatar
      ref={ref}
      className={`${sizeClass} ${className || ""}`}
      aria-label={name}
    >
      <RACAvatar.Image src={src} />
      <RACAvatar.Fallback>{name?.[0] || "?"}</RACAvatar.Fallback>
    </RACAvatar>
  );
};
