import { Dropdown } from "@heroui/react";

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
    <Dropdown>
      <Dropdown.Trigger>
        <button className="p-2 transition rounded-full hover:bg-gray-100 flex items-center justify-center outline-none">
          <FaChevronDown size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Popover className="p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg min-w-[200px] z-50">
        <Dropdown.Menu aria-label="User Actions" className="outline-none">
          <Dropdown.Item
            id="profile"
            textValue="Profile"
            className="px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 outline-none text-gray-700 dark:text-gray-200 block w-full"
            onClick={() => navigate("/profile")}
          >
            <div className="flex items-center gap-2">
              <FaRegCircleUser size={14} /> Profile
            </div>
          </Dropdown.Item>

          {user?.role.name === ROLES.OPERATOR_SUPER_ADMIN ||
          user?.role.name === ROLES.OPERATOR_ADMIN ||
          user?.role.name === ROLES.OPERATOR_POKTAN ||
          user?.role.name === ROLES.PENYULUH ||
          user?.role.name === ROLES.PENYULUH_SWADAYA ? (
            <Dropdown.Item
              id="dashboard"
              textValue="Dashboard Admin"
              className="px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 outline-none text-gray-700 dark:text-gray-200 block w-full"
              onClick={() => navigate("/dashboard-admin")}
            >
              <div className="flex items-center gap-2">
                <MdOutlineDashboard size={14} /> Dashboard Admin
              </div>
            </Dropdown.Item>
          ) : null}

          <Dropdown.Item
            id="delete"
            textValue="Keluar"
            className="px-3 py-2 text-sm rounded-lg cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 outline-none block w-full"
            onClick={() => {
              logout();
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.reload();
            }}
          >
            <div className="flex items-center gap-2 text-red-600">
              <RxExit size={14} /> Keluar
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
