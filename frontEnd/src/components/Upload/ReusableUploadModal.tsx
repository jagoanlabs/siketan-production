// components/ReusableUploadModal.tsx
import React, { useState, useRef } from "react";
import { RiUploadLine, RiFileExcelLine, RiDownloadLine } from "react-icons/ri";
import { toast } from "sonner";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import * as XLSX from "xlsx";

interface UploadFileConfig {
  accept: string;
  allowedTypes: string[];
  maxSize: number; // in bytes
  requiredColumns?: string[];
}

interface UploadTemplateConfig {
  filename: string;
  headers: string[];
  sampleData?: string[];
  format?: "csv" | "xlsx"; // Tambahkan opsi format
}

interface ReusableUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onUpload: (file: File) => Promise<void>;
  templateConfig?: UploadTemplateConfig;
  fileConfig: UploadFileConfig;
  uploadButtonText?: string;
  isLoading?: boolean;
}

export const ReusableUploadModal: React.FC<ReusableUploadModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onUpload,
  templateConfig,
  fileConfig,
  uploadButtonText = "Upload Data",
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validasi tipe file
    if (!fileConfig.allowedTypes.includes(file.type)) {
      toast.error(
        `Format file tidak didukung. Format yang didukung: ${fileConfig.accept}`,
      );

      return;
    }

    // Validasi ukuran file
    if (file.size > fileConfig.maxSize) {
      const maxSizeMB = fileConfig.maxSize / (1024 * 1024);

      toast.error(`Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB`);

      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);

    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Pilih file terlebih dahulu");

      return;
    }

    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      onClose();
    } catch (error) {
      // Error handling dilakukan di parent component
    }
  };

  // Fungsi untuk membuat template XLSX
  const createXlsxTemplate = () => {
    if (!templateConfig) return;

    // Buat workbook baru
    const wb = XLSX.utils.book_new();

    // Siapkan data untuk worksheet
    const data = [];

    // Tambahkan header
    data.push(templateConfig.headers);

    // Tambahkan sample data jika tersedia
    if (templateConfig.sampleData) {
      data.push(templateConfig.sampleData);
    }

    // Buat worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Styling untuk header (opsional - tergantung versi xlsx)
    const headerRange = XLSX.utils.decode_range(ws["!ref"] || "A1");

    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });

      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center" },
      };
    }

    // Tambahahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(wb, ws, "Template Data");

    // Generate dan download file
    XLSX.writeFile(wb, templateConfig.filename.replace(".csv", ".xlsx"));
  };

  const handleDownloadTemplate = () => {
    if (!templateConfig) return;

    // Default ke XLSX jika tidak ditentukan
    const format = templateConfig.format || "xlsx";

    if (format === "xlsx") {
      createXlsxTemplate();
    } else {
      // Format CSV (original)
      const headers = templateConfig.headers.join(",");
      const sampleRow = templateConfig.sampleData
        ? `\n${templateConfig.sampleData.join(",")}`
        : "";
      const csvContent = `${headers}${sampleRow}`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", templateConfig.filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const resetModal = () => {
    setSelectedFile(null);
    setDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Modal
      classNames={{
        base: "max-h-[90vh]",
      }}
      isOpen={isOpen}
      size="2xl"
      onClose={handleClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <RiUploadLine className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <p className="text-sm text-gray-500 font-normal">{description}</p>
        </ModalHeader>

        <ModalBody className="py-6">
          <div className="space-y-6">
            {/* Template Download */}
            {templateConfig && (
              <Card>
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Download Template
                      </h4>
                      <p className="text-sm text-gray-600">
                        Unduh template untuk memastikan format data yang benar
                      </p>
                    </div>
                    <Button
                      color="primary"
                      size="sm"
                      startContent={<RiDownloadLine size={16} />}
                      variant="flat"
                      onPress={handleDownloadTemplate}
                    >
                      Template
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                accept={fileConfig.accept}
                className="hidden"
                type="file"
                onChange={handleFileInputChange}
              />

              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <RiFileExcelLine className="text-green-600" size={48} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      color="danger"
                      size="sm"
                      variant="light"
                      onPress={() => setSelectedFile(null)}
                    >
                      Hapus File
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      variant="light"
                      onPress={() => fileInputRef.current?.click()}
                    >
                      Pilih File Lain
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <RiUploadLine className="text-gray-400" size={48} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Drag & Drop file atau klik untuk pilih
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Format yang didukung: {fileConfig.accept}
                    </p>
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={() => fileInputRef.current?.click()}
                    >
                      Pilih File
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* File Requirements */}
            <Card>
              <CardBody className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Persyaratan File:
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    Format file: {fileConfig.accept}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    Ukuran maksimal: {fileConfig.maxSize / (1024 * 1024)}MB
                  </li>
                  {fileConfig.requiredColumns && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      Kolom wajib: {fileConfig.requiredColumns.join(", ")}
                    </li>
                  )}
                </ul>
              </CardBody>
            </Card>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color="danger"
            disabled={isLoading}
            variant="light"
            onPress={handleClose}
          >
            Batal
          </Button>
          <Button
            color="primary"
            disabled={!selectedFile || isLoading}
            isLoading={isLoading}
            startContent={!isLoading ? <RiUploadLine size={16} /> : undefined}
            onPress={handleUpload}
          >
            {isLoading ? "Mengupload..." : uploadButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
