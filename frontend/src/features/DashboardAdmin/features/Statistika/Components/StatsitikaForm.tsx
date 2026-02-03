// components/StatistikaForm.tsx (Updated)
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { RadioGroup, Radio } from "@heroui/radio";

import {
  CreateStatistikaFormData,
  KOMODITAS_OPTIONS,
  BULAN_OPTIONS,
} from "@/types/Statistika/statistika.d";
import { useCreateStatistika } from "@/hook/dashboard/Statistika/useStatistika";
import { useUpdateStatistika } from "@/hook/dashboard/Statistika/useEditStatistika";
import {
  EditStatistikaFormData,
  determineJenisTanaman,
} from "@/types/Statistika/editStatistika.d";

interface StatistikaFormProps {
  selectedPoktanId: number | null;
  onSuccess?: () => void;
  // Edit mode props
  isEdit?: boolean;
  editId?: number;
  initialData?: any; // Data from statistika detail API
  kelompokData?: any; // Data from kelompok tani API
}

export const StatistikaForm: React.FC<StatistikaFormProps> = ({
  selectedPoktanId,
  onSuccess,
  isEdit = false,
  editId,
  initialData,
  kelompokData,
}) => {
  const createMutation = useCreateStatistika();
  const updateMutation = useUpdateStatistika();

  // Initialize form data based on mode
  const getInitialFormData = (): CreateStatistikaFormData => {
    if (isEdit && initialData) {
      const jenisTanaman = determineJenisTanaman(
        initialData.kategori,
        initialData.komoditas,
      );

      return {
        kategoriTanaman: initialData.kategori as
          | "pangan"
          | "perkebunan"
          | "jenis_sayur"
          | "buah",
        jenisTanaman,
        komoditasSemusim:
          jenisTanaman === "semusim" ? initialData.komoditas : "",
        komoditasTahunan:
          jenisTanaman === "tahunan" ? initialData.komoditas : "",
        periodeTanam: initialData.periodeTanam,
        luasLahanTanam: initialData.luasLahan,
        prakiraanLuasPanen: initialData.prakiraanLuasPanen,
        prakiraanHasilPanen: initialData.prakiraanHasilPanen,
        prakiraanBulanPanen: initialData.prakiraanBulanPanen,
        fk_kelompokId: initialData.fk_kelompokId,
      };
    }

    // Default for create mode
    return {
      kategoriTanaman: "pangan",
      jenisTanaman: "semusim",
      komoditasSemusim: "",
      komoditasTahunan: "",
      periodeTanam: "",
      luasLahanTanam: 0,
      prakiraanLuasPanen: 0,
      prakiraanHasilPanen: 0,
      prakiraanBulanPanen: "",
      fk_kelompokId: 0,
    };
  };

  const [formData, setFormData] =
    useState<CreateStatistikaFormData>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (isEdit && initialData) {
      const newFormData = getInitialFormData();

      setFormData(newFormData);
    }
  }, [isEdit, initialData]);

  useEffect(() => {
    if (selectedPoktanId) {
      setFormData((prev) => ({ ...prev, fk_kelompokId: selectedPoktanId }));
    }
  }, [selectedPoktanId]);

  // Reset komoditas ketika kategori atau jenis tanaman berubah
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      komoditasSemusim:
        prev.jenisTanaman === "tahunan" ? "" : prev.komoditasSemusim,
      komoditasTahunan:
        prev.jenisTanaman === "semusim" ? "" : prev.komoditasTahunan,
    }));
  }, [formData.kategoriTanaman, formData.jenisTanaman]);

  const handleInputChange = (
    field: keyof CreateStatistikaFormData,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;

        return rest;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.kategoriTanaman)
      newErrors.kategoriTanaman = "Kategori tanaman wajib dipilih";
    if (!formData.jenisTanaman)
      newErrors.jenisTanaman = "Jenis tanaman wajib dipilih";

    // Validasi komoditas berdasarkan jenis tanaman
    if (formData.jenisTanaman === "semusim" && !formData.komoditasSemusim) {
      newErrors.komoditasSemusim = "Komoditas semusim wajib dipilih";
    }
    if (formData.jenisTanaman === "tahunan" && !formData.komoditasTahunan) {
      newErrors.komoditasTahunan = "Komoditas tahunan wajib dipilih";
    }

    if (!formData.periodeTanam)
      newErrors.periodeTanam = "Periode tanam wajib dipilih";
    if (!formData.luasLahanTanam || formData.luasLahanTanam <= 0) {
      newErrors.luasLahanTanam = "Luas lahan tanam harus lebih dari 0";
    }
    if (!formData.prakiraanLuasPanen || formData.prakiraanLuasPanen <= 0) {
      newErrors.prakiraanLuasPanen = "Prakiraan luas panen harus lebih dari 0";
    }
    if (!formData.prakiraanHasilPanen || formData.prakiraanHasilPanen <= 0) {
      newErrors.prakiraanHasilPanen =
        "Prakiraan hasil panen harus lebih dari 0";
    }
    if (!formData.prakiraanBulanPanen)
      newErrors.prakiraanBulanPanen = "Prakiraan bulan panen wajib dipilih";
    if (!selectedPoktanId && !isEdit)
      newErrors.fk_kelompokId = "Poktan wajib dipilih";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEdit && editId && initialData) {
        // Edit mode - prepare EditStatistikaFormData
        const editFormData: EditStatistikaFormData = {
          ...formData,
          id: initialData.id,
          createdAt: initialData.createdAt,
          updatedAt: initialData.updatedAt,
          realisasiLuasPanen: initialData.realisasiLuasPanen,
          realisasiHasilPanen: initialData.realisasiHasilPanen,
          realisasiBulanPanen: initialData.realisasiBulanPanen || "",
        };

        await updateMutation.mutateAsync({
          id: editId,
          data: editFormData,
          kelompokData: kelompokData,
        });
      } else {
        // Create mode
        await createMutation.mutateAsync(formData);

        // Reset form for create mode
        setFormData({
          kategoriTanaman: "pangan",
          jenisTanaman: "semusim",
          komoditasSemusim: "",
          komoditasTahunan: "",
          periodeTanam: "",
          luasLahanTanam: 0,
          prakiraanLuasPanen: 0,
          prakiraanHasilPanen: 0,
          prakiraanBulanPanen: "",
          fk_kelompokId: selectedPoktanId || 0,
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error submitting statistika:", error);
    }
  };

  const getKomoditasSemusimOptions = () => {
    const options = KOMODITAS_OPTIONS[formData.kategoriTanaman];

    if (!options) return [];

    return options.semusim || [];
  };

  const getKomoditasTahunanOptions = () => {
    const options = KOMODITAS_OPTIONS[formData.kategoriTanaman];

    if (!options) return [];

    return options.tahunan || [];
  };

  const isLoading = isEdit
    ? updateMutation.isPending
    : createMutation.isPending;

  return (
    <form className="space-y-6 p-5" onSubmit={handleSubmit}>
      {/* Kategori Tanaman */}
      <div>
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Kategori Tanaman <span className="text-red-500">*</span>
        </p>
        <RadioGroup
          className="gap-4"
          orientation="horizontal"
          value={formData.kategoriTanaman}
          onValueChange={(value) => handleInputChange("kategoriTanaman", value)}
        >
          <Radio value="pangan">Tanaman Pangan</Radio>
          <Radio value="perkebunan">Perkebunan</Radio>
          <Radio value="jenis_sayur">Jenis Sayur</Radio>
          <Radio value="buah">Buah</Radio>
        </RadioGroup>
        {errors.kategoriTanaman && (
          <p className="text-red-500 text-sm mt-1">{errors.kategoriTanaman}</p>
        )}
      </div>

      {/* Komoditas Tanaman - 2 Select Terpisah */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Komoditas Tanaman
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Komoditas Semusim */}
          <div>
            <Select
              errorMessage={errors.komoditasSemusim}
              isDisabled={formData.kategoriTanaman === "jenis_sayur"}
              isInvalid={!!errors.komoditasSemusim}
              isRequired={formData.jenisTanaman === "semusim"}
              label="Komoditas Semusim"
              placeholder="Pilih komoditas semusim"
              selectedKeys={
                formData.komoditasSemusim ? [formData.komoditasSemusim] : []
              }
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;

                handleInputChange("komoditasSemusim", selected);
              }}
            >
              {getKomoditasSemusimOptions().map((option) => (
                <SelectItem key={option} textValue={option}>
                  {option}
                </SelectItem>
              ))}
            </Select>
            {formData.kategoriTanaman === "jenis_sayur" && (
              <p className="text-yellow-600 text-sm mt-1">
                Jenis sayur tidak tersedia untuk kategori semusim
              </p>
            )}
          </div>

          {/* Komoditas Tahunan */}
          <div>
            <Select
              errorMessage={errors.komoditasTahunan}
              isInvalid={!!errors.komoditasTahunan}
              isRequired={formData.jenisTanaman === "tahunan"}
              label="Komoditas Tahunan"
              placeholder="Pilih komoditas tahunan"
              selectedKeys={
                formData.komoditasTahunan ? [formData.komoditasTahunan] : []
              }
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;

                handleInputChange("komoditasTahunan", selected);
              }}
            >
              {getKomoditasTahunanOptions().map((option) => (
                <SelectItem key={option} textValue={option}>
                  {option}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Periode Tanam */}
      <div>
        <Select
          isRequired
          errorMessage={errors.periodeTanam}
          isInvalid={!!errors.periodeTanam}
          label="Periode Tanam"
          placeholder="Pilih periode tanam"
          selectedKeys={formData.periodeTanam ? [formData.periodeTanam] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;

            handleInputChange("periodeTanam", selected);
          }}
        >
          {BULAN_OPTIONS.map((bulan) => (
            <SelectItem key={bulan} textValue={bulan}>
              {bulan}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Luas Lahan Tanam */}
      <div>
        <Input
          isRequired
          errorMessage={errors.luasLahanTanam}
          isInvalid={!!errors.luasLahanTanam}
          label="Luas Lahan Tanam (HA)"
          min="0"
          placeholder="Masukkan luas lahan tanam"
          step="0.01"
          type="number"
          value={formData.luasLahanTanam.toString()}
          onChange={(e) =>
            handleInputChange("luasLahanTanam", parseFloat(e.target.value) || 0)
          }
        />
      </div>

      {/* Prakiraan Panen Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Prakiraan Panen
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            isRequired
            errorMessage={errors.prakiraanLuasPanen}
            isInvalid={!!errors.prakiraanLuasPanen}
            label="Prakiraan Luas Panen (HA)"
            min="0"
            placeholder="Masukkan prakiraan luas panen"
            step="0.01"
            type="number"
            value={formData.prakiraanLuasPanen.toString()}
            onChange={(e) =>
              handleInputChange(
                "prakiraanLuasPanen",
                parseFloat(e.target.value) || 0,
              )
            }
          />

          <Input
            isRequired
            errorMessage={errors.prakiraanHasilPanen}
            isInvalid={!!errors.prakiraanHasilPanen}
            label="Prakiraan Hasil Panen (TON)"
            min="0"
            placeholder="Masukkan prakiraan hasil panen"
            step="0.01"
            type="number"
            value={formData.prakiraanHasilPanen.toString()}
            onChange={(e) =>
              handleInputChange(
                "prakiraanHasilPanen",
                parseFloat(e.target.value) || 0,
              )
            }
          />
        </div>

        <Select
          isRequired
          errorMessage={errors.prakiraanBulanPanen}
          isInvalid={!!errors.prakiraanBulanPanen}
          label="Prakiraan Bulan Panen"
          placeholder="Pilih prakiraan bulan panen"
          selectedKeys={
            formData.prakiraanBulanPanen ? [formData.prakiraanBulanPanen] : []
          }
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;

            handleInputChange("prakiraanBulanPanen", selected);
          }}
        >
          {BULAN_OPTIONS.map((bulan) => (
            <SelectItem key={bulan} textValue={bulan}>
              {bulan}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          color="primary"
          isDisabled={!selectedPoktanId && !isEdit}
          isLoading={isLoading}
          type="submit"
        >
          {isLoading
            ? isEdit
              ? "Mengupdate..."
              : "Menyimpan..."
            : isEdit
              ? "Update Data"
              : "Simpan Data"}
        </Button>
      </div>
    </form>
  );
};
