// Mock data for a single report, assuming this comes from props or a store
const mockLaporanPenyuluh = {
  namaPenyuluh: "Budi Santoso",
  noTelp: "081234567890",
  alamat: "Jl. Pahlawan No. 10, Ngawi",
  wilayah: "Kecamatan Ngawi",
  tanggalKunjungan: "2024-07-27",
  komoditas: "Padi",
  statusKepemilikan: "Milik Sendiri",
  luasLahan: "2 Ha",
  tanggalTanam: "2024-05-15",
  estimasiPanen: "2024-08-20",
  umurTanaman: "Sedang",
  kendala: "Serangan hama wereng dan cuaca yang tidak menentu.",
  tindakLanjut: "Pemberian pestisida organik dan pengaturan jadwal irigasi.",
  catatan: "Petani kooperatif dan mengikuti arahan dengan baik.",
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-md text-gray-900">{value}</p>
  </div>
);

export const DetailRiwayatLaporanPenyuluh = () => {
  const laporan = mockLaporanPenyuluh; // In a real app, you'd pass the report data as a prop

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Kolom Data Penyuluh */}
        <div className="p-5 border border-gray-200 rounded-xl md:col-span-1">
          <h3 className="mb-4 text-xl font-semibold text-green-700 border-b pb-2">
            Data Penyuluh
          </h3>
          <div className="space-y-4">
            <DetailItem label="Nama Penyuluh" value={laporan.namaPenyuluh} />
            <DetailItem label="Nomor Telepon" value={laporan.noTelp} />
            <DetailItem label="Alamat" value={laporan.alamat} />
          </div>
        </div>

        {/* Kolom Detail Kunjungan */}
        <div className="p-5 border border-gray-200 rounded-xl md:col-span-2">
          <h3 className="mb-4 text-xl font-semibold text-green-700 border-b pb-2">
            Detail Kunjungan
          </h3>
          <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Wilayah Binaan" value={laporan.wilayah} />
            <DetailItem
              label="Tanggal Kunjungan"
              value={laporan.tanggalKunjungan}
            />
            <DetailItem label="Komoditas" value={laporan.komoditas} />
            <DetailItem
              label="Status Kepemilikan"
              value={laporan.statusKepemilikan}
            />
            <DetailItem label="Luas Lahan" value={laporan.luasLahan} />
            <DetailItem label="Tanggal Tanam" value={laporan.tanggalTanam} />
            <DetailItem label="Estimasi Panen" value={laporan.estimasiPanen} />
            <DetailItem label="Umur Tanaman" value={laporan.umurTanaman} />
          </div>
        </div>
      </div>

      {/* Kolom Kendala, Tindak Lanjut, dan Catatan */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="p-5 border border-gray-200 rounded-xl">
          <h3 className="text-lg font-semibold text-green-600">Kendala</h3>
          <p className="mt-2 text-gray-700">{laporan.kendala}</p>
        </div>
        <div className="p-5 border border-gray-200 rounded-xl">
          <h3 className="text-lg font-semibold text-green-600">
            Tindak Lanjut
          </h3>
          <p className="mt-2 text-gray-700">{laporan.tindakLanjut}</p>
        </div>
        <div className="p-5 border border-gray-200 rounded-xl">
          <h3 className="text-lg font-semibold text-green-600">
            Catatan Tambahan
          </h3>
          <p className="mt-2 text-gray-700">{laporan.catatan}</p>
        </div>
      </div>
    </div>
  );
};
