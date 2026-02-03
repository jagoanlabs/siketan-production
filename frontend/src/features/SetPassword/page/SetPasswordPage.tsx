import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { GoHomeFill } from "react-icons/go";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FiLock, FiCheckCircle } from "react-icons/fi";

import { assets } from "@/assets/assets";
import { usePetaniSetPassword } from "@/hook/usePetaniAuth";

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const setPasswordMutation = usePetaniSetPassword();

  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validasi strength password
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasNumber: false,
    hasLetter: false,
    hasSpecial: false,
  });

  // Ambil NIK dari sessionStorage saat component mount
  useEffect(() => {
    const tempNIK = sessionStorage.getItem("tempNIK");

    if (!tempNIK) {
      // Jika tidak ada NIK, redirect ke login
      navigate("/login");

      return;
    }
    setNik(tempNIK);
  }, [navigate]);

  // Validasi password strength
  useEffect(() => {
    if (password) {
      setPasswordStrength({
        length: password.length >= 6,
        hasNumber: /\d/.test(password),
        hasLetter: /[a-zA-Z]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      });
    }
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi input
    if (!password || !confirmPassword) {
      setError("Password dan konfirmasi password wajib diisi");

      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");

      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");

      return;
    }

    setIsLoading(true);
    setPasswordMutation.mutate(
      {
        NIK: nik,
        password,
        confirmPassword,
      },
      {
        onError: (err: any) => {
          setError(
            err?.response?.data?.message ||
              "Terjadi kesalahan saat mengatur password",
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      },
    );
  };

  const isPasswordValid =
    passwordStrength.length &&
    passwordStrength.hasNumber &&
    passwordStrength.hasLetter;
  const isFormValid =
    isPasswordValid &&
    password === confirmPassword &&
    password.length > 0 &&
    confirmPassword.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF3E2] to-[#FFEFD5] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-6xl bg-white shadow-xl rounded-xl lg:rounded-2xl overflow-hidden">
        {/* Left Image + Overlay - Hidden on Mobile */}
        <div className="hidden lg:block relative w-[45%] xl:w-[50%]">
          <img
            alt="Set Password Art"
            className="object-cover w-full h-full"
            src={assets.imageLoginBackground}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-orange-900/20 via-transparent to-orange-900/60" />

          {/* Logo on Image */}
          <div className="absolute left-0 p-3 xl:p-4 bg-white/95 backdrop-blur-sm rounded-r-full top-6">
            <img alt="Logo" className="h-8 xl:h-10" src={assets.imageLogo} />
          </div>

          {/* Title on Image */}
          <div className="absolute px-6 xl:px-8 text-white bottom-8 lg:bottom-12">
            <p className="text-2xl xl:text-4xl font-light leading-snug">
              Atur <strong className="font-bold">Password Anda</strong> <br />
              Untuk <strong className="font-bold">Keamanan Akun</strong>
            </p>
            <p className="mt-3 text-sm xl:text-base text-white/80">
              Sistem Informasi Kegiatan Pertanian
            </p>
          </div>
        </div>

        {/* Right Set Password Form */}
        <div className="w-full lg:w-[55%] xl:w-[50%] px-6 sm:px-8 md:px-12 lg:px-10 py-6 sm:py-8 lg:py-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <img alt="Logo" className="h-12 sm:h-14" src={assets.imageLogo} />
          </div>

          <div className="flex flex-col items-center md:justify-center h-full">
            <form
              className="w-full lg:w-10/12 xl:w-9/12"
              onSubmit={handleSubmit}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 lg:pb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-bold text-gray-800">
                    Atur Password Baru
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Silakan buat password untuk akun Anda
                  </p>
                </div>
                <Link
                  className="hover:scale-110 transition-transform"
                  to="/login"
                >
                  <GoHomeFill
                    className="text-orange-500 hover:text-orange-600"
                    size={24}
                  />
                </Link>
              </div>

              {/* NIK Display */}
              <div className="mb-14 p-4 bg-orange-50 border  border-orange-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiLock className="text-orange-600 w-8 h-8" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      NIK Anda
                    </p>
                    <p className="text-lg font-bold text-orange-900">{nik}</p>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-10">
                <Input
                  required
                  autoComplete="new-password"
                  classNames={{
                    label: "font-semibold text-sm sm:text-base",
                    inputWrapper:
                      "px-3 sm:px-4 py-5 sm:py-6 w-full border-1 border-gray-300 bg-white hover:border-gray-400 data-[focus=true]:border-orange-500",
                    input: "text-sm sm:text-base",
                  }}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff
                          className="text-gray-400 hover:text-gray-600"
                          size={20}
                        />
                      ) : (
                        <FiEye
                          className="text-gray-400 hover:text-gray-600"
                          size={20}
                        />
                      )}
                    </button>
                  }
                  label="Password Baru"
                  labelPlacement="outside"
                  placeholder="Masukkan password baru"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  variant="bordered"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(""); // Clear error saat mengetik
                  }}
                />

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <FiCheckCircle
                        className={
                          passwordStrength.length
                            ? "text-green-500"
                            : "text-gray-300"
                        }
                        size={14}
                      />
                      <span
                        className={
                          passwordStrength.length
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        Minimal 6 karakter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <FiCheckCircle
                        className={
                          passwordStrength.hasLetter
                            ? "text-green-500"
                            : "text-gray-300"
                        }
                        size={14}
                      />
                      <span
                        className={
                          passwordStrength.hasLetter
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        Mengandung huruf
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <FiCheckCircle
                        className={
                          passwordStrength.hasNumber
                            ? "text-green-500"
                            : "text-gray-300"
                        }
                        size={14}
                      />
                      <span
                        className={
                          passwordStrength.hasNumber
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        Mengandung angka
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="mb-6">
                <Input
                  required
                  autoComplete="new-password"
                  classNames={{
                    label: "font-semibold text-sm sm:text-base",
                    inputWrapper: `px-3 sm:px-4 py-5 sm:py-6 w-full border-1 ${
                      confirmPassword && password !== confirmPassword
                        ? "border-red-500 data-[focus=true]:border-red-500"
                        : confirmPassword && password === confirmPassword
                          ? "border-green-500 data-[focus=true]:border-green-500"
                          : "border-gray-300 hover:border-gray-400 data-[focus=true]:border-orange-500"
                    } bg-white`,
                    input: "text-sm sm:text-base",
                  }}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff
                          className="text-gray-400 hover:text-gray-600"
                          size={20}
                        />
                      ) : (
                        <FiEye
                          className="text-gray-400 hover:text-gray-600"
                          size={20}
                        />
                      )}
                    </button>
                  }
                  label="Konfirmasi Password"
                  labelPlacement="outside"
                  placeholder="Ulangi password baru"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  variant="bordered"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                />

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="mt-2">
                    {password === confirmPassword ? (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <FiCheckCircle size={12} />
                        Password cocok
                      </p>
                    ) : (
                      <p className="text-xs text-red-600">
                        Password tidak cocok
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 text-xs sm:text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full py-5 sm:py-6 text-sm sm:text-base font-semibold text-white rounded-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  isDisabled={!isFormValid || isLoading}
                  isLoading={isLoading}
                  type="submit"
                >
                  {isLoading ? "Mengatur Password..." : "ATUR PASSWORD"}
                </Button>

                <Link
                  className="w-full py-3 text-sm text-center text-gray-600 hover:text-gray-800 transition-colors"
                  to="/login"
                >
                  Kembali ke Login
                </Link>
              </div>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Tips Keamanan:
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Gunakan kombinasi huruf, angka, dan simbol</li>
                  <li>• Jangan gunakan informasi pribadi yang mudah ditebak</li>
                  <li>• Simpan password dengan aman</li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
