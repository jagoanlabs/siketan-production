import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";
import { toast } from "sonner";

import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";
import { useAuth } from "@/hook/UseAuth";
import { useUpdateProfile } from "@/hook/dashboard/profile/useUpdateUser";

// Icons (you can replace these with your preferred icon library)

const UserIcon = () => (
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

const MailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);

export const ProfileDashboard = () => {
  const { user } = useAuth(); // Assuming useAuth has refetchUser method
  const [editedUser, setEditedUser] = useState({ ...user });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const { isOpen, onClose } = useDisclosure();

  // Use TanStack Query mutation
  const updateProfileMutation = useUpdateProfile();

  const handleSave = async () => {
    try {
      // Validasi password jika diisi
      if (passwordData.newPassword) {
        if (!passwordData.currentPassword) {
          toast.info("Password saat ini harus diisi");

          return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
          toast.info("Password baru dan konfirmasi password tidak cocok");

          return;
        }

        if (passwordData.newPassword.length < 6) {
          toast.info("Password baru minimal 6 karakter");

          return;
        }
      }

      // Prepare data to send
      const updateData = {
        nama: editedUser.nama,
        email: editedUser.email,
        no_wa: editedUser.no_wa,
        ...(passwordData.newPassword && {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      };

      // Call mutation
      await updateProfileMutation.mutateAsync({
        userId: user?.id.toString() || "",
        data: updateData,
      });

      // Success handling
      onClose();

      toast.success("Profil berhasil diperbarui");
    } catch (error: any) {
      console.error("Update profile error:", error);

      toast.error(error?.response?.data?.message || "Gagal memperbarui profil");
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsPasswordVisible({
      current: false,
      new: false,
      confirm: false,
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setIsPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen max-w-6xl container mx-auto py-6">
      <PageMeta
        description="Dashboard Admin untuk mengelola data statistik pertanian"
        title="Dashboard Admin | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Profile" },
        ]}
      />

      <div className="container mx-auto px-4 w-full">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profil Pengguna
          </h1>
          <p className="text-gray-600">
            Kelola informasi profil dan pengaturan akun Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Card - Left Side */}
          <div className="lg:col-span-4">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardBody className="p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar with gradient border */}
                  <Avatar
                    className="w-32 h-32 text-large border-4 border-white"
                    name={user?.nama}
                    src={user?.foto}
                  />

                  {/* User Name and Role */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.nama}
                  </h2>
                  <Chip
                    className="mb-4"
                    color="primary"
                    startContent={<ShieldIcon />}
                    variant="flat"
                  >
                    {user?.peran}
                  </Chip>

                  {/* Status Badge */}
                  <div className="mb-6">
                    <Chip
                      color={user?.isVerified ? "success" : "warning"}
                      size="sm"
                      variant="flat"
                    >
                      {user?.isVerified
                        ? "✓ Terverifikasi"
                        : "⏳ Belum Terverifikasi"}
                    </Chip>
                  </div>

                  {/* Edit Button
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium"
                    size="lg"
                    startContent={<EditIcon />}
                    onPress={onOpen}
                  >
                    Edit Profil
                  </Button> */}

                  <Divider className="my-6" />

                  {/* Account Info */}
                  <div className="w-full text-left space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Bergabung:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(user?.createdAt?.toString() || "")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">ID Akun:</span>
                      <span className="font-mono text-gray-900 text-xs">
                        {user?.accountID}
                      </span>
                    </div>
                  </div>

                  <div className="w-full mt-6">
                    <Button
                      as={Link}
                      className="w-full font-medium"
                      color="danger"
                      to="/dashboard-admin/delete-account"
                      variant="flat"
                    >
                      Kebijakan Hapus Akun
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Information Cards - Right Side */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <UserIcon />
                    Informasi Personal
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Nama Lengkap
                    </p>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {user?.nama}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Pekerjaan
                    </p>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {user?.pekerjaan}
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* Contact Information Card */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <MailIcon />
                    Informasi Kontak
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MailIcon />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneIcon />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        WhatsApp
                      </p>
                      <p className="text-gray-900 font-medium">{user?.no_wa}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Account Statistics Card */}
              <Card className="md:col-span-2 shadow-lg border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardBody className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Statistik Akun</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                      <h4 className="text-sm font-medium opacity-90">
                        Status Akun
                      </h4>
                      <p className="text-2xl font-bold">
                        {user?.isVerified ? "Aktif" : "Pending"}
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                      <h4 className="text-sm font-medium opacity-90">Peran</h4>
                      <p className="text-2xl font-bold">{user?.peran}</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                      <h4 className="text-sm font-medium opacity-90">
                        Bergabung
                      </h4>
                      <p className="text-lg font-bold">
                        {user?.createdAt
                          ? new Date(user?.createdAt).getFullYear()
                          : ""}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        classNames={{
          base: "bg-white",
          header: "border-b border-gray-200",
          body: "py-6",
          footer: "border-t border-gray-200",
          wrapper: "z-99999",
        }}
        isDismissable={!updateProfileMutation.isPending}
        isKeyboardDismissDisabled={updateProfileMutation.isPending}
        isOpen={isOpen}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
        scrollBehavior="inside"
        size="2xl"
        style={{ zIndex: 99999 }}
        onClose={onClose}
      >
        <ModalContent style={{ zIndex: 99999 }}>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  Edit Profil
                </h3>
                <p className="text-gray-600 font-normal">
                  Perbarui informasi profil Anda
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Profile Information Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <UserIcon />
                      Informasi Profil
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Input
                          classNames={{
                            input: "text-gray-900",
                            label: "text-gray-700 font-medium",
                          }}
                          isDisabled={updateProfileMutation.isPending}
                          label="Nama Lengkap"
                          name="nama"
                          placeholder="Masukkan nama lengkap"
                          size="lg"
                          value={editedUser?.nama}
                          variant="bordered"
                          onChange={handleChange}
                        />
                      </div>

                      <Input
                        classNames={{
                          input: "text-gray-900",
                          label: "text-gray-700 font-medium",
                        }}
                        isDisabled={updateProfileMutation.isPending}
                        label="Email"
                        name="email"
                        placeholder="Masukkan email"
                        size="lg"
                        startContent={<MailIcon />}
                        type="email"
                        value={editedUser?.email}
                        variant="bordered"
                        onChange={handleChange}
                      />

                      <Input
                        classNames={{
                          input: "text-gray-900",
                          label: "text-gray-700 font-medium",
                        }}
                        isDisabled={updateProfileMutation.isPending}
                        label="Nomor WhatsApp"
                        name="no_wa"
                        placeholder="Masukkan nomor WhatsApp"
                        size="lg"
                        startContent={<PhoneIcon />}
                        value={editedUser?.no_wa}
                        variant="bordered"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <Divider />

                  {/* Password Change Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MdLockOutline />
                      Ubah Password
                    </h4>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 mb-4">
                        Kosongkan field password jika tidak ingin mengubah
                        password
                      </p>

                      <Input
                        classNames={{
                          input: "text-gray-900",
                          label: "text-gray-700 font-medium",
                        }}
                        endContent={
                          <button
                            aria-label="toggle password visibility"
                            className="focus:outline-none"
                            disabled={updateProfileMutation.isPending}
                            type="button"
                            onClick={() => togglePasswordVisibility("current")}
                          >
                            {isPasswordVisible.current ? (
                              <FaEyeSlash />
                            ) : (
                              <FaEye />
                            )}
                          </button>
                        }
                        isDisabled={updateProfileMutation.isPending}
                        label="Password Saat Ini"
                        name="currentPassword"
                        placeholder="Masukkan password saat ini"
                        size="lg"
                        startContent={<MdLockOutline />}
                        type={isPasswordVisible.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        variant="bordered"
                        onChange={handlePasswordChange}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          classNames={{
                            input: "text-gray-900",
                            label: "text-gray-700 font-medium",
                          }}
                          endContent={
                            <button
                              aria-label="toggle password visibility"
                              className="focus:outline-none"
                              disabled={updateProfileMutation.isPending}
                              type="button"
                              onClick={() => togglePasswordVisibility("new")}
                            >
                              {isPasswordVisible.new ? (
                                <FaEyeSlash />
                              ) : (
                                <FaEye />
                              )}
                            </button>
                          }
                          isDisabled={updateProfileMutation.isPending}
                          label="Password Baru"
                          name="newPassword"
                          placeholder="Masukkan password baru"
                          size="lg"
                          startContent={<MdLockOutline />}
                          type={isPasswordVisible.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          variant="bordered"
                          onChange={handlePasswordChange}
                        />

                        <Input
                          classNames={{
                            input: "text-gray-900",
                            label: "text-gray-700 font-medium",
                          }}
                          endContent={
                            <button
                              aria-label="toggle password visibility"
                              className="focus:outline-none"
                              disabled={updateProfileMutation.isPending}
                              type="button"
                              onClick={() =>
                                togglePasswordVisibility("confirm")
                              }
                            >
                              {isPasswordVisible.confirm ? (
                                <FaEyeSlash />
                              ) : (
                                <FaEye />
                              )}
                            </button>
                          }
                          isDisabled={updateProfileMutation.isPending}
                          label="Konfirmasi Password Baru"
                          name="confirmPassword"
                          placeholder="Konfirmasi password baru"
                          size="lg"
                          startContent={<MdLockOutline />}
                          type={isPasswordVisible.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          variant="bordered"
                          onChange={handlePasswordChange}
                        />
                      </div>

                      {passwordData.newPassword &&
                        passwordData.confirmPassword &&
                        passwordData.newPassword !==
                        passwordData.confirmPassword && (
                          <p className="text-red-500 text-sm mt-2">
                            Password baru dan konfirmasi password tidak cocok
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  isDisabled={updateProfileMutation.isPending}
                  size="lg"
                  variant="light"
                  onPress={handleCancel}
                >
                  Batal
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium"
                  isDisabled={updateProfileMutation.isPending}
                  isLoading={updateProfileMutation.isPending}
                  size="lg"
                  onPress={handleSave}
                >
                  {updateProfileMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
