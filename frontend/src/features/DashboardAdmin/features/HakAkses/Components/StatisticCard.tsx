import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";

import { USER_ROLES } from "@/types/HakAkses/ubahAksesUser";

// Statistics Card Component
export const StatCard: React.FC<{
  role: (typeof USER_ROLES)[0];
  count: number;
  isLoading: boolean;
  total: number;
}> = ({ role, count, isLoading, total }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <Card
      className="border-none bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow"
      shadow="sm"
    >
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Chip color={role.color as any} size="sm" variant="dot" />
            <div>
              <p className="text-xs font-medium text-gray-600">{role.label}</p>
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">
                      {count.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">({percentage}%)</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
