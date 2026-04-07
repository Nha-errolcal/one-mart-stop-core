import React, { useState } from "react";
import { Input, Button, message, Space, Card } from "antd";
import { SearchOutlined, LockOutlined } from "@ant-design/icons";
import { request } from "../../store/Configstore";
import { useNavigate } from "react-router-dom";

const FindAccount = () => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  const navigate = useNavigate(); // <-- React Router v6 navigation hook

  const handleSearch = async () => {
    if (!query.trim()) {
      message.warning("សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ ឬអ៊ីមែល!");
      return;
    }

    setLoading(true);
    try {
      const res = await request(
        `account/find/your/account?query=${query}`,
        "get",
      );
      if (res.status === "success") {
        setUser(res.data);
        message.success(`User found: ${res.data.username || res.data.email}`);
      } else {
        setUser(null);
        message.error(res.message || "User not found");
      }
    } catch (error) {
      setUser(null);
      message.error("Failed to fetch account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      message.warning("សូមបញ្ចូលពាក្យសម្ងាត់ថ្មី និងបញ្ជាក់វា!");
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error("ពាក្យសម្ងាត់មិនត្រូវគ្នា!");
      return;
    }

    setChanging(true);
    try {
      const res = await request("account/change/password", "post", {
        user_id: user.id,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      if (res.status === "success") {
        message.success(res.message);
        // Clear form
        setUser(null);
        setQuery("");
        setNewPassword("");
        setConfirmPassword("");
        // Redirect to login page
        navigate("/login");
      } else {
        message.error(res.message || "Failed to change password");
      }
    } catch (error) {
      message.error("Failed to change password. Please try again.");
      console.error(error);
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-md">
        <h1
          className="text-2xl font-semibold mb-6 text-center"
          style={{ color: "#EA4156" }}
        >
          Find Account
        </h1>

        <Space direction="vertical" size="middle" className="w-full">
          <Input
            placeholder="Enter username or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined style={{ color: "#EA4156" }} />}
            disabled={loading}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            block
            loading={loading}
            style={{ backgroundColor: "#EA4156", borderColor: "#EA4156" }}
          >
            Search
          </Button>
        </Space>

        {user && (
          <Card
            title="Account Details & Change Password"
            className="mt-6"
            headStyle={{ backgroundColor: "#EA4156", color: "#fff" }}
          >
            <p>
              <strong>Username:</strong> {user.username || "—"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "—"}
            </p>
            <p>
              <strong>Name:</strong> {user.name || "—"}
            </p>

            <Space direction="vertical" size="middle" className="w-full mt-4">
              <Input.Password
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                prefix={<LockOutlined />}
              />
              <Input.Password
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                prefix={<LockOutlined />}
              />
              <Button
                type="primary"
                block
                style={{ backgroundColor: "#EA4156", borderColor: "#EA4156" }}
                onClick={handleChangePassword}
                loading={changing}
              >
                Change Password
              </Button>
            </Space>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FindAccount;
