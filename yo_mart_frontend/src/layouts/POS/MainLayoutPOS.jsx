import { Link, Outlet, useLocation } from "react-router";
import logo from "@/assets/image/logo.png";
import user from "@/assets/image/user.jpg";
import { ImList2 } from "react-icons/im";
import { BsShop } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Modal, message } from "antd";
import { FaChevronDown } from "react-icons/fa";
import { LogOut, Clock, FileX } from "lucide-react";
import { request } from "@/store/Configstore";
import { getProfile, removeAcccessToken, setProfile } from "@/store/profile";

const MainLayoutPOS = () => {
  const [currentTime, setCurrentTime] = useState("");
  const location = useLocation();

  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateCurrentTime = () => {
    const now = new Date();
    setCurrentTime(
      now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
    );
  };

  const users = getProfile();
  const [closingDay, setClosingDay] = useState(false);

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

  const fetchTodaySales = async () => {
    try {
      const res = await request("report/close_day");
      console.log(res);
    } catch (err) {
      console.error(err);
      message.error("មានបញ្ហាក្នុងការទាញទិន្នន័យ");
    }
  };

  const menu = (
    <Menu
      style={{
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0",
        padding: "4px",
        minWidth: 140,
      }}
    >
      <Menu.Item
        key="logout"
        style={{ borderRadius: 8 }}
        icon={<LogOut size={13} style={{ color: "#dc2626" }} />}
      >
        <span
          style={{ color: "#dc2626", fontWeight: 600, fontSize: 13 }}
          onClick={handleLogout}
        >
          Logout
        </span>
      </Menu.Item>
    </Menu>
  );

  const isPos = location.pathname === "/pos" || location.pathname === "/";
  const isProduct = location.pathname === "/product_detail";

  return (
    <div style={{ background: "#f0f4f8", minHeight: "100vh" }}>
      {/* ── HEADER ── */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "98%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 8px",
            height: 64,
          }}
        >
          {/* ── Brand ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                flexShrink: 0,
                background: "#f8fafc",
              }}
            >
              <img
                src={logo}
                alt="logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div>
              <h1
                className="font-battambang"
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#1e293b",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                ផ្ទះកាហ្វេ 24/7
              </h1>
              <p
                className="font-battambang"
                style={{ fontSize: 11, color: "#f97316", margin: 0 }}
              >
                សូមស្វាគមន៍
              </p>
            </div>
          </div>

          {/* ── Nav Links ── */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Button>បិទការលក់ថ្ងៃនេះ</Button>
            <Button
              onClick={() =>
                window.open(
                  "/pos/customer_screen",
                  "_blank",
                  "width=300,height=600,resizable=yes,scrollbars=yes",
                )
              }
            >
              បង្ហាញអេក្រង់អតិថិជន
            </Button>
            <Button
              onClick={() => {
                fetchTodaySales();
              }}
            >
              ទិន្នន័យលក់សម្រាប់ថ្ងៃនេះ
            </Button>{" "}
          </nav>

          {/* ── Right: Clock + User ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Clock */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                padding: "6px 12px",
              }}
            >
              <Clock size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {currentTime}
              </span>
            </div>

            {/* User */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #dbeafe",
                    boxShadow: "0 0 0 2px #eff6ff",
                  }}
                >
                  <img
                    src={user}
                    alt="user"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>

              {/* Name + Role */}
              <div style={{ lineHeight: 1.3 }}>
                {users?.name && (
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1e293b",
                      margin: 0,
                    }}
                  >
                    {users.name}
                  </p>
                )}
                <p
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  role
                </p>
              </div>

              {/* Dropdown chevron */}
              <Dropdown
                overlay={menu}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#dbeafe";
                    e.currentTarget.style.borderColor = "#bfdbfe";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f1f5f9";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  <FaChevronDown size={10} style={{ color: "#64748b" }} />
                </button>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main
        style={{
          maxWidth: "98%",
          margin: "0 auto",
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayoutPOS;
