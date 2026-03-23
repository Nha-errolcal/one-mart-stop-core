import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import { request } from "@/store/Configstore";
import { getProfile, removeAcccessToken, setProfile } from "@/store/profile";

import { Dropdown } from "antd";
import { ChevronDown, Menu as MenuIcon, UserCheck } from "lucide-react";

import {
  LayoutDashboard,
  Users,
  UserCog,
  ShoppingCart,
  Store,
  Package,
  Layers,
  Settings,
} from "lucide-react";

import logo from "@/assets/logo.png";
import userProfileImg from "@/assets/image/user.jpg";

const navItems = [
  { key: "/", label: "ផ្ទាំងគ្រប់គ្រង", icon: <LayoutDashboard size={20} /> },
  {
    key: "manage",
    label: "ការគ្រប់គ្រង",
    icon: <Users size={20} />,
    children: [
      { key: "/customer", label: "អតិថិជន", icon: <Users size={18} /> },
      { key: "/employees", label: "បុគ្គលិក", icon: <UserCog size={18} /> },
    ],
  },
  {
    key: "products",
    label: "ទំនិញ/ផលិតផល",
    icon: <Package size={20} />,
    children: [
      {
        key: "/product_detail",
        label: "បញ្ជីផលិតផល",
        icon: <Package size={18} />,
      },
      { key: "/category", label: "ប្រភេទផលិតផល", icon: <Layers size={18} /> },
    ],
  },
  {
    key: "sales",
    label: "ការលក់",
    icon: <ShoppingCart size={20} />,
    children: [
      { key: "/pos", label: "POS លក់", icon: <Store size={18} /> },
      { key: "/order", label: "ការបញ្ជាទិញ", icon: <ShoppingCart size={18} /> },
    ],
  },
  {
    key: "settings",
    label: "ការកំណត់",
    icon: <Settings size={20} />,
    children: [
      {
        key: "/user",
        label: "អ្នកប្រើប្រាស់",
        icon: <Users size={18} />,
      },
      {
        key: "/role",
        label: "តួនាទី",
        icon: <UserCheck size={18} />,
      },
    ],
  },
];

const SidebarMenu = ({ collapsed = false }) => {
  const { pathname } = useLocation();
  const [openGroup, setOpenGroup] = useState({});

  useEffect(() => {
    const next = {};
    navItems.forEach((g) => {
      if (g.children?.some((c) => c.key === pathname)) next[g.key] = true;
    });
    setOpenGroup((prev) => ({ ...prev, ...next }));
  }, [pathname]);

  const toggleGroup = (key) =>
    setOpenGroup((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <ul className="space-y-0.5 font-battambang px-2">
      {navItems.map((item) => {
        if (!item.children) {
          return (
            <li key={item.key}>
              <NavLink
                to={item.key}
                end={item.key === "/"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-500 text-white font-semibold shadow-md"
                      : "text-slate-300 hover:bg-white/10 hover:text-white",
                  ].join(" ")
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="text-[15px] truncate">{item.label}</span>
                )}
              </NavLink>
            </li>
          );
        }

        const isOpen = !!openGroup[item.key];
        const isAnyActive = item.children.some((c) => c.key === pathname);

        return (
          <li key={item.key}>
            <button
              onClick={() => toggleGroup(item.key)}
              className={[
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200",
                isAnyActive
                  ? "bg-white/10 text-white font-semibold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
              ].join(" ")}
              title={collapsed ? item.label : undefined}
              type="button"
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="text-[15px] truncate">{item.label}</span>
                )}
              </div>
              {!collapsed && (
                <ChevronDown
                  size={15}
                  className={[
                    "transition-transform duration-200 shrink-0",
                    isOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              )}
            </button>

            {!collapsed && isOpen && (
              <ul className="mt-1 ml-4 space-y-0.5 border-l-2 border-white/10 pl-3">
                {item.children.map((child) => (
                  <li key={child.key}>
                    <NavLink
                      to={child.key}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
                          isActive
                            ? "bg-blue-500 text-white font-semibold shadow-md"
                            : "text-slate-400 hover:bg-white/10 hover:text-white",
                        ].join(" ")
                      }
                    >
                      <span className="shrink-0">{child.icon}</span>
                      <span className="text-[14px] truncate">
                        {child.label}
                      </span>
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
  const user = getProfile();
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
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

  const initials = useMemo(() => {
    const name = (user?.name || "User").trim();
    return (
      name
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("") || "U"
    );
  }, [user?.name]);

  const menuItems = [
    {
      key: "logout",
      label: <span className="font-battambang text-red-500">ចាកចេញ</span>,
      onClick: handleLogout,
    },
    {
      key: "role",
      label: <span className="font-battambang"> {user?.name || "User"}</span>,
      onClick: handleLogout,
    },
  ];

  if (!user) return null;

  return (
    <div className="h-screen w-full flex overflow-hidden font-battambang">
      <aside
        style={{ backgroundColor: "#1e2330" }}
        className={`flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}
      >
        {/* Logo bar */}
        <div
          style={{ backgroundColor: "#161b27" }}
          className="h-16 px-3 flex items-center gap-3 shrink-0"
        >
          <div className="w-9 h-9 shrink-0 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {!collapsed && (
            <div className="leading-tight overflow-hidden">
              <div className="text-sm font-bold text-white truncate">
                ម៉ាតវ៉ាន់ស្តុប ខេអេច
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Admin Dashboard
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          <SidebarMenu collapsed={collapsed} />
        </nav>

        {/* Footer */}
        <div
          style={{ backgroundColor: "#161b27" }}
          className="p-3 border-t border-white/5 shrink-0"
        >
          {!collapsed ? (
            <div className="flex items-center gap-2 px-1">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] text-slate-500">Logged in as</div>
                <div className="text-sm font-semibold text-slate-200 truncate">
                  {user?.name || "User"}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                {initials}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <header
          style={{ backgroundColor: "#1a56db" }}
          className="h-16 px-5 flex items-center justify-between shrink-0 shadow-md shadow-blue-900/20"
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-lg hover:bg-white/15 active:scale-95 transition"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
              type="button"
            >
              <MenuIcon size={20} className="text-white" />
            </button>
            <div className="hidden md:block">
              <div className="text-base font-semibold text-white">
                សូមស្វាគមន៍ 👋
              </div>
              <div className="text-[11px] text-blue-200">{currentTime}</div>
            </div>
            <div className="md:hidden text-[11px] text-blue-200">
              {currentTime}
            </div>
          </div>

          {/* Right */}
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <button
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/15 transition active:scale-[0.99]"
              type="button"
            >
              <div className="relative">
                <img
                  src={userProfileImg}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white/40"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-blue-600" />
              </div>

              <ChevronDown size={15} className="text-white/70" />
            </button>
          </Dropdown>
        </header>

        {/* Content */}
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
