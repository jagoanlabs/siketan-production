import React from "react";
import { Avatar } from "./HeroAvatar";

export const User = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const { name, description, avatarProps, className, ...rest } = props;
  return (
    <div className={`flex items-center gap-3 ${className || ""}`} ref={ref} {...rest}>
      <Avatar {...avatarProps} name={name} />
      <div className="flex flex-col text-left">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{name}</span>
        {description && <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>}
      </div>
    </div>
  );
});

User.displayName = "User";
