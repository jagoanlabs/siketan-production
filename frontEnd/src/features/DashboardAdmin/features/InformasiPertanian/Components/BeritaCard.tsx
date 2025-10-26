// components/BeritaCard.tsx
import React from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";

import {
  BeritaData,
  getKategoriColor,
  stripHtml,
  formatDate,
  getRelativeTime,
} from "@/types/InfoPertanian/berita.d";
import { assets } from "@/assets/assets";
import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";
interface BeritaCardProps {
  berita: BeritaData;
  viewMode?: "grid" | "list";
  onReadMore?: (berita: BeritaData) => void;
  onEdit?: (berita: BeritaData) => void;
  onDelete?: (berita: BeritaData) => void;
  showActions?: boolean;
}

export const BeritaCard: React.FC<BeritaCardProps> = ({
  berita,
  viewMode = "grid",
  onReadMore,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const previewText = stripHtml(berita.isi);
  const maxPreviewLength = viewMode === "grid" ? 100 : 200;
  const truncatedPreview =
    previewText.length > maxPreviewLength
      ? previewText.substring(0, maxPreviewLength) + "..."
      : previewText;

  if (viewMode === "list") {
    return (
      <Card className="w-full hover:shadow-lg transition-all duration-300 border-none shadow-sm">
        <CardBody className="p-0">
          <div className="flex flex-col md:flex-row gap-4 p-4">
            {/* Image */}
            <div className="md:w-80 flex-shrink-0 z-1">
              <img
                alt={berita.judul}
                className="w-full h-64 object-cover rounded-t-lg"
                src={berita.fotoBerita || assets.imagePlaceholder}
                onError={(e) => {
                  e.currentTarget.src = assets.imagePlaceholder;
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Chip
                      color={getKategoriColor(berita.kategori) as any}
                      size="sm"
                      variant="flat"
                    >
                      {berita.kategori.toUpperCase()}
                    </Chip>
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(berita.tanggal)}
                    </span>
                  </div>

                  {showActions && (
                    <div className="flex items-center gap-1">
                      <PermissionWrapper
                        permissions={[PERMISSIONS.BERITA_PETANI_EDIT]}
                      >
                        <Button
                          isIconOnly
                          color="primary"
                          size="sm"
                          variant="light"
                          onPress={() => onEdit?.(berita)}
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
                      </PermissionWrapper>
                      <PermissionWrapper
                        permissions={[PERMISSIONS.BERITA_PETANI_DELETE]}
                      >
                        <Button
                          isIconOnly
                          color="danger"
                          size="sm"
                          variant="light"
                          onPress={() => onDelete?.(berita)}
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
                      </PermissionWrapper>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {berita.judul}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                  {truncatedPreview}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar
                    className="bg-primary-100 text-primary-600"
                    name={berita.createdBy}
                    size="sm"
                  />
                  <div className="text-xs">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {berita.createdBy}
                    </p>
                    <p className="text-gray-500">
                      {formatDate(berita.tanggal)}
                    </p>
                  </div>
                </div>

                <Button
                  color="primary"
                  endContent={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                  size="sm"
                  variant="light"
                  onPress={() => onReadMore?.(berita)}
                >
                  Baca Selengkapnya
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Grid View
  // Grid View
  return (
    <Card className="w-full hover:shadow-lg transition-all duration-300 border-none shadow-sm group">
      <CardHeader className="p-0">
        <div className="relative w-full">
          {/* Category chip */}
          <div className="absolute top-3 left-3 ">
            <Chip
              className="text-white font-medium"
              color={getKategoriColor(berita.kategori) as any}
              size="sm"
              variant="solid"
            >
              {berita.kategori.toUpperCase()}
            </Chip>
          </div>
          <div className=" w-full h-full">
            <img
              alt={berita.judul}
              className="w-full h-64 object-cover rounded-t-lg"
              src={berita.fotoBerita || assets.imagePlaceholder}
              onError={(e) => {
                e.currentTarget.src = assets.imagePlaceholder;
              }}
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-4 py-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
          {berita.judul}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 min-h-[3.75rem]">
          {truncatedPreview}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <span>{getRelativeTime(berita.tanggal)}</span>
        </div>
      </CardBody>

      <Divider />

      <CardFooter className="px-4 py-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar
              className="bg-primary-100 text-primary-600"
              name={berita.createdBy}
              size="sm"
            />
            <div className="text-xs">
              <p className="font-medium text-gray-900 dark:text-white truncate max-w-24">
                {berita.createdBy}
              </p>
              <p className="text-gray-500">Penulis</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Admin Actions */}
            {showActions && (
              <>
                <PermissionWrapper
                  permissions={[PERMISSIONS.BERITA_PETANI_EDIT]}
                >
                  <Button
                    isIconOnly
                    color="default"
                    size="sm"
                    variant="light"
                    onPress={() => onEdit?.(berita)}
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
                </PermissionWrapper>
                <PermissionWrapper
                  permissions={[PERMISSIONS.BERITA_PETANI_DELETE]}
                >
                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => onDelete?.(berita)}
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
                </PermissionWrapper>
              </>
            )}

            {/* Read More Button */}
            <Button
              color="primary"
              size="sm"
              startContent={
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
              }
              variant="flat"
              onPress={() => onReadMore?.(berita)}
            >
              Baca
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
