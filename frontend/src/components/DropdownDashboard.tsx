import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";

import { FaChevronDown, FaRegCircleUser } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";

import { useAuth } from "@/hook/UseAuth";
import { ROLES } from "@/helpers/RoleHelper/constants/role";

export const DropdownDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* Dropdown */}
      <Dropdown>
        <DropdownTrigger>
          <button className="p-2 transition rounded-full hover:bg-gray-100">
            <FaChevronDown size={18} />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="profile"
            onClick={() => navigate("/profile")}
          >
            <FaRegCircleUser size={14} /> Profile
          </DropdownItem>
          {/* {user?.role.name === ROLES.PETANI || user?.role.name === ROLES.PENYULUH || user?.role.name === ROLES.PENYULUH_SWADAYA ? (
            <DropdownItem
              key="report"
              startContent={<IoDocumentTextOutline size={14} />}
              onClick={() =>
                navigate(
                  user?.peran === "petani"
                    ? "/laporan-petani"
                    : "/laporan-penyuluh",
                )
              }
            >
              Isi Formulir Laporan
            </DropdownItem>
          ) : null}

          {user?.role.name === ROLES.PETANI || user?.role.name === ROLES.PENYULUH || user?.role.name === ROLES.PENYULUH_SWADAYA ? (
            <DropdownItem
              key="history"
              startContent={<GrDocumentUser size={14} />}
              onClick={() => navigate("/dashboard/riwayat-form")}
            >
              Riwayat Laporan Saya
            </DropdownItem>
          ) : null} */}

          {/* Conditional rendering langsung tanpa wrapper */}
          {user?.role.name === ROLES.OPERATOR_SUPER_ADMIN ||
          user?.role.name === ROLES.OPERATOR_ADMIN ||
          user?.role.name === ROLES.OPERATOR_POKTAN ||
          user?.role.name === ROLES.PENYULUH ||
          user?.role.name === ROLES.PENYULUH_SWADAYA ? (
            <DropdownItem
              key="dashboard"
              onClick={() => navigate("/dashboard-admin")}
            >
              <MdOutlineDashboard size={14} /> Dashboard Admin
            </DropdownItem>
          ) : null}
          {/* Conditional rendering langsung tanpa wrapper */}
          <DropdownItem
            key="delete"
            className="text-danger"
            variant="danger"
            onClick={() => {
              logout();
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.reload();
            }}
          >
            <RxExit size={14} /> Keluar
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
