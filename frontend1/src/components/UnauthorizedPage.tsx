import { Button } from "@heroui/button";
import { GoAlert, GoArrowLeft, GoShield } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = ({
  title = "Akses Ditolak",
  message = "Maaf, Anda tidak memiliki autorisasi untuk mengakses fitur/halaman ini.",
  onGoBack,
}: {
  title?: string;
  message?: string;
  onGoBack?: () => void;
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
          {/* Header with Icon */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <GoShield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                <p className="text-red-100 mt-1">Error 403 - Forbidden</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Warning Icon & Message */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <GoAlert className="w-10 h-10 text-red-500" />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {message}
              </p>
            </div>

            {/* Possible Reasons */}
            <div className="mb-8">
              <h3 className="font-medium text-gray-900 mb-3">
                Kemungkinan Penyebab:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span>
                    Role Anda tidak memiliki permission untuk mengakses fitur
                    ini
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Sesi login Anda telah berubah atau expired</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Permission belum di-assign oleh administrator</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span>URL yang Anda akses salah atau tidak tersedia</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end sm:flex-row gap-3">
              {/* Go Back */}
              <Button
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                onPress={handleGoBack}
              >
                <GoArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            Butuh bantuan? Hubungi administrator sistem atau
            <a
              className="text-blue-600 hover:text-blue-800 ml-1"
              href="mailto:support@yourdomain.com"
            >
              support@yourdomain.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Komponen untuk berbagai jenis unauthorized access
export const UnauthorizedVariants = {
  // Untuk akses fitur yang memerlukan upgrade role
  UpgradeRequired: (props: any) => (
    <UnauthorizedPage
      {...props}
      customActions={
        <Button className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200">
          <span>Request Upgrade</span>
        </Button>
      }
      message="Fitur ini memerlukan role dengan level akses yang lebih tinggi. Silakan hubungi administrator untuk upgrade akun Anda."
      title="Upgrade Akun Diperlukan"
    />
  ),

  // Untuk fitur yang sedang dalam maintenance
  FeatureMaintenance: (props: any) => (
    <UnauthorizedPage
      {...props}
      message="Maaf, fitur ini sedang dalam tahap maintenance. Silakan coba beberapa saat lagi."
      showContactAdmin={false}
      showRetryButton={true}
      title="Fitur Dalam Maintenance"
    />
  ),

  // Untuk akses yang memerlukan verifikasi tambahan
  AdditionalVerificationNeeded: (props: any) => (
    <UnauthorizedPage
      {...props}
      customActions={
        <Button className="flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200">
          <span>Request Verifikasi</span>
        </Button>
      }
      message="Untuk mengakses fitur ini, Anda memerlukan verifikasi tambahan dari administrator."
      title="Verifikasi Tambahan Diperlukan"
    />
  ),
};

export default UnauthorizedPage;
