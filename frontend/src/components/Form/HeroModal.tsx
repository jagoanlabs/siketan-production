import { createContext, useContext } from "react";
import { Modal as RACModal } from "@heroui/react";

const ModalContext = createContext<any>(null);

export const Modal = ({ isOpen, onOpenChange, size = "lg", backdrop, scrollBehavior, children, onClose, ...props }: any) => {
  const handleClose = onClose || (() => onOpenChange?.(false));

  return (
    <ModalContext.Provider value={{ onClose: handleClose }}>
      <RACModal.Root isOpen={isOpen} onOpenChange={onOpenChange || onClose} {...props}>
        <RACModal.Backdrop className="!z-[99999]" variant={backdrop === "blur" ? "blur" : "opaque"}>
          <RACModal.Container placement="center" size={size} scroll={scrollBehavior}>
            <RACModal.Dialog>
              {children}
            </RACModal.Dialog>
          </RACModal.Container>
        </RACModal.Backdrop>
      </RACModal.Root>
    </ModalContext.Provider>
  );
};

export const ModalContent = ({ children }: any) => {
  const ctx = useContext(ModalContext);
  const onClose = ctx?.onClose || (() => {});
  return (
    <>
      {typeof children === "function" ? children(onClose) : children}
    </>
  );
};

export const ModalHeader = RACModal.Header;
export const ModalBody = RACModal.Body;
export const ModalFooter = RACModal.Footer;
export const ModalHeading = RACModal.Heading;
export const ModalCloseTrigger = RACModal.CloseTrigger;
export const ModalIcon = RACModal.Icon;
