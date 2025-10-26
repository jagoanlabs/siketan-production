import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";

// HeroUI Components
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import { Tooltip } from "@heroui/tooltip";

import { useProductState } from "../Components/useTokoPertanian";

import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";
import {
  useDeleteProduct,
  useMetaTokoPertanian,
  useProductData,
} from "@/hook/dashboard/tokoPertanian/useTokoPertanian";
import {
  formatPrice,
  getRoleColor,
  getRoleLabel,
  getStatusColor,
  ProductData,
} from "@/types/TokoPertanian/tokoPertanian.d";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { SelectionAction } from "@/types/table";
import { LoadingModal } from "@/components/LoadingModal";
import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";

export const TokoPertanian = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    currentPage,
    queryParams,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  } = useProductState();

  // API Hooks
  const {
    data: productResponse,
    isLoading,
    error,
    refetch,
  } = useProductData(queryParams);

  const { data: metaResponse } = useMetaTokoPertanian();

  const deleteProductMutation = useDeleteProduct();

  const bulkDeleteMutation = useDeleteProduct(true); // isBulkAction = true

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Selection state
  const [selectedProducts, setSelectedProducts] = useState<ProductData[]>([]);

  // Helper function to get unique ID from product
  const getProductId = (product: ProductData): number => product.id;

  // Loading modal states
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Define bulk actions
  const selectionActions: SelectionAction[] = [
    {
      label: "Hapus Produk",
      icon: <FaRegTrashAlt size={16} />,
      variant: "danger",
      onClick: async (selectedItems: ProductData[]) => {
        try {
          const productIds = selectedItems.map((product) => product.id);

          // Show loading modal
          setIsLoadingModalOpen(true);
          setLoadingMessage("Menghapus produk");
          setLoadingProgress(0);

          let successCount = 0;
          let failedCount = 0;
          const failedProducts: string[] = [];

          // await bulkDeleteMutation.mutateAsync(productIds);
          for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i];
            const currentProduct = selectedItems.find(
              (p) => p.id === productId,
            );

            // Update progress message
            setLoadingMessage(
              `Menghapus produk: ${currentProduct?.namaProducts || productId}`,
            );

            try {
              await bulkDeleteMutation.mutateAsync(productId);
              successCount++;
            } catch (error: any) {
              failedCount++;
              failedProducts.push(
                currentProduct?.namaProducts || `ID: ${productId}`,
              );
              console.error(`Failed to delete product ${productId}:`, error);
            }

            // Update progress
            const progress = Math.round(((i + 1) / productIds.length) * 100);

            setLoadingProgress(progress);
          }

          // Hide loading modal
          setIsLoadingModalOpen(false);

          // Show results
          if (failedCount === 0) {
            toast.success(`${successCount} produk berhasil dihapus`);
          } else if (successCount === 0) {
            toast.error(`Gagal menghapus semua produk (${failedCount} produk)`);
          } else {
            toast.warning(
              `${successCount} produk berhasil dihapus, ${failedCount} produk gagal dihapus`,
              {
                description:
                  failedProducts.length > 0
                    ? `Produk yang gagal: ${failedProducts.slice(0, 3).join(", ")}${failedProducts.length > 3 ? "..." : ""}`
                    : undefined,
              },
            );
          }

          // Clear selection and refetch data
          setSelectedProducts([]);
          refetch();
        } catch (error) {
          // Error handling already done in hook
          setIsLoadingModalOpen(false);
          toast.error("Terjadi kesalahan saat menghapus produk");
          console.error("Bulk delete error:", error);
        }
      },
      confirmMessage: `Apakah Anda yakin ingin menghapus {count} produk yang dipilih? Aksi ini tidak dapat dibatalkan.`,
    },
  ];

  // Handlers
  const handleViewDetail = (product: ProductData) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (product: ProductData) => {
    navigate(`/dashboard-admin/daftar-toko/edit/${product.id}`);
  };

  const handleDelete = (product: ProductData) => {
    confirmDialog({
      message: (
        <div className="space-y-3">
          <p>Apakah Anda yakin ingin menghapus produk ini?</p>
          <div className="bg-gray-50 p-3 rounded-lg border">
            <div className="flex items-center gap-3 mb-2">
              <img
                alt={product.namaProducts}
                className="w-12 h-12 object-cover rounded-lg"
                src={product.fotoTanaman}
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder-product.jpg";
                }}
              />
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {product.namaProducts}
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <strong>Penjual:</strong> {product.tbl_akun.nama}
                  </p>
                  <p>
                    <strong>Stok:</strong> {product.stok} {product.satuan}
                  </p>
                  <p>
                    <strong>Harga:</strong> {formatPrice(product.harga)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <p className="text-red-800 text-sm font-medium mb-1">
              ⚠️ Peringatan
            </p>
            <p className="text-red-700 text-xs">
              Produk yang dihapus tidak dapat dipulihkan kembali. Pastikan Anda
              benar-benar ingin menghapus produk ini.
            </p>
          </div>
        </div>
      ),
      header: "Konfirmasi Hapus Produk",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Hapus",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await deleteProductMutation.mutateAsync(product.id);
        } catch (error) {
          // Error handling already done in hook
        }
      },
      reject: () => {
        // User cancelled, do nothing
      },
    });
  };

  const handleCreateNew = () => {
    navigate("/dashboard-admin/daftar-toko/create");
  };

  // Data
  const productList = productResponse?.data || [];
  const paginationInfo = productResponse
    ? {
        total: productResponse.total,
        currentPages: productResponse.currentPages,
        limit: productResponse.limit,
        maxPages: productResponse.maxPages,
        from: productResponse.from,
        to: productResponse.to,
      }
    : undefined;

  // Table columns configuration
  const columns = [
    {
      key: "no",
      title: "NO",
      align: "center" as const,
      render: (_: ProductData, index: number) => {
        const baseIndex = (currentPage - 1) * 10 + index + 1;

        return <span className="font-medium text-gray-900">{baseIndex}</span>;
      },
    },
    {
      key: "nama",
      title: "NAMA",
      render: (product: ProductData) => (
        <div className="flex items-center gap-3">
          <div>
            {product.tbl_akun ? (
              <>
                <p className="font-medium text-gray-900 text-sm">
                  {product.tbl_akun.nama}
                </p>
                <p className="text-xs text-gray-500">
                  {product.tbl_akun.no_wa}
                </p>
              </>
            ) : (
              <p className="font-medium text-gray-900 text-sm">
                Tidak ada nama
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "peran",
      title: "PERAN",
      align: "center" as const,
      render: (product: ProductData) => (
        <Chip
          color={getRoleColor(product.profesiPenjual)}
          size="sm"
          variant="flat"
        >
          {getRoleLabel(product.profesiPenjual)}
        </Chip>
      ),
    },
    {
      key: "namaProducts",
      title: "NAMA PRODUK",
      render: (product: ProductData) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">
              {product.namaProducts}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "stok",
      title: "STOK",
      align: "right" as const,
      render: (product: ProductData) => (
        <span className="font-medium text-gray-900">
          {product.stok.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      key: "satuan",
      title: "SATUAN",
      align: "center" as const,
      render: (product: ProductData) => (
        <span className="text-sm text-gray-700">{product.satuan}</span>
      ),
    },
    {
      key: "harga",
      title: "HARGA",
      align: "right" as const,
      render: (product: ProductData) => (
        <span className="font-medium text-green-600">
          {formatPrice(product.harga)}
        </span>
      ),
    },
    {
      key: "status",
      title: "STATUS PRODUK",
      align: "center" as const,
      render: (product: ProductData) => (
        <Chip color={getStatusColor(product.status)} size="sm" variant="flat">
          {product.status}
        </Chip>
      ),
    },
    {
      key: "aksi",
      title: "AKSI",
      align: "center" as const,
      render: (product: ProductData) => (
        <div className="flex items-center justify-center gap-1">
          <PermissionWrapper
            permissions={[
              PERMISSIONS.TOKO_PETANI_INDEX,
              PERMISSIONS.TOKO_PETANI_DETAIL,
            ]}
          >
            <Tooltip content="Lihat Detail">
              <Button
                isIconOnly
                color="primary"
                size="sm"
                variant="light"
                onPress={() => handleViewDetail(product)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Button>
            </Tooltip>
          </PermissionWrapper>

          <PermissionWrapper permissions={[PERMISSIONS.TOKO_PETANI_EDIT]}>
            <Tooltip content="Edit Data">
              <Button
                isIconOnly
                color="warning"
                size="sm"
                variant="light"
                onPress={() => handleEdit(product)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Button>
            </Tooltip>
          </PermissionWrapper>

          <PermissionWrapper permissions={[PERMISSIONS.TOKO_PETANI_DELETE]}>
            <Tooltip content="Hapus Data">
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="light"
                onPress={() => handleDelete(product)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Button>
            </Tooltip>
          </PermissionWrapper>
        </div>
      ),
    },
  ];

  // Header Actions
  const headerActions = (
    <div className="flex items-center gap-2">
      <PermissionWrapper permissions={[PERMISSIONS.TOKO_PETANI_CREATE]}>
        <Button
          color="primary"
          startContent={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4v16m8-8H4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          }
          variant="solid"
          onPress={handleCreateNew}
        >
          Tambah Produk
        </Button>
      </PermissionWrapper>

      <Button
        isIconOnly
        isDisabled={isLoading}
        variant="bordered"
        onPress={() => refetch()}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </Button>
    </div>
  );

  // Stats component
  const StatsCards = () => {
    return (
      <Card className="mb-6" shadow="sm">
        <CardBody className="py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {metaResponse?.data?.totalProduct || 0}
              </p>
              <p className="text-sm text-gray-600">Total Produk</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {metaResponse?.data?.totalProductPetani || 0}
              </p>
              <p className="text-sm text-gray-600">Dari Petani</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {metaResponse?.data?.totalProductPenyuluh || 0}
              </p>
              <p className="text-sm text-gray-600">Dari Penyuluh</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="min-h-screen max-w-6xl container mx-auto py-6">
      <PageMeta
        description="Dashboard Admin untuk mengelola produk toko pertanian"
        title="Toko Pertanian | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Toko Pertanian" },
        ]}
      />

      <LoadingModal
        isOpen={isLoadingModalOpen}
        message={loadingMessage}
        progress={loadingProgress}
        showProgress={true}
        type="processing"
      />

      <div className="container mx-auto px-4 w-ful">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Toko Pertanian
              </h1>
              <p className="text-gray-600">
                Kelola produk pertanian dari petani dan penyuluh
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards />
        </div>

        {/* Reusable Table */}
        <ReusableTable<ProductData>
          // Data & Loading
          className=""
          currentPage={currentPage}
          emptyStateMessage="Belum ada produk. Mulai dengan menambahkan produk pertanian pertama Anda." // You can implement debounce in useProductState if needed
          enableMultiSelect={true}
          getItemId={getProductId}
          headerActions={headerActions}
          paginationInfo={paginationInfo}
          selectedItems={selectedProducts}
          selectionActions={selectionActions}
          showPagination={true}
          showSearch={true}
          subtitle=""
          title=""
          onClearSearch={clearSearch}
          onSearchChange={handleSearchChange}


          // Multiple Selection - NEW
          onSelectionChange={setSelectedProducts}
          data={productList}
          // Search
          debouncedSearchTerm={searchTerm}
          error={error}
          // Columns Configuration
          columns={columns}
          searchPlaceholder="Cari berdasarkan nama penjual atau nama produk..."
          // Pagination
          loading={isLoading}
          onPageChange={handlePageChange}
          // Styling & Behavior
          searchTerm={searchTerm}
        />

        {/* Detail Modal */}
        <Modal
          className="max-h-[90vh]"
          isOpen={isDetailModalOpen}
          scrollBehavior="inside"
          size="3xl"
          onOpenChange={setIsDetailModalOpen}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Chip
                      color={
                        selectedProduct
                          ? (getStatusColor(selectedProduct.status) as any)
                          : "default"
                      }
                      size="sm"
                      variant="flat"
                    >
                      {selectedProduct?.status}
                    </Chip>
                    <Chip
                      color={
                        selectedProduct
                          ? (getRoleColor(
                              selectedProduct.profesiPenjual,
                            ) as any)
                          : "default"
                      }
                      size="sm"
                      variant="flat"
                    >
                      {selectedProduct &&
                        getRoleLabel(selectedProduct.profesiPenjual)}
                    </Chip>
                  </div>
                  <h2 className="text-xl font-bold">
                    {selectedProduct?.namaProducts}
                  </h2>
                </ModalHeader>

                <ModalBody>
                  {selectedProduct && (
                    <div className="space-y-6">
                      {/* Product Image */}
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          alt={selectedProduct.namaProducts}
                          className="w-full h-full object-cover"
                          src={selectedProduct.fotoTanaman}
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/placeholder-product.jpg";
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4" shadow="sm">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Informasi Produk
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Stok:</span>
                              <span className="font-medium">
                                {selectedProduct.stok.toLocaleString("id-ID")}{" "}
                                {selectedProduct.satuan}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Harga:</span>
                              <span className="font-medium text-green-600">
                                {formatPrice(selectedProduct.harga)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <Chip
                                color={getStatusColor(selectedProduct.status)}
                                size="sm"
                                variant="flat"
                              >
                                {selectedProduct.status}
                              </Chip>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4" shadow="sm">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Informasi Penjual
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Avatar
                                className="bg-primary-100 text-primary-600"
                                name={selectedProduct.tbl_akun.nama}
                                src={selectedProduct.tbl_akun.foto || undefined}
                              />
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {selectedProduct.tbl_akun.nama}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {selectedProduct.tbl_akun.no_wa}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Peran:</span>
                                <Chip
                                  color={getRoleColor(
                                    selectedProduct.profesiPenjual,
                                  )}
                                  size="sm"
                                  variant="flat"
                                >
                                  {getRoleLabel(selectedProduct.profesiPenjual)}
                                </Chip>
                              </div>
                              {selectedProduct.tbl_akun.email && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Email:</span>
                                  <span className="font-medium">
                                    {selectedProduct.tbl_akun.email}
                                  </span>
                                </div>
                              )}
                              {selectedProduct.profesiPenjual === "petani" &&
                                selectedProduct.tbl_akun.dataPetani && (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Kecamatan:
                                      </span>
                                      <span className="font-medium">
                                        {
                                          selectedProduct.tbl_akun.dataPetani
                                            .kecamatan
                                        }
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Desa:
                                      </span>
                                      <span className="font-medium">
                                        {
                                          selectedProduct.tbl_akun.dataPetani
                                            .desa
                                        }
                                      </span>
                                    </div>
                                  </>
                                )}
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Description */}
                      <Card className="p-4" shadow="sm">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Deskripsi Produk
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {selectedProduct.deskripsi}
                        </p>
                      </Card>
                    </div>
                  )}
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Tutup
                  </Button>
                  {selectedProduct && (
                    <PermissionWrapper
                      permissions={[PERMISSIONS.TOKO_PETANI_EDIT]}
                    >
                      <Button
                        color="primary"
                        startContent={
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        }
                        variant="flat"
                        onPress={() => {
                          onClose();
                          handleEdit(selectedProduct);
                        }}
                      >
                        Edit Produk
                      </Button>
                    </PermissionWrapper>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
