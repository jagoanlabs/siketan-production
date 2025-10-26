import { Link } from "react-router-dom";

import { PenyuluhForm } from "../components/PenyuluhForm";

import { assets } from "@/assets/assets";

type RoleType = {
  key: string;
  label: string;
};

export const role: RoleType[] = [
  { key: "petani", label: "Petani" },
  { key: "penyuluh", label: "Penyuluh" },
];

export default function RegisterPage() {
  // const [selectedRole, setSelectedRole] = useState<string>("penyuluh");

  // Check if Petani is selected
  // const isPetaniSelected = selectedRole === "petani";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D9EAF2] to-[#E8F3FA] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-6xl bg-white shadow-xl rounded-xl lg:rounded-2xl overflow-hidden lg:max-h-[800px]">
        {/* Left Image Section - Hidden on Mobile */}
        <div className="hidden lg:block relative w-[45%] xl:w-[50%]">
          <img
            alt="Register Art"
            className="object-cover w-full h-full"
            src={assets.imageLoginBackground}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/0 via-transparent to-black/50" />

          {/* Logo on Image */}
          <div className="absolute left-0 p-3 xl:p-4 bg-white/95 backdrop-blur-sm rounded-r-full top-6">
            <img alt="Logo" className="h-8 xl:h-10" src={assets.imageLogo} />
          </div>

          {/* Dynamic Title based on role */}
          <div className="absolute px-6 xl:px-8 text-white bottom-8 lg:bottom-12">
            {/* {isPetaniSelected ? ( */}
            <>
              {/* <p className="text-2xl xl:text-4xl font-light leading-snug">
                Daftar <strong className="font-bold">Sebagai Petani</strong>{" "}
                <br />
                Bergabung <strong className="font-bold">Bersama Kami</strong>
              </p>
              <p className="mt-3 text-sm xl:text-base text-white/80">
                Lengkapi data diri untuk bergabung dalam sistem
              </p>

              Stats
              <div className="flex gap-6 mt-6">
                <div>
                  <p className="text-2xl font-bold">1000+</p>
                  <p className="text-sm text-white/70">Petani Terdaftar</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm text-white/70">Kelompok Tani</p>
                </div>
              </div> */}
            </>
            {/* ) : ( */}
            <>
              <p className="text-2xl xl:text-4xl font-light leading-snug">
                Bergabunglah{" "}
                <strong className="font-bold">Bersama Kami</strong> <br />
                Majukan{" "}
                <strong className="font-bold">Pertanian Indonesia</strong>
              </p>
              <p className="mt-3 text-sm xl:text-base text-white/80">
                Daftar sekarang dan dapatkan akses penuh
              </p>

              {/* Normal Stats */}
              <div className="flex gap-6 mt-6">
                <div>
                  <p className="text-2xl font-bold">1000+</p>
                  <p className="text-sm text-white/70">Petani Terdaftar</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm text-white/70">Penyuluh Aktif</p>
                </div>
              </div>
            </>
            {/* )} */}
          </div>
        </div>

        {/* Right Register Form - Full Width on Mobile */}
        <div className="w-full lg:w-[55%] xl:w-[50%] px-6 sm:px-8 md:px-12 lg:px-10 py-6 sm:py-8 lg:py-10 max-h-screen overflow-y-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <img alt="Logo" className="h-12 sm:h-14" src={assets.imageLogo} />
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex space-x-6 justify-center sm:justify-start">
              <Link
                className="text-base sm:text-lg font-medium text-gray-400 hover:text-black transition-colors"
                to="/login"
              >
                Login
              </Link>
              <Link
                className={`pb-1 text-base sm:text-lg font-semibold text-black border-green-500 border-b-3`}
                to="/register"
              >
                Register
              </Link>
            </div>

            {/* Role Selector */}
            {/* <div className="flex items-center gap-2 justify-center sm:justify-end">
              <span className="text-xs sm:text-sm text-gray-600">
                Daftar sebagai
              </span>
              <Select
                className="w-32 sm:w-36"
                classNames={{
                  trigger: `border-2 ${isPetaniSelected ? "border-green-500" : "border-green-500"} data-[hover=true]:${isPetaniSelected ? "border-green-600" : "border-green-600"} ${isPetaniSelected ? "text-green-500" : "text-green-500"} min-h-unit-10`,
                  value: `font-semibold ${isPetaniSelected ? "!text-green-600" : "!text-green-600"}`,
                }}
                selectedKeys={[selectedRole]}
                size="sm"
                variant="bordered"
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string;

                  setSelectedRole(key);
                  // Reset both forms when switching roles
                }}
              >
                {role.map((roleItem) => (
                  <SelectItem
                    key={roleItem.key}
                    classNames={{
                      base: `data-[hover=true]:${roleItem.key === "petani" ? "bg-green-100" : "bg-green-100"} data-[selected=true]:${roleItem.key === "petani" ? "!text-green-600" : "!text-green-600"}`,
                    }}
                  >
                    {roleItem.label}
                  </SelectItem>
                ))}
              </Select>
            </div> */}
          </div>

          {/* Register Forms
          {isPetaniSelected ? (
          Petani Register Form 
            <PetaniForm key="petani-form" />
          ) : (
            Regular Register Form for Penyuluh 
          <PenyuluhForm key="penyuluh-form" />
          )} */}

          <PenyuluhForm key="penyuluh-form" />
        </div>
      </div>
    </div>
  );
}
