import React from "react";

export const Image = React.forwardRef<HTMLImageElement, any>((props, ref) => {
  const { src, alt, className, shadow, radius, ...rest } = props;
  
  let shadowClass = "";
  if (shadow === "sm") shadowClass = "shadow-sm";
  if (shadow === "md") shadowClass = "shadow-md";
  if (shadow === "lg") shadowClass = "shadow-lg";
  
  let radiusClass = "rounded-xl";
  if (radius === "none") radiusClass = "rounded-none";
  if (radius === "sm") radiusClass = "rounded-sm";
  if (radius === "md") radiusClass = "rounded-md";
  if (radius === "lg") radiusClass = "rounded-lg";
  if (radius === "full") radiusClass = "rounded-full";

  return (
    <img
      ref={ref}
      src={src}
      alt={alt || ""}
      className={`object-cover ${radiusClass} ${shadowClass} ${className || ""}`}
      {...rest}
    />
  );
});

Image.displayName = "Image";
