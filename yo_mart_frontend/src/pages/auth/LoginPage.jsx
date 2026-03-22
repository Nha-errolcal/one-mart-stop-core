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
        name: values.name,
        password: values.password,
      });
      if (res && !res.error) {
        setAcccessToken(res.token);
        setProfile(JSON.stringify(res.user));
        message.success(res.message);
        navigate("/");
      }
    } catch (error) {
      message.error(error.message || "ការចូលប្រើបានបរាជ័យ។");
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
      {/* Name field */}
      <Form.Item
        label={
          <span className="font-battambang text-gray-700 font-medium">
            ឈ្មោះអ្នកប្រើប្រាស់
          </span>
        }
        name="name"
        rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់!" }]}
      >
        <Input
          prefix={<UserOutlined className="text-gray-400" />}
          placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
          size="large"
          className="font-battambang rounded-lg"
        />
      </Form.Item>

      {/* Password field */}
      <Form.Item
        label={
          <span className="font-battambang text-gray-700 font-medium">
            ពាក្យសម្ងាត់
          </span>
        }
        name="password"
        rules={[{ required: true, message: "សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក!" }]}
      >
        <Input.Password
          prefix={<LockOutlined className="text-gray-400" />}
          placeholder="បញ្ចូលពាក្យសម្ងាត់របស់អ្នក"
          size="large"
          className="font-battambang rounded-lg"
        />
      </Form.Item>

      {/* Submit */}
      <Form.Item className="mb-2 pt-2">
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
          icon={<CoffeeOutlined />}
          className="font-battambang rounded-lg h-11 text-base font-semibold"
          style={{ backgroundColor: "#92400e", borderColor: "#92400e" }}
        >
          {loading ? "កំពុងចូលប្រើ..." : "ចូលប្រើ"}
        </Button>
      </Form.Item>

      {/* Footer */}
      <div className="text-center pt-1">
        <p className="text-sm text-gray-500 font-battambang">
          មិនមានគណនីទេ?{" "}
          <a
            href="#"
            className="text-amber-700 hover:text-amber-800 font-semibold hover:underline font-battambang"
          >
            ចុះឈ្មោះ
          </a>
        </p>
      </div>
    </Form>
  );
};

export default LoginPage;
