import { createContext, useContext } from "react";
import { Modal as RACModal } from "@heroui/react";

const ModalContext = createContext<any>(null);

export const Modal = ({ isOpen, onOpenChange, size, backdrop, scrollBehavior, children, onClose, ...props }: any) => {
  const handleClose = onClose || (() => onOpenChange?.(false));
  
  return (
    <ModalContext.Provider value={{ onClose: handleClose }}>
      <RACModal.Root isOpen={isOpen} onOpenChange={onOpenChange || onClose} {...props}>
        <RACModal.Backdrop variant={backdrop === "blur" ? "blur" : "opaque"} />
        <RACModal.Container size={size} scroll={scrollBehavior}>
          <RACModal.Dialog className="outline-none bg-white rounded-xl shadow-xl border border-gray-100 max-w-lg w-full p-6 my-8 mx-auto flex flex-col gap-4">
            {children}
          </RACModal.Dialog>
        </RACModal.Container>
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

export const ModalHeader = ({ children, className, ...props }: any) => {
  return (
    <div className={`text-lg font-bold text-gray-900 border-b pb-2 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

export const ModalBody = ({ children, className, ...props }: any) => {
  return (
    <div className={`text-sm text-gray-600 py-2 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

export const ModalFooter = ({ children, className, ...props }: any) => {
  return (
    <div className={`flex justify-end gap-2 border-t pt-3 mt-2 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};
