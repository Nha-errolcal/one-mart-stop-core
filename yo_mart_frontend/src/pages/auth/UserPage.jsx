import { useEffect, useState } from "react";
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
import { IoEyeSharp } from "react-icons/io5";
import { useForm } from "antd/es/form/Form";
import { Info } from "lucide-react";

const UserPage = () => {
  const [state, setState] = useState({
    list: [],
    loading: false,
    modalVisible: false,
    editingUser: null, // track user being edited
  });

  const [viewData, setViewData] = useState(null); // For view modal
  const [form] = useForm();

  useEffect(() => {
    getAll();
  }, []);

  // Fetch all users
  const getAll = async () => {
    setState((p) => ({ ...p, loading: true }));
    try {
      const res = await request("users/get_all_user", "get");
      if (res?.success) {
        setState((p) => ({ ...p, list: res.data, loading: false }));
      }
    } catch {
      message.error("ទាញយកទិន្នន័យមិនបាន");
      setState((p) => ({ ...p, loading: false }));
    }
  };

  // Fetch single user for viewing
  const getOne = async (id) => {
    try {
      const res = await request(`users/view_only/${id}`, "get");

      if (res?.success && res.data.length > 0) {
        setViewData(res.data);
        setState((p) => ({ ...p, modalVisible: true }));
      }
    } catch {
      message.error("មិនអាចយកទិន្នន័យបាន");
    }
  };

  // Create or update user
  const onFinish = async (values) => {
    try {
      let url = "register";
      let method = "post";

      if (state.editingUser) {
        url = `users/update_user/${state.editingUser.id}`;
        method = "put";
      }

      const payload = {
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password || undefined,
        password_confirmation: values.password_confirmation || undefined,
      };

      await request(url, method, payload);

      message.success(
        state.editingUser
          ? "បានកែប្រែអ្នកប្រើប្រាស់"
          : "បង្កើតអ្នកប្រើប្រាស់ជោគជ័យ",
      );

      setState((p) => ({
        ...p,
        modalVisible: false,
        editingUser: null,
      }));
      form.resetFields();
      getAll();
    } catch (error) {
      message.error(state.editingUser ? "កែប្រែបរាជ័យ" : "បង្កើតបរាជ័យ");
    }
  };

  const handleDelete = (id) => {
    let password = "";

    Modal.confirm({
      title: "លុបអ្នកប្រើប្រាស់?",
      content: (
        <div>
          <p>សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នកដើម្បីបញ្ជាក់</p>
          <Input.Password
            placeholder="Password"
            onChange={(e) => (password = e.target.value)}
          />
        </div>
      ),
      okText: "បាទ/ចាស",
      cancelText: "បោះបង់",
      okButtonProps: { danger: true },
      onOk: async () => {
        if (!password) {
          message.error("សូមបញ្ចូលពាក្យសម្ងាត់");
          throw new Error("Password required");
        }
        try {
          const res = await request(`users/delete_user/${id}`, "delete", {
            password,
          });

          if (res?.success === true && res?.status === 200) {
            message.success("បានលុបអ្នកប្រើប្រាស់ជោគជ័យ");
            setState((p) => ({
              ...p,
              list: p.list.filter((u) => u.id !== id),
            }));
            password = "";
          } else if (
            res?.data?.success === false &&
            res?.data?.status === 400
          ) {
            return message.error("ពាក្យសម្ងាត់មិនត្រឹមត្រូវ");
          } else if (
            res?.data?.success === false &&
            res?.data?.status === 422
          ) {
            const errorMsg = "សូមបញ្ចូលពាក្យសម្ងាត់យ៉ាងតិច 6 តួអក្សរ";
            return message.error(errorMsg);
          } else {
            return message.error("មានបញ្ហាក្នុងការលុប");
          }
        } catch (err) {
          const errorMsg =
            err?.response?.data?.error ||
            (err?.response?.data?.errors
              ? Object.values(err.response.data.errors).flat().join(", ")
              : "បរាជ័យក្នុងការលុប");

          message.error(errorMsg);
          throw new Error(errorMsg);
        }
      },
      onCancel: () => {
        password = "";
      },
    });
  };
  const handleEdit = (user) => {
    setState((p) => ({
      ...p,
      modalVisible: true,
      editingUser: user,
    }));

    form.setFieldsValue({
      name: user.name,
      username: user.username,
      email: user.email,
      password: "",
      password_confirmation: "",
    });
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between bg-white p-3 rounded-md mb-3">
        <div>
          <h1 className="text-xl font-battambang">បញ្ជីអ្នកប្រើប្រាស់</h1>
          <p className="text-sm text-gray-500">
            ចំនួនសរុប: {state.list.length}
          </p>
        </div>

        <Button
          type="primary"
          onClick={() =>
            setState((p) => ({ ...p, modalVisible: true, editingUser: null }))
          }
        >
          + បន្ថែម
        </Button>
      </div>

      {/* USER TABLE */}
      <div className="bg-white p-3 rounded-md">
        <Table
          rowKey="id"
          size="small"
          dataSource={state.list}
          loading={state.loading}
          columns={[
            {
              title: "ល.រ",
              width: 60,
              fixed: "left",
              render: (_, __, index) => index + 1,
            },
            { title: "ឈ្មោះ", dataIndex: "name" },
            { title: "ឈ្មោះអ្នកប្រើ", dataIndex: "username" },
            { title: "អ៊ីមែល", dataIndex: "email" },
            {
              title: "កាលបរិច្ឆេទ",
              dataIndex: "created_at",
              render: (v) => formatDate(v),
            },
            {
              title: "សកម្មភាព",
              render: (item) => (
                <Space>
                  <Tooltip title="មើល">
                    <Button
                      icon={<IoEyeSharp />}
                      onClick={() => getOne(item.id)}
                    />
                  </Tooltip>

                  <Tooltip title="កែប្រែ">
                    <Button
                      icon={<MdEdit />}
                      onClick={() => handleEdit(item)}
                    />
                  </Tooltip>

                  <Tooltip title="លុប">
                    <Button
                      danger
                      icon={<MdDelete />}
                      onClick={() => handleDelete(item.id)}
                    />
                  </Tooltip>
                </Space>
              ),
            },
          ]}
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal
        open={state.modalVisible && !viewData}
        onCancel={() =>
          setState((p) => ({
            ...p,
            modalVisible: false,
            editingUser: null,
          }))
        }
        onOk={() => form.submit()}
        title={state.editingUser ? "កែប្រែអ្នកប្រើប្រាស់" : "អ្នកប្រើប្រាស់"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="ឈ្មោះ"
            rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះ" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="username"
            label="ឈ្មោះអ្នកប្រើ"
            rules={[{ required: true, message: "សូមបញ្ចូល Username" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="អ៊ីមែល"
            rules={[
              { required: true, message: "សូមបញ្ចូល Email" },
              { type: "email", message: "Email មិនត្រឹមត្រូវ" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="ពាក្យសម្ងាត់"
            rules={[
              {
                required: !state.editingUser,
                min: 6,
                message: "សូមបញ្ចូលពាក្យសម្ងាត់យ៉ាងតិច 6 តួអក្សរ",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label="បញ្ជាក់ពាក្យសម្ងាត់"
            dependencies={["password"]}
            rules={[
              {
                required: !state.editingUser,
                message: "សូមបញ្ជាក់ពាក្យសម្ងាត់",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Password មិនត្រូវគ្នា");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      {/* VIEW USER MODAL */}
      <Modal
        open={state.modalVisible && viewData}
        footer={null}
        onCancel={() => {
          setState((p) => ({ ...p, modalVisible: false }));
          setViewData(null);
        }}
        title={
          <div className="flex items-center gap-2">
            <IoEyeSharp className="text-blue-500 text-lg" />
            <span>ព័ត៌មានអ្នកប្រើប្រាស់</span>
          </div>
        }
        width={1000}
      >
        {viewData && (
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-3 mb-3 border-b pb-2">
                <Info /> ព័ត៌មានមូលដ្ឋាន
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">ឈ្មោះ</p>
                  <p className="font-medium">{viewData[0].name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Username</p>
                  <p className="font-medium">{viewData[0].username}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{viewData[0].email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                🛡 តួនាទី
              </h3>
              <div className="flex flex-wrap gap-2">
                {[...new Map(viewData.map((i) => [i.role_id, i])).values()].map(
                  (role) => (
                    <span
                      key={role.role_id}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm"
                    >
                      {role.role_name}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                🔑 សិទ្ធិ
              </h3>
              {viewData.some((p) => p.permission_id !== null) ? (
                <div className="flex flex-wrap gap-2">
                  {viewData
                    .filter((p) => p.permission_id !== null)
                    .map((p) => (
                      <span
                        key={p.permission_id}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium text-sm"
                      >
                        {p.permission_name} ({p.permission_code})
                      </span>
                    ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">គ្មានសិទ្ធិ</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default UserPage;
