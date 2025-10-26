import { Modal, ModalContent } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { Progress } from "@heroui/progress";
import { useEffect, useState } from "react";
import { FiDownload, FiUpload, FiDatabase } from "react-icons/fi";

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
  type?: "export" | "import" | "processing" | "default";
  progress?: number;
  showProgress?: boolean;
  onClose?: () => void;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  message = "Memproses...",
  type = "default",
  progress = 0,
  showProgress = false,
}) => {
  const [dots, setDots] = useState("");

  // Animasi dots untuk loading text
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";

        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Reset dots ketika modal dibuka
  useEffect(() => {
    if (isOpen) {
      setDots("");
    }
  }, [isOpen]);

  // Icon berdasarkan type
  const getIcon = () => {
    switch (type) {
      case "export":
        return <FiDownload className="w-8 h-8 text-success-500" />;
      case "import":
        return <FiUpload className="w-8 h-8 text-warning-500" />;
      case "processing":
        return <FiDatabase className="w-8 h-8 text-primary-500" />;
      default:
        return null;
    }
  };

  // Warna spinner berdasarkan type
  const getSpinnerColor = () => {
    switch (type) {
      case "export":
        return "success";
      case "import":
        return "warning";
      case "processing":
        return "primary";
      default:
        return "primary";
    }
  };

  // Background gradient berdasarkan type
  const getBackgroundGradient = () => {
    switch (type) {
      case "export":
        return "from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/30";
      case "import":
        return "from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/30";
      case "processing":
        return "from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/30";
      default:
        return "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700";
    }
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{
        base: "z-[9999]",
        backdrop: "bg-black/60",
      }}
      hideCloseButton={true}
      isDismissable={false}
      isOpen={isOpen}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent className="max-w-md mx-auto">
        <div
          className={`bg-gradient-to-br ${getBackgroundGradient()} border-0 shadow-2xl`}
        >
          <div className="flex flex-col items-center justify-center min-h-[280px] p-8 text-center space-y-6">
            {/* Icon dan Spinner Container */}
            <div className="relative">
              {/* Background circle dengan pulse animation */}
              <div
                className={`
                absolute inset-0 rounded-full animate-ping opacity-20
                ${
                  type === "export"
                    ? "bg-success-400"
                    : type === "import"
                      ? "bg-warning-400"
                      : type === "processing"
                        ? "bg-primary-400"
                        : "bg-gray-400"
                }
              `}
              />

              {/* Spinner dengan icon */}
              <div className="relative flex items-center justify-center">
                <Spinner
                  classNames={{
                    circle1: "border-b-current",
                    circle2: "border-b-current",
                  }}
                  color={getSpinnerColor()}
                  size="lg"
                />

                {/* Icon di tengah spinner */}
                {getIcon() && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {getIcon()}
                  </div>
                )}
              </div>
            </div>

            {/* Message dengan animasi dots */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {message}
                <span className="inline-block w-6 text-left">{dots}</span>
              </h3>

              {/* Sub message berdasarkan type */}
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                {type === "export" && "Sedang menyiapkan file untuk diunduh"}
                {type === "import" && "Sedang memproses file yang Anda upload"}
                {type === "processing" && "Sedang memproses data"}
                {type === "default" && "Mohon tunggu sebentar"}
              </p>
            </div>

            {/* Progress Bar (opsional) */}
            {showProgress && (
              <div className="w-full space-y-2">
                <Progress
                  classNames={{
                    base: "w-full",
                    track: "drop-shadow-md border border-default",
                    indicator: "bg-gradient-to-r from-current to-current",
                    label: "tracking-wider font-medium",
                    value: "text-foreground/60",
                  }}
                  color={getSpinnerColor()}
                  showValueLabel={true}
                  size="sm"
                  value={progress}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {progress}% selesai
                </p>
              </div>
            )}

            {/* Subtle animation elements */}
            <div
              className="absolute top-4 left-4 w-2 h-2 bg-current opacity-20 rounded-full animate-pulse"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="absolute top-6 right-6 w-1 h-1 bg-current opacity-30 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-current opacity-25 rounded-full animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
