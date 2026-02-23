// Mock data for a single report, assuming this comes from props or a store
const mockLaporanPetani = {
  namaPetani: "Slamet Riyadi",
  noTelp: "089876543210",
  alamat: "Desa Klitik, RT 02/RW 01, Geneng, Ngawi",
  komoditas: "Jagung",
  statusKepemilikan: "Sewa",
  luasLahan: "0.5 Ha",
  umurTanaman: "45 Hari",
  waktuTanam: "2024-06-10",
  estimasiPanen: "2024-09-15",
  seranganHama: "Ya, ulat grayak",
  kondisiCuaca: "Cerah berawan, sesekali hujan ringan di malam hari.",
  kendala: "Sulit mendapatkan pupuk bersubsidi.",
  harapan: "Adanya bantuan alsintan untuk mempercepat proses panen.",
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-md text-gray-900">{value}</p>
  </div>
);

export const DetailRiwayatLaporanPetani = () => {
  const laporan = mockLaporanPetani; // In a real app, you'd pass the report data as a prop

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Kolom Data Petani */}
        <div className="p-5 border border-gray-200 rounded-xl md:col-span-1">
          <h3 className="mb-4 text-xl font-semibold text-green-700 border-b pb-2">
            Data Petani
          </h3>
          <div className="space-y-4">
            <DetailItem label="Nama Petani" value={laporan.namaPetani} />
            <DetailItem label="Nomor Telepon" value={laporan.noTelp} />
            <DetailItem label="Alamat" value={laporan.alamat} />
          </div>
        </div>

        {/* Kolom Detail Lahan */}
        <div className="p-5 border border-gray-200 rounded-xl md:col-span-2">
          <h3 className="mb-4 text-xl font-semibold text-green-700 border-b pb-2">
            Detail Lahan & Tanaman
          </h3>
          <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Komoditas" value={laporan.komoditas} />
            <DetailItem
              label="Status Kepemilikan"
              value={laporan.statusKepemilikan}
            />
            <DetailItem label="Luas Lahan" value={laporan.luasLahan} />
            <DetailItem label="Umur Tanaman" value={laporan.umurTanaman} />
            <DetailItem label="Waktu Tanam" value={laporan.waktuTanam} />
            <DetailItem label="Estimasi Panen" value={laporan.estimasiPanen} />
            <DetailItem
              label="Serangan Hama/Penyakit"
              value={laporan.seranganHama}
            />
          </div>
        </div>
      </div>

      {/* Kolom Kondisi & Harapan */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="p-5 border border-gray-200 rounded-xl">
          <h3 className="text-lg font-semibold text-green-600">
            Kondisi Cuaca
          </h3>
          <p className="mt-2 text-gray-700">{laporan.kondisiCuaca}</p>
        </div>
        <div className="p-5 border border-gray-200 rounded-xl">
          <h3 className="text-lg font-semibold text-green-600">
            Kendala Utama
          </h3>
          <p className="mt-2 text-gray-700">{laporan.kendala}</p>
        </div>
        <div className="p-5 border border-gray-200 rounded-xl">
          <h3 className="text-lg font-semibold text-green-600">Harapan</h3>
          <p className="mt-2 text-gray-700">{laporan.harapan}</p>
        </div>
      </div>
    </div>
  );
};
