// TokoTabs.tsx

import { useState } from "react";
import { motion } from "framer-motion";

// --- Konten untuk masing-masing tab (bisa Anda pisah ke komponen lain jika kompleks) ---

const DetailBerandaContent = ({
  contentBeranda,
}: {
  contentBeranda: string;
}) => (
  <div className="py-4 text-gray-600 ">
    <p className="mb-10">{contentBeranda}</p>
  </div>
);

const ProdukContent = ({ contentProduk }: { contentProduk: string }) => (
  <div className="py-4 text-gray-600">
    <div className="flex items-center gap-4">
      <p className="text-sm">{contentProduk}</p>
    </div>
  </div>
);

export const TokoTabs = ({
  contentBeranda,
  contentProduk,
}: {
  contentBeranda: string;
  contentProduk: string;
}) => {
  // Daftar tab yang akan ditampilkan. Mudah untuk ditambah di masa depan.
  const tabs = [
    { id: "beranda", label: "Beranda" },
    { id: "produk", label: "Produk" },
  ];

  // State untuk melacak tab mana yang sedang aktif
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full ">
      {/* Container untuk Tombol Tab */}
      <div className="relative border-b border-gray-300">
        <div className="flex items-center space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                relative px-1 py-2 text-base font-medium transition
                ${activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-blue-600"}
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              {/* Jika tab ini aktif, render garis biru di bawahnya */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-[-1px] left-0 right-0 h-1 rounded-t-xl bg-blue-600"
                  layoutId="underline" // Kunci animasi!
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Container untuk Konten Tab */}
      <div className="mt-4">
        {activeTab === "beranda" && (
          <DetailBerandaContent contentBeranda={contentBeranda} />
        )}
        {activeTab === "produk" && (
          <ProdukContent contentProduk={contentProduk} />
        )}
      </div>
    </div>
  );
};
