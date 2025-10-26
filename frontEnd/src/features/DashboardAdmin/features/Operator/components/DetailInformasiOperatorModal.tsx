// components/modals/OperatorDetailModal.tsx
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { User } from "@heroui/user";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";

import { OperatorDetailModalProps } from "@/types/Operator/operator";

export const OperatorDetailModal: React.FC<OperatorDetailModalProps> = ({
  isOpen,
  onClose,
  operator,
}) => {
  if (!operator) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      classNames={{
        body: "py-6",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-[#292f46] bg-white dark:bg-gray-800",
        header: "border-b-[1px] border-[#292f46]/20",
        footer: "border-t-[1px] border-[#292f46]/20",
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Detail Operator</h2>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            {/* Profile Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <User
                    avatarProps={{
                      src: operator.foto || undefined,
                      size: "lg",
                      name: operator.nama,
                      className: "w-16 h-16",
                    }}
                    classNames={{
                      name: "text-lg font-semibold",
                      description: "text-gray-600 dark:text-gray-300",
                    }}
                    description={operator.email}
                    name={operator.nama}
                  />
                  <div className="flex-1">
                    <Chip color="primary" size="sm" variant="flat">
                      {operator.akun.peran}
                    </Chip>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  Informasi Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      NIK
                    </p>
                    <p className="text-gray-800 dark:text-white font-medium">
                      {operator.nik}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      NKK
                    </p>
                    <p className="text-gray-800 dark:text-white font-medium">
                      {operator.nkk || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nama Lengkap
                    </p>
                    <p className="text-gray-800 dark:text-white font-medium">
                      {operator.nama}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="text-gray-800 dark:text-white font-medium">
                      {operator.email}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  Informasi Kontak
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      No. Telepon
                    </p>
                    <p className="text-gray-800 dark:text-white font-medium">
                      {operator.noTelp}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Alamat
                    </p>
                    <p className="text-gray-800 dark:text-white font-medium">
                      {operator.alamat}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* System Information */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  Informasi Sistem
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Role
                    </p>
                    <p className="text-gray-800 dark:text-white font-medium">
                      {operator.akun.peran}
                    </p>
                  </div>
                  <Divider className="my-2" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Tanggal Dibuat
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium">
                        {formatDate(operator.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Terakhir Diupdate
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium">
                        {formatDate(operator.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button className="min-w-20" color="primary" onPress={onClose}>
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
