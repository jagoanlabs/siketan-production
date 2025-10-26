// components/JurnalCard.tsx
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import React from "react";

import { Jurnal } from "@/types/Jurnal/jurnal";
import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";

interface JurnalCardProps {
  jurnal: Jurnal;
  showActions?: boolean;
  viewMode?: "grid" | "list";
  onReadMore?: (jurnal: Jurnal) => void;
  onEdit?: (jurnal: Jurnal) => void;
  onDelete?: (jurnal: Jurnal) => void;
}

export const JurnalCard: React.FC<JurnalCardProps> = ({
  jurnal,
  showActions = true,
  viewMode = "grid",
  onReadMore,
  onEdit,
  onDelete,
}) => {
  const isListView = viewMode === "list";

  // Utility functions
  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    const div = document.createElement("div");

    div.innerHTML = html;

    return div.textContent || div.innerText || "";
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "public":
      case "terbit":
        return "success";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  // Event handlers dengan callback yang benar
  const handleEdit = () => {
    if (onEdit) {
      onEdit(jurnal);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(jurnal);
    }
  };

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore(jurnal);
    }
  };

  return (
    <Card
      className={`shadow-md hover:shadow-lg transition-all duration-300 ${
        isListView ? "flex-row" : ""
      }`}
    >
      {/* Image */}
      <div
        className={`${
          isListView ? "w-48 h-32 flex-shrink-0" : "w-full h-48"
        } overflow-hidden ${
          isListView ? "rounded-l-lg" : "rounded-t-lg"
        } relative`}
      >
        {jurnal.gambar ? (
          <img
            alt={jurnal.judul}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            src={jurnal.gambar}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}
        {jurnal.statusJurnal && (
          <div className="absolute top-3 right-3">
            <Chip
              className="text-white"
              color={getStatusColor(jurnal.statusJurnal)}
              size="sm"
              variant="solid"
            >
              {jurnal.statusJurnal}
            </Chip>
          </div>
        )}
      </div>

      {/* Content */}
      <CardBody className={`p-6 ${isListView ? "flex-1" : ""}`}>
        <div className={`${isListView ? "flex flex-col h-full" : ""}`}>
          {/* Title */}
          <h3
            className={`font-semibold text-gray-800 mb-3 ${
              isListView ? "text-lg line-clamp-2" : "text-lg line-clamp-2"
            }`}
          >
            {jurnal.judul}
          </h3>

          {/* Description */}
          <p
            className={`text-gray-600 text-sm mb-4 ${
              isListView ? "line-clamp-2" : "line-clamp-3"
            }`}
          >
            {truncateText(stripHtmlTags(jurnal.uraian), isListView ? 100 : 120)}
          </p>

          {/* Date */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
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
                strokeWidth="2"
              />
            </svg>
            <span>{formatDate(jurnal.tanggalDibuat)}</span>
          </div>

          {/* Footer */}
          <div
            className={`flex justify-between items-center pt-3 border-t ${
              isListView ? "mt-auto" : ""
            }`}
          >
            {/* Author */}
            <div className="flex items-center gap-3">
              <Avatar
                className="flex-shrink-0"
                name={jurnal.dataPenyuluh?.nama || jurnal.pengubah || "Admin"}
                size="sm"
                src={jurnal.dataPenyuluh?.foto ?? ""}
              />
              <div className="min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">
                  {jurnal.dataPenyuluh?.nama || jurnal.pengubah || "Admin"}
                </p>
                {jurnal.dataPenyuluh && (
                  <p className="text-xs text-gray-500 truncate">
                    {jurnal.dataPenyuluh.kecamatan}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center justify-end gap-2">
                {/* Edit Button */}
                <PermissionWrapper
                  permissions={[PERMISSIONS.JURNAL_PENYULUH_EDIT]}
                >
                  <Button
                    isIconOnly
                    className="hover:bg-gray-100"
                    color="default"
                    size="sm"
                    variant="light"
                    onPress={handleEdit}
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

                {/* Delete Button */}
                <PermissionWrapper
                  permissions={[PERMISSIONS.JURNAL_PENYULUH_DELETE]}
                >
                  <Button
                    isIconOnly
                    className="hover:bg-red-50"
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={handleDelete}
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

                {/* Read More Button */}
                <PermissionWrapper
                  permissions={[
                    PERMISSIONS.JURNAL_PENYULUH_INDEX,
                    PERMISSIONS.JURNAL_PENYULUH_INDEX,
                  ]}
                >
                  <Button
                    className="hover:bg-primary-100"
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
                    onPress={handleReadMore}
                  >
                    Baca
                  </Button>
                </PermissionWrapper>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
