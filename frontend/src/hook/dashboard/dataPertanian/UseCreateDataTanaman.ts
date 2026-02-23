import type {
  FormErrors,
  PetaniOption,
  PetaniData,
  SelectOption,
  CreateTanamanFormData,
  UseCreateDataTanamanReturn,
} from "@/types/DataPertanian/createDataTanaman.d";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import {
  createTanaman,
  type CreateTanamanData,
} from "@/service/DashboardAdmin/tanaman/tanaman-service";

export const useCreateDataTanaman = (): UseCreateDataTanamanReturn => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState<CreateTanamanFormData>({
    statusKepemilikanLahan: "",
    luasLahan: "",
    kategori: "",
    jenis: "",
    komoditas: "",
    periodeMusimTanam: "",
    periodeBulanTanam: "",
    prakiraanLuasPanen: 0,
    prakiraanProduksiPanen: 0,
    prakiraanBulanPanen: "",
    fk_petaniId: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedPetani, setSelectedPetani] = useState<PetaniOption | null>(
    null,
  );
  const [isPetaniLoading, setIsPetaniLoading] = useState(false);

  // Options for Select fields
  const statusKepemilikanOptions: SelectOption[] = [
    { key: "MILIK SENDIRI", label: "Milik Sendiri" },
    { key: "TANAH SEWA", label: "Tanah Sewa" },
    { key: "BAGI HASIL", label: "Bagi Hasil" },
    { key: "GADAI", label: "Gadai" },
  ];

  const kategoriOptions: SelectOption[] = [
    { key: "TANAMAN PANGAN", label: "Tanaman Pangan" },
    { key: "TANAMAN PERKEBUNAN", label: "Tanaman Perkebunan" },
    { key: "HORTIKULTURA", label: "Hortikultura" },
  ];

  const jenisOptions: SelectOption[] = [
    { key: "SAYUR", label: "Sayur" },
    { key: "BUAH", label: "Buah" },
    { key: "PADI", label: "Padi" },
    { key: "PALAWIJA", label: "Palawija" },
    { key: "PERKEBUNAN", label: "Perkebunan" },
  ];

  const periodeMusimOptions: SelectOption[] = [
    { key: "Tanaman Semusim", label: "Tanaman Semusim" },
    { key: "Tanaman Tahunan", label: "Tanaman Tahunan" },
  ];

  const bulanOptions: SelectOption[] = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ].map((bulan) => ({ key: bulan, label: bulan }));

  // Common komoditas suggestions
  const komoditasSuggestions: string[] = [
    "Padi Organik",
    "Padi Konvensional",
    "Jagung",
    "Kedelai",
    "Kacang Tanah",
    "Kacang Hijau",
    "Ubi Kayu",
    "Ubi Jalar",
    "Cabai Merah",
    "Cabai Rawit",
    "Tomat",
    "Terong",
    "Kangkung",
    "Bayam",
    "Sawi",
    "Mentimun",
  ];

  // Load petani options for AsyncSelect
  const loadPetaniOptions = async (
    inputValue: string,
  ): Promise<PetaniOption[]> => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }

    try {
      setIsPetaniLoading(true);
      const response = await axiosClient.get(
        `/search/petani?search=${inputValue}`,
      );
      const petaniData: PetaniData[] = response.data.data;

      return petaniData.map((petani) => ({
        value: petani.id,
        label: `${petani.nama} (${petani.nik})`,
        nik: petani.nik,
        nama: petani.nama,
        alamat: petani.alamat,
        desa: petani.desaData?.nama || petani.desa,
        kecamatan: petani.kecamatanData?.nama || petani.kecamatan,
      }));
    } catch (error) {
      console.error("Error loading petani options:", error);
      toast.error("Gagal memuat data petani");

      return [];
    } finally {
      setIsPetaniLoading(false);
    }
  };

  // Handle petani selection
  const handlePetaniChange = (selectedOption: PetaniOption | null) => {
    setSelectedPetani(selectedOption);
    if (selectedOption) {
      handleInputChange("fk_petaniId", selectedOption.value);
    } else {
      handleInputChange("fk_petaniId", 0);
    }
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createTanaman,
    onSuccess: () => {
      navigate("/dashboard-admin/data-tanaman");
    },
  });

  // Handle input change
  const handleInputChange = (
    field: keyof CreateTanamanFormData,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.statusKepemilikanLahan) {
      newErrors.statusKepemilikanLahan = "Status kepemilikan lahan wajib diisi";
    }

    if (!formData.luasLahan || parseFloat(formData.luasLahan) <= 0) {
      newErrors.luasLahan = "Luas lahan harus lebih dari 0";
    }

    if (!formData.kategori) {
      newErrors.kategori = "Kategori tanaman wajib diisi";
    }

    if (!formData.jenis) {
      newErrors.jenis = "Jenis tanaman wajib diisi";
    }

    if (!formData.komoditas.trim()) {
      newErrors.komoditas = "Komoditas wajib diisi";
    }

    if (!formData.periodeMusimTanam) {
      newErrors.periodeMusimTanam = "Periode musim tanam wajib diisi";
    }

    if (!formData.periodeBulanTanam) {
      newErrors.periodeBulanTanam = "Bulan tanam wajib diisi";
    }

    if (!formData.prakiraanLuasPanen || formData.prakiraanLuasPanen <= 0) {
      newErrors.prakiraanLuasPanen = "Prakiraan luas panen harus lebih dari 0";
    }

    if (
      !formData.prakiraanProduksiPanen ||
      formData.prakiraanProduksiPanen <= 0
    ) {
      newErrors.prakiraanProduksiPanen =
        "Prakiraan produksi panen harus lebih dari 0";
    }

    if (!formData.prakiraanBulanPanen) {
      newErrors.prakiraanBulanPanen = "Prakiraan bulan panen wajib diisi";
    }

    if (!formData.fk_petaniId || formData.fk_petaniId === 0) {
      newErrors.fk_petaniId = "Petani wajib dipilih";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon lengkapi semua field yang diperlukan");

      return;
    }

    await createMutation.mutateAsync(formData as CreateTanamanData);
  };

  return {
    // Form state
    formData,
    errors,
    selectedPetani,
    isPetaniLoading,

    // Options
    statusKepemilikanOptions,
    kategoriOptions,
    jenisOptions,
    periodeMusimOptions,
    bulanOptions,
    komoditasSuggestions,

    // Functions
    handleInputChange,
    handlePetaniChange,
    handleSubmit,
    loadPetaniOptions,

    // Mutation
    createMutation,
  };
};
