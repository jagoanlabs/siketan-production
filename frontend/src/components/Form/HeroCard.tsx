import { Card as RACCard } from "@heroui/react";

export const Card = ({ children, shadow, className, ...props }: any) => {
  let shadowClass = "shadow";
  if (shadow === "sm") shadowClass = "shadow-sm";
  if (shadow === "md") shadowClass = "shadow-md";
  if (shadow === "lg") shadowClass = "shadow-lg";
  if (shadow === "none") shadowClass = "shadow-none";

  return (
    <RACCard className={`${shadowClass} ${className || ""}`} {...props}>
      {children}
    </RACCard>
  );
};

export const CardBody = ({ children, className, ...props }: any) => {
  return (
    <div className={`p-5 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = RACCard.Header;
export const CardFooter = RACCard.Footer;
export const CardTitle = RACCard.Title;
