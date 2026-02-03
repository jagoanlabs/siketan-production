import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { FaRegUserCircle } from "react-icons/fa";
import { useState } from "react";
import { DatePicker } from "@heroui/date-picker";
import { DateValue } from "@internationalized/date";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import HomeLayout from "@/layouts/HomeLayout";
import { Footer } from "@/features/Home/components/Footer";
import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { SectionInfoPertanianCard } from "@/components/SectionInfoPertanianCard";

export const FormLaporanPetaniPage = () => {
  const [form, setForm] = useState({
    namaPetani: "",
    noTelp: "",
    alamat: "",
    komoditas: "",
    statusKepemilikan: "",
    luasLahan: "",
    umurTanaman: "",
    waktuTanam: null as DateValue | null,
    estimasiPanen: null as DateValue | null,
    seranganHama: "",
    kondisiCuaca: "",
    kendala: "",
    harapan: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (
    name: keyof typeof form,
    value: DateValue | null,
  ) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                href="/profile"
              >
                <FaRegUserCircle />
                Profile
              </BreadcrumbItem>
              <BreadcrumbItem
                classNames={{
                  base: " text-[#003F75] font-semibold",
                  item: " text-[#003F75]",
                  separator: " text-[#003F75]",
                }}
              >
                Isi Form Laporan
              </BreadcrumbItem>
              <BreadcrumbItem
                classNames={{
                  base: " text-[#003F75] font-semibold",
                  item: " text-[#003F75]",
                  separator: " text-[#003F75]",
                }}
              >
                Form Laporan Petani
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <SectionInfoPertanianCard
          subtitle="Form Laporan Petani di Kab. Ngawi"
          title="Form Laporan Petani"
        />
        <div className="flex flex-col w-11/12 mx-auto space-x-6">
          <h2 className="mb-6 text-3xl font-semibold text-left text-green-700">
            Form Laporan Petani
          </h2>
          <form className="grid gap-6 md:grid-cols-3" onSubmit={handleSubmit}>
            {/* Kolom 1 */}
            <div className="p-5 bg-white border border-gray-200 shadow-md rounded-xl">
              <Input
                isRequired
                className="mb-4"
                label="Nama Petani"
                name="namaPetani"
                placeholder="Masukkan nama lengkap"
                value={form.namaPetani}
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
              <div className="grid-form-petani">
                <Select
                  isRequired
                  className="area-komoditas"
                  label="Komoditas utama yang sedang ditanam"
                  name="komoditas"
                  selectedKeys={[form.komoditas]}
                  onChange={handleChange}
                >
                  <SelectItem key="padi">Padi</SelectItem>
                  <SelectItem key="jagung">Jagung</SelectItem>
                </Select>

                <Select
                  className="area-seranganHama"
                  label="Apakah ada serangan hama/penyakit?"
                  name="seranganHama"
                  selectedKeys={[form.seranganHama]}
                  onChange={handleChange}
                >
                  <SelectItem key="ya">Ya</SelectItem>
                  <SelectItem key="tidak">Tidak</SelectItem>
                </Select>

                <Select
                  isRequired
                  className="area-statusKepemilikan"
                  label="Status kepemilikan lahan"
                  name="statusKepemilikan"
                  selectedKeys={[form.statusKepemilikan]}
                  onChange={handleChange}
                >
                  <SelectItem key="milik">Milik</SelectItem>
                  <SelectItem key="sewa">Sewa</SelectItem>
                </Select>

                <Textarea
                  className="area-kondisiCuaca"
                  label="Kondisi cuaca 7 hari terakhir"
                  maxRows={5}
                  minRows={5}
                  name="kondisiCuaca"
                  placeholder="Contoh: Hujan deras setiap sore, cuaca cerah"
                  value={form.kondisiCuaca}
                  onChange={handleChange}
                />

                <Input
                  isRequired
                  className="area-luasLahan"
                  label="Luas lahan yang diamati"
                  name="luasLahan"
                  placeholder="Contoh: 1 bahu, 2 patok, 0.5 ha"
                  value={form.luasLahan}
                  onChange={handleChange}
                />

                <Select
                  className="area-kendala"
                  label="Kendala utama dalam pertanian"
                  name="kendala"
                  selectedKeys={[form.kendala]}
                  onChange={handleChange}
                >
                  <SelectItem key="hama">Hama</SelectItem>
                  <SelectItem key="cuaca">Cuaca</SelectItem>
                </Select>

                <div className="area-umurTanaman">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      label="Umur tanaman saat ini"
                      name="umurTanaman"
                      placeholder="Contoh: 35"
                      value={form.umurTanaman}
                      onChange={handleChange}
                    />
                    <Select
                      label="Label Umur"
                      name="labelUmur"
                      selectedKeys={[form.kendala]}
                      onChange={handleChange}
                    >
                      <SelectItem key="Hari">Hari</SelectItem>
                      <SelectItem key="Bulan">Bulan</SelectItem>
                    </Select>
                  </div>
                </div>

                <Textarea
                  className="area-harapan"
                  label="Harapan untuk musim ini"
                  name="harapan"
                  placeholder="Contoh: Bantuan alsintan, pelatihan pasar digital"
                  value={form.harapan}
                  onChange={handleChange}
                />

                <div className="area-waktuTanam">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <DatePicker
                      className=""
                      label="Waktu tanam"
                      name="waktuTanam"
                      value={form.waktuTanam}
                      onChange={(value) =>
                        handleDateChange("waktuTanam", value)
                      }
                    />
                    <DatePicker
                      className=""
                      label="Estimasi Panen"
                      name="estimasiPanen"
                      value={form.estimasiPanen}
                      onChange={(value) =>
                        handleDateChange("estimasiPanen", value)
                      }
                    />
                  </div>
                </div>

                <div className="area-kosong" />
              </div>

              <div className="flex flex-wrap justify-end gap-3 mt-6">
                <Button className="text-white" color="success" variant="solid">
                  Lokasi GPS
                </Button>
                <Button
                  className="text-white"
                  color="success"
                  type="submit"
                  variant="solid"
                >
                  Kirim Laporan Petani
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
