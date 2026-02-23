import { useState } from "react";
import { Button } from "@heroui/button";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { GoHomeFill } from "react-icons/go";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { assets } from "@/assets/assets";
import { useLogin } from "@/hook/useAuthApi";
// import { usePetaniLogin } from "@/hook/usePetaniAuth";

type RoleType = {
  key: string;
  label: string;
};

export const role: RoleType[] = [
  { key: "petani", label: "Petani" },
  { key: "penyuluh", label: "Penyuluh" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  // const [selectedRole, setSelectedRole] = useState<string>("penyuluh");

  // Penyuluh login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Petani login states
  // const [nik, setNik] = useState("");
  // const [petaniPassword, setPetaniPassword] = useState("");

  // Common states
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const loginMutation = useLogin();
  // const petaniLoginMutation = usePetaniLogin();

  // Check if Petani is selected
  // const isPetaniSelected = selectedRole === "petani";
  // Check if Petani is selected

  // const handlePetaniLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   petaniLoginMutation.mutate(
  //     { NIK: nik, password: petaniPassword },
  //     {
  //       onError: (err: any) => {
  //         setError(
  //           err?.response?.data?.message || "Terjadi kesalahan saat login",
  //         );
  //       },
  //       onSettled: () => {
  //         setIsLoading(false);
  //       },
  //     },
  //   );
  // };

  const handlePenyuluhLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/");
        },
        onError: (err: any) => {
          setError(
            err?.response?.data?.message || "Terjadi kesalahan saat login",
          );
        },
        onSettled: () => {
          setIsLoading(false);
        },
      },
    );
  };

  // Handle role change
  // const handleRoleChange = (keys: any) => {
  //   const key = Array.from(keys)[0] as string;

  //   setSelectedRole(key);
  //   setError(""); // Clear error when switching roles

  //   // Reset form fields
  //   setEmail("");
  //   setPassword("");
  //   setNik("");
  //   setPetaniPassword("");
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D9EAF2] to-[#E8F3FA] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-6xl lg:max-h-[800px] bg-white shadow-xl rounded-xl lg:rounded-2xl overflow-hidden ">
        {/* Left Image + Overlay - Hidden on Mobile */}
        <div className="hidden lg:block relative w-[45%] xl:w-[50%]">
          <img
            alt="Login Art"
            className="object-cover w-full h-full"
            src={assets.imageLoginBackground}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/0 via-transparent to-black/50" />

          {/* Logo on Image */}
          <div className="absolute left-0 p-3 xl:p-4 bg-white/95 backdrop-blur-sm rounded-r-full top-6">
            <img alt="Logo" className="h-8 xl:h-10" src={assets.imageLogo} />
          </div>

          {/* Title on Image */}
          <div className="absolute px-6 xl:px-8 text-white bottom-8 lg:bottom-12">
            <p className="text-2xl xl:text-4xl font-light leading-snug">
              Melesat <strong className="font-bold">Lebih Cepat</strong> <br />
              Bertumbuh <strong className="font-bold">Lebih Baik</strong>
            </p>
            <p className="mt-3 text-sm xl:text-base text-white/80">
              Sistem Informasi Kegiatan Pertanian
            </p>
          </div>
        </div>

        {/* Right Login Form - Full Width on Mobile */}
        <div className="w-full lg:w-[55%] xl:w-[50%] px-6 sm:px-8 md:px-12 lg:px-10 py-6 sm:py-8 lg:py-10">
          {/* Mobile Logo - Only shown on mobile */}
          <div className="lg:hidden flex justify-center mb-6">
            <img alt="Logo" className="h-12 sm:h-14" src={assets.imageLogo} />
          </div>

          {/* Nav Tabs and Role Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
            {/* Login/Register Tabs */}
            <div className="flex space-x-6 justify-center sm:justify-start">
              <Link
                className="pb-1 text-base sm:text-lg font-semibold text-black border-green-500 border-b-3"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="text-base sm:text-lg font-medium text-gray-400 hover:text-black transition-colors"
                to="/register"
              >
                Register
              </Link>
            </div>

            {/* Role Selector */}
            {/* <div className="flex items-center gap-2 justify-center sm:justify-end">
              <span className="text-xs sm:text-sm text-gray-600 text-nowrap">
                Masuk sebagai
              </span>
              <Select
                className="w-32 sm:w-36"
                classNames={{
                  trigger: `border-2 ${isPetaniSelected ? "border-green-500" : "border-green-500"} data-[hover=true]:${isPetaniSelected ? "border-green-600" : "border-green-600"} ${isPetaniSelected ? "text-green-500" : "text-green-500"} min-h-unit-10`,
                  base: `data-[hover=true]:${isPetaniSelected ? "bg-green-100" : "bg-green-100"} data-[selected=true]:${isPetaniSelected ? "text-green-500" : "text-green-500"} ${isPetaniSelected ? "text-green-400" : "text-green-400"}`,
                  value: `!${isPetaniSelected ? "text-green-500" : "text-green-500"}`,
                }}
                selectedKeys={[selectedRole]}
                size="sm"
                variant="bordered"
                onSelectionChange={handleRoleChange}
              >
                {role.map((roleItem) => (
                  <SelectItem
                    key={roleItem.key}
                    classNames={{
                      base: `data-[hover=true]:${roleItem.key === "petani" ? "bg-green-100" : "bg-green-100"} data-[selected=true]:${roleItem.key === "petani" ? "text-green-500" : "text-green-500"}`,
                    }}
                  >
                    {roleItem.label}
                  </SelectItem>
                ))}
              </Select>
            </div> */}
          </div>

          {/* Login Form or Coming Soon */}
          <div className="flex flex-col items-center mt-[30%]  h-full">
            {/* Coming Soon Message for Petani */}
            {/* {isPetaniSelected ? ( */}
              {/* <form
                className="w-full lg:w-10/12 xl:w-9/12"
                onSubmit={handlePetaniLogin}
              >
                Form Title
                <div className="flex items-center justify-between pb-6 lg:pb-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-bold text-gray-800">
                      Login Siketan Ngawi
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Selamat datang kembali, Penyuluh!
                    </p>
                  </div>
                  <Link className="hover:scale-110 transition-transform" to="/">
                    <GoHomeFill
                      className="text-blue-500 hover:text-blue-600"
                      size={24}
                    />
                  </Link>
                </div>

                NIK Input
                <div className="mb-6 lg:mb-5 pb-6 lg:pb-5">
                  <Input
                    required
                    autoComplete="username"
                    classNames={{
                      label: "font-semibold text-sm sm:text-base",
                      inputWrapper:
                        "px-3 sm:px-4 py-5 sm:py-6 w-full border-1 border-gray-300 bg-white hover:border-gray-400 data-[focus=true]:border-green-500",
                      input: "text-sm sm:text-base",
                    }}
                    label="NIK (Nomor Induk Kependudukan)"
                    labelPlacement="outside"
                    placeholder="Masukkan NIK Anda (16 digit)"
                    type="text"
                    value={nik}
                    variant="bordered"
                    onChange={(e) => {
                      // Only allow numbers and limit to 16 digits
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16);

                      setNik(value);
                    }}
                  />
                </div>

                Password Input
                <div className="mb-2">
                  <Input
                    required
                    autoComplete="current-password"
                    classNames={{
                      label: "font-semibold text-sm sm:text-base",
                      inputWrapper:
                        "px-3 sm:px-4 py-5 sm:py-6 w-full border-1 border-gray-300 bg-white hover:border-gray-400 data-[focus=true]:border-green-500",
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
                    label="Password"
                    labelPlacement="outside"
                    placeholder="Masukkan password Anda"
                    type={showPassword ? "text" : "password"}
                    value={petaniPassword}
                    variant="bordered"
                    onChange={(e) => setPetaniPassword(e.target.value)}
                  />
                </div>

                Error Message
                {error && (
                  <div className="mb-4 p-3 text-xs sm:text-sm text-red-600 bg-red-50 rounded-lg">
                    {error}
                  </div>
                )}

                Links
                <div className="flex items-center justify-between mt-4 mb-6 text-xs sm:text-sm">
                  <Link
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    to="/petani/register"
                  >
                    Belum punya akun?
                  </Link>
                  <Link
                    className="text-green-600 hover:text-green-700 hover:underline transition-colors"
                    to="/petani/forgot-password"
                  >
                    Lupa Password?
                  </Link>
                </div>

                Submit Button
                <Button
                  className="w-full py-5 sm:py-6 text-sm sm:text-base font-semibold text-white rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  isDisabled={
                    !nik || !petaniPassword || isLoading || nik.length !== 16
                  }
                  isLoading={isLoading}
                  type="submit"
                >
                  {isLoading ? "Sedang Masuk..." : "LOGIN"}
                </Button>

                NIK validation helper
                {nik && nik.length > 0 && nik.length !== 16 && (
                  <p className="mt-2 text-xs text-green-600">
                    NIK harus terdiri dari 16 digit
                  </p>
                )}
              </form> */}
            {/* ) : ( */}
              {/* /* Regular Login Form for Penyuluh */}
              <form
                className="w-full lg:w-10/12 xl:w-9/12"
                onSubmit={handlePenyuluhLogin}
              >
                {/* Form Title */}
                <div className="flex items-center justify-between pb-6 lg:pb-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-bold text-gray-800">
                      Login Siketan Ngawi
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Selamat datang kembali, Penyuluh!
                    </p>
                  </div>
                  <Link className="hover:scale-110 transition-transform" to="/">
                    <GoHomeFill
                      className="text-blue-500 hover:text-blue-600"
                      size={24}
                    />
                  </Link>
                </div>

                {/* Email Input */}
                <div className="mb-6 lg:mb-5 pb-6 lg:pb-5">
                  <Input
                    required
                    autoComplete="email"
                    classNames={{
                      label: "font-semibold text-sm sm:text-base",
                      inputWrapper:
                        "px-3 sm:px-4 py-5 sm:py-6 w-full border-1 border-gray-300 bg-white hover:border-gray-400 data-[focus=true]:border-green-500",
                      input: "text-sm sm:text-base",
                    }}
                    label="Email"
                    labelPlacement="outside"
                    placeholder="Masukkan email anda"
                    type="email"
                    value={email}
                    variant="bordered"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Input */}
                <div className="mb-2">
                  <Input
                    required
                    autoComplete="current-password"
                    classNames={{
                      label: "font-semibold text-sm sm:text-base",
                      inputWrapper:
                        "px-3 sm:px-4 py-5 sm:py-6 w-full border-1 border-gray-300 bg-white hover:border-gray-400 data-[focus=true]:border-green-500",
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
                    label="Password"
                    labelPlacement="outside"
                    placeholder="Masukkan password anda"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    variant="bordered"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 text-xs sm:text-sm text-red-600 bg-red-50 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Links */}
                {/* <div className="flex items-center justify-between mt-4 mb-6 text-xs sm:text-sm">
                  <Link
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    to="/register"
                  >
                    Buat akun baru
                  </Link>
                  <Link
                    className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    to="/forgot-password"
                  >
                    Lupa Password?
                  </Link>
                </div> */}

                {/* Submit Button */}
                <Button
                  className="w-full py-5 sm:py-6 mt-6 text-sm sm:text-base font-semibold text-white rounded-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  isDisabled={!email || !password || isLoading}
                  isLoading={isLoading}
                  type="submit"
                >
                  {isLoading ? "Sedang Masuk..." : "LOGIN"}
                </Button>
              </form>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
