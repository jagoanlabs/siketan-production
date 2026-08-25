import { Checkbox } from "../../../components/Form/HeroCheckbox";
import { Input, Textarea } from "../../../components/Form/HeroInput";
import { Button } from "../../../components/Form/HeroButton";
import { Modal } from "@heroui/react";
import { Select, SelectItem } from "../../../components/Form/HeroSelect";
import ReactSelect from "react-select";

// components/PenyuluhForm.tsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";




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
import {
  penyuluhRegisterSchema,
  type PenyuluhRegisterFormValues,
  type FieldErrors,
  flattenZodErrors,
} from "@/lib/validations/auth.schema";
import { toast } from "sonner";

// @ts-ignore
import privacyPolicyContent from "@/assets/privacy-policy.md?raw";
import { MarkdownViewer } from "../../Legal/components/MarkdownViewer";

import { useRegisterPenyuluh } from "@/hook/useAuthApi";
import { useDebouncedCallback } from "@/utils/debounce";
import {
  useKecamatan,
  useDesaByKecamatan,
  useAllKelompok,
} from "@/hook/dashboard/infoPenyuluh/useCreatePenyuluh";
import { CreatePenyuluhData } from "@/types/DataPenyuluh/createPenyuluh";

interface PenyuluhFormProps {
  onSuccess?: () => void;
}

export const PenyuluhForm: React.FC<PenyuluhFormProps> = ({ onSuccess }) => {
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
  const [errors, setErrors] = useState<FieldErrors<PenyuluhRegisterFormValues>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [identityType, setIdentityType] = useState<"NIK" | "NIP">("NIK");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

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

  // Options for react-select Desa Binaan
  const desaBinaanOptions = useMemo(() => {
    return (desaBinaanData?.data || []).map((desa) => ({
      value: desa.nama,
      label: desa.nama,
    }));
  }, [desaBinaanData]);

  const selectedDesaBinaanValues = useMemo(() => {
    return desaBinaanOptions.filter((opt) =>
      formData.desaBinaan.includes(opt.value),
    );
  }, [desaBinaanOptions, formData.desaBinaan]);

  // Options for react-select Kelompok Binaan
  const kelompokBinaanOptions = useMemo(() => {
    return filteredKelompok.map((kelompok: any) => ({
      value: String(kelompok.id),
      label: `${kelompok.namaKelompok} - ${kelompok.desa} (Gapoktan: ${kelompok.gapoktan})`,
      data: kelompok,
    }));
  }, [filteredKelompok]);

  const selectedKelompokValues = useMemo(() => {
    return kelompokBinaanOptions.filter((opt) =>
      formData.selectedKelompokIds.includes(opt.value),
    );
  }, [kelompokBinaanOptions, formData.selectedKelompokIds]);

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

      reader.onloadend = (_e: any) => {
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

  // Validate a single field with zod
  const validateField = (field: string, newFormData: any) => {
    // Abaikan validasi email selama belum ada "@" (kecuali kosong)
    if (typeof newFormData.email === "string" && newFormData.email.length > 0 && !newFormData.email.includes("@")) {
      if (field === "email") return;
      setErrors((prev) => ({ ...prev, email: undefined }));
    }

    // Abaikan validasi NoWa selama belum minimal 4 digit (kecuali kosong)
    if (field === "NoWa" && typeof newFormData.NoWa === "string" && newFormData.NoWa.length > 0 && newFormData.NoWa.replace(/\D/g, "").length < 4) {
      return;
    }

    const result = penyuluhRegisterSchema.safeParse(newFormData);

    if (result.success) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      const fieldIssue = result.error.issues.find(
        (issue: any) => issue.path.join(".") === field,
      );

      if (fieldIssue) {
        setErrors((prev) => ({
          ...prev,
          [field]: fieldIssue.message,
        }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    }
  };

  // Debounced validator
  const debouncedValidate = useDebouncedCallback(
    (field: string, newFormData: any) => {
      validateField(field, newFormData);
    },
    500,
  );

  // Handle input changes with debounce
  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };

    setFormData(newFormData);

    // For email: skip validation until "@" is present (tapi tetap validasi kalau kosong)
    if (field === "email" && value.length > 0 && value.indexOf("@") === -1) {
      setErrors((prev) => ({ ...prev, email: undefined }));
      return;
    }

    // For NoWa: skip validation until at least 4 digits (tapi tetap validasi kalau kosong)
    if (field === "NoWa" && value.length > 0 && value.replace(/\D/g, "").length < 4) {
      setErrors((prev) => ({ ...prev, NoWa: undefined }));
      return;
    }

    // Clear error immediately, then debounce validation
    if ((errors as Record<string, string | undefined>)[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    debouncedValidate(field, newFormData);
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

  // Handle form submission
  const handlePenyuluhSubmit = async (e: React.FormEvent) => {
    console.log(formData);
    e.preventDefault();

    const result = penyuluhRegisterSchema.safeParse(formData);

    if (!result.success) {
      setErrors(flattenZodErrors(result.error));

      toast.error("Form Tidak Valid", {
        description: "Mohon periksa kembali data yang Anda masukkan.",
        duration: 3000,
      });

      return;
    }

    setErrors({});

    registerMutation.mutate(
      {
        ...formData,
        foto: selectedFile,
      } as unknown as CreatePenyuluhData,
      {
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
        onSuccess?.();
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Terjadi kesalahan saat mendaftar";

        const lowerMessage = typeof message === "string" ? message.toLowerCase() : "";

        if (lowerMessage.includes("email")) {
          setErrors((prev) => ({
            ...prev,
            email: message,
          }));
        }

        if (lowerMessage.includes("nip") || lowerMessage.includes("nik")) {
          setErrors((prev) => ({
            ...prev,
            NIP: message,
          }));
        }

        if (lowerMessage.includes("wa") || lowerMessage.includes("nomor") || lowerMessage.includes("hp")) {
          setErrors((prev) => ({
            ...prev,
            NoWa: message,
          }));
        }

        toast.error("Registrasi Gagal", {
          description: message,
          duration: 4000,
        });
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

            {/* Pilihan Jenis Identitas (Radio Button) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jenis Identitas <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <label
                  onClick={() => {
                    setIdentityType("NIK");
                    if (formData.NIP.length > 16) {
                      handleInputChange("NIP", formData.NIP.slice(0, 16));
                    }
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${identityType === "NIK"
                    ? "border-green-600 bg-green-50/70 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="identityType"
                    value="NIK"
                    checked={identityType === "NIK"}
                    onChange={() => { }}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer accent-green-600"
                  />
                  <div>
                    <span className="font-semibold text-sm text-gray-800 block">
                      NIK (16 Digit)
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => {
                    setIdentityType("NIP");
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${identityType === "NIP"
                    ? "border-green-600 bg-green-50/70 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="identityType"
                    value="NIP"
                    checked={identityType === "NIP"}
                    onChange={() => { }}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer accent-green-600"
                  />
                  <div>
                    <span className="font-semibold text-sm text-gray-800 block">
                      NIP (18 Digit)
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NIP / NIK Input */}
              <Input
                required
                errorMessage={errors.NIP}
                isInvalid={!!errors.NIP}
                label={identityType === "NIP" ? "NIP Penyuluh" : "NIK Penyuluh"}
                labelPlacement="outside"
                maxLength={identityType === "NIP" ? 18 : 16}
                placeholder={
                  identityType === "NIP"
                    ? "Masukkan 18 digit NIP"
                    : "Masukkan 16 digit NIK"
                }
                type="text"
                value={formData.NIP}
                variant="bordered"
                onChange={(e: any) => {
                  const maxDigits = identityType === "NIP" ? 18 : 16;
                  const value = e.target.value.replace(/\D/g, "").slice(0, maxDigits);

                  handleInputChange("NIP", value);
                }}
              />

              {/* Nama Lengkap */}
              <Input
                required
                errorMessage={errors.nama}
                isInvalid={!!errors.nama}
                label="Nama Lengkap"
                labelPlacement="outside"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                variant="bordered"
                onChange={(e: any) => handleInputChange("nama", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <Input
                required
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                label="Email"
                labelPlacement="outside"
                placeholder="email@example.com"
                type="email"
                value={formData.email}
                variant="bordered"
                onChange={(e: any) => handleInputChange("email", e.target.value)}
              />

              {/* WhatsApp */}
              <Input
                required
                errorMessage={errors.NoWa}
                isInvalid={!!errors.NoWa}
                label="No. HP/WhatsApp"
                labelPlacement="outside"
                maxLength={13}
                placeholder="08xxxxxxxxxx (10-13 digit)"
                type="tel"
                value={formData.NoWa}
                variant="bordered"
                onChange={(e: any) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 13);

                  handleInputChange("NoWa", value);
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <Input
                  required
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
                  onChange={(e: any) =>
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
                          className={`flex-1 h-1 rounded-full ${passwordStrength.strength >= level
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
                onChange={(e: any) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
              />
            </div>

            {/* Tipe Penyuluh */}
            <div>
              <p className="block text-sm font-semibold text-gray-700 mb-2">
                Tipe Penyuluh <span className="text-red-500">*</span>
              </p>
              <Select isInvalid={!!errors.tipe}
                placeholder="Pilih tipe penyuluh"
                selectedKeys={formData.tipe ? [formData.tipe] : []}
                variant="bordered"
                onSelectionChange={(keys: any) => {
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
              errorMessage={errors.alamat}
              isInvalid={!!errors.alamat}
              label="Alamat Lengkap"
              labelPlacement="outside"
              placeholder="Masukkan alamat lengkap"
              rows={3}
              value={formData.alamat}
              variant="bordered"
              onChange={(e: any) => handleInputChange("alamat", e.target.value)}
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
                Kecamatan <span className="text-red-500">*</span>
              </p>
              <Select
                isInvalid={!!errors.kecamatan}
                isLoading={loadingKecamatan}
                placeholder="Pilih kecamatan"
                selectedKeys={
                  formData.kecamatanId ? [formData.kecamatanId.toString()] : []
                }
                variant="bordered"
                onSelectionChange={(keys: any) => {
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
                Desa <span className="text-red-500">*</span>
              </p>
              <Select
                isInvalid={!!errors.desa}
                isDisabled={!formData.kecamatanId}
                isLoading={loadingDesa}
                placeholder={
                  formData.kecamatanId ? "Pilih desa" : "Pilih kecamatan dulu"
                }
                selectedKeys={
                  formData.desaId ? [formData.desaId.toString()] : []
                }
                variant="bordered"
                onSelectionChange={(keys: any) => {
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
                Kecamatan Binaan <span className="text-red-500">*</span>
              </p>
              <Select
                isInvalid={!!errors.kecamatanBinaan}
                isLoading={loadingKecamatan}
                placeholder="Pilih kecamatan binaan"
                selectedKeys={
                  formData.kecamatanBinaanId
                    ? [formData.kecamatanBinaanId.toString()]
                    : []
                }
                variant="bordered"
                onSelectionChange={(keys: any) => {
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
              <p className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Desa Wilayah Binaan <span className="text-red-500">*</span>
              </p>
              <ReactSelect
                isMulti
                isDisabled={!formData.kecamatanBinaanId || loadingDesaBinaan}
                isLoading={loadingDesaBinaan}
                placeholder={
                  formData.kecamatanBinaanId
                    ? "Pilih satu atau lebih desa binaan..."
                    : "Pilih kecamatan binaan dulu"
                }
                options={desaBinaanOptions}
                value={selectedDesaBinaanValues}
                onChange={(selectedOptions: any) => {
                  const values = selectedOptions
                    ? selectedOptions.map((opt: any) => opt.value)
                    : [];
                  handleInputChange("desaBinaan", values);
                }}
                classNames={{
                  control: ({ isFocused }) =>
                    `w-full px-2 py-1 bg-transparent border rounded-xl hover:border-gray-400 transition-colors outline-none focus:outline-none flex items-center justify-between min-h-[42px] ${
                      errors.desaBinaan
                        ? "border-red-500 ring-1 ring-red-500"
                        : isFocused
                          ? "border-green-500 ring-1 ring-green-500"
                          : "border-gray-300 dark:border-gray-600"
                    }`,
                  placeholder: () => "text-gray-400 text-sm",
                  multiValue: () =>
                    "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-lg px-2 py-0.5 m-0.5 text-xs font-medium flex items-center gap-1",
                  multiValueLabel: () =>
                    "text-blue-800 dark:text-blue-200 text-xs font-medium",
                  multiValueRemove: () =>
                    "hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5 text-blue-600 transition-colors cursor-pointer",
                  menu: () =>
                    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-1 p-1 z-[9999]",
                  option: ({ isFocused, isSelected }) =>
                    `px-3 py-2 text-sm rounded-lg cursor-pointer ${
                      isSelected
                        ? "bg-green-600 text-white"
                        : isFocused
                          ? "bg-green-50 dark:bg-gray-700 text-green-800 dark:text-green-300"
                          : "text-gray-700 dark:text-gray-200"
                    }`,
                }}
                unstyled
              />
              {errors.desaBinaan && (
                <p className="text-xs text-red-500 mt-1">{errors.desaBinaan}</p>
              )}
            </div>

            {/* Kelompok Binaan - Multiple Select */}
            <div className="mb-10">
              <p className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Kelompok Tani Binaan <span className="text-red-500">*</span>
              </p>
              <ReactSelect
                isMulti
                isDisabled={!formData.kecamatanBinaanId || loadingKelompok}
                isLoading={loadingKelompok}
                placeholder={
                  formData.kecamatanBinaanId
                    ? "Pilih satu atau lebih kelompok tani binaan..."
                    : "Pilih kecamatan binaan dulu"
                }
                options={kelompokBinaanOptions}
                value={selectedKelompokValues}
                onChange={(selectedOptions: any) => {
                  const values = selectedOptions
                    ? selectedOptions.map((opt: any) => opt.value)
                    : [];
                  handleInputChange("selectedKelompokIds", values);
                }}
                classNames={{
                  control: ({ isFocused }) =>
                    `w-full px-2 py-1 bg-transparent border rounded-xl hover:border-gray-400 transition-colors outline-none focus:outline-none flex items-center justify-between min-h-[42px] ${
                      errors.selectedKelompokIds
                        ? "border-red-500 ring-1 ring-red-500"
                        : isFocused
                          ? "border-green-500 ring-1 ring-green-500"
                          : "border-gray-300 dark:border-gray-600"
                    }`,
                  placeholder: () => "text-gray-400 text-sm",
                  multiValue: () =>
                    "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-lg px-2 py-0.5 m-0.5 text-xs font-medium flex items-center gap-1",
                  multiValueLabel: () =>
                    "text-green-800 dark:text-green-200 text-xs font-medium",
                  multiValueRemove: () =>
                    "hover:bg-green-200 dark:hover:bg-green-800 rounded p-0.5 text-green-600 transition-colors cursor-pointer",
                  menu: () =>
                    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-1 p-1 z-[9999]",
                  option: ({ isFocused, isSelected }) =>
                    `px-3 py-2 text-sm rounded-lg cursor-pointer ${
                      isSelected
                        ? "bg-green-600 text-white"
                        : isFocused
                          ? "bg-green-50 dark:bg-gray-700 text-green-800 dark:text-green-300"
                          : "text-gray-700 dark:text-gray-200"
                    }`,
                }}
                unstyled
              />
              {errors.selectedKelompokIds && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.selectedKelompokIds}
                </p>
              )}
            </div>

            {/* Nama Produk */}
            <Input
              label="Nama Produk (Opsional)"
              labelPlacement="outside"
              placeholder="Masukkan nama produk yang dibina"
              value={formData.namaProduct}
              variant="bordered"
              onChange={(e: any) => handleInputChange("namaProduct", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Privacy Policy Checkbox */}
      <div className="mt-6 mb-4">
        <Checkbox
          color="success"
          isSelected={privacyAccepted}
          onValueChange={setPrivacyAccepted}
        >
          <span className="text-sm text-gray-600">
            Saya menyetujui{" "}
            <span
              className="text-green-600 hover:underline font-medium cursor-pointer"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setIsPrivacyModalOpen(true);
              }}
            >
              Kebijakan Privasi
            </span>
          </span>
        </Checkbox>
      </div>

      {/* Privacy Policy Modal */}
      <Modal isOpen={isPrivacyModalOpen} onOpenChange={setIsPrivacyModalOpen}>
        <Modal.Backdrop variant="blur">
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-xl">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Kebijakan Privasi</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="p-6">
                <div className="prose prose-sm max-w-none">
                  <MarkdownViewer content={privacyPolicyContent} />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button color="danger" variant="light" onPress={() => setIsPrivacyModalOpen(false)}>
                  Tutup
                </Button>
                <Button
                  className="text-white"
                  color="success"
                  onPress={() => {
                    setPrivacyAccepted(true);
                    setIsPrivacyModalOpen(false);
                  }}
                >
                  Setuju
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Submit Button */}
      <Button
        className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold text-white rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        isDisabled={
          registerMutation.isPending ||
          !privacyAccepted ||
          !formData.NIP ||
          !formData.nama ||
          !formData.email ||
          !formData.NoWa ||
          !formData.password ||
          !formData.confirmPassword ||
          !formData.alamat ||
          !formData.kecamatanId ||
          !formData.desaId ||
          !formData.kecamatanBinaanId ||
          formData.desaBinaan.length === 0 ||
          formData.selectedKelompokIds.length === 0 ||
          !formData.tipe ||
          Object.values(errors).some(e => !!e)
        }
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
