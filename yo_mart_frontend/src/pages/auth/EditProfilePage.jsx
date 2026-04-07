import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  ShopOutlined,
  BranchesOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HomeOutlined,
} from "@ant-design/icons";

/* ── Brand tokens ── */
const B = {
  red: "#EA4156",
  redDark: "#c52e42",
  redLight: "rgba(234,65,86,0.08)",
  redGlow: "rgba(234,65,86,0.18)",
  black: "#0f0f0f",
  card: "#ffffff",
  border: "#e5e7eb",
  gray: "#6b7280",
  grayLight: "#f9fafb",
  font: "'Poppins', sans-serif",
  fontKh: "'Battambang', serif",
};

/* ── Section wrapper ── */
const Section = ({ title, icon, children }) => (
  <div
    style={{
      background: B.card,
      borderRadius: 16,
      border: `1px solid ${B.border}`,
      overflow: "hidden",
      boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      marginBottom: 20,
    }}
  >
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
          letterSpacing: 0.5,
        }}
      >
        {title}
      </span>
    </div>
    <div style={{ padding: "20px 24px" }}>{children}</div>
  </div>
);

/* ── Styled label ── */
const Label = ({ children }) => (
  <span
    style={{
      fontFamily: B.fontKh,
      color: B.black,
      fontWeight: 600,
      fontSize: 13,
    }}
  >
    {children}
  </span>
);

/* ── Input shared style ── */
const inputStyle = {
  borderRadius: 10,
  borderColor: B.border,
  fontFamily: B.font,
  fontSize: 14,
};

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
        border: "3px solid #fff",
        outline: `3px solid ${B.redLight}`,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

/* ── Main EditProfilePage ── */
const EditProfilePage = () => {
  const navigate = useNavigate();
  const { profileData, getProfile } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    getProfile();
  }, []);

  /* Pre-fill form when data arrives */
  useEffect(() => {
    if (profileData) {
      const { name, email, username, store_info } = profileData;
      form.setFieldsValue({
        name,
        email,
        username,
        store_name: store_info?.name,
        branch: store_info?.branch,
        company_name: store_info?.company_name,
        store_no: store_info?.store_no,
        house_no: store_info?.house_no,
        street: store_info?.street,
        village: store_info?.village,
        district: store_info?.district,
        province: store_info?.province,
        address_note: store_info?.address_note,
      });
    }
  }, [profileData]);

  const handleSave = async (values) => {
    try {
      // TODO: call your update API here
      // await request("profile/update", "put", values);
      console.log("Save values:", values);
      message.success("រក្សាទុករួចរាល់!");
      navigate("/account/profile");
    } catch (err) {
      message.error("មានបញ្ហាក្នុងការរក្សាទុក!");
    }
  };

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
          កំពុងផ្ទុក...
        </div>
      </div>
    );
  }

  const { name, roles } = profileData;
  const role = roles?.[0];

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
        {/* ── Page header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/account/profile")}
              style={{
                borderRadius: 8,
                borderColor: B.border,
                fontFamily: B.font,
                height: 38,
              }}
            />
            <div>
              <h1
                style={{
                  fontFamily: B.fontKh,
                  fontSize: 20,
                  fontWeight: 700,
                  color: B.black,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                កែប្រែព័ត៌មានផ្ទាល់ខ្លួន
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: B.gray,
                  fontFamily: B.font,
                }}
              >
                Edit your profile information
              </p>
            </div>
          </div>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            style={{
              background: `linear-gradient(135deg, ${B.red}, ${B.redDark})`,
              border: "none",
              borderRadius: 10,
              height: 40,
              paddingInline: 20,
              fontFamily: B.fontKh,
              fontWeight: 600,
              fontSize: 14,
              boxShadow: `0 4px 14px ${B.redGlow}`,
            }}
          >
            រក្សាទុក
          </Button>
        </div>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSave}
        >
          {/* ── Avatar hero ── */}
          <div
            style={{
              background: B.card,
              borderRadius: 20,
              border: `1px solid ${B.border}`,
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
              padding: "28px 32px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 24,
              position: "relative",
              overflow: "hidden",
            }}
          >
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
            <div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontFamily: B.fontKh,
                  fontWeight: 700,
                  fontSize: 18,
                  color: B.black,
                }}
              >
                {name}
              </p>
              {role && (
                <span
                  style={{
                    background: B.red,
                    color: "#fff",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 10px",
                    fontFamily: B.font,
                    letterSpacing: 0.5,
                  }}
                >
                  {role.name?.replace("_", " ").toUpperCase()}
                </span>
              )}
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 12,
                  color: B.gray,
                  fontFamily: B.fontKh,
                }}
              >
                * ផ្លាស់ប្តូររូបភាពមិនទាន់គាំទ្រ
              </p>
            </div>
          </div>

          {/* ── Account Info ── */}
          <Section title="ព័ត៌មានគណនី" icon={<UserOutlined />}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 20px",
              }}
            >
              <Form.Item
                name="name"
                label={<Label>ឈ្មោះពេញ</Label>}
                rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះ" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="ឈ្មោះពេញ"
                />
              </Form.Item>

              <Form.Item
                name="username"
                label={<Label>ឈ្មោះអ្នកប្រើ</Label>}
                rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះអ្នកប្រើ" }]}
              >
                <Input
                  prefix={<IdcardOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="username"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<Label>អ៊ីមែល</Label>}
                rules={[
                  { required: true, message: "សូមបញ្ចូលអ៊ីមែល" },
                  { type: "email", message: "អ៊ីមែលមិនត្រឹមត្រូវ" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="example@email.com"
                />
              </Form.Item>

              <Form.Item
                name="new_password"
                label={<Label>ពាក្យសម្ងាត់ថ្មី (ប្រសិនចង់ផ្លាស់ប្តូរ)</Label>}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="••••••••"
                />
              </Form.Item>
            </div>
          </Section>

          {/* ── Store Info ── */}
          <Section title="ព័ត៌មានហាង" icon={<ShopOutlined />}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 20px",
              }}
            >
              <Form.Item name="store_name" label={<Label>ឈ្មោះហាង</Label>}>
                <Input
                  prefix={<ShopOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="ឈ្មោះហាង"
                />
              </Form.Item>

              <Form.Item name="branch" label={<Label>សាខា</Label>}>
                <Input
                  prefix={<BranchesOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="Main Branch"
                />
              </Form.Item>

              <Form.Item name="company_name" label={<Label>ក្រុមហ៊ុន</Label>}>
                <Input
                  prefix={<PhoneOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="ឈ្មោះក្រុមហ៊ុន"
                />
              </Form.Item>

              <Form.Item name="store_no" label={<Label>លេខហាង</Label>}>
                <Input
                  prefix={<IdcardOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="STORE-001"
                />
              </Form.Item>
            </div>
          </Section>

          {/* ── Location ── */}
          <Section title="ទីតាំង" icon={<EnvironmentOutlined />}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 20px",
              }}
            >
              <Form.Item name="house_no" label={<Label>លេខផ្ទះ</Label>}>
                <Input
                  prefix={<HomeOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="H45"
                />
              </Form.Item>

              <Form.Item name="street" label={<Label>ផ្លូវ</Label>}>
                <Input
                  prefix={<EnvironmentOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="Street 12"
                />
              </Form.Item>

              <Form.Item name="village" label={<Label>ភូមិ</Label>}>
                <Input
                  prefix={<EnvironmentOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="Village 7"
                />
              </Form.Item>

              <Form.Item name="district" label={<Label>ខណ្ឌ / ស្រុក</Label>}>
                <Input
                  prefix={<EnvironmentOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="Chamkarmon"
                />
              </Form.Item>

              <Form.Item name="province" label={<Label>ខេត្ត / រាជធានី</Label>}>
                <Input
                  prefix={<EnvironmentOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="Phnom Penh"
                />
              </Form.Item>

              <Form.Item
                name="address_note"
                label={<Label>កំណត់សម្គាល់</Label>}
              >
                <Input
                  prefix={<HomeOutlined style={{ color: B.red }} />}
                  size="large"
                  style={inputStyle}
                  placeholder="Near the market"
                />
              </Form.Item>
            </div>
          </Section>

          {/* ── Bottom action bar ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              paddingTop: 4,
            }}
          >
            <Button
              size="large"
              onClick={() => navigate("/account/profile")}
              style={{
                borderRadius: 10,
                borderColor: B.border,
                fontFamily: B.fontKh,
                fontWeight: 600,
                height: 44,
                paddingInline: 24,
              }}
            >
              បោះបង់
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              htmlType="submit"
              style={{
                background: `linear-gradient(135deg, ${B.red}, ${B.redDark})`,
                border: "none",
                borderRadius: 10,
                height: 44,
                paddingInline: 28,
                fontFamily: B.fontKh,
                fontWeight: 600,
                fontSize: 15,
                boxShadow: `0 4px 16px ${B.redGlow}`,
              }}
            >
              រក្សាទុក
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditProfilePage;
