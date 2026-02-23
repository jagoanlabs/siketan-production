import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Link } from "react-router-dom";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";
import { forwardRef, useImperativeHandle } from "react";
import { GoHomeFill } from "react-icons/go";
import {
  FiEye,
  FiEyeOff,
  FiUpload,
  FiUser,
  FiMapPin,
  FiUsers,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { toast } from "sonner";

import {
  useDesa,
  useKecamatan,
  useKelompokTaniByDesa,
  usePenyuluh,
  usePetaniRegister,
} from "@/hook/usePetaniAuth";
type PetaniFormRef = {
  resetForm?: () => void;
};
export const PetaniForm = forwardRef<PetaniFormRef, {}>((_, ref) => {
  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setPetaniForm({
        NIK: "",
        NKK: "",
        nama: "",
        email: "",
        alamat: "",
        desa: "",
        kecamatan: "",
        password: "",
        confirmPassword: "",
        NoWa: "",
        gapoktan: "",
        namaKelompok: "",
        penyuluh: undefined,
        kecamatanId: undefined,
        desaId: undefined,
      });
      setSelectedFile(null);
      setFilePreview(null);
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    },
  }));
  // Petani Form States
  const [petaniForm, setPetaniForm] = useState({
    NIK: "",
    NKK: "",
    nama: "",
    email: "",
    alamat: "",
    desa: "",
    kecamatan: "",
    password: "",
    confirmPassword: "",
    NoWa: "",
    gapoktan: "",
    namaKelompok: "",
    penyuluh: undefined as number | undefined,
    kecamatanId: undefined as number | undefined,
    desaId: undefined as number | undefined,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // API Hooks
  const petaniRegisterMutation = usePetaniRegister();
  const { data: kecamatanList, isLoading: loadingKecamatan } = useKecamatan();
  const { data: desaList, isLoading: loadingDesa } = useDesa(
    petaniForm.kecamatanId || null,
  );
  const { data: penyuluhList, isLoading: loadingPenyuluh } = usePenyuluh();
  const { data: kelompokTaniData, isLoading: loadingKelompokTani } =
    useKelompokTaniByDesa(petaniForm.desaId || null);

  // Check if Petani is selected
  const isPetaniSelected = true;

  // Auto-generate email for petani if not provided
  useEffect(() => {
    if (isPetaniSelected && petaniForm.nama && !petaniForm.email) {
      const firstName = petaniForm.nama.split(" ")[0].toLowerCase();

      setPetaniForm((prev) => ({ ...prev, email: `${firstName}@gmail.com` }));
    }
  }, [isPetaniSelected, petaniForm.nama, petaniForm.email]);

  // Auto-populate gapoktan saat kelompok tani data tersedia
  useEffect(() => {
    if (
      isPetaniSelected &&
      kelompokTaniData?.kelompokTani &&
      kelompokTaniData.kelompokTani.length > 0
    ) {
      // Ambil gapoktan dari kelompok tani pertama (semua gapoktan sama untuk desa yang sama)
      const gapoktan = kelompokTaniData.kelompokTani[0].gapoktan;

      setPetaniForm((prev) => ({
        ...prev,
        gapoktan: gapoktan,
        namaKelompok: "", // Reset nama kelompok saat gapoktan berubah
      }));
    }
  }, [isPetaniSelected, kelompokTaniData]);

  // Handle file upload for petani
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file type
      if (
        !["image/png", "image/jpg", "image/jpeg", "image/gif"].includes(
          file.type,
        )
      ) {
        toast.error("Format file tidak valid", {
          description: "Harap pilih file gambar (PNG, JPG, JPEG, atau GIF)",
        });

        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File terlalu besar", {
          description: "Ukuran file maksimal 2MB",
        });

        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();

      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };

    const strength = Object.values(checks).filter(Boolean).length;

    return { checks, strength };
  };

  const passwordStrength = checkPasswordStrength(petaniForm.password);

  // Form validation for petani
  const validatePetaniForm = () => {
    const newErrors: Record<string, string> = {};

    if (!petaniForm.NIK) {
      newErrors.NIK = "NIK wajib diisi";
    } else if (petaniForm.NIK.length !== 16) {
      newErrors.NIK = "NIK harus 16 digit";
    }

    if (!petaniForm.nama) {
      newErrors.nama = "Nama lengkap wajib diisi";
    } else if (petaniForm.nama.length < 3) {
      newErrors.nama = "Nama minimal 3 karakter";
    }

    if (!petaniForm.NoWa) {
      newErrors.NoWa = "Nomor WhatsApp wajib diisi";
    } else if (!/^[0-9]{10,13}$/.test(petaniForm.NoWa.replace(/\D/g, ""))) {
      newErrors.NoWa = "Nomor WhatsApp tidak valid";
    }

    if (!petaniForm.password) {
      newErrors.password = "Password wajib diisi";
    } else if (petaniForm.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (!petaniForm.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (petaniForm.password !== petaniForm.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    if (!petaniForm.alamat) {
      newErrors.alamat = "Alamat wajib diisi";
    }

    if (!petaniForm.kecamatan) {
      newErrors.kecamatan = "Kecamatan wajib dipilih";
    }

    if (!petaniForm.desa) {
      newErrors.desa = "Desa wajib dipilih";
    }

    if (!petaniForm.penyuluh) {
      newErrors.penyuluh = "Penyuluh wajib dipilih";
    }

    if (!petaniForm.gapoktan) {
      newErrors.gapoktan = "Gapoktan wajib diisi";
    }

    if (!petaniForm.namaKelompok) {
      newErrors.namaKelompok = "Nama kelompok wajib diisi";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePetaniSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePetaniForm()) {
      toast.error("Form Tidak Valid", {
        description: "Mohon periksa kembali data yang Anda masukkan.",
        duration: 3000,
      });

      return;
    }

    // Create FormData for multipart upload
    const submitData = new FormData();

    // Add all petani form data
    submitData.append("NIK", petaniForm.NIK);
    submitData.append("NKK", petaniForm.NKK || petaniForm.NIK); // Use NIK if NKK empty
    submitData.append("nama", petaniForm.nama);
    submitData.append("email", petaniForm.email);
    submitData.append("alamat", petaniForm.alamat);
    submitData.append("desa", petaniForm.desa);
    submitData.append("kecamatan", petaniForm.kecamatan);
    submitData.append("password", petaniForm.password);
    submitData.append("NoWa", petaniForm.NoWa);
    submitData.append("gapoktan", petaniForm.gapoktan);
    submitData.append("namaKelompok", petaniForm.namaKelompok);
    submitData.append("penyuluh", petaniForm.penyuluh!.toString());

    // Add optional IDs if available
    if (petaniForm.kecamatanId) {
      submitData.append("kecamatanId", petaniForm.kecamatanId.toString());
    }
    if (petaniForm.desaId) {
      submitData.append("desaId", petaniForm.desaId.toString());
    }

    // Add file if selected
    if (selectedFile) {
      submitData.append("foto", selectedFile);
    }

    petaniRegisterMutation.mutate(submitData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (isPetaniSelected) {
      setPetaniForm((prev) => ({ ...prev, [field]: value }));

      // Special handling for location fields
      if (field === "kecamatan") {
        const selectedKecamatan = kecamatanList?.data.find(
          (k: any) => k.nama === value,
        );

        if (selectedKecamatan) {
          setPetaniForm((prev) => ({
            ...prev,
            kecamatan: value as string,
            kecamatanId: selectedKecamatan.id,
            desa: "", // Reset desa when kecamatan changes
            desaId: undefined,
          }));
        }
      }

      if (field === "desa") {
        const selectedDesa = desaList?.find((d: any) => d.nama === value);

        if (selectedDesa) {
          setPetaniForm((prev) => ({
            ...prev,
            desa: value as string,
            desaId: selectedDesa.id,
          }));
        }
      }
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form className="w-full" onSubmit={handlePetaniSubmit}>
      {/* Form Title */}
      <div className="flex items-center justify-between pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Daftar Akun Petani
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Lengkapi data diri Anda sebagai Petani
          </p>
        </div>
        <Link className="hover:scale-110 transition-transform" to="/">
          <GoHomeFill
            className="text-green-500 hover:text-green-600"
            size={24}
          />
        </Link>
      </div>

      {/* Form Sections */}
      <div className="space-y-8">
        {/* Data Pribadi Section */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <FiUser className="text-green-500" size={20} />
            Data Pribadi
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NIK */}
              <Input
                required
                className="mb-4"
                classNames={{
                  label: "font-semibold text-sm",
                  inputWrapper: `px-4 py-3 border-1 ${errors.NIK ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                errorMessage={errors.NIK}
                isInvalid={!!errors.NIK}
                label="NIK"
                labelPlacement="outside"
                placeholder="16 digit NIK"
                type="text"
                value={petaniForm.NIK}
                variant="bordered"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 16);

                  handleInputChange("NIK", value);
                }}
              />

              {/* NKK */}
              <Input
                classNames={{
                  label: "font-semibold text-sm",
                  inputWrapper:
                    "px-4 py-3 border-1 border-gray-300 hover:border-gray-400 data-[focus=true]:border-green-500",
                }}
                label="NKK (Opsional)"
                labelPlacement="outside"
                placeholder="16 digit NKK"
                type="text"
                value={petaniForm.NKK}
                variant="bordered"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 16);

                  handleInputChange("NKK", value);
                }}
              />
            </div>

            {/* Nama Lengkap */}
            <Input
              required
              classNames={{
                label: "font-semibold text-sm",
                inputWrapper: `px-4 py-3 border-1 ${errors.nama ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
              }}
              errorMessage={errors.nama}
              isInvalid={!!errors.nama}
              label="Nama Lengkap"
              labelPlacement="outside"
              placeholder="Masukkan nama lengkap"
              type="text"
              value={petaniForm.nama}
              variant="bordered"
              onChange={(e) => handleInputChange("nama", e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* No WhatsApp */}
              <Input
                required
                classNames={{
                  label: "font-semibold text-sm",
                  inputWrapper: `px-4 py-3 border-1 ${errors.NoWa ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                errorMessage={errors.NoWa}
                isInvalid={!!errors.NoWa}
                label="Nomor WhatsApp"
                labelPlacement="outside"
                placeholder="08xxxxxxxxxx"
                startContent={
                  <span className="text-gray-500 text-sm">+62</span>
                }
                type="tel"
                value={petaniForm.NoWa}
                variant="bordered"
                onChange={(e) => handleInputChange("NoWa", e.target.value)}
              />

              {/* Email */}
              <Input
                classNames={{
                  label: "font-semibold text-sm",
                  inputWrapper:
                    "px-4 py-3 border-1 border-gray-300 hover:border-gray-400 data-[focus=true]:border-green-500",
                }}
                label="Email (Opsional)"
                labelPlacement="outside"
                placeholder="email@example.com"
                type="email"
                value={petaniForm.email}
                variant="bordered"
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Password */}
              <Input
                required
                classNames={{
                  label: "font-semibold text-sm",
                  inputWrapper: `px-4 py-3 border-1 ${errors.password ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="text-gray-400" size={18} />
                    ) : (
                      <FiEye className="text-gray-400" size={18} />
                    )}
                  </button>
                }
                errorMessage={errors.password}
                isInvalid={!!errors.password}
                label="Password"
                labelPlacement="outside"
                placeholder="Minimal 6 karakter"
                type={showPassword ? "text" : "password"}
                value={petaniForm.password}
                variant="bordered"
                onChange={(e) => handleInputChange("password", e.target.value)}
              />

              {/* Confirm Password */}
              <Input
                required
                classNames={{
                  label: "font-semibold text-sm",
                  inputWrapper: `px-4 py-3 border-1 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="text-gray-400" size={18} />
                    ) : (
                      <FiEye className="text-gray-400" size={18} />
                    )}
                  </button>
                }
                errorMessage={errors.confirmPassword}
                isInvalid={!!errors.confirmPassword}
                label="Konfirmasi Password"
                labelPlacement="outside"
                placeholder="Ulangi password"
                type={showConfirmPassword ? "text" : "password"}
                value={petaniForm.confirmPassword}
                variant="bordered"
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
              />
            </div>

            {/* Password Strength Indicator */}
            {petaniForm.password && (
              <div className="mt-2 space-y-1 mb-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 h-1 rounded-full ${
                        passwordStrength.strength >= level
                          ? passwordStrength.strength <= 2
                            ? "bg-red-500"
                            : passwordStrength.strength <= 3
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-1">
                    {passwordStrength.checks.length ? (
                      <FiCheck className="text-green-500" size={12} />
                    ) : (
                      <FiX className="text-red-500" size={12} />
                    )}
                    <span>Minimal 8 karakter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.checks.uppercase &&
                    passwordStrength.checks.lowercase ? (
                      <FiCheck className="text-green-500" size={12} />
                    ) : (
                      <FiX className="text-red-500" size={12} />
                    )}
                    <span>Huruf besar dan kecil</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordStrength.checks.number ? (
                      <FiCheck className="text-green-500" size={12} />
                    ) : (
                      <FiX className="text-red-500" size={12} />
                    )}
                    <span>Minimal 1 angka</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div>
            <p className="block text-sm font-semibold text-gray-700 mb-2">
              Foto KTP/Profile (Opsional)
            </p>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                <div className="flex items-center gap-2">
                  <FiUpload className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : "Pilih file gambar"}
                  </span>
                </div>
                <input
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
                />
              </label>
              {filePreview && (
                <img
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg"
                  src={filePreview}
                />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Format: PNG, JPG, JPEG, GIF. Maksimal 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Alamat Section */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
          <FiMapPin className="text-green-500" size={20} />
          Alamat
        </h3>
        <div className="space-y-4">
          {/* Alamat */}
          <Textarea
            required
            classNames={{
              label: "font-semibold text-sm",
              inputWrapper: `px-4 py-3 border-1 ${errors.alamat ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
            }}
            errorMessage={errors.alamat}
            isInvalid={!!errors.alamat}
            label="Alamat Lengkap"
            labelPlacement="outside"
            placeholder="Masukkan alamat lengkap"
            rows={3}
            value={petaniForm.alamat}
            variant="bordered"
            onChange={(e) => handleInputChange("alamat", e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kecamatan */}
            <div>
              <p className="block text-sm font-semibold text-gray-700 mb-2">
                Kecamatan *
              </p>
              <Select
                classNames={{
                  trigger: `px-4 py-3 border-1 ${errors.kecamatan ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                isLoading={loadingKecamatan}
                placeholder="Pilih kecamatan"
                selectedKeys={
                  petaniForm.kecamatan ? [petaniForm.kecamatan] : []
                }
                variant="bordered"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;

                  handleInputChange("kecamatan", selected);
                }}
              >
                {kecamatanList?.data?.map((kecamatan: any) => (
                  <SelectItem key={kecamatan.nama} textValue={kecamatan.nama}>
                    {kecamatan.nama}
                  </SelectItem>
                )) || []}
              </Select>
              {errors.kecamatan && (
                <p className="text-xs text-red-500 mt-1">{errors.kecamatan}</p>
              )}
            </div>

            {/* Desa */}
            <div>
              <p className="block text-sm font-semibold text-gray-700 mb-2">
                Desa *
              </p>
              <Select
                classNames={{
                  trigger: `px-4 py-3 border-1 ${errors.desa ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                isDisabled={!petaniForm.kecamatan}
                isLoading={loadingDesa}
                placeholder={
                  petaniForm.kecamatan ? "Pilih desa" : "Pilih kecamatan dulu"
                }
                selectedKeys={petaniForm.desa ? [petaniForm.desa] : []}
                variant="bordered"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;

                  handleInputChange("desa", selected);
                }}
              >
                {desaList?.map((desa: any) => (
                  <SelectItem key={desa.nama} textValue={desa.nama}>
                    {desa.nama}
                  </SelectItem>
                )) || []}
              </Select>
              {errors.desa && (
                <p className="text-xs text-red-500 mt-1">{errors.desa}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kelompok Tani Section */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
          <FiUsers className="text-green-500" size={20} />
          Kelompok Tani
        </h3>
        <div className="space-y-4">
          {/* Penyuluh */}
          <div>
            <p className="block text-sm font-semibold text-gray-700 mb-2">
              Penyuluh *
            </p>
            <Select
              classNames={{
                trigger: `px-4 py-3 border-1 ${errors.penyuluh ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
              }}
              isLoading={loadingPenyuluh}
              placeholder="Pilih penyuluh"
              selectedKeys={
                petaniForm.penyuluh ? [petaniForm.penyuluh.toString()] : []
              }
              variant="bordered"
              onSelectionChange={(keys) => {
                const selected = Number(Array.from(keys)[0]);

                handleInputChange("penyuluh", selected);
              }}
            >
              {penyuluhList?.map((penyuluh) => (
                <SelectItem key={penyuluh.id} textValue={penyuluh.nama}>
                  <div>
                    <p className="font-medium">
                      {penyuluh.nama} -{" "}
                      {penyuluh.desa
                        ? `(${penyuluh.desa})`
                        : "(tidak ada desa)"}
                    </p>
                  </div>
                </SelectItem>
              )) || []}
            </Select>
            {errors.penyuluh && (
              <p className="text-xs text-red-500 mt-1">{errors.penyuluh}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gapoktan - Auto populated dan disabled */}
            <Input
              classNames={{
                label: "font-semibold text-sm",
                inputWrapper:
                  "px-4 py-3 border-1 border-gray-300 bg-gray-50 hover:border-gray-400",
              }}
              isDisabled={true}
              label="Gapoktan"
              labelPlacement="outside"
              placeholder={
                !petaniForm.desaId
                  ? "Pilih desa terlebih dahulu"
                  : loadingKelompokTani
                    ? "Memuat..."
                    : "Auto terisi dari kelompok"
              }
              type="text"
              value={petaniForm.gapoktan}
              variant="bordered"
            />

            {/* Nama Kelompok - Select dropdown */}
            <div>
              <p className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Kelompok Tani *
              </p>
              <Select
                classNames={{
                  trigger: `px-4 py-3 border-1 ${errors.namaKelompok ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                isDisabled={
                  !kelompokTaniData?.kelompokTani ||
                  kelompokTaniData.kelompokTani.length === 0
                }
                isLoading={loadingKelompokTani}
                placeholder={
                  !petaniForm.desaId
                    ? "Pilih desa terlebih dahulu"
                    : loadingKelompokTani
                      ? "Memuat kelompok tani..."
                      : kelompokTaniData?.kelompokTani?.length === 0
                        ? "Tidak ada kelompok tani di desa ini"
                        : "Pilih kelompok tani"
                }
                selectedKeys={
                  petaniForm.namaKelompok ? [petaniForm.namaKelompok] : []
                }
                variant="bordered"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;

                  handleInputChange("namaKelompok", selected);
                }}
              >
                {kelompokTaniData?.kelompokTani?.map((kelompok: any) => (
                  <SelectItem
                    key={kelompok.namaKelompok}
                    textValue={kelompok.namaKelompok}
                  >
                    <div>
                      <p className="font-medium">{kelompok.namaKelompok}</p>
                      <p className="text-xs text-gray-500">
                        Gapoktan: {kelompok.gapoktan}
                      </p>
                    </div>
                  </SelectItem>
                )) || []}
              </Select>
              {errors.namaKelompok && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.namaKelompok}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        className="w-full mt-6 py-5 sm:py-6 text-sm sm:text-base font-semibold text-white rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        isDisabled={petaniRegisterMutation.isPending}
        isLoading={petaniRegisterMutation.isPending}
        type="submit"
      >
        {petaniRegisterMutation.isPending ? (
          <div className="flex items-center space-x-2">
            <span>Mendaftarkan...</span>
          </div>
        ) : (
          "DAFTAR SEBAGAI PETANI"
        )}
      </Button>

      {/* Login Link */}
      <div className="text-center mt-4">
        <p className="text-xs sm:text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            className="text-green-600 hover:underline font-medium"
            to="/login"
          >
            Masuk di sini
          </Link>
        </p>
      </div>

      {/* Mobile Footer Info */}
      <div className="lg:hidden mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Dengan mendaftar sebagai Petani, Anda akan mendapatkan akses ke semua
          fitur Siketan Ngawi untuk petani
        </p>
      </div>
    </form>
  );
});

PetaniForm.displayName = "PetaniForm";
