import React from "react";
import { Button as RACButton, Spinner } from "@heroui/react";

export const Button = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
  const { isLoading, children, isDisabled, ...rest } = props;
  return (
    <RACButton ref={ref} isDisabled={isDisabled || isLoading} {...rest}>
      {isLoading && <Spinner size="sm" className="mr-2" />}
      {children}
    </RACButton>
  );
});

Button.displayName = "Button";
