import React, { useState } from "react";
import { Switch, Tag, Typography, Divider, Button, message } from "antd";
import { Save, ChevronRight } from "lucide-react";
import usePermission from "../../store/permissionStore";

const { Text } = Typography;

const getColor = (code) => {
  if (code.includes("view") || code.includes("access")) return "blue";
  if (code.includes("create")) return "green";
  if (code.includes("update")) return "orange";
  if (code.includes("delete")) return "red";
  return "default";
};

const getBgColor = (code) => {
  if (code.includes("view") || code.includes("access"))
    return { bg: "#eff6ff", border: "#bfdbfe" };
  if (code.includes("create")) return { bg: "#f0fdf4", border: "#bbf7d0" };
  if (code.includes("update")) return { bg: "#fffbeb", border: "#fde68a" };
  if (code.includes("delete")) return { bg: "#fef2f2", border: "#fecaca" };
  return { bg: "#f8fafc", border: "#e2e8f0" };
};

const getLabel = (code) => {
  const action = code.split(".")[1];
  return action ? action.charAt(0).toUpperCase() + action.slice(1) : code;
};

const getGroupName = (route) => {
  if (!route || route === "other") return "Other";
  const name = route.replace("/", "");
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const groupByRoute = (data) => {
  const map = {};
  data.forEach((item) => {
    const key = item.route_web || "other";
    if (!map[key]) map[key] = [];
    map[key].push(item);
  });
  return map;
};

const PermissionUI = ({ data = [], roleId, onSaveSuccess }) => {
  const { registerRolePermissionCreate, loading: saving } = usePermission();

  const [permState, setPermState] = useState(() => {
    const map = {};
    data.forEach((p) => {
      map[p.id] = !!p.allowed;
    });
    return map;
  });

  const grouped = groupByRoute(data);
  const isAllAllowed = (permissions) =>
    permissions.every((p) => permState[p.id]);
  const allowedCount = Object.values(permState).filter(Boolean).length;

  const handleToggleAll = (permissions, checked) => {
    const updated = { ...permState };
    permissions.forEach((p) => {
      updated[p.id] = checked;
    });
    setPermState(updated);
  };

  const handleToggleOne = (permId, checked) => {
    setPermState((prev) => ({ ...prev, [permId]: checked }));
  };

  const handleSave = async () => {
    if (!roleId) {
      message.error("សូមជ្រើសរើស Role មុននឹងរក្សាទុក");
      return;
    }
    const permissions = data.map((p) => ({
      permission_id: p.id,
      action: p.code.split(".")[1] || "view",
      allowed: !!permState[p.id],
    }));
    await registerRolePermissionCreate(roleId, { permissions });
    onSaveSuccess?.();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* SUMMARY BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "#f8fafc",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          marginBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 13, color: "#64748b" }}>
            សិទ្ធដែលបានជ្រើស៖
          </Text>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: allowedCount > 0 ? "#1677ff" : "#94a3b8",
            }}
          >
            {allowedCount} / {data.length}
          </span>
        </div>
        <Button
          type="primary"
          size="middle"
          loading={saving}
          icon={<Save size={14} />}
          onClick={handleSave}
          style={{
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "linear-gradient(135deg, #1677ff, #0950b3)",
            border: "none",
            fontFamily: "Battambang, sans-serif",
            fontSize: 13,
          }}
        >
          រក្សាទុកសិទ្ធ
        </Button>
      </div>

      {/* PERMISSION GROUPS */}
      {Object.entries(grouped).map(([route, permissions]) => {
        const allAllowed = isAllAllowed(permissions);
        const groupAllowed = permissions.filter((p) => permState[p.id]).length;
        const groupName = getGroupName(route);

        return (
          <div
            key={route}
            style={{
              borderRadius: 12,
              border: "1px solid #e8eaf0",
              overflow: "hidden",
            }}
          >
            {/* Group Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#fff",
                borderBottom: allAllowed
                  ? "2px solid #1677ff"
                  : "1px solid #f0f0f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ChevronRight size={14} color="#94a3b8" />
                <Text strong style={{ fontSize: 14, color: "#1e293b" }}>
                  {groupName}
                </Text>
                <Text style={{ fontSize: 11, color: "#94a3b8" }}>
                  {route !== "other" ? route : ""}
                </Text>
                <span
                  style={{
                    fontSize: 11,
                    padding: "1px 8px",
                    borderRadius: 20,
                    background: groupAllowed > 0 ? "#dbeafe" : "#f1f5f9",
                    color: groupAllowed > 0 ? "#1d4ed8" : "#94a3b8",
                    fontWeight: 500,
                  }}
                >
                  {groupAllowed}/{permissions.length}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    fontFamily: "Battambang, sans-serif",
                  }}
                >
                  អនុញ្ញាតទំាងអស់
                </Text>
                <Switch
                  size="small"
                  checked={allAllowed}
                  onChange={(checked) => handleToggleAll(permissions, checked)}
                />
              </div>
            </div>

            {/* Permission Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
                padding: 12,
                background: "#fafbfc",
              }}
            >
              {permissions.map((perm) => {
                const isOn = !!permState[perm.id];
                const { bg, border } = getBgColor(perm.code);
                return (
                  <div
                    key={perm.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      border: `1px solid ${isOn ? border : "#eef0f4"}`,
                      borderRadius: 8,
                      background: isOn ? bg : "#fff",
                      gap: 8,
                      minWidth: 0,
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => handleToggleOne(perm.id, !isOn)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minWidth: 0,
                        overflow: "hidden",
                      }}
                    >
                      <Tag
                        color={isOn ? getColor(perm.code) : "default"}
                        style={{ margin: 0, fontSize: 11, flexShrink: 0 }}
                      >
                        {getLabel(perm.code)}
                      </Tag>
                      <Text
                        style={{
                          fontSize: 12,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: isOn ? "#1e293b" : "#94a3b8",
                          fontWeight: isOn ? 500 : 400,
                        }}
                      >
                        {perm.name}
                      </Text>
                    </div>
                    <Switch
                      size="small"
                      checked={isOn}
                      onChange={(checked, e) => {
                        e.stopPropagation();
                        handleToggleOne(perm.id, checked);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PermissionUI;
