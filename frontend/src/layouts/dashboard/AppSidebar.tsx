import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";

// Assume these icons are imported from an icon library

import { FaChevronDown, FaRegChartBar } from "react-icons/fa6";
import { PiFarm, PiUserGearBold } from "react-icons/pi";
import { PiNewspaper } from "react-icons/pi";
import { PiUser } from "react-icons/pi";
import {
  MdLockOpen,
  MdOutlineGroup,
  MdOutlineHistory,
  MdOutlineLogout,
  MdOutlinePerson,
} from "react-icons/md";
import { IoChatboxEllipsesOutline, IoStorefrontOutline } from "react-icons/io5";
import { confirmDialog } from "primereact/confirmdialog";
import { HiDotsHorizontal } from "react-icons/hi";

import { useAuth } from "@/hook/UseAuth";
import { assets } from "@/assets/assets";
import { useSidebar } from "@/context/SidebarContext";
import { PERMISSIONS } from "@/helpers/RoleHelper/constants/permission";
import { PermissionType } from "@/helpers/RoleHelper/constants/permission";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    permission?: PermissionType; // Permission untuk submenu item
  }[];
  isLogout?: boolean;
  permission?: PermissionType; // Permission untuk menu utama (opsional)
  permissions?: PermissionType[]; // Permissions untuk menu dengan submenu
};

const navItems: NavItem[] = [
  {
    icon: <LuLayoutDashboard />,
    name: "Dashboard",
    path: "/dashboard-admin",
    permission: PERMISSIONS.DASHBOARD_INDEX,
  },
  {
    icon: <FaRegChartBar />,
    name: "Statistik",
    subItems: [
      {
        name: "Statistika Pertanian",
        path: "/dashboard-admin/statistik-pertanian",
        pro: false,
        permission: PERMISSIONS.STATISTIC_INDEX,
      },
    ],
  },
  {
    icon: <PiFarm />,
    name: "Data Pertanian",
    subItems: [
      {
        name: "Tanaman Petani",
        path: "/dashboard-admin/data-tanaman",
        pro: false,
        permission: PERMISSIONS.TANAMAN_PETANI_INDEX,
      },
      {
        name: "Daftar Petani",
        path: "/dashboard-admin/data-petani",
        pro: false,
        permission: PERMISSIONS.DATA_PETANI_INDEX,
      },
    ],
  },
  {
    icon: <PiNewspaper />,
    name: "Informasi Pertanian",
    subItems: [
      {
        name: "Berita Petani",
        path: "/dashboard-admin/berita-pertanian",
        pro: false,
        permission: PERMISSIONS.BERITA_PETANI_INDEX,
      },
      {
        name: "Acara Petani",
        path: "/dashboard-admin/acara-pertanian",
        pro: false,
        permission: PERMISSIONS.ACARA_PETANI_INDEX,
      },
    ],
  },
  {
    icon: <IoStorefrontOutline />,
    name: "Toko Pertanian",
    subItems: [
      {
        name: "Daftar Toko",
        path: "/dashboard-admin/daftar-toko",
        pro: false,
        permission: PERMISSIONS.TOKO_PETANI_INDEX,
      },
    ],
  },
  {
    icon: <IoChatboxEllipsesOutline />,
    name: "Live Chat",
    subItems: [
      {
        name: "Live Chat",
        path: "/dashboard-admin/chat",
        pro: false,
        permission: PERMISSIONS.LIVE_CHAT_INDEX,
      },
    ],
  },
  {
    icon: <PiUser />,
    name: "Informasi Penyuluh",
    subItems: [
      {
        name: "Data Penyuluh",
        path: "/dashboard-admin/data-penyuluh",
        pro: false,
        permission: PERMISSIONS.DATA_PENYULUH_INDEX,
      },
      {
        name: "Jurnal Penyuluh",
        path: "/dashboard-admin/jurnal-penyuluh",
        pro: false,
        permission: PERMISSIONS.JURNAL_PENYULUH_INDEX,
      },
    ],
  },
  {
    icon: <MdLockOpen />,
    name: "Hak Akses",
    subItems: [
      {
        name: "Verifikasi User",
        path: "/dashboard-admin/verifikasi-user",
        pro: false,
        permission: PERMISSIONS.VERIFIKASI_USER_INDEX,
      },
      {
        name: "Ubah Akses User",
        path: "/dashboard-admin/ubah-akses-user",
        pro: false,
        permission: PERMISSIONS.UBAH_HAK_AKSES_INDEX,
      },
    ],
  },
  {
    icon: <MdOutlineHistory />,
    name: "Log Aktivitas",
    subItems: [
      {
        name: "Aktivitas User",
        path: "/dashboard-admin/aktivitas-user",
        pro: false,
        permission: PERMISSIONS.VERIFIKASI_USER_INDEX,
      },
      {
        name: "Data Sampah",
        path: "/dashboard-admin/data-sampah",
        pro: false,
        permission: PERMISSIONS.DATA_SAMPAH_INDEX,
      },
    ],
  },
  {
    icon: <MdOutlineGroup />,
    name: "Kelompok Petani",
    subItems: [
      {
        name: "Data Kelompok",
        path: "/dashboard-admin/data-kelompok",
        pro: false,
        permission: PERMISSIONS.DATA_KELOMPOK_INDEX,
      },
    ],
  },
  {
    icon: <PiUserGearBold />,
    name: "Operator",
    subItems: [
      {
        name: "Data Operator",
        path: "/dashboard-admin/operator",
        pro: false,
        permission: PERMISSIONS.DATA_OPERATOR_INDEX,
      },
    ],
  },
  {
    icon: <MdOutlinePerson />,
    name: "Profile",
    path: "/dashboard-admin/profile",
  },
  {
    icon: <MdOutlineLogout />,
    name: "Logout",
    path: "/logout",
    isLogout: true,
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { logout, hasPermission } = useAuth(); // Tambahkan hasPermission dari useAuth

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  const handleLogout = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      confirmDialog({
        message: "Apakah kamu yakin ingin logout?",
        header: "Konfirmasi Logout",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Ya, Logout",
        rejectLabel: "Batal",
        acceptClassName: "p-button-danger",
        accept: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Logout gagal", error);
          }
        },
      });
    },
    [logout],
  );

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;

      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }

      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        // Filter submenu items berdasarkan permission
        const accessibleSubItems =
          nav.subItems?.filter(
            (subItem) =>
              !subItem.permission || hasPermission(subItem.permission),
          ) || [];

        // Jika menu memiliki submenu, hanya tampilkan jika ada submenu yang dapat diakses
        if (nav.subItems) {
          if (accessibleSubItems.length === 0) {
            return null; // Jangan tampilkan menu jika tidak ada submenu yang dapat diakses
          }

          return (
            <li key={nav.name}>
              <button
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
                onClick={() => handleSubmenuToggle(index, menuType)}
              >
                <span
                  className={`menu-item-icon-size  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <FaChevronDown
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>

              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {accessibleSubItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                          to={subItem.path}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        }

        // Untuk menu tanpa submenu
        if (nav.path) {
          // Cek permission untuk menu utama
          const hasMenuPermission =
            !nav.permission || hasPermission(nav.permission);

          if (!hasMenuPermission) {
            return null;
          }

          return nav.isLogout ? (
            <li key={nav.name}>
              <button
                className={`menu-item group w-full text-left ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
                onClick={handleLogout}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </button>
            </li>
          ) : (
            <li key={nav.name}>
              <Link
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
                to={nav.path}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            </li>
          );
        }

        return null;
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                alt="Logo"
                className="dark:hidden"
                height={40}
                src={assets.imageLogo}
                width={150}
              />
              <img
                alt="Logo"
                className="hidden dark:block"
                height={40}
                src={assets.imageLogo}
                width={150}
              />
            </>
          ) : (
            <img
              alt="Logo"
              height={32}
              src={assets.imageLogoFavicon}
              width={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HiDotsHorizontal className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
