import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, ShopOutlined } from "@ant-design/icons";
import { request } from "../../store/Configstore";
import { setAcccessToken, setProfile } from "../../store/profile";
import { Link } from "react-router";
import { setPermission } from "../../util/Helper";

/* ── Brand tokens ── */
const B = {
  red: "#EA4156",
  redDark: "#c52e42",
  black: "#0f0f0f",
  gray: "#6b7280",
  border: "#e5e7eb",
  bg: "#ffffff",
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const res = await request("login", "post", {
        login: values.login,
        password: values.password,
      });
      if (res && res.success) {
        setAcccessToken(res.token);
        const profileRes = await request("profile", "get");
        if (profileRes && profileRes.success) {
          setProfile(JSON.stringify(profileRes.user));
          setPermission(profileRes.user.roles[0].permissions);
        }
        navigate("/");
      } else {
        message.error(res.message || "ចូលប្រើបរាជ័យ");
      }
    } catch (error) {
      message.error(error?.message || "ការចូលប្រើបានបរាជ័យ។");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Header ── */}
      <div style={{ marginBottom: 36, textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: 14,
            background: B.red,
            marginBottom: 20,
            boxShadow: `0 4px 20px ${B.red}55`,
          }}
        >
          <ShopOutlined style={{ color: "#fff", fontSize: 26 }} />
        </div>
        <h2
          style={{
            fontFamily: "'Battambang', serif",
            fontSize: 22,
            fontWeight: 700,
            color: B.black,
            margin: "0 0 6px",
          }}
        >
          ចូលប្រើប្រព័ន្ធ
        </h2>
        <p
          style={{
            color: B.gray,
            fontSize: 13,
            margin: 0,
            fontFamily: "'Battambang', serif",
          }}
        >
          Welcome back — please sign in to continue
        </p>
      </div>

      {/* ── Form ── */}
      <Form
        name="login"
        onFinish={handleLogin}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          label={
            <span
              style={{
                fontFamily: "'Battambang', serif",
                color: B.black,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              ឈ្មោះអ្នកប្រើប្រាស់
            </span>
          }
          name="login"
          rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: B.red }} />}
            placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
            size="large"
            style={{
              borderRadius: 10,
              borderColor: B.border,
              fontFamily: "'Battambang', serif",
            }}
          />
        </Form.Item>

        <Form.Item
          label={
            <span
              style={{
                fontFamily: "'Battambang', serif",
                color: B.black,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              ពាក្យសម្ងាត់
            </span>
          }
          name="password"
          rules={[{ required: true, message: "សូមបញ្ចូលពាក្យសម្ងាត់!" }]}
          style={{ marginTop: 4 }}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: B.red }} />}
            placeholder="បញ្ចូលពាក្យសម្ងាត់"
            size="large"
            style={{
              borderRadius: 10,
              borderColor: B.border,
              fontFamily: "'Battambang', serif",
            }}
          />
        </Form.Item>

        {/* Forgot password */}
        <div style={{ textAlign: "right", marginTop: -8, marginBottom: 24 }}>
          <Link
            to="/auth/find_account"
            style={{
              color: B.red,
              fontSize: 12,
              fontFamily: "'Battambang', serif",
              fontWeight: 500,
            }}
          >
            ភ្លេចពាក្យសម្ងាត់?
          </Link>
        </div>

        {/* Submit */}
        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            icon={<ShopOutlined />}
            style={{
              background: loading
                ? B.redDark
                : `linear-gradient(135deg, ${B.red} 0%, ${B.redDark} 100%)`,
              border: "none",
              borderRadius: 10,
              height: 48,
              fontFamily: "'Battambang', serif",
              fontSize: 15,
              fontWeight: 600,
              boxShadow: `0 4px 16px ${B.red}44`,
              letterSpacing: 0.5,
            }}
          >
            {loading ? "កំពុងចូល..." : "ចូលប្រើ"}
          </Button>
        </Form.Item>

        {/* Divider */}
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ flex: 1, height: 1, background: B.border }} />
          <span
            style={{
              color: B.gray,
              fontSize: 12,
              fontFamily: "'Battambang', serif",
            }}
          >
            ឬ
          </span>
          <div style={{ flex: 1, height: 1, background: B.border }} />
        </div> */}

        {/* Register link */}
        {/* <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 13,
              color: B.gray,
              fontFamily: "'Battambang', serif",
              margin: 0,
            }}
          >
            មិនមានគណនីទេ?{" "}
            <a
              href="#"
              style={{
                color: B.red,
                fontWeight: 700,
                textDecoration: "none",
                borderBottom: `1px solid ${B.red}`,
                paddingBottom: 1,
              }}
            >
              ចុះឈ្មោះ
            </a>
          </p>
        </div> */}
      </Form>
    </>
  );
};

export default LoginPage;
