import { ShopOutlined } from "@ant-design/icons";
import { Clock10, Languages, Rocket, Store, StoreIcon } from "lucide-react";
import { Outlet } from "react-router";
import CopyRight from "../../components/CopyRight";

/* ── Brand tokens ── */
const B = {
  red: "#EA4156",
  redDark: "#c52e42",
  redSoft: "rgba(234,65,86,0.15)",
  white: "#ffffff",
  black: "#0f0f0f",
  gray: "#1a1a1a",
  grayMid: "#2a2a2a",
  grayText: "rgba(255,255,255,0.45)",
};

/* ─── Left Panel ─── */
const InfoPanel = () => (
  <div
    style={{
      flex: 1,
      background: B.black,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 40px",
      position: "relative",
      overflow: "hidden",
      minHeight: "100vh",
      borderRight: `1px solid ${B.grayMid}`,
    }}
  >
    {/* Red glow blob top-right */}
    <div
      style={{
        position: "absolute",
        top: -80,
        right: -80,
        width: 320,
        height: 320,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${B.red}55 0%, transparent 70%)`,
        pointerEvents: "none",
      }}
    />
    {/* Red glow blob bottom-left */}
    <div
      style={{
        position: "absolute",
        bottom: -60,
        left: -60,
        width: 240,
        height: 240,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${B.red}33 0%, transparent 70%)`,
        pointerEvents: "none",
      }}
    />

    {/* Decorative concentric rings */}
    {[140, 230, 320].map((size, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          border: `1px solid rgba(234,65,86,${0.08 - i * 0.02})`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      />
    ))}

    {/* Logo */}
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: 24,
        background: B.red,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 44,
        boxShadow: `0 8px 40px ${B.red}66`,
        marginBottom: 28,
        position: "relative",
        zIndex: 1,
      }}
    >
      <ShopOutlined className="text-white" size={50} />
    </div>

    {/* Shop name */}
    <h1
      style={{
        color: B.white,
        fontFamily: "'Battambang', serif",
        fontSize: 22,
        fontWeight: 700,
        textAlign: "center",
        margin: "0 0 6px",
        position: "relative",
        zIndex: 1,
        lineHeight: 1.7,
        letterSpacing: 0.5,
      }}
    >
      ម៉ាតវ៉ាន់ស្តុប ខេអេច
    </h1>
    <p
      style={{
        color: B.red,
        fontFamily: "'Battambang', serif",
        fontSize: 13,
        textAlign: "center",
        margin: "0 0 36px",
        position: "relative",
        zIndex: 1,
        letterSpacing: 1,
        textTransform: "uppercase",
        fontWeight: 600,
      }}
    >
      Mat Van Stop KH
    </p>

    {/* Divider */}
    <div
      style={{
        width: 40,
        height: 2,
        background: B.red,
        borderRadius: 2,
        marginBottom: 36,
        position: "relative",
        zIndex: 1,
      }}
    />

    {/* Info cards */}
    {[
      {
        icon: <StoreIcon className="text-white" size={25} />,
        label: "ឈ្មោះហាង",
        value: "ម៉ាតវ៉ាន់ស្តុប ខេអេច",
      },
      {
        icon: <Rocket className="text-white" size={25} />,
        label: "កំណែ",
        value: "Version 2.1.0",
      },
      {
        icon: <Languages className="text-white" size={25} />,
        label: "ភាសា",
        value: "ខ្មែរ / English",
      },
      {
        icon: <Clock10 className="text-white" size={25} />,
        label: "ម៉ោងបើក",
        value: "06:00 – 22:00",
      },
    ].map(({ icon, label, value }) => (
      <div
        key={label}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          width: "100%",
          maxWidth: 280,
          marginBottom: 14,
          background: B.grayMid,
          borderRadius: 12,
          padding: "12px 18px",
          border: `1px solid rgba(255,255,255,0.06)`,
          position: "relative",
          zIndex: 1,
          transition: "border-color 0.2s",
        }}
      >
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <div
            style={{
              color: B.grayText,
              fontFamily: "'Battambang', serif",
              fontSize: 11,
              marginBottom: 2,
            }}
          >
            {label}
          </div>
          <div
            style={{
              color: B.white,
              fontFamily: "'Battambang', serif",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {value}
          </div>
        </div>
      </div>
    ))}

    {/* Footer */}
    <CopyRight />
  </div>
);

/* ─── Layout ─── */
const MainLayoutAuth = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: B.white,
        fontFamily: "'Battambang', serif",
      }}
    >
      {/* LEFT — hidden on mobile, visible md+ */}
      <div className="hidden md:flex" style={{ flex: 1 }}>
        <InfoPanel />
      </div>

      {/* RIGHT — form content from <Outlet /> */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 32px",
          background: B.white,
          minHeight: "100vh",
        }}
      >
        {/* Mobile-only branding */}
        <div className="flex md:hidden flex-col items-center mb-8">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: B.red,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              boxShadow: `0 4px 20px ${B.red}55`,
              marginBottom: 12,
            }}
          >
            🛒
          </div>
          <h2
            style={{
              fontFamily: "'Battambang', serif",
              fontSize: 18,
              fontWeight: 700,
              color: B.black,
              textAlign: "center",
              margin: "0 0 4px",
            }}
          >
            ម៉ាតវ៉ាន់ស្តុប ខេអេច
          </h2>
          <p
            style={{
              color: B.red,
              fontSize: 12,
              margin: 0,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            Mat Van Stop KH
          </p>
        </div>

        {/* Page content */}
        <div style={{ width: "100%", maxWidth: 400 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayoutAuth;
