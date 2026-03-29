import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, CoffeeOutlined } from "@ant-design/icons";
import { request } from "../../store/Configstore";
import { setAcccessToken, setProfile } from "../../store/profile";

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
        // console.log("Login successful:", res);
        setAcccessToken(res.token);
        const profileRes = await request("profile", "get");
        if (profileRes && profileRes.success) {
          // console.log("Profile response:", profileRes.user);
          const user = profileRes.user;
          setProfile(JSON.stringify(user));
          console.log("User:", user);
          console.log("Role:", user.roles?.[0]);
        }
        navigate("/");
      } else {
        console.error("Login failed:", res);
        message.error(res.message || "ចូលប្រើបរាជ័យ");
      }
    } catch (error) {
      message.error(error?.message || "ការចូលប្រើបានបរាជ័យ។");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login"
      onFinish={handleLogin}
      layout="vertical"
      requiredMark={false}
      className="space-y-1"
    >
      {/* LOGIN FIELD */}
      <Form.Item
        label={<span className="font-battambang">ឈ្មោះអ្នកប្រើប្រាស់</span>}
        name="login"
        rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់!" }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
          size="large"
        />
      </Form.Item>

      {/* PASSWORD FIELD */}
      <Form.Item
        label={<span className="font-battambang">ពាក្យសម្ងាត់</span>}
        name="password"
        rules={[{ required: true, message: "សូមបញ្ចូលពាក្យសម្ងាត់!" }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="បញ្ចូលពាក្យសម្ងាត់"
          size="large"
        />
      </Form.Item>

      {/* BUTTON */}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
          icon={<CoffeeOutlined />}
          style={{ backgroundColor: "#92400e", borderColor: "#92400e" }}
        >
          {loading ? "កំពុងចូល..." : "ចូលប្រើ"}
        </Button>
      </Form.Item>

      {/* FOOTER */}
      <div className="text-center">
        <p className="text-sm text-gray-500 font-battambang">
          មិនមានគណនីទេ?{" "}
          <a href="#" className="text-amber-700 font-semibold">
            ចុះឈ្មោះ
          </a>
        </p>
      </div>
    </Form>
  );
};

export default LoginPage;
