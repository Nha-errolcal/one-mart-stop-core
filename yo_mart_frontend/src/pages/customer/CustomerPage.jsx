import { useEffect, useState } from "react";
import MainPage from "@/layouts/auth/MainPage";
import {Button, Form, Input, message, Modal, Space, Table, Tooltip} from "antd";
import { formatDate, request } from "@/store/Configstore";
import { MdDelete, MdEdit } from "react-icons/md";
import { useForm } from "antd/es/form/Form";
import { Eye } from "lucide-react";
import {IoEyeSharp} from "react-icons/io5";

const CustomerPage = () => {
  const [state, setState] = useState({
    list: [],
    loading: false,
    modalVisible: false,
    currentCategory: null,
  });
  const [form] = useForm();

  useEffect(() => {
    getAll();
  }, []);

  // Function to fetch all customers
  const getAll = async () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      const res = await request("customer", "get");
      if (res && res.getAll) {
        setState((prevState) => ({
          ...prevState,
          list: res.getAll,
          loading: false,
        }));
      } else {
        message.warning("No data found.");
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    } catch (error) {
      message.error("Failed to fetch customers. Please try again later.");
      console.error("Error fetching customers:", error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  // Function to handle form submission
  const onFinish = async (values) => {
    try {
      const id = state.currentCategory?.id; // Keep this as currentCategory
      const endpoint = id ? `customer/${id}` : "customer";
      const method = id ? "put" : "post";

      const res = await request(endpoint, method, values);

      if (res) {
        message.success("Customer saved successfully");
        setState((prev) => ({
          ...prev,
          modalVisible: false,
          currentCategory: null, // Reset currentCategory after saving
        }));
        getAll();
      }
    } catch (error) {
      console.error("Error while saving customer:", error);
      message.error("Failed to save customer. Please try again.");
    }
  };

  // Function to handle deletion of a customer
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      description: "Are you sure to remove this customer?",
      okText: "Yes",
      onOk: async () => {
        try {
          const res = await request(`customer/${id}`, "delete");
          if (res) {
            message.success(res.message);
            setState((prevState) => ({
              ...prevState,
              list: prevState.list.filter((item) => item.id !== id),
            }));
          }
        } catch (err) {
          message.error(`Failed to delete customer: ${err.message}`);
        }
      },
    });
  };

  // Function to handle adding a new customer
  const handleAdd = () => {
    setState((prev) => ({
      ...prev,
      modalVisible: true,
      currentCategory: null, // Reset for new customer
    }));
    form.resetFields();
  };

  // Function to handle editing a customer
  const handleEdit = (customer) => {
    setState((prev) => ({
      ...prev,
      modalVisible: true,
      currentCategory: customer,
    }));
    form.setFieldsValue({
      name: customer.name,
      tel: customer.tel,
      email: customer.email,
      address: customer.address,
    });
  };

  return (
    <MainPage loading={state.loading}>
      <div className="flex bg-white p-3 rounded-md flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">

        {/* Left Side */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-battambang">
            បញ្ជីអតិថិជន
          </h1>
          <p className="text-sm text-slate-500 font-battambang">
            គ្រប់គ្រង និងមើលព័ត៌មានអតិថិជន
          </p>
        </div>

        {/* Right Side */}
        <Button
            type="primary"
            size="large"
            onClick={handleAdd}
            className="font-battambang shadow-sm"
        >
          + បង្កើតអតិថិជនថ្មី
        </Button>
      </div>

      {/* Modal for Add/Edit Customer */}
      <Modal
        visible={state.modalVisible}
        onCancel={() => setState((prev) => ({ ...prev, modalVisible: false }))}
        onOk={() => form.submit()}
        title={state.currentCategory ? "កែប្រែអតិថិជន" : "បង្កើតអតិថិជនថ្មី"}
      >
        <Form onFinish={onFinish} form={form} layout="vertical">

          <Form.Item
              className="font-battambang"
              name="name"
              label="ឈ្មោះអតិថិជន"
              rules={[
                { required: true, message: "សូមបញ្ចូលឈ្មោះអតិថិជន" }
              ]}
          >
            <Input placeholder="បញ្ចូលឈ្មោះអតិថិជន" size="large" />
          </Form.Item>

          <Form.Item
              className="font-battambang"
              name="tel"
              label="លេខទូរស័ព្ទ"
              rules={[
                { required: true, message: "សូមបញ្ចូលលេខទូរស័ព្ទ" }
              ]}
          >
            <Input placeholder="បញ្ចូលលេខទូរស័ព្ទ" size="large" />
          </Form.Item>

          <Form.Item
              className="font-battambang"
              name="email"
              label="អ៊ីមែល"
              rules={[
                { required: true, message: "សូមបញ្ចូលអ៊ីមែល" },
                { type: "email", message: "ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ" }
              ]}
          >
            <Input placeholder="បញ្ចូលអ៊ីមែល" size="large" />
          </Form.Item>

          <Form.Item
              className="font-battambang"
              name="address"
              label="អាសយដ្ឋាន"
              rules={[
                { required: true, message: "សូមបញ្ចូលអាសយដ្ឋាន" }
              ]}
          >
            <Input placeholder="បញ្ចូលអាសយដ្ឋាន" size="large" />
          </Form.Item>

        </Form>
      </Modal>

      {/* Table for displaying customers */}
      <div className={"bg-white p-3 rounded-md flex-col gap-3"}>
        <Table
            size={"small"}
            bordered={true}
            dataSource={state.list}
            columns={[
              {
                key: "name",
                dataIndex: "name",
                title: "ឈ្មោះអតិថិជន",
              },
              {
                key: "tel",
                dataIndex: "tel",
                title: "លេខទូរស័ព្ទ",
              },
              {
                key: "email",
                dataIndex: "email",
                title: "អ៊ីមែល",
              },
              {
                key: "address",
                dataIndex: "address",
                title: "អាសយដ្ឋាន",
              },
              {
                key: "created_at",
                dataIndex: "created_at",
                title: "កាលបរិច្ឆេទបង្កើត",
                render: (value) => formatDate(value),
              },
              {
                title: "សកម្មភាព",
                key: "action",
                render: (item) => (
                    <Space size={6}>
                      {/* View */}
                      <Tooltip title="មើលព័ត៌មាន">
                        <Button
                            size="small"
                            icon={<IoEyeSharp  size={15} />}
                            onClick={() => handleEdit(item)}
                            className="!bg-green-500 hover:!bg-green-600 !text-white !border-green-500 rounded-md"
                        />
                      </Tooltip>

                      {/* Edit */}
                      <Tooltip title="កែប្រែ">
                        <Button
                            size="small"
                            icon={<MdEdit size={15} />}
                            onClick={() => handleEdit(item)}
                            className="!bg-blue-500 hover:!bg-blue-600 !text-white !border-blue-500 rounded-md"
                        />
                      </Tooltip>

                      {/* Delete */}
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
    </MainPage>
  );
};

export default CustomerPage;
