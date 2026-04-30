import { useEffect, useRef, useState } from "react";
import MainPage from "@/layouts/auth/MainPage";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tooltip,
} from "antd";
import { formatDate, request } from "@/store/Configstore";
import { MdDelete, MdEdit } from "react-icons/md";
import { useForm } from "antd/es/form/Form";
import { IoEyeSharp } from "react-icons/io5";
import { Lock, Search } from "lucide-react";

const CreatePermissionPage = () => {
  const [state, setState] = useState({
    list: [],
    loading: false,
    modalVisible: false,
    currentItem: null,
  });

  const [form] = useForm();
  const searchRef = useRef(null);

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async (query = "") => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await request(`permission?query=${query}`, "get");
      if (res && res.success) {
        setState((prev) => ({ ...prev, list: res.data, loading: false }));
      } else {
        message.warning("No data found.");
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      message.error("Failed to fetch permissions.");
      console.error(error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const onFinish = async (values) => {
    try {
      const id = state.currentItem?.id;
      const endpoint = id ? `permission/${id}` : "permission";
      const method = id ? "put" : "post";

      const res = await request(endpoint, method, values);
      if (res) {
        message.success(id ? "បានកែប្រែសិទ្ធជោគជ័យ" : "បានបង្កើតសិទ្ធជោគជ័យ");
        setState((prev) => ({
          ...prev,
          modalVisible: false,
          currentItem: null,
        }));
        getAll();
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to save permission.");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "តើអ្នកប្រាកដទេ?",
      content: "តើអ្នកចង់លុបសិទ្ធនេះមែនទេ?",
      okText: "លុប",
      okType: "danger",
      cancelText: "បោះបង់",
      onOk: async () => {
        try {
          const res = await request(`permission/${id}`, "delete");
          if (res) {
            message.success("បានលុបសិទ្ធជោគជ័យ");
            setState((prev) => ({
              ...prev,
              list: prev.list.filter((item) => item.id !== id),
            }));
          }
        } catch (err) {
          message.error(`Failed to delete: ${err.message}`);
        }
      },
    });
  };

  const handleAdd = () => {
    setState((prev) => ({ ...prev, modalVisible: true, currentItem: null }));
    form.resetFields();
  };

  const handleEdit = (item) => {
    setState((prev) => ({ ...prev, modalVisible: true, currentItem: item }));
    form.setFieldsValue({
      name: item.name,
      code: item.code,
      route_web: item.route_web,
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      getAll(value);
    }, 300);
  };

  const columns = [
    {
      key: "no",
      title: "លរ",
      width: 60,
      align: "center",
      render: (_, __, index) => (
        <span style={{ color: "#94a3b8", fontSize: 13 }}>{index + 1}</span>
      ),
    },
    {
      key: "name",
      dataIndex: "name",
      title: "ឈ្មោះសិទ្ធ",
      sorter: (a, b) => a.name?.localeCompare(b.name),
      render: (value) => (
        <span style={{ fontWeight: 500, color: "#1e293b" }}>{value}</span>
      ),
    },
    {
      key: "code",
      dataIndex: "code",
      title: "កូដ",
      sorter: (a, b) => a.code?.localeCompare(b.code),
      render: (value) => (
        <span
          style={{
            fontFamily: "monospace",
            background: "#f1f5f9",
            padding: "2px 10px",
            borderRadius: 6,
            fontSize: 12,
            color: "#475569",
            border: "1px solid #e2e8f0",
          }}
        >
          {value}
        </span>
      ),
    },
    {
      key: "route_web",
      dataIndex: "route_web",
      title: "Route Web",
      render: (value) =>
        value ? (
          <span
            style={{
              fontFamily: "monospace",
              background: "#eff6ff",
              padding: "2px 10px",
              borderRadius: 6,
              fontSize: 12,
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
            }}
          >
            {value}
          </span>
        ) : (
          <span style={{ color: "#cbd5e1" }}>—</span>
        ),
    },
    {
      key: "created_at",
      dataIndex: "created_at",
      title: "កាលបរិច្ឆេទបង្កើត",
      render: (value) => (
        <span style={{ color: "#64748b", fontSize: 13 }}>
          {formatDate(value)}
        </span>
      ),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "សកម្មភាព",
      key: "action",
      width: 120,
      align: "center",
      render: (item) => (
        <Space size={6}>
          <Tooltip title="មើលព័ត៌មាន">
            <Button
              size="small"
              icon={<IoEyeSharp size={15} />}
              onClick={() => handleEdit(item)}
              className="!bg-green-500 hover:!bg-green-600 !text-white !border-green-500 rounded-md"
            />
          </Tooltip>
          <Tooltip title="កែប្រែ">
            <Button
              size="small"
              icon={<MdEdit size={15} />}
              onClick={() => handleEdit(item)}
              className="!bg-blue-500 hover:!bg-blue-600 !text-white !border-blue-500 rounded-md"
            />
          </Tooltip>
          <Tooltip title="លុប">
            <Button
              size="small"
              icon={<MdDelete size={15} />}
              onClick={() => handleDelete(item.id)}
              className="!bg-red-500 hover:!bg-red-600 !text-white !border-red-500 rounded-md"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <MainPage loading={state.loading}>
      {/* HEADER */}
      <div className="flex bg-white p-3 rounded-md flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              flexShrink: 0,
              background: "linear-gradient(135deg, #1677ff 0%, #0950b3 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={20} color="#fff" />
          </div>
          <div>
            <h1
              className="font-battambang"
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              បញ្ជីសិទ្ធ
            </h1>
            <p
              className="font-battambang"
              style={{ margin: 0, fontSize: 13, color: "#64748b" }}
            >
              គ្រប់គ្រង និងបង្កើតសិទ្ធប្រព័ន្ធ
            </p>
          </div>
        </div>

        {/* RIGHT: search + add */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Input
            placeholder="ស្វែងរកសិទ្ធ..."
            prefix={<Search size={14} color="#9ca3af" />}
            allowClear
            onChange={handleSearch}
            style={{ width: 240, borderRadius: 8 }}
            className="font-battambang"
          />
          <Button
            type="primary"
            size="large"
            onClick={handleAdd}
            className="font-battambang"
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg, #1677ff, #0950b3)",
              border: "none",
            }}
          >
            + បង្កើតសិទ្ធថ្មី
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        open={state.modalVisible}
        onCancel={() =>
          setState((prev) => ({
            ...prev,
            modalVisible: false,
            currentItem: null,
          }))
        }
        onOk={() => form.submit()}
        okText={
          <span className="font-battambang">
            {state.currentItem ? "រក្សាទុក" : "បង្កើត"}
          </span>
        }
        cancelText={<span className="font-battambang">បោះបង់</span>}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Lock size={16} color="#1677ff" />
            <span className="font-battambang">
              {state.currentItem ? "កែប្រែសិទ្ធ" : "បង្កើតសិទ្ធថ្មី"}
            </span>
          </div>
        }
        okButtonProps={{ style: { borderRadius: 8 } }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
      >
        <Form
          onFinish={onFinish}
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            className="font-battambang"
            name="name"
            label="ឈ្មោះសិទ្ធ"
            rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះសិទ្ធ" }]}
          >
            <Input placeholder="ឧ. View Dashboard" size="large" />
          </Form.Item>

          <Form.Item
            className="font-battambang"
            name="code"
            label="កូដ (Code)"
            rules={[{ required: true, message: "សូមបញ្ចូលកូដ" }]}
            extra={
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                ឧ. dashboard.view, employee.create
              </span>
            }
          >
            <Input
              placeholder="ឧ. dashboard.view"
              size="large"
              style={{ fontFamily: "monospace" }}
            />
          </Form.Item>

          <Form.Item
            className="font-battambang"
            name="route_web"
            label="Route Web"
            extra={
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                ឧ. /dashboard, /employee (មិនចាំបាច់ក៏បាន)
              </span>
            }
          >
            <Input
              placeholder="ឧ. /dashboard"
              size="large"
              style={{ fontFamily: "monospace" }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* TABLE */}
      <div className="bg-white p-3 rounded-md">
        <Table
          size="small"
          bordered
          rowKey="id"
          dataSource={state.list}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => (
              <span className="font-battambang">សរុប {total} សិទ្ធ</span>
            ),
          }}
          locale={{
            emptyText: (
              <div style={{ padding: "32px 0", color: "#94a3b8" }}>
                <Lock
                  size={32}
                  color="#e2e8f0"
                  style={{ margin: "0 auto 8px", display: "block" }}
                />
                <p
                  className="font-battambang"
                  style={{ margin: 0, fontSize: 14 }}
                >
                  មិនមានសិទ្ធ
                </p>
              </div>
            ),
          }}
        />
      </div>
    </MainPage>
  );
};

export default CreatePermissionPage;
