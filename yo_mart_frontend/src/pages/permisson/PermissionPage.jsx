import React, { useEffect, useState, useRef } from "react";
import usePermission from "../../store/permissionStore";
import useAuth from "../../store/authStore";
import LoadingHelper from "../../components/LoadingHelper";
import { Card, Select, Button, message, Typography, Divider, Tag } from "antd";
import {
  User,
  Shield,
  Search,
  KeyRound,
  CheckCircle,
  Users,
  Lock,
} from "lucide-react";
import PermissionUI from "../../components/permission/PermissionUI";

const { Title, Text } = Typography;

const PermissionPage = () => {
  const {
    dataPermission,
    getAllPermission,
    registerPermissionToRole,
    loading: permissionLoading,
  } = usePermission();

  const {
    roleData,
    getAllRole,
    searchUsers,
    userData,
    loading: roleLoading,
  } = useAuth();

  const [userId, setUserId] = useState(null);
  const [roleIds, setRoleIds] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [userSelectKey, setUserSelectKey] = useState(0);
  const [roleSelectKey, setRoleSelectKey] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllPermission(), getAllRole()]);
    };
    fetchData();
  }, [getAllPermission, getAllRole]);

  const loading = permissionLoading || roleLoading;

  const handleSearchUser = (value) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!value || value.trim() === "") return;
      searchUsers(value);
    }, 300);
  };

  const clearForm = () => {
    setUserId(null);
    setRoleIds([]);
    setUserSelectKey((k) => k + 1);
    setRoleSelectKey((k) => k + 1);
  };

  const handleRegisterToRole = async () => {
    if (!userId) return message.error("សូមជ្រើសរើសអ្នកប្រើប្រាស់");
    if (!roleIds.length) return message.error("សូមជ្រើសរើសតួនាទី");
    const success = await registerPermissionToRole(userId, roleIds);
    if (success) clearForm();
  };

  const selectedRoleName = roleData?.find((r) => r.id === roleId)?.name;

  return (
    <div style={{ minHeight: "100vh", padding: "24px", background: "#f5f6fa" }}>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 4,
          }}
        >
          <div
            className="bg-blue-700"
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={22} color="#fff" />
          </div>
          <div>
            <Title
              level={3}
              className="font-battambang"
              style={{ margin: 0, fontSize: 22, color: "#0f172a" }}
            >
              គ្រប់គ្រងសិទ្ធ
            </Title>
            <Text
              className="font-battambang"
              style={{ color: "#64748b", fontSize: 13 }}
            >
              គ្រប់គ្រងសិទ្ធ និងតួនាទីអ្នកប្រើប្រាស់
            </Text>
          </div>
        </div>
      </div>

      {/* ASSIGN ROLE CARD */}
      <Card
        style={{
          borderRadius: 16,
          border: "1px solid #e8eaf0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          marginBottom: 24,
          overflow: "hidden",
        }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Card header stripe */}
        <div
          style={{
            padding: "14px 24px",
            background: "#fafbff",
            borderBottom: "1px solid #e8eaf0",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Users size={16} color="#1677ff" />
          <span
            className="font-battambang"
            style={{ fontWeight: 600, fontSize: 15, color: "#1e293b" }}
          >
            ចុះឈ្មោះតួនាទីអ្នកប្រើប្រាស់
          </span>
        </div>

        <div style={{ padding: "20px 24px" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* USER */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={14} color="#1677ff" />
                </div>
                <Text
                  strong
                  className="font-battambang"
                  style={{ fontSize: 13, color: "#374151" }}
                >
                  អ្នកប្រើប្រាស់
                </Text>
              </div>
              <Select
                key={userSelectKey}
                showSearch
                allowClear
                placeholder="ស្វែងរកអ្នកប្រើប្រាស់..."
                style={{ width: "100%" }}
                filterOption={false}
                onSearch={handleSearchUser}
                onChange={(value) => setUserId(value)}
                suffixIcon={<Search size={14} color="#9ca3af" />}
                options={
                  userData?.map((u) => ({
                    value: u.id,
                    label: `${u.username || u.name} (${u.email})`,
                  })) || []
                }
                loading={roleLoading}
              />
            </div>

            {/* ROLE */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#f0fdf4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <KeyRound size={14} color="#16a34a" />
                </div>
                <Text
                  strong
                  className="font-battambang"
                  style={{ fontSize: 13, color: "#374151" }}
                >
                  តួនាទី
                </Text>
              </div>
              <Select
                key={roleSelectKey}
                mode="multiple"
                placeholder="ជ្រើសរើសតួនាទី..."
                style={{ width: "100%" }}
                onChange={(value) => setRoleIds(value)}
                options={
                  roleData?.map((r) => ({
                    value: r.id,
                    label: r.name,
                  })) || []
                }
              />
            </div>
          </div>

          <Divider style={{ margin: "20px 0 16px" }} />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button onClick={clearForm} style={{ borderRadius: 8 }}>
              លុបចោល
            </Button>
            <Button
              className="bg-blue-700"
              type="primary"
              size="middle"
              onClick={handleRegisterToRole}
              icon={<CheckCircle size={15} />}
              style={{
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                border: "none",
                fontFamily: "Battambang, sans-serif",
              }}
            >
              កំណត់តួនាទី
            </Button>
          </div>
        </div>
      </Card>

      {/* PERMISSION MANAGEMENT CARD */}
      <Card
        style={{
          borderRadius: 16,
          border: "1px solid #e8eaf0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Card header */}
        <div
          style={{
            padding: "14px 24px",
            background: "#fafbff",
            borderBottom: "1px solid #e8eaf0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Lock size={16} color="#1677ff" />
            <span
              className="font-battambang"
              style={{ fontWeight: 600, fontSize: 15, color: "#1e293b" }}
            >
              គ្រប់គ្រងសិទ្ធ
            </span>
            {selectedRoleName && (
              <Tag
                color="blue"
                style={{
                  marginLeft: 4,
                  fontFamily: "Battambang, sans-serif",
                  borderRadius: 6,
                }}
              >
                {selectedRoleName}
              </Tag>
            )}
          </div>

          {/* Role selector inline in header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text
              style={{
                fontSize: 12,
                color: "#64748b",
                fontFamily: "Battambang, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              តួនាទី៖
            </Text>
            <Select
              allowClear
              placeholder="ជ្រើសរើសតួនាទី"
              style={{ width: 220 }}
              onChange={(value) => setRoleId(value ?? null)}
              value={roleId}
              size="small"
              options={
                roleData?.map((r) => ({
                  value: r.id,
                  label: r.name,
                })) || []
              }
            />
          </div>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {!loading && dataPermission ? (
            <>
              {!roleId && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#94a3b8",
                  }}
                >
                  <Lock
                    size={36}
                    color="#cbd5e1"
                    style={{ margin: "0 auto 12px" }}
                  />
                  <p
                    className="font-battambang"
                    style={{ fontSize: 14, margin: 0 }}
                  >
                    សូមជ្រើសរើសតួនាទីដើម្បីគ្រប់គ្រងសិទ្ធ
                  </p>
                </div>
              )}
              {roleId && (
                <PermissionUI
                  data={dataPermission?.data || []}
                  roleId={roleId}
                  onSaveSuccess={() => getAllPermission()}
                />
              )}
            </>
          ) : (
            !loading && (
              <Text type="secondary" className="font-battambang">
                មិនមានទិន្នន័យ
              </Text>
            )
          )}
        </div>
      </Card>

      <LoadingHelper loading={loading} />
    </div>
  );
};

export default PermissionPage;
