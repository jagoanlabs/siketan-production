// components/PenyuluhForm.tsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Link } from "react-router-dom";
import { Select, SelectItem } from "@heroui/select";
import { Input, Textarea } from "@heroui/input";
import { GoHomeFill } from "react-icons/go";
import {
  FiCheck,
  FiEye,
  FiEyeOff,
  FiX,
  FiUpload,
  FiUser,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import { toast } from "sonner";

import { useRegisterPenyuluh } from "@/hook/useAuthApi";
import {
  useKecamatan,
  useDesaByKecamatan,
  useAllKelompok,
} from "@/hook/dashboard/infoPenyuluh/useCreatePenyuluh";
import { CreatePenyuluhData } from "@/types/DataPenyuluh/createPenyuluh";

export function PenyuluhForm() {
  const navigate = useNavigate();

  // Penyuluh Form States - Updated to match CreatePenyuluh
  const [formData, setFormData] = useState({
    NIP: "",
    nama: "",
    email: "",
    NoWa: "",
    password: "",
    confirmPassword: "",
    alamat: "",
    kecamatanId: null as number | null,
    kecamatan: "",
    desaId: null as number | null,
    desa: "",
    kecamatanBinaanId: null as number | null,
    kecamatanBinaan: "",
    desaBinaan: [] as string[],
    namaProduct: "",
    selectedKelompokIds: [] as string[],
    tipe: "reguler",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // API Hooks - Updated to match CreatePenyuluh
  // const registerMutation = useRegister();
  const registerMutation = useRegisterPenyuluh();
  const { data: kecamatanData, isLoading: loadingKecamatan } = useKecamatan();
  const { data: desaData, isLoading: loadingDesa } = useDesaByKecamatan(
    formData.kecamatanId,
  );
  const { data: desaBinaanData, isLoading: loadingDesaBinaan } =
    useDesaByKecamatan(formData.kecamatanBinaanId);
  const { data: kelompokData, isLoading: loadingKelompok } = useAllKelompok();

  // Filtered kelompok based on selected kecamatan binaan
  const filteredKelompok = useMemo(() => {
    if (!kelompokData?.dataKelompok || !formData.kecamatanBinaanId) {
      return [];
    }

    return Object.values(kelompokData.dataKelompok).filter(
      (kelompok: any) => kelompok.kecamatanId === formData.kecamatanBinaanId,
    );
  }, [kelompokData, formData.kecamatanBinaanId]);

  // Handle file upload
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

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File terlalu besar", {
          description: "Ukuran file maksimal 5MB",
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

  const passwordStrength = checkPasswordStrength(formData.password);

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle kecamatan selection
  const handleKecamatanChange = (value: string) => {
    const selectedKecamatan = kecamatanData?.data.find(
      (k) => k.id.toString() === value,
    );

    if (selectedKecamatan) {
      setFormData((prev) => ({
        ...prev,
        kecamatanId: selectedKecamatan.id,
        kecamatan: selectedKecamatan.nama,
        desaId: null,
        desa: "",
      }));
    }
  };

  // Handle desa selection
  const handleDesaChange = (value: string) => {
    const selectedDesa = desaData?.data.find((d) => d.id.toString() === value);

    if (selectedDesa) {
      setFormData((prev) => ({
        ...prev,
        desaId: selectedDesa.id,
        desa: selectedDesa.nama,
      }));
    }
  };

  // Handle kecamatan binaan selection
  const handleKecamatanBinaanChange = (value: string) => {
    const selectedKecamatan = kecamatanData?.data.find(
      (k) => k.id.toString() === value,
    );

    if (selectedKecamatan) {
      setFormData((prev) => ({
        ...prev,
        kecamatanBinaanId: selectedKecamatan.id,
        kecamatanBinaan: selectedKecamatan.nama,
        desaBinaan: [],
        selectedKelompokIds: [],
      }));
    }
  };

  // Form validation
  const validatePenyuluhForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.NIP) {
      newErrors.NIP = "NIP wajib diisi";
    }

    if (!formData.nama) {
      newErrors.nama = "Nama lengkap wajib diisi";
    } else if (formData.nama.length < 3) {
      newErrors.nama = "Nama lengkap minimal 3 karakter";
    }

    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email tidak valid";
    }

    if (!formData.NoWa) {
      newErrors.NoWa = "Nomor WhatsApp wajib diisi";
    } else if (!/^[0-9]{10,13}$/.test(formData.NoWa.replace(/\D/g, ""))) {
      newErrors.NoWa = "Nomor WhatsApp tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (passwordStrength.strength < 3) {
      newErrors.password = "Password terlalu lemah";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    if (!formData.alamat) {
      newErrors.alamat = "Alamat wajib diisi";
    }

    if (!formData.kecamatanId) {
      newErrors.kecamatan = "Kecamatan wajib dipilih";
    }

    if (!formData.desaId) {
      newErrors.desa = "Desa wajib dipilih";
    }

    if (!formData.kecamatanBinaanId) {
      newErrors.kecamatanBinaan = "Kecamatan binaan wajib dipilih";
    }

    if (formData.desaBinaan.length === 0) {
      newErrors.desaBinaan = "Minimal pilih satu desa binaan";
    }

    if (formData.selectedKelompokIds.length === 0) {
      newErrors.selectedKelompokIds = "Minimal pilih satu kelompok tani";
    }

    if (!formData.tipe) {
      newErrors.tipe = "Tipe penyuluh wajib dipilih";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handlePenyuluhSubmit = async (e: React.FormEvent) => {
    console.log(formData);
    e.preventDefault();

    if (!validatePenyuluhForm()) {
      toast.error("Form Tidak Valid", {
        description: "Mohon periksa kembali data yang Anda masukkan.",
        duration: 3000,
      });

      return;
    }

    registerMutation.mutate(formData as unknown as CreatePenyuluhData, {
      onSuccess: () => {
        setFormData({
          NIP: "",
          nama: "",
          email: "",
          NoWa: "",
          password: "",
          confirmPassword: "",
          alamat: "",
          kecamatanId: null,
          kecamatan: "",
          desaId: null,
          desa: "",
          kecamatanBinaanId: null,
          kecamatanBinaan: "",
          desaBinaan: [],
          namaProduct: "",
          selectedKelompokIds: [],
          tipe: "reguler",
        });
        setErrors({});
        setSelectedFile(null);
        setFilePreview(null);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      },
    });
  };

  return (
    <form className="w-full" onSubmit={handlePenyuluhSubmit}>
      {/* Form Title */}
      <div className="flex items-center justify-between pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Daftar Akun Penyuluh
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Lengkapi data diri Anda sebagai Penyuluh
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
            {/* Photo Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {filePreview ? (
                  <img
                    alt="Preview"
                    className="w-full h-full object-cover"
                    src={filePreview}
                  />
                ) : (
                  <FiUser className="text-gray-400" size={32} />
                )}
              </div>
              <label className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                <div className="flex items-center gap-2">
                  <FiUpload className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : "Pilih foto"}
                  </span>
                </div>
                <input
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-gray-500 text-center">
                Format: PNG, JPG, JPEG, GIF. Maksimal 5MB.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NIP */}
              <Input
                required
                classNames={{
                  label: "font-semibold text-sm",
                  inputWrapper: `px-4 py-3 border-1 ${errors.NIP ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                errorMessage={errors.NIP}
                isInvalid={!!errors.NIP}
                label="NIP/NIK Penyuluh"
                labelPlacement="outside"
                placeholder="Masukkan NIP/NIK"
                value={formData.NIP}
                variant="bordered"
                onChange={(e) => handleInputChange("NIP", e.target.value)}
              />

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
                value={formData.nama}
                variant="bordered"
                onChange={(e) => handleInputChange("nama", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <Input
                required
                classNames={{
                  label: "font-semibold text-sm",
                  inputWrapper: `px-4 py-3 border-1 ${errors.email ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                label="Email"
                labelPlacement="outside"
                placeholder="email@example.com"
                type="email"
                value={formData.email}
                variant="bordered"
                onChange={(e) => handleInputChange("email", e.target.value)}
              />

              {/* WhatsApp */}
              <Input
                required
                classNames={{
                  label: "font-semibold text-sm",
                  inputWrapper: `px-4 py-3 border-1 ${errors.NoWa ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                errorMessage={errors.NoWa}
                isInvalid={!!errors.NoWa}
                label="No. HP/WhatsApp"
                labelPlacement="outside"
                placeholder="08xxxxxxxxxx"
                type="tel"
                value={formData.NoWa}
                variant="bordered"
                onChange={(e) => handleInputChange("NoWa", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
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
                  placeholder="Minimal 8 karakter"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  variant="bordered"
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
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
                value={formData.confirmPassword}
                variant="bordered"
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
              />
            </div>

            {/* Tipe Penyuluh */}
            <div>
              <p className="block text-sm font-semibold text-gray-700 mb-2">
                Tipe Penyuluh *
              </p>
              <Select
                classNames={{
                  trigger: `px-4 py-3 border-1 ${errors.tipe ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                placeholder="Pilih tipe penyuluh"
                selectedKeys={formData.tipe ? [formData.tipe] : []}
                variant="bordered"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;

                  handleInputChange("tipe", selected);
                }}
              >
                <SelectItem key="reguler" textValue="Reguler">
                  Reguler
                </SelectItem>
                <SelectItem key="swadaya" textValue="Swadaya">
                  Swadaya
                </SelectItem>
              </Select>
              {errors.tipe && (
                <p className="text-xs text-red-500 mt-1">{errors.tipe}</p>
              )}
            </div>

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
              value={formData.alamat}
              variant="bordered"
              onChange={(e) => handleInputChange("alamat", e.target.value)}
            />
          </div>
        </div>

        {/* Wilayah Tempat Tinggal Section */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <FiMapPin className="text-green-500" size={20} />
            Wilayah Tempat Tinggal
          </h3>
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
                  formData.kecamatanId ? [formData.kecamatanId.toString()] : []
                }
                variant="bordered"
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;

                  if (value) handleKecamatanChange(value);
                }}
              >
                {(kecamatanData?.data || []).map((kecamatan) => (
                  <SelectItem key={kecamatan.id} textValue={kecamatan.nama}>
                    {kecamatan.nama}
                  </SelectItem>
                ))}
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
                isDisabled={!formData.kecamatanId}
                isLoading={loadingDesa}
                placeholder={
                  formData.kecamatanId ? "Pilih desa" : "Pilih kecamatan dulu"
                }
                selectedKeys={
                  formData.desaId ? [formData.desaId.toString()] : []
                }
                variant="bordered"
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;

                  if (value) handleDesaChange(value);
                }}
              >
                {(desaData?.data || []).map((desa) => (
                  <SelectItem key={desa.id} textValue={desa.nama}>
                    {desa.nama}
                  </SelectItem>
                ))}
              </Select>
              {errors.desa && (
                <p className="text-xs text-red-500 mt-1">{errors.desa}</p>
              )}
            </div>
          </div>
        </div>

        {/* Wilayah Binaan Section */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <FiUsers className="text-green-500" size={20} />
            Wilayah Binaan
          </h3>
          <div className="space-y-4">
            {/* Kecamatan Binaan */}
            <div>
              <p className="block text-sm font-semibold text-gray-700 mb-2">
                Kecamatan Binaan *
              </p>
              <Select
                classNames={{
                  trigger: `px-4 py-3 border-1 ${errors.kecamatanBinaan ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                isLoading={loadingKecamatan}
                placeholder="Pilih kecamatan binaan"
                selectedKeys={
                  formData.kecamatanBinaanId
                    ? [formData.kecamatanBinaanId.toString()]
                    : []
                }
                variant="bordered"
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;

                  if (value) handleKecamatanBinaanChange(value);
                }}
              >
                {(kecamatanData?.data || []).map((kecamatan) => (
                  <SelectItem key={kecamatan.id} textValue={kecamatan.nama}>
                    {kecamatan.nama}
                  </SelectItem>
                ))}
              </Select>
              {errors.kecamatanBinaan && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.kecamatanBinaan}
                </p>
              )}
            </div>

            {/* Desa Binaan - Multiple Select */}
            <div>
              <p className="block text-sm font-semibold text-gray-700 mb-2">
                Desa Wilayah Binaan *
              </p>
              <Select
                classNames={{
                  trigger: `px-4 py-3 border-1 ${errors.desaBinaan ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                isDisabled={!formData.kecamatanBinaanId}
                isLoading={loadingDesaBinaan}
                isMultiline={true}
                placeholder={
                  formData.kecamatanBinaanId
                    ? "Pilih desa binaan"
                    : "Pilih kecamatan binaan dulu"
                }
                renderValue={(items) => (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <div
                        key={item.key}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {item.textValue}
                      </div>
                    ))}
                  </div>
                )}
                selectedKeys={formData.desaBinaan}
                selectionMode="multiple"
                variant="bordered"
                onSelectionChange={(keys) => {
                  handleInputChange("desaBinaan", Array.from(keys));
                }}
              >
                {(desaBinaanData?.data || []).map((desa) => (
                  <SelectItem key={desa.nama} textValue={desa.nama}>
                    {desa.nama}
                  </SelectItem>
                ))}
              </Select>
              {errors.desaBinaan && (
                <p className="text-xs text-red-500 mt-1">{errors.desaBinaan}</p>
              )}
            </div>

            {/* Kelompok Binaan - Multiple Select */}
            <div className="mb-10">
              <p className="block text-sm font-semibold text-gray-700 mb-2">
                Kelompok Tani Binaan *
              </p>
              <Select
                classNames={{
                  trigger: `px-4 py-3 border-1 ${errors.selectedKelompokIds ? "border-red-500" : "border-gray-300"} hover:border-gray-400 data-[focus=true]:border-green-500`,
                }}
                isDisabled={!formData.kecamatanBinaanId}
                isLoading={loadingKelompok}
                isMultiline={true}
                placeholder="Pilih kelompok yang akan dibina"
                renderValue={(items) => (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <div
                        key={item.key}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {item.textValue}
                      </div>
                    ))}
                  </div>
                )}
                selectedKeys={formData.selectedKelompokIds}
                selectionMode="multiple"
                variant="bordered"
                onSelectionChange={(keys) => {
                  handleInputChange("selectedKelompokIds", Array.from(keys));
                }}
              >
                {filteredKelompok.map((kelompok: any) => (
                  <SelectItem
                    key={kelompok.id}
                    textValue={`${kelompok.namaKelompok} - ${kelompok.desa}`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {kelompok.namaKelompok} - {kelompok.desa}
                      </span>
                      <span className="text-xs text-gray-500">
                        Gapoktan: {kelompok.gapoktan}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </Select>
              {errors.selectedKelompokIds && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.selectedKelompokIds}
                </p>
              )}
            </div>

            {/* Nama Produk */}
            <Input
              classNames={{
                label: "font-semibold text-sm",
                inputWrapper:
                  "px-4 py-3 border-1 border-gray-300 hover:border-gray-400 data-[focus=true]:border-green-500",
              }}
              label="Nama Produk (Opsional)"
              labelPlacement="outside"
              placeholder="Masukkan nama produk yang dibina"
              value={formData.namaProduct}
              variant="bordered"
              onChange={(e) => handleInputChange("namaProduct", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        className="w-full mt-6 py-5 sm:py-6 text-sm sm:text-base font-semibold text-white rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        isDisabled={registerMutation.isPending}
        isLoading={registerMutation.isPending}
        type="submit"
      >
        {registerMutation.isPending ? (
          <div className="flex items-center space-x-2">
            <span>Mendaftarkan...</span>
          </div>
        ) : (
          "DAFTAR SEBAGAI PENYULUH"
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
          Dengan mendaftar sebagai Penyuluh, Anda akan mendapatkan akses ke
          semua fitur Siketan Ngawi untuk penyuluh
        </p>
      </div>
    </form>
  );
}
