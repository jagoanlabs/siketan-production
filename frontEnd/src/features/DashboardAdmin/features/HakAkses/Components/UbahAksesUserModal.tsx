// src/features/DashboardAdmin/features/HakAkses/Components/UbahAksesUserModal.tsx
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import React, { useState, useEffect } from "react";
import { Divider } from "@heroui/divider";
import { User } from "@heroui/user";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";

import {
  USER_ROLES,
  UserAksesData,
  UserRole,
} from "@/types/HakAkses/ubahAksesUser";

// Import types from hooks

interface UbahRoleModalProps {
  isOpen: boolean;
  user: UserAksesData | null;
  onClose: () => void;
  onSave: (userId: number, newRole: UserRole) => void;
  isLoading?: boolean;
}

export const UbahRoleModal: React.FC<UbahRoleModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("petani");

  useEffect(() => {
    if (user) {
      setSelectedRole(user.peran as UserRole);
    }
  }, [user]);

  const handleSave = () => {
    if (user && selectedRole) {
      onSave(user.id, selectedRole);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "petani":
        return "success";
      case "penyuluh":
        return "primary";
      case "operator poktan":
        return "secondary";
      case "operator admin":
        return "warning";
      case "operator super admin":
        return "danger";
      default:
        return "default";
    }
  };

  const getRoleIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} placement="center" size="lg" onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  {getRoleIcon()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Ubah Role User
                  </h2>
                  <p className="text-sm text-gray-500">
                    Kelola akses pengguna sistem
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody>
              <div className="space-y-4">
                {/* User Info Card */}
                <Card className="bg-gray-50" shadow="sm">
                  <CardBody className="px-4 py-3">
                    <div className="flex items-start gap-4">
                      <User
                        avatarProps={{
                          size: "sm",
                          name: user.nama,
                          color: "primary",
                        }}
                        description={user.email || "Tidak ada email"}
                        name={user.nama}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">
                            Role Saat Ini:
                          </span>
                          <Chip
                            color={getRoleColor(user.peran) as any}
                            size="sm"
                            variant="flat"
                          >
                            {USER_ROLES.find(
                              (role) => role.value === user.peran,
                            )?.label || user.peran}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Divider />

                {/* Role Selection */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-900">
                    Pilih Role Baru
                  </p>

                  <Select
                    isDisabled={isLoading}
                    placeholder="Pilih role..."
                    selectedKeys={[selectedRole]}
                    startContent={getRoleIcon()}
                    value={selectedRole}
                    variant="bordered"
                    onChange={(e) =>
                      setSelectedRole(e.target.value as UserRole)
                    }
                  >
                    {USER_ROLES.map((role) => (
                      <SelectItem
                        key={role.value}
                        startContent={
                          <Chip
                            color={getRoleColor(role.value) as any}
                            size="sm"
                            variant="dot"
                          />
                        }
                      >
                        {role.label}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Role Preview */}
                  {selectedRole && selectedRole !== user.peran && (
                    <Card className="bg-blue-50 border-blue-200" shadow="sm">
                      <CardBody className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-blue-700">
                            Preview role baru:
                          </span>
                          <Chip
                            color={getRoleColor(selectedRole) as any}
                            size="sm"
                            variant="flat"
                          >
                            {
                              USER_ROLES.find(
                                (role) => role.value === selectedRole,
                              )?.label
                            }
                          </Chip>
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>

                {/* Warning */}
                {selectedRole !== user.peran && (
                  <Card className="bg-yellow-50 border-yellow-200" shadow="sm">
                    <CardBody className="px-3 py-3">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">
                            Peringatan Perubahan Role
                          </h4>
                          <p className="text-xs text-yellow-700 mt-1">
                            Mengubah role akan memindahkan data user ke tabel
                            yang sesuai dengan role baru. Pastikan perubahan ini
                            sudah benar sebelum menyimpan.
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                isDisabled={isLoading}
                variant="light"
                onPress={onClose}
              >
                Batal
              </Button>
              <Button
                color="primary"
                isDisabled={isLoading || selectedRole === user.peran}
                isLoading={isLoading}
                startContent={
                  !isLoading && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  )
                }
                onPress={handleSave}
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
