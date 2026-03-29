import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { request, formatDate } from "@/store/Configstore";
import dayjs from "dayjs";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { useForm } from "antd/es/form/Form";
import MainPage from "@/layouts/auth/MainPage";

const EmployeesPage = () => {
  const [state, setState] = useState({
    list: [],
    modal: false,
    loading: false,
  });
  const [formRef] = useForm();

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await request("employees", "get");
      if (res) {
        setState((prev) => ({ ...prev, list: res.employees, loading: false }));
      }
    } catch (err) {
      message.error(err?.message || "Failed to fetch employees");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const onOpenModal = (item = null) => {
    setState((prev) => ({ ...prev, modal: true }));
    formRef.resetFields();
    if (item) {
      formRef.setFieldsValue({
        name: item.name || "",
        dob: item.dob ? dayjs(item.dob) : null,
        salary: item.salary || 0,
        bonus: item.bonus || 0,
        gender: item.gender ?? null,
        employment_date: item.employment_date
          ? dayjs(item.employment_date)
          : null,
        id: item.id,
      });
    }
  };

  const onCloseModal = () => {
    setState((prev) => ({ ...prev, modal: false }));
  };

  const onFinish = async (values) => {
    try {
      const id = formRef.getFieldValue("id");
      const payload = {
        ...values,
        employment_date: values.employment_date
          ? dayjs(values.employment_date).format("YYYY-MM-DD")
          : undefined,
        dob: values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : undefined,
      };
      const endpoint = id ? `employees/${id}` : "employees";
      const method = id ? "put" : "post";
      const res = await request(endpoint, method, payload);
      if (res) {
        message.success(
          id ? "Employee updated successfully" : "Employee added successfully",
        );
        getAll();
        onCloseModal();
      } else {
        message.error("Error in adding/updating employee");
      }
    } catch (err) {
      message.error(`Failed to add/update employee: ${err.message}`);
    }
  };

  const handleClickDelete = (data) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Are you sure you want to remove this employee?",
      okText: "Yes",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await request(`employees/${data.id}`, "delete");
          if (res) {
            message.success(res.message);
            setState((prev) => ({
              ...prev,
              list: prev.list.filter((item) => item.id !== data.id),
            }));
          }
        } catch (err) {
          message.error(`Failed to delete employee: ${err.message}`);
        }
      },
    });
  };

  const isEditing = !!formRef.getFieldValue("id");

  return (
    <MainPage loading={state.loading}>
      {/* Header */}
      <div className="flex bg-white p-3 rounded-md flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-battambang">
            បញ្ជីបុគ្គលិក
          </h1>
          <p className="text-sm text-slate-500 font-battambang">
            គ្រប់គ្រង និងមើលព័ត៌មានបុគ្គលិក ({state.list.length} នាក់)
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          onClick={() => onOpenModal()}
          className="font-battambang shadow-sm"
        >
          + បញ្ចូលបុគ្គលិកថ្មី
        </Button>
      </div>

      {/* Modal */}
      <Modal
        title={
          <span className="font-battambang">
            {isEditing ? "កែសម្រួលបុគ្គលិក" : "បញ្ចូលបុគ្គលិកថ្មី"}
          </span>
        }
        open={state.modal}
        footer={null}
        onCancel={onCloseModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="font-battambang">ឈ្មោះ</span>}
                name="name"
                rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះ" }]}
              >
                <Input placeholder="បញ្ចូលឈ្មោះ" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-battambang">ថ្ងៃខែឆ្នាំកំណើត</span>
                }
                name="dob"
              >
                <DatePicker
                  placeholder="ថ្ងៃខែឆ្នាំកំណើត"
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="font-battambang">ប្រាក់ខែ</span>}
                name="salary"
              >
                <InputNumber
                  placeholder="ប្រាក់ខែ"
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="font-battambang">បន្ថែម</span>}
                name="bonus"
              >
                <InputNumber
                  placeholder="បន្ថែម"
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="font-battambang">ភេទ</span>}
                name="gender"
              >
                <Select placeholder="ជ្រើសរើសភេទ" size="large">
                  <Select.Option value={1}>ប្រុស</Select.Option>
                  <Select.Option value={0}>ស្រី</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-battambang">កាលបរិច្ឆេទចូលធ្វើការ</span>
                }
                name="employment_date"
              >
                <DatePicker
                  placeholder="កាលបរិច្ឆេទចូលធ្វើការ"
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
          <Space style={{ marginTop: 8 }}>
            <Button onClick={onCloseModal} className="font-battambang">
              បោះបង់
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="font-battambang"
            >
              រក្សាទុក
            </Button>
          </Space>
        </Form>
      </Modal>

      {/* Table */}
      <div className="bg-white p-3 rounded-md">
        <Table
          size="small"
          bordered
          dataSource={state.list}
          loading={state.loading}
          rowKey="id"
          pagination={{ pageSize: 7 }}
          columns={[
            {
              title: <span className="font-battambang">ឈ្មោះ</span>,
              key: "name",
              dataIndex: "name",
              sorter: (a, b) => a.name?.localeCompare(b.name),
            },
            {
              title: (
                <span className="font-battambang">កាលបរិច្ឆេទចូលធ្វើការ</span>
              ),
              key: "employment_date",
              dataIndex: "employment_date",
              render: (value) => formatDate(value),
              sorter: (a, b) =>
                new Date(a.employment_date) - new Date(b.employment_date),
            },
            {
              title: <span className="font-battambang">ប្រាក់ខែ</span>,
              key: "salary",
              dataIndex: "salary",
              sorter: (a, b) => a.salary - b.salary,
            },
            {
              title: <span className="font-battambang">បន្ថែម</span>,
              key: "bonus",
              dataIndex: "bonus",
              sorter: (a, b) => a.bonus - b.bonus,
            },
            {
              title: <span className="font-battambang">ថ្ងៃខែឆ្នាំកំណើត</span>,
              key: "dob",
              dataIndex: "dob",
              render: (value) => formatDate(value),
              sorter: (a, b) => new Date(a.dob) - new Date(b.dob),
            },
            {
              title: <span className="font-battambang">ភេទ</span>,
              key: "gender",
              dataIndex: "gender",
              render: (value) => (
                <span className="font-battambang">
                  {value ? "ប្រុស" : "ស្រី"}
                </span>
              ),
              sorter: (a, b) => a.gender - b.gender,
            },
            {
              title: <span className="font-battambang">បង្កើតដោយ</span>,
              key: "create_by",
              dataIndex: "create_by",
              sorter: (a, b) => a.create_by?.localeCompare(b.create_by),
            },
            {
              title: <span className="font-battambang">កាលបរិច្ឆេទបង្កើត</span>,
              key: "created_at",
              dataIndex: "created_at",
              render: (value) => formatDate(value),
              sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            },
            {
              title: <span className="font-battambang">សកម្មភាព</span>,
              key: "action",
              render: (item) => (
                <Space size={6}>
                  {/* View */}
                  <Tooltip title="មើលព័ត៌មាន">
                    <Button
                      size="small"
                      icon={<IoEyeSharp size={15} />}
                      onClick={() => onOpenModal(item)}
                      className="!bg-green-500 hover:!bg-green-600 !text-white !border-green-500 rounded-md"
                    />
                  </Tooltip>

                  {/* Edit */}
                  <Tooltip title="កែប្រែ">
                    <Button
                      size="small"
                      icon={<MdEdit size={15} />}
                      onClick={() => onOpenModal(item)}
                      className="!bg-blue-500 hover:!bg-blue-600 !text-white !border-blue-500 rounded-md"
                    />
                  </Tooltip>

                  {/* Delete */}
                  <Tooltip title="លុប">
                    <Button
                      size="small"
                      icon={<MdDelete size={15} />}
                      onClick={() => handleClickDelete(item)}
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

export default EmployeesPage;
