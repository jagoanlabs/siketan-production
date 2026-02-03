// ProductTabs.tsx - Enhanced Responsive Version

import { Button } from "@heroui/button";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaUser, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";

const DetailProdukContent = ({
  content,
  phone,
  productName,
}: {
  content: string;
  phone: string;
  productName: string;
}) => (
  <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
    <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
      <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
        Deskripsi Produk
      </h4>
      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
        {content || "Tidak ada deskripsi tersedia"}
      </p>
    </div>

    {/* Action Buttons - Responsive */}
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2">
      <Button
        className="w-full sm:w-auto text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 transition-colors px-6 py-3 font-medium text-sm sm:text-base"
        variant="bordered"
        onClick={() => {
          // You can add WhatsApp integration here
          window.open(
            `https://wa.me/${phone}?text=Halo, saya tertarik dengan produk ${productName}`,
            "_blank",
          );
        }}
      >
        <IoLogoWhatsapp className="text-green-600 text-lg sm:text-xl" />
        Chat WhatsApp
      </Button>
    </div>
  </div>
);

const PenjualContent = ({
  owner,
  address,
  email,
  phone,
  profession,
  kecamatan,
  desa,
}: {
  owner: string;
  address: string;
  email: string;
  phone: string;
  profession: string;
  kecamatan: string;
  desa: string;
}) => (
  <div className="py-4 sm:py-6">
    <div className="bg-gray-50 p-4 sm:p-6 rounded-xl space-y-4">
      {/* Seller Info */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FaUser className="text-blue-600 text-lg sm:text-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            {owner}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                profession === "penyuluh"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {profession.charAt(0).toUpperCase() + profession.slice(1)}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2 text-gray-600">
              <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0 text-sm" />
              <p className="leading-relaxed break-words">{address}</p>
            </div>
            {email && (
              <div className="flex items-center gap-2 text-gray-600">
                <FaEnvelope className="text-blue-500 flex-shrink-0 text-sm" />
                <span className="break-all">{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <FaPhone className="text-blue-500 flex-shrink-0 text-sm" />
                <span>{phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Lokasi</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Kecamatan:</span>
            <p className="font-medium">{kecamatan}</p>
          </div>
          <div>
            <span className="text-gray-500">Desa:</span>
            <p className="font-medium">{desa}</p>
          </div>
        </div>
      </div>

      {/* Contact Actions */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            className="text-green-600 bg-green-50 hover:bg-green-100 border border-green-200"
            variant="bordered"
            onClick={() => {
              window.open(`https://wa.me/${phone}`, "_blank");
            }}
          >
            <IoLogoWhatsapp className="text-green-600" />
            WhatsApp
          </Button>
          {email && (
            <Button
              className="text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200"
              variant="bordered"
              onClick={() => {
                window.open(`mailto:${email}`, "_blank");
              }}
            >
              <FaEnvelope />
              Email
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const ProductTabs = ({
  content,
  owner,
  address,
  email,
  phone,
  profession,
  kecamatan,
  desa,
  productName,
}: {
  content: string;
  owner: string;
  address: string;
  email: string;
  phone: string;
  profession: string;
  kecamatan: string;
  desa: string;
  productName: string;
}) => {
  const tabs = [
    { id: "detail", label: "Detail Produk" },
    { id: "penjual", label: "Penjual" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full">
      {/* Tab Navigation - Responsive */}
      <div className="relative border-b border-gray-300">
        <div className="flex items-center justify-start overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                relative px-1 sm:px-4 py-3 text-sm sm:text-base font-medium transition whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-blue-600"
                  layoutId="underline"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "detail" && (
          <DetailProdukContent
            content={content}
            phone={phone}
            productName={productName}
          />
        )}
        {activeTab === "penjual" && (
          <PenjualContent
            address={address}
            desa={desa}
            email={email}
            kecamatan={kecamatan}
            owner={owner}
            phone={phone}
            profession={profession}
          />
        )}
      </motion.div>
    </div>
  );
};
