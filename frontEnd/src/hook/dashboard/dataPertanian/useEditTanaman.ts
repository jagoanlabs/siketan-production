import type {
  FormErrors,
  PetaniOption,
  PetaniData,
  SelectOption,
} from "@/types/DataPertanian/editDataTanaman";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import {
  getTanamanById,
  updateTanaman,
  type CreateTanamanData,
  type TanamanDetailResponse,
} from "@/service/DashboardAdmin/tanaman/tanaman-service";

export const useEditTanaman = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const tanamanId = parseInt(id || "0");

  // Form State
  const [formData, setFormData] = useState<CreateTanamanData>({
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
    fk_petaniId: 1,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedPetani, setSelectedPetani] = useState<PetaniOption | null>(
    null,
  );
  const [isPetaniLoading, setIsPetaniLoading] = useState(false);

  // Fetch existing data
  const { data: tanamanData, isLoading: isDataLoading } =
    useQuery<TanamanDetailResponse>({
      queryKey: ["tanamanDetail", tanamanId],
      queryFn: () => getTanamanById(tanamanId),
      enabled: !!tanamanId,
    });

  // Set form data when tanaman data is loaded
  useEffect(() => {
    if (tanamanData?.data) {
      const data = tanamanData.data;

      setFormData({
        statusKepemilikanLahan: data.statusKepemilikanLahan,
        luasLahan: data.luasLahan,
        kategori: data.kategori,
        jenis: data.jenis,
        komoditas: data.komoditas,
        periodeMusimTanam: data.periodeMusimTanam,
        periodeBulanTanam: data.periodeBulanTanam,
        prakiraanLuasPanen: data.prakiraanLuasPanen,
        prakiraanProduksiPanen: data.prakiraanProduksiPanen,
        prakiraanBulanPanen: data.prakiraanBulanPanen,
        fk_petaniId: data.fk_petaniId,
      });

      // Set selected petani if exists
      if (data.dataPetani) {
        setSelectedPetani({
          value: data.fk_petaniId,
          label: `${data.dataPetani.nama} (${data.dataPetani.nik})`,
          nik: data.dataPetani.nik,
          nama: data.dataPetani.nama,
          alamat: data.dataPetani.alamat,
          desa: data.dataPetani.desaData?.nama || data.dataPetani.desa,
          kecamatan:
            data.dataPetani.kecamatanData?.nama || data.dataPetani.kecamatan,
        });
      }
    }
  }, [tanamanData]);

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

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: CreateTanamanData) => updateTanaman(tanamanId, data),
    onSuccess: () => {
      navigate("/dashboard-admin/data-tanaman");
    },
  });

  // Handle input change
  const handleInputChange = (field: keyof CreateTanamanData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);

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

    if (!hasChanges) {
      toast.info("Tidak ada perubahan yang perlu disimpan");

      return;
    }

    await updateMutation.mutateAsync(formData);
  };

  return {
    // Data
    formData,
    errors,
    hasChanges,
    selectedPetani,
    isPetaniLoading,
    tanamanData,
    isDataLoading,
    updateMutation,

    // Options
    statusKepemilikanOptions,
    kategoriOptions,
    jenisOptions,
    periodeMusimOptions,
    bulanOptions,

    // Functions
    handleInputChange,
    handleSubmit,
    loadPetaniOptions,
    validateForm,
    navigate,

    // Setters
    setSelectedPetani,
  };
};
