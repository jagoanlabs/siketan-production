// components/UploadOperatorModal.tsx
import React from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { ReusableUploadModal } from "@/components/Upload/ReusableUploadModal";
import { useUploadOperatorData } from "@/hook/useOperator";

interface UploadOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadOperatorModal: React.FC<UploadOperatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const uploadMutation = useUploadOperatorData();

  return (
    <ReusableUploadModal
      description="Upload file Excel atau CSV untuk menambah data operator secara bulk"
      fileConfig={{
        accept: ".xlsx,.xls",
        allowedTypes: [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
        maxSize: 10 * 1024 * 1024, // 10MB
        requiredColumns: ["NIK", "Nama", "Email", "NoTelp", "Alamat"],
      }}
      isLoading={uploadMutation.isPending}
      isOpen={isOpen}
      title="Upload Data Operator"
      uploadButtonText="Upload Data Operator"
      onClose={onClose}
      onUpload={async (file) => {
        uploadMutation.mutate(file, {
          onSuccess: () => {
            onClose();
          },
          onError: (error: AxiosError) => {
            toast.error(error.message || "Gagal upload data operator");
          },
        });
      }}
    />
  );
};
