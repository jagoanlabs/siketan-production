// components/EventTaniCard.tsx
import React from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";

import {
  EventTaniData,
  formatDate,
  formatTime,
  getDaysUntilEvent,
  getStatusColor,
  getStatusLabel,
} from "@/types/InfoPertanian/event.d";
import { assets } from "@/assets/assets";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";
import PermissionWrapper from "@/components/PermissionWrapper";

interface EventTaniCardProps {
  event: EventTaniData;
  viewMode?: "grid" | "list";
  onViewDetail?: (event: EventTaniData) => void;
  onEdit?: (event: EventTaniData) => void;
  onDelete?: (event: EventTaniData) => void;
  showActions?: boolean;
}

export const EventTaniCard: React.FC<EventTaniCardProps> = ({
  event,
  viewMode = "grid",
  onViewDetail,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const daysUntil = getDaysUntilEvent(event.tanggalAcara);
  const isUpcoming = daysUntil >= 0;

  if (viewMode === "list") {
    return (
      <Card className="w-full hover:shadow-lg transition-all duration-300 border-none shadow-sm">
        <CardBody className="p-0">
          <div className="flex flex-col md:flex-row gap-4 p-4">
            {/* Image */}
            <div className="md:w-80 flex-shrink-0 z-1">
              <img
                alt={event.namaKegiatan}
                className="w-full h-64 object-cover rounded-t-lg"
                src={
                  event.fotoKegiatan !== ""
                    ? event.fotoKegiatan
                    : assets.imagePlaceholder
                }
                onError={(e) => {
                  e.currentTarget.src = assets.imagePlaceholder;
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Chip
                      color={getStatusColor(event.tanggalAcara) as any}
                      size="sm"
                      variant="flat"
                    >
                      {getStatusLabel(event.tanggalAcara)}
                    </Chip>
                    {isUpcoming && daysUntil <= 7 && daysUntil > 0 && (
                      <Chip color="warning" size="sm" variant="dot">
                        {daysUntil} hari lagi
                      </Chip>
                    )}
                  </div>

                  {showActions && (
                    <div className="flex items-center gap-1">
                      <PermissionWrapper
                        permissions={[PERMISSIONS.ACARA_PETANI_EDIT]}
                      >
                        <Button
                          isIconOnly
                          color="primary"
                          size="sm"
                          variant="light"
                          onPress={() => onEdit?.(event)}
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
                        permissions={[PERMISSIONS.ACARA_PETANI_DELETE]}
                      >
                        <Button
                          isIconOnly
                          color="danger"
                          size="sm"
                          variant="light"
                          onPress={() => onDelete?.(event)}
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
                  {event.namaKegiatan}
                </h3>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-400"
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
                    <span>{formatDate(event.tanggalAcara)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span>{formatTime(event.waktuAcara)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span className="line-clamp-1">{event.tempat}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar
                    className="bg-primary-100 text-primary-600"
                    name={event.createdBy}
                    size="sm"
                  />
                  <div className="text-xs">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {event.createdBy}
                    </p>
                    <p className="text-gray-500">Organizer</p>
                  </div>
                </div>
                <PermissionWrapper
                  permissions={[
                    PERMISSIONS.ACARA_PETANI_INDEX,
                    PERMISSIONS.ACARA_PETANI_DETAIL,
                  ]}
                >
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
                    onPress={() => onViewDetail?.(event)}
                  >
                    Lihat Detail
                  </Button>
                </PermissionWrapper>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Grid View
  return (
    <Card className="w-full hover:shadow-lg transition-all duration-300 border-none shadow-sm group">
      <CardHeader className="p-0">
        <div className="relative w-full">
          <img
            alt={event.namaKegiatan}
            className="w-full h-64 object-cover rounded-t-lg"
            src={event.fotoKegiatan || assets.imagePlaceholder}
            onError={(e) => {
              e.currentTarget.src = assets.imagePlaceholder;
            }}
          />

          {/* Status chips */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Chip
              className="text-white font-medium"
              color={getStatusColor(event.tanggalAcara) as any}
              size="sm"
              variant="solid"
            >
              {getStatusLabel(event.tanggalAcara)}
            </Chip>

            {isUpcoming && daysUntil <= 7 && daysUntil > 0 && (
              <Chip
                className="text-white font-medium"
                color="warning"
                size="sm"
                variant="solid"
              >
                {daysUntil} hari lagi
              </Chip>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-4 py-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem]">
          {event.namaKegiatan}
        </h3>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              className="w-4 h-4 text-gray-400"
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
            <span className="text-xs">{formatDate(event.tanggalAcara)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <span className="text-xs">{formatTime(event.waktuAcara)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
              <path
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <span className="text-xs line-clamp-1">{event.tempat}</span>
          </div>
        </div>
      </CardBody>

      <Divider />

      <CardFooter className="px-4 py-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar
              className="bg-primary-100 text-primary-600"
              name={event.createdBy}
              size="sm"
            />
            <div className="text-xs">
              <p className="font-medium text-gray-900 dark:text-white truncate max-w-20">
                {event.createdBy}
              </p>
              <p className="text-gray-500">Organizer</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Admin Actions */}
            {showActions && (
              <>
                <PermissionWrapper
                  permissions={[PERMISSIONS.ACARA_PETANI_INDEX]}
                >
                  <Button
                    isIconOnly
                    color="default"
                    size="sm"
                    variant="light"
                    onPress={() => onEdit?.(event)}
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
                  permissions={[PERMISSIONS.ACARA_PETANI_DELETE]}
                >
                  <Button
                    isIconOnly
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => onDelete?.(event)}
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

            {/* View Detail Button */}
            <PermissionWrapper
              permissions={[
                PERMISSIONS.ACARA_PETANI_INDEX,
                PERMISSIONS.ACARA_PETANI_DETAIL,
              ]}
            >
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
                onPress={() => onViewDetail?.(event)}
              >
                Detail
              </Button>
            </PermissionWrapper>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
