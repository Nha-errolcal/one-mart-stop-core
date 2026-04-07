import React, { useEffect } from "react";
import { useAuth } from "../../store/authStore";
import { Button, Tag, Tooltip } from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  BranchesOutlined,
  PhoneOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Edit2Icon } from "lucide-react";
import { Link } from "react-router";

/* ── Brand tokens ── */
const B = {
  red: "#EA4156",
  redLight: "rgba(234,65,86,0.08)",
  redGlow: "rgba(234,65,86,0.18)",
  black: "#0f0f0f",
  dark: "#1a1a1a",
  card: "#ffffff",
  border: "#f0f0f0",
  gray: "#6b7280",
  grayLight: "#f9fafb",
  font: "'Poppins', sans-serif",
  fontKh: "'Battambang', serif",
};

/* ── Reusable info row ── */
const InfoRow = ({ icon, label, value, khmer }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "12px 0",
      borderBottom: `1px solid ${B.border}`,
    }}
  >
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: 9,
        background: B.redLight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: B.red,
        fontSize: 15,
        flexShrink: 0,
        marginTop: 1,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: 11,
          color: B.gray,
          fontFamily: khmer ? B.fontKh : B.font,
          fontWeight: 500,
          marginBottom: 2,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: B.black,
          fontFamily: khmer ? B.fontKh : B.font,
          fontWeight: 600,
          wordBreak: "break-word",
        }}
      >
        {value || "—"}
      </div>
    </div>
  </div>
);

/* ── Section card ── */
const Card = ({ title, icon, children, style }) => (
  <div
    style={{
      background: B.card,
      borderRadius: 16,
      border: `1px solid ${B.border}`,
      overflow: "hidden",
      boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      ...style,
    }}
  >
    {/* Card header */}
    <div
      style={{
        padding: "16px 24px",
        borderBottom: `1px solid ${B.border}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: B.grayLight,
      }}
    >
      <span style={{ color: B.red, fontSize: 16 }}>{icon}</span>
      <span
        style={{
          fontFamily: B.fontKh,
          fontWeight: 700,
          fontSize: 13,
          color: B.black,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {title}
      </span>
    </div>
    <div style={{ padding: "4px 24px 8px" }}>{children}</div>
  </div>
);

/* ── Avatar initials ── */
const Avatar = ({ name }) => {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";
  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${B.red}, #ff6b7a)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        fontWeight: 700,
        color: "#fff",
        fontFamily: B.font,
        boxShadow: `0 6px 24px ${B.redGlow}`,
        flexShrink: 0,
        border: "3px solid #fff",
        outline: `3px solid ${B.redLight}`,
      }}
    >
      {initials}
    </div>
  );
};

/* ── Main ProfilePage ── */
const ProfilePage = () => {
  const { profileData, getProfile } = useAuth();

  useEffect(() => {
    getProfile();
  }, []);

  if (!profileData) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          fontFamily: B.font,
          color: B.gray,
          fontSize: 14,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: `3px solid ${B.red}`,
              borderTopColor: "transparent",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading profile...
        </div>
      </div>
    );
  }

  const { name, email, username, roles, store_info } = profileData;
  const role = roles?.[0];
  const store = store_info;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: B.grayLight,
        fontFamily: B.font,
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* ── Hero header card ── */}
        <div
          style={{
            background: B.card,
            borderRadius: 20,
            border: `1px solid ${B.border}`,
            boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
            padding: "32px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 24,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background accent */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${B.redLight} 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <Avatar name={name} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <h1
                style={{
                  fontFamily: B.font,
                  fontSize: 22,
                  fontWeight: 700,
                  color: B.black,
                  margin: 0,
                }}
              >
                {name}
              </h1>
              {role && (
                <Tag
                  style={{
                    background: B.red,
                    border: "none",
                    color: "#fff",
                    borderRadius: 20,
                    fontFamily: B.font,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 10px",
                    letterSpacing: 0.5,
                  }}
                >
                  {role.name?.replace("_", " ").toUpperCase()}
                </Tag>
              )}
            </div>
            <p
              style={{
                fontFamily: B.font,
                fontSize: 13,
                color: B.gray,
                margin: "4px 0 10px",
              }}
            >
              @{username} · {email}
            </p>
            {role && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: B.redLight,
                  borderRadius: 8,
                  padding: "4px 12px",
                  fontSize: 12,
                  color: B.red,
                  fontWeight: 600,
                  fontFamily: B.font,
                }}
              >
                <SafetyCertificateOutlined />
                Code: {role.code}
              </div>
            )}
          </div>
          <div>
            <Link
              //   cl
              style={{
                background: B.red,
                border: "none",
                borderRadius: 8,
                boxShadow: `0 4px 12px ${B.redGlow}`,
              }}
              to="/account/profile/edit"
            >
              <EditOutlined />
            </Link>
            {/* <Button
              type="primary"
              icon={<EditOutlined />}
              //   onClick={() => navigate("/account/profile/edit")}
              style={{
                background: B.red,
                border: "none",
                borderRadius: 8,
                boxShadow: `0 4px 12px ${B.redGlow}`,
              }}
            >
              <Link to={"/account/profile/edit"}></Link>
            </Button> */}
          </div>
        </div>

        {/* ── Two column grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 20,
          }}
        >
          {/* Account info */}
          <Card title="ព័ត៌មានគណនី" icon={<UserOutlined />}>
            <InfoRow
              icon={<UserOutlined />}
              label="ឈ្មោះពេញ"
              khmer
              value={name}
            />
            <InfoRow
              icon={<MailOutlined />}
              label="អ៊ីមែល"
              khmer
              value={email}
            />
            <InfoRow
              icon={<IdcardOutlined />}
              label="ឈ្មោះអ្នកប្រើ"
              khmer
              value={`@${username}`}
            />
            {role && (
              <InfoRow
                icon={<SafetyCertificateOutlined />}
                label="តួនាទី"
                khmer
                value={role.name?.replace("_", " ")}
              />
            )}
          </Card>

          {/* Store info */}
          {store && (
            <Card title="ព័ត៌មានហាង" icon={<ShopOutlined />}>
              <InfoRow
                icon={<ShopOutlined />}
                label="ឈ្មោះហាង"
                khmer
                value={store.name}
              />
              <InfoRow
                icon={<BranchesOutlined />}
                label="សាខា"
                khmer
                value={store.branch}
              />
              <InfoRow
                icon={<IdcardOutlined />}
                label="លេខហាង"
                khmer
                value={store.store_no}
              />
              <InfoRow
                icon={<PhoneOutlined />}
                label="ក្រុមហ៊ុន"
                khmer
                value={store.company_name}
              />
            </Card>
          )}

          {/* Location */}
          {store && (
            <Card title="ទីតាំង" icon={<EnvironmentOutlined />}>
              <InfoRow
                icon={<HomeOutlined />}
                label="លេខផ្ទះ"
                khmer
                value={store.house_no}
              />
              <InfoRow
                icon={<EnvironmentOutlined />}
                label="ផ្លូវ"
                khmer
                value={store.street}
              />
              <InfoRow
                icon={<EnvironmentOutlined />}
                label="ភូមិ"
                khmer
                value={store.village}
              />
              <InfoRow
                icon={<EnvironmentOutlined />}
                label="ខណ្ឌ / ស្រុក"
                khmer
                value={store.district}
              />
              <InfoRow
                icon={<EnvironmentOutlined />}
                label="ខេត្ត / រាជធានី"
                khmer
                value={store.province}
              />
              {store.address_note && (
                <InfoRow
                  icon={<HomeOutlined />}
                  label="កំណត់សម្គាល់"
                  khmer
                  value={store.address_note}
                />
              )}
            </Card>
          )}

          {/* Permissions */}
          {role?.permissions && (
            <Card title="សិទ្ធិប្រើប្រាស់" icon={<SafetyCertificateOutlined />}>
              <div
                style={{
                  padding: "12px 0",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {Object.entries(role.permissions).map(([key, val]) => (
                  <Tooltip key={key} title={key}>
                    <Tag
                      style={{
                        borderRadius: 8,
                        fontFamily: B.font,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        background: val ? B.redLight : "#f3f4f6",
                        color: val ? B.red : B.gray,
                        border: `1px solid ${val ? B.red + "33" : B.border}`,
                      }}
                    >
                      {key.replace(/_/g, " ")}
                    </Tag>
                  </Tooltip>
                ))}
              </div>
            </Card>
          )}

          {/* Joined date */}
          {store?.created_at && (
            <Card title="ព័ត៌មានប្រព័ន្ធ" icon={<CalendarOutlined />}>
              <InfoRow
                icon={<CalendarOutlined />}
                label="កាលបរិច្ឆេទបង្កើត"
                khmer
                value={new Date(store.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              />
              <InfoRow
                icon={<IdcardOutlined />}
                label="លេខសម្គាល់ហាង"
                khmer
                value={`#${store.id}`}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
