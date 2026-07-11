import { Breadcrumbs as RACBreadcrumbs, BreadcrumbsItem as RACBreadcrumbsItem } from "@heroui/react";

export const Breadcrumbs = ({ children, size, className, ...props }: any) => {
  // Map size classes to className
  let sizeClass = "";
  if (size === "sm") sizeClass = "text-xs";
  if (size === "md") sizeClass = "text-sm";
  if (size === "lg") sizeClass = "text-base";

  return (
    <RACBreadcrumbs className={`${sizeClass} ${className || ""}`} {...props}>
      {children}
    </RACBreadcrumbs>
  );
};

export const BreadcrumbsItem = ({ children, classNames, className, ...props }: any) => {
  const itemClass = classNames?.item || classNames?.base || className || "";
  return (
    <RACBreadcrumbsItem className={itemClass} {...props}>
      {children}
    </RACBreadcrumbsItem>
  );
};
