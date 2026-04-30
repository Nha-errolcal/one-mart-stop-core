import { useEffect, useMemo, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  NavLink,
  Link,
} from "react-router-dom";
import { request } from "@/store/Configstore";
import { getProfile, removeAcccessToken, setProfile } from "@/store/profile";
import logo from "../assets/logo.jpg";
import { Dropdown } from "antd";
import {
  Bell,
  ChevronDown,
  Info,
  LogOut,
  Menu as MenuIcon,
  User,
  UserCheck,
} from "lucide-react";
import { MdSecurity } from "react-icons/md";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Store,
  Package,
  Layers,
  Settings,
} from "lucide-react";
import userProfileImg from "../assets/image/user.jpg";
import { getPermission } from "../util/Helper";

const navItemsMenu = [
  { key: "/", label: "ផ្ទាំងគ្រប់គ្រង", icon: <LayoutDashboard size={20} /> },
  { key: "/customer", label: "អតិថិជន", icon: <Users size={18} /> },
  {
    key: "/products",
    label: "ទំនិញ/ផលិតផល",
    icon: <Package size={20} />,
    children: [
      { key: "/category", label: "ប្រភេទផលិតផល", icon: <Layers size={18} /> },
      { key: "/products", label: "បញ្ជីផលិតផល", icon: <Package size={18} /> },
    ],
  },
  {
    key: "/sales",
    label: "ការលក់",
    icon: <ShoppingCart size={20} />,
    children: [
      { key: "/sale/pos", label: "លក់", icon: <Store size={18} /> },
      {
        key: "/sale/order",
        label: "ការបញ្ជាទិញ",
        icon: <ShoppingCart size={18} />,
      },
    ],
  },
  {
    key: "/account",
    label: "គ្រប់គ្រងគណនី",
    icon: <Users size={20} />,
    children: [
      {
        key: "/account/users",
        label: "បញ្ជីសមាជិក",
        icon: <Users size={18} />,
      },
      {
        key: "/account/profile",
        label: "ប្រវត្តិគណនី",
        icon: <User size={18} />,
      },
      { key: "/account/roles", label: "តួនាទី", icon: <UserCheck size={18} /> },
    ],
  },
  {
    key: "/setting",
    label: "ការកំណត់",
    icon: <Settings />,
    children: [
      {
        key: "/setting/permission",
        label: "សិទ្ធិ",
        icon: <MdSecurity size={18} />,
      },
      {
        key: "/setting/create/permission",
        label: "បង្កើតសិទ្ធិ",
        icon: <MdSecurity size={18} />,
      },
    ],
  },
  { key: "/about/system", label: "អំពីប្រព័ន្ធ", icon: <Info size={20} /> },
  { key: "/about/team", label: "អំពីក្រុម", icon: <Users size={20} /> },
];

const extractAllowedRoutes = (permission) => {
  if (!permission) return new Set();

  let flatList = [];

  if (Array.isArray(permission)) {
    flatList = permission;
  } else if (typeof permission === "object") {
    flatList = Object.values(permission).flatMap((entry) => {
      if (Array.isArray(entry)) return entry;
      if (Array.isArray(entry?.action)) return entry.action;
      return [];
    });
  }

  const routes = flatList
    .map((p) => p?.web_route ?? p?.route_web ?? null)
    .filter(Boolean);

  return new Set(routes);
};

const SidebarMenu = ({ collapsed = false }) => {
  const { pathname } = useLocation();
  const [openGroup, setOpenGroup] = useState({});

  const permission = getPermission();
  const allowedRoutes = useMemo(
    () => extractAllowedRoutes(permission),
    [JSON.stringify(permission)],
  );

  const items = useMemo(() => {
    if (!allowedRoutes.size) return [];

    return navItemsMenu.reduce((acc, item) => {
      if (!item.children) {
        if (allowedRoutes.has(item.key)) acc.push(item);
        return acc;
      }
      const allowedChildren = item.children.filter((child) =>
        allowedRoutes.has(child.key),
      );
      if (allowedChildren.length > 0) {
        acc.push({ ...item, children: allowedChildren });
      }
      return acc;
    }, []);
  }, [allowedRoutes]);

  useEffect(() => {
    const next = {};
    items.forEach((group) => {
      if (group.children?.some((c) => c.key === pathname)) {
        next[group.key] = true;
      }
    });
    setOpenGroup((prev) => {
      const hasChange = Object.keys(next).some((k) => !prev[k]);
      return hasChange ? { ...prev, ...next } : prev;
    });
  }, [pathname, items]);

  const toggleGroup = (key) =>
    setOpenGroup((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <ul className="space-y-0.5 font-battambang px-2">
      {items.map((item) => {
        if (!item.children) {
          return (
            <li key={item.key}>
              <NavLink
                to={item.key}
                end={item.key === "/"}
                className={({ isActive }) =>
                  [
                    "flex items-center text-sm gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-[#EA4156] text-white shadow-md"
                      : "text-black hover:bg-[#EA4156] hover:text-white",
                  ].join(" ")
                }
              >
                <span>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          );
        }

        const isOpen = !!openGroup[item.key];
        const isAnyActive = item.children.some((c) => c.key === pathname);

        return (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => toggleGroup(item.key)}
              className={[
                "w-full flex items-center text-sm justify-between px-3 py-2.5 rounded-lg transition-all duration-200",
                isAnyActive
                  ? "bg-[#EA4156] text-white font-semibold"
                  : "text-gray-700 hover:bg-[#EA4156] hover:text-white",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </div>
              {!collapsed && (
                <ChevronDown
                  size={15}
                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {!collapsed && isOpen && (
              <ul className="mt-1 ml-4 space-y-0.5 border-l-2 border-gray-200 pl-3">
                {item.children.map((child) => (
                  <li key={child.key}>
                    <NavLink
                      to={child.key}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                          isActive
                            ? "text-[#EA4156] font-semibold"
                            : "text-gray-800 hover:text-[#EA4156]",
                        ].join(" ")
                      }
                    >
                      <span>{child.icon}</span>
                      <span>{child.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const MainLayout = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const user = useMemo(() => getProfile(), []);
  const navigate = useNavigate();

  useEffect(() => {
    const update = () =>
      setCurrentTime(
        new Date().toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      const res = await request("logout", "post");
      if (res) {
        removeAcccessToken("");
        setProfile("");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  const menuItems = [
    {
      key: "profile-header",
      label: (
        <Link to="/account/profile">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <div className="relative w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || "Dev"}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.roles?.[0]?.name || "Role"}
              </p>
            </div>
          </div>
        </Link>
      ),
    },
    {
      key: "profile",
      label: (
        <Link to="/account/profile" className="flex items-center gap-3 py-1">
          <User size={16} className="text-gray-400" />
          <span className="text-sm text-gray-700">My Profile</span>
        </Link>
      ),
    },
    {
      key: "settings",
      label: (
        <span className="flex items-center gap-3 py-1">
          <Settings size={16} className="text-gray-400" />
          <span className="text-sm text-gray-700">Settings</span>
        </span>
      ),
    },
    {
      key: "notifications",
      label: (
        <span className="flex items-center gap-3 py-1">
          <Bell size={16} className="text-gray-400" />
          <span className="text-sm text-gray-700">Notifications</span>
        </span>
      ),
    },
    { type: "divider" },
    {
      key: "logout",
      onClick: handleLogout,
      danger: true,
      label: (
        <span className="flex items-center gap-3 py-1 font-battambang">
          <LogOut size={16} />
          <span className="text-sm font-medium">ចាកចេញ</span>
        </span>
      ),
    },
  ];

  if (!user) return null;

  return (
    <div className="h-screen w-full flex overflow-hidden font-battambang">
      {/* Sidebar */}
      <aside
        className={`flex flex-col transition-all bg-white duration-300 shadow-md ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo */}
        <div className="h-16 px-3 flex items-center bg-white gap-3 shrink-0">
          <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={logo}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/default-avatar.png";
              }}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {!collapsed && (
            <div className="leading-tight overflow-hidden">
              <div className="text-sm font-bold text-[#EA4156] truncate">
                ម៉ាតវ៉ាន់ស្តុប ខេអេច
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          <SidebarMenu collapsed={collapsed} />
        </nav>

        {/* Footer */}
        <div className="p-3 text-center">
          <p className="text-[10px] font-mono text-gray-700">
            © {new Date().getFullYear()} Mat Van Stop KH · All rights reserved
            by <br />
            <a
              href="https://teamyearng.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-400 transition-colors"
            >
              teamyearng
            </a>
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 px-5 flex items-center bg-white justify-between shrink-0 shadow-sm mb-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <MenuIcon size={20} className="text-[#EA4156]" />
            </button>
            <div className="hidden md:block">
              <div className="text-base font-semibold text-[#EA4156]">
                សូមស្វាគមន៍ 👋
              </div>
              <div className="text-[11px] text-[#EA4156]">{currentTime}</div>
            </div>
            <div className="md:hidden text-[11px] text-[#EA4156]">
              {currentTime}
            </div>
          </div>

          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-50 transition active:scale-[0.99]"
            >
              <div className="relative">
                <img
                  src={userProfileImg}
                  alt="User"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white/40"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-blue-600" />
              </div>
              <ChevronDown size={15} className="text-black" />
            </button>
          </Dropdown>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
