import { Avatar } from "../../../components/Form/HeroAvatar";
import { Card, CardBody, CardHeader } from "../../../components/Form/HeroCard";
import { Input, Textarea } from "../../../components/Form/HeroInput";
import { Button } from "../../../components/Form/HeroButton";

// components/forms/OperatorPoktanEditForm.tsx
import React, { useState, useEffect } from "react";

import { useUpdateProfile, useGetDetailProfile } from "@/hook/useEditProfile";
import { OperatorPoktanProfileData } from "@/types/editProfle";

export const OperatorPoktanEditForm = () => {
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetDetailProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const [formData, setFormData] = useState<OperatorPoktanProfileData>({
    nik: "",
    email: "",
    whatsapp: "",
    alamat: "",
    desa: "",
    nama: "",
    kecamatan: "",
    baru: "",
    foto: null,
  });

  const [previewImage, setPreviewImage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  // Load profile data when available
  useEffect(() => {
    if (profileData) {
      setFormData({
        nik: profileData.nik || "",
        email: profileData.email || "",
        whatsapp: profileData.no_wa || "",
        alamat: profileData.alamat || "",
        desa: profileData.desa || "",
        nama: profileData.nama || "",
        kecamatan: profileData.kecamatan || "",
        baru: "",
        foto: null,
      });
      setPreviewImage(profileData.foto || "");
    }
  }, [profileData]);

  const handleInputChange = (
    field: keyof OperatorPoktanProfileData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        foto: file,
      }));

      // Create preview
      const reader = new FileReader();

      reader.onload = (e: any) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for submission (exclude empty password field)
    const submitData: OperatorPoktanProfileData = { ...formData };

    if (!submitData.baru) delete submitData.baru;

    updateProfile(submitData);
  };

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
        <span className="ml-2">Memuat data profile...</span>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold">Edit Profile Operator Poktan</h2>
      </CardHeader>
      <CardBody>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4" size="lg" src={previewImage} />
            <input
              accept="image/*"
              className="hidden"
              id="foto-upload"
              type="file"
              onChange={handleFileChange}
            />
            <Button
              as="label"
              htmlFor="foto-upload"
              size="sm"
              variant="bordered"
            >
              Upload Foto
            </Button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="NIK"
              maxLength={16}
              placeholder="Masukkan NIK"
              value={formData.nik}
              onChange={(e: any) => handleInputChange("nik", e.target.value)}
            />
            <Input
              label="Nama"
              placeholder="Masukkan nama"
              value={formData.nama}
              onChange={(e: any) => handleInputChange("nama", e.target.value)}
            />
            <Input
              label="Email"
              placeholder="Masukkan email"
              type="email"
              value={formData.email}
              onChange={(e: any) => handleInputChange("email", e.target.value)}
            />
            <Input
              label="WhatsApp"
              placeholder="Masukkan nomor WhatsApp"
              value={formData.whatsapp}
              onChange={(e: any) => handleInputChange("whatsapp", e.target.value)}
            />
            <Input
              label="Kecamatan"
              placeholder="Masukkan kecamatan"
              value={formData.kecamatan}
              onChange={(e: any) => handleInputChange("kecamatan", e.target.value)}
            />
            <Input
              label="Desa"
              placeholder="Masukkan desa"
              value={formData.desa}
              onChange={(e: any) => handleInputChange("desa", e.target.value)}
            />
          </div>

          <Textarea
            label="Alamat"
            placeholder="Masukkan alamat lengkap"
            value={formData.alamat}
            onChange={(e: any) => handleInputChange("alamat", e.target.value)}
          />

          {/* Password Field */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Ubah Password (Opsional)</h3>
            <Input
              endContent={
                <Button
                  size="sm"
                  type="button"
                  variant="light"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </Button>
              }
              label="Password Baru"
              placeholder="Masukkan password baru"
              type={showPassword ? "text" : "password"}
              value={formData.baru}
              onChange={(e: any) => handleInputChange("baru", e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              color="primary"
              disabled={isUpdating}
              isLoading={isUpdating}
              size="lg"
              type="submit"
            >
              {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
