import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { useState } from "react";
import { DatePicker } from "@heroui/date-picker";
import { DateValue } from "@internationalized/date";

import { Footer } from "@/features/Home/components/Footer";
import HomeLayout from "@/layouts/HomeLayout";
import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { SectionInfoPertanianCard } from "@/components/SectionInfoPertanianCard";
export const FormLaporanPenyuluhPage = () => {
  const [form, setForm] = useState({
    namaPenyuluh: "",
    noTelp: "",
    alamat: "",
    wilayah: "",
    tanggalKunjungan: null as DateValue | null, // ubah tipe
    komoditas: "",
    statusKepemilikan: "",
    luasLahan: "",
    tanggalTanam: null as DateValue | null,
    estimasiPanen: null as DateValue | null,
    umurTanaman: "",
    kendala: "",
    tindakLanjut: "",
    catatan: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // khusus untuk DatePicker
  const handleDateChange = (
    name: keyof typeof form,
    value: DateValue | null,
  ) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // validasi dan kirim data
    console.log(form);
  };

  return (
    <>
      <HomeLayout>
        <div className="p-5">
          <div className="w-full px-10 py-5 text-center h-52 rounded-3xl bg-gradient-to-b from-[#7AD4F6] to-transparent">
            <div className="flex flex-col items-center justify-center mb-6 ">
              <NavbarStaticItem index={2} />
            </div>
            <Breadcrumbs>
              <BreadcrumbItem
                classNames={{
                  base: "hover:cursor-pointer text-[#003F75] font-semibold",
                  item: "hover:cursor-pointer text-[#003F75] ",
                  separator: " text-[#003F75]",
                }}
                href="/"
              >
                Home
              </BreadcrumbItem>
              <BreadcrumbItem
                classNames={{
                  base: " text-[#003F75] font-semibold",
                  item: " text-[#003F75]",
                  separator: " text-[#003F75]",
                }}
              >
                Informasi Pertanian
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <SectionInfoPertanianCard
          subtitle="Form Laporan Penyuluh di Kab. Ngawi"
          title="Form Laporan Penyuluh"
        />
        <div className="flex flex-col w-11/12 mx-auto space-x-6">
          {/* content */}
          <h2 className="mb-6 text-3xl font-semibold text-left text-green-700">
            Form Laporan Penyuluh
          </h2>
          <form className="grid gap-6 md:grid-cols-3" onSubmit={handleSubmit}>
            {/* Kolom 1 */}
            <div className="p-5 bg-white border border-gray-200 shadow-md rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-green-600">
                Data Penyuluh
              </h3>
              <Input
                isRequired
                className="mb-4"
                label="Nama Penyuluh"
                name="namaPenyuluh"
                placeholder="Masukkan nama lengkap"
                value={form.namaPenyuluh}
                onChange={handleChange}
              />
              <Input
                isRequired
                className="mb-4"
                label="Nomor Telepon"
                name="noTelp"
                placeholder="Contoh : 08123456789"
                value={form.noTelp}
                onChange={handleChange}
              />
              <Textarea
                isRequired
                label="Alamat"
                name="alamat"
                placeholder="Masukkan alamat lengkap"
                value={form.alamat}
                onChange={handleChange}
              />
            </div>

            {/* Kolom 2 & 3 */}
            <div className="p-5 bg-white border border-gray-200 shadow-md rounded-xl md:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-green-600">
                Detail Kunjungan
              </h3>

              <div className="grid-form">
                <div className="area-wilayah-binaan">
                  <Input
                    label="Wilayah Binaan"
                    name="wilayah"
                    placeholder="Masukkan nama desa atau kecamatan"
                    value={form.wilayah}
                    onChange={handleChange}
                  />
                </div>

                <div className="area-umur-tanaman">
                  <Select
                    label="Umur Tanaman"
                    name="umurTanaman"
                    selectedKeys={form.umurTanaman ? [form.umurTanaman] : []}
                    onSelectionChange={(keys) =>
                      setForm((prev) => ({
                        ...prev,
                        umurTanaman: Array.from(keys)[0] as string,
                      }))
                    }
                  >
                    <SelectItem key="muda">Muda</SelectItem>
                    <SelectItem key="sedang">Sedang</SelectItem>
                    <SelectItem key="panen">Mendekati Panen</SelectItem>
                  </Select>
                </div>

                <div className="area-tanggal-kunjungan">
                  <DatePicker
                    label="Tanggal Kunjungan"
                    name="tanggalKunjungan"
                    value={form.tanggalKunjungan}
                    onChange={(value) =>
                      handleDateChange("tanggalKunjungan", value)
                    }
                  />
                </div>

                <div className="area-kendala">
                  <Textarea
                    label="Kendala yang Dihadapi Petani"
                    maxRows={5}
                    minRows={5}
                    name="kendala"
                    placeholder="Contoh: Hujan deras setiap sore"
                    value={form.kendala}
                    onChange={handleChange}
                  />
                </div>

                <div className="area-komoditas">
                  <Input
                    label="Komoditas"
                    name="komoditas"
                    placeholder="Masukkan jenis tanaman"
                    value={form.komoditas}
                    onChange={handleChange}
                  />
                </div>

                <div className="area-status-kepemilikan">
                  <Select
                    label="Status Kepemilikan Lahan"
                    name="statusKepemilikan"
                    selectedKeys={
                      form.statusKepemilikan ? [form.statusKepemilikan] : []
                    }
                    onSelectionChange={(keys) =>
                      setForm((prev) => ({
                        ...prev,
                        statusKepemilikan: Array.from(keys)[0] as string,
                      }))
                    }
                  >
                    <SelectItem key="milik-sendiri">Milik Sendiri</SelectItem>
                    <SelectItem key="sewa">Sewa</SelectItem>
                    <SelectItem key="bagi-hasil">Bagi Hasil</SelectItem>
                  </Select>
                </div>

                <div className="area-tindak-lanjut">
                  <Select
                    label="Tindak Lanjut dari Penyuluh"
                    name="tindakLanjut"
                    selectedKeys={[form.tindakLanjut]}
                    onChange={handleChange}
                  >
                    <SelectItem key="pelatihan">Pelatihan</SelectItem>
                    <SelectItem key="bantuan">Bantuan Alsintan</SelectItem>
                  </Select>
                </div>

                <div className="area-luas-lahan">
                  <Input
                    label="Luas Lahan (Ha)"
                    name="luasLahan"
                    placeholder="Contoh: 1.5"
                    value={form.luasLahan}
                    onChange={handleChange}
                  />
                </div>
                <div className="area-tanggal-estimasi">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <DatePicker
                      label="Tanggal Tanam"
                      name="tamggalTanam"
                      value={form.tanggalTanam}
                      onChange={(value) =>
                        handleDateChange("tanggalTanam", value)
                      }
                    />
                    <DatePicker
                      label="Estimasi Panen"
                      name="estimasiPanen"
                      value={form.estimasiPanen}
                      onChange={(value) =>
                        handleDateChange("estimasiPanen", value)
                      }
                    />
                  </div>
                </div>

                <div className="area-catatan">
                  <Textarea
                    className="h-24 resize-none"
                    label="Catatan Tambahan"
                    name="catatan"
                    placeholder="Tambahkan informasi lain di sini"
                    value={form.catatan}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="text-white" color="success" type="submit">
                  Kirim Laporan Penyuluh
                </Button>
              </div>
            </div>
          </form>
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
};
