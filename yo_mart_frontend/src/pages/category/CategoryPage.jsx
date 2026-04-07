import { useEffect, useState } from "react";
import MainPage from "@/layouts/auth/MainPage";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { formatDate, request } from "@/store/Configstore";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import { useForm } from "antd/es/form/Form";
import { Plus, Search } from "lucide-react";

const CategoryPage = () => {
  const [state, setState] = useState({
    list: [],
    loading: false,
    modalVisible: false,
    currentCategory: null,
  });
  const [form] = useForm();
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await request(`category?search=${searchText}`, "get");
      if (res && res.getAll && res.getAll.length > 0) {
        setState((prev) => ({ ...prev, list: res.getAll, loading: false }));
      } else {
        message.warning("មិនមានប្រភេទផលិតផលណាមួយត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ");
        setState((prev) => ({ ...prev, list: [], loading: false }));
      }
    } catch (error) {
      message.error("Failed to fetch categories. Please try again later.");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const onFinish = async (values) => {
    try {
      const id = state.currentCategory?.id;
      const endpoint = id ? `category/${id}` : "category";
      const method = id ? "put" : "post";
      const res = await request(endpoint, method, values);
      if (res) {
        notification.success({
          message: "ជោគជ័យ",
          description: "Category saved successfully",
          placement: "topRight",
        });
        setState((prev) => ({
          ...prev,
          modalVisible: false,
          currentCategory: null,
        }));
        getAll();
      }
    } catch (error) {
      if (error?.message?.includes("duplicate key") || error?.status === 500) {
        notification.error({
          message: "កំហុស",
          description:
            "រក្សាទុកបរាជ័យ៖ មានបញ្ហាជាមួយ ID។ សូមទាក់ទងអ្នកគ្រប់គ្រង។",
          placement: "topRight",
        });
      } else {
        message.error("Failed to save category. Please try again.");
      }
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Are you sure you want to remove this category?",
      okText: "Yes",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await request(`category/${id}`, "delete");
          if (res) {
            message.success(res.message);
            setState((prev) => ({
              ...prev,
              list: prev.list.filter((item) => item.id !== id),
            }));
          }
        } catch (err) {
          message.error(`Failed to delete category: ${err.message}`);
        }
      },
    });
  };

  const handleAdd = () => {
    setState((prev) => ({
      ...prev,
      modalVisible: true,
      currentCategory: null,
    }));
    form.resetFields();
  };

  const handleEdit = (category) => {
    setState((prev) => ({
      ...prev,
      modalVisible: true,
      currentCategory: category,
    }));
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      status: category.status,
    });
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg shadow-sm gap-4 mb-6">
        {/* Title Section */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 font-battambang">
            បញ្ជីប្រភេទផលិតផល
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-battambang mt-1">
            គ្រប់គ្រង និងមើលព័ត៌មានប្រភេទផលិតផល ({state.list.length} ប្រភេទ)
          </p>
        </div>

        {/* Search Section */}

        {/* Add Button */}
        <div className="flex justify-end w-full md:w-auto">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              placeholder="ស្វែងរកប្រភេទ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={getAll}
              className="rounded-md border-gray-300 shadow-sm"
            />
            <Button
              type="primary"
              onClick={getAll}
              className="font-battambang px-4 py-2 shadow-md"
            >
              <Search size="20" /> ស្វែងរក
            </Button>
          </div>
          <Button
            type="primary"
            size="sm"
            onClick={handleAdd}
            className="font-battambang ml-2 shadow-md bg-blue-600 hover:bg-blue-700"
          >
            <Plus /> បង្កើតប្រភេទថ្មី
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={state.modalVisible}
        onCancel={() => setState((prev) => ({ ...prev, modalVisible: false }))}
        onOk={() => form.submit()}
        title={
          <span className="font-battambang">
            {state.currentCategory ? "កែសម្រួលប្រភេទ" : "បង្កើតប្រភេទថ្មី"}
          </span>
        }
        okText={<span className="font-battambang">រក្សាទុក</span>}
        cancelText={<span className="font-battambang">បោះបង់</span>}
      >
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Form.Item
            className="font-battambang"
            name="name"
            label={<span className="font-battambang">ឈ្មោះប្រភេទ</span>}
            rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះប្រភេទ" }]}
          >
            <Input placeholder="បញ្ចូលឈ្មោះប្រភេទ" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-battambang">បរិយាយ</span>}
            // rules={[{ required: true, message: "សូមបញ្ចូលបរិយាយ" }]}
          >
            <Input.TextArea placeholder="បញ្ចូលបរិយាយ" rows={3} />
          </Form.Item>

          <Form.Item
            name="status"
            label={<span className="font-battambang">ស្ថានភាព</span>}
            rules={[{ required: true, message: "សូមជ្រើសរើសស្ថានភាព" }]}
          >
            <Select
              placeholder="ជ្រើសរើសស្ថានភាព"
              size="large"
              options={[
                {
                  value: 1,
                  label: <span className="font-battambang">សកម្ម</span>,
                },
                {
                  value: 0,
                  label: <span className="font-battambang">អសកម្ម</span>,
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Table */}
      <div className="bg-white p-3 rounded-md">
        <Table
          size="small"
          bordered
          rowKey="id"
          dataSource={state.list}
          loading={state.loading}
          columns={[
            {
              key: "no",
              title: <span className="font-battambang">ល.រ</span>,
              render: (text, record, index) => (
                <span className="font-battambang">{index + 1}</span>
              ),
            },
            {
              key: "name",
              dataIndex: "name",
              title: <span className="font-battambang">ឈ្មោះប្រភេទ</span>,
              sorter: (a, b) => a.name?.localeCompare(b.name),
            },
            {
              key: "description",
              dataIndex: "description",
              title: <span className="font-battambang">បរិយាយ</span>,
              render: (value) => (
                <p className="w-64 font-battambang text-sm">{value}</p>
              ),
              sorter: (a, b) =>
                (a.description || "").localeCompare(b.description || ""),
            },
            // {
            //   key: "create_by",
            //   dataIndex: "create_by",
            //   title: <span className="font-battambang">បង្កើតដោយ</span>,
            //   sorter: (a, b) => a.create_by?.localeCompare(b.create_by),
            // },
            {
              key: "status",
              dataIndex: "status",
              title: <span className="font-battambang">ស្ថានភាព</span>,
              render: (status) =>
                status === 1 ? (
                  <Tag color="green" className="font-battambang">
                    <CheckCircleOutlined />
                  </Tag>
                ) : (
                  <Tag color="red" className="font-battambang">
                    <CloseCircleOutlined />
                  </Tag>
                ),
              sorter: (a, b) => a.status - b.status,
            },
            {
              key: "created_at",
              dataIndex: "created_at",
              title: <span className="font-battambang">កាលបរិច្ឆេទបង្កើត</span>,
              render: (value) => formatDate(value),
              sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            },
            {
              title: (
                <p color="geekblue" className="font-battambang">
                  សកម្មភាព
                </p>
              ),
              key: "action",
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
          ]}
        />
      </div>
    </>
  );
};

export default CategoryPage;
