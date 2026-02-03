import { Button } from "@heroui/button";
import { FiRefreshCw, FiAlertCircle } from "react-icons/fi";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Terjadi Kesalahan",
  message = "Gagal memuat data. Silakan coba lagi.",
  onRetry,
  showRetry = true,
}) => (
  <div className="text-center py-12">
    <div className="flex justify-center mb-4">
      <FiAlertCircle className="w-12 h-12 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6">{message}</p>
    {showRetry && onRetry && (
      <Button
        className="bg-red-500 text-white hover:bg-red-600"
        startContent={<FiRefreshCw className="w-4 h-4" />}
        onClick={onRetry}
      >
        Coba Lagi
      </Button>
    )}
  </div>
);
