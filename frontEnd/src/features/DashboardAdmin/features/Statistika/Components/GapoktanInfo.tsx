// components/GapoktanInfo.tsx
import React from "react";
import { Card, CardBody } from "@heroui/card";

import { Kelompok } from "@/types/Statistika/statistika.d";

interface GapoktanInfoProps {
  kelompokData: Kelompok | null;
}

export const GapoktanInfo: React.FC<GapoktanInfoProps> = ({ kelompokData }) => {
  if (!kelompokData) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-800">
        <CardBody>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📍</div>
            <p>Pilih Poktan terlebih dahulu untuk melihat identitas Gapoktan</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <CardBody>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Identitas Gapoktan
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Gapoktan
                </p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {kelompokData.gapoktan}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Nama Kelompok
                </p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {kelompokData.namaKelompok}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Desa
                </p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {kelompokData.desa}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Kecamatan
                </p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {kelompokData.kecamatan}
                </p>
              </div>
            </div>
          </div>

          {kelompokData.penyuluh && (
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Penyuluh
              </p>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {kelompokData.penyuluh}
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
