import { useEffect, useState } from "react";
import MainPage from "@/layouts/auth/MainPage";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
  Upload,
  Image,
  Row,
  Col,
} from "antd";
import { formatDate, request } from "@/store/Configstore";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { Config } from "@/util/Config";

const ProductPage = () => {
  const [state, setState] = useState({
    loading: true,
    list: [],
    category: [],
    modal: false,
  });
  const [formRef] = useForm();
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [filter, setFilter] = useState({ search: "", category_id: "" });

  useEffect(() => {
    getAll();
    getCategory();
  }, []);

  const getCategory = async () => {
    try {
      const res = await request("category", "get");
      if (res)
        setState((pre) => ({ ...pre, category: res.getAll, loading: false }));
    } catch (error) {
      message.error(error);
    }
  };

  const getAll = async () => {
    try {
      const res = await request("product", "get", { ...filter });
      if (res)
        setState((pre) => ({ ...pre, list: res.getAll, loading: false }));
    } catch (error) {
      message.error(error);
    }
  };

  const onClickOpenModal = () => {
    setState((pre) => ({ ...pre, modal: true }));
    formRef.resetFields();
    setFileList([]);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onFinish = async (item) => {
    try {
      const id = formRef.getFieldValue("id");
      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("category_id", item.category_id);
      formData.append("qty", item.qty || "");
      formData.append("product_in", item.product_in || "");
      formData.append("product_out", item.product_out || "");
      formData.append("description", item.description || "");
      formData.append("discount", item.discount || "");
      formData.append("id", id);

      if (item.image?.file) {
        if (item.image.file.status === "removed") {
          formData.append("image_remove", "1");
        } else if (item.image.file.originFileObj) {
          formData.append(
            "image",
            item.image.file.originFileObj,
            item.image.file.name,
          );
        }
      }

      let url = "product";
      let method = "post";
      if (id !== undefined) {
        url += "/" + id;
        formData.append("_method", "put");
      }

      setState((pre) => ({ ...pre, loading: true }));
      const res = await request(url, method, formData);
      if (res) {
        message.success(res.message);
        setState((prev) => ({ ...prev, modal: false }));
        getAll();
        formRef.resetFields();
        setFileList([]);
      }
    } catch (error) {
      message.error("Failed to add product");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Are you sure you want to remove this product?",
      okText: "Yes",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await request(`product/${id}`, "delete");
          if (res) {
            message.success(res.message);
            setState((prev) => ({
              ...prev,
              list: prev.list.filter((item) => item.id !== id),
            }));
          }
        } catch (err) {
          message.error(`Failed to delete product: ${err.message}`);
        }
      },
    });
  };

  const handleEdit = (item) => {
    formRef.setFieldsValue({ ...item });
    setState((prev) => ({ ...prev, modal: true }));
    if (item.image) {
      setFileList([
        {
          uid: "-1",
          name: item.image,
          status: "done",
          url: Config.image_path + item.image,
        },
      ]);
    } else {
      setFileList([]);
    }
  };

  const isEditing = !!formRef.getFieldValue("id");

  return (
    <>
      {/* Header */}
      <div className="flex bg-white p-3 rounded-md flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-battambang">
            បញ្ជីផលិតផល
          </h1>
          <p className="text-sm text-slate-500 font-battambang">
            គ្រប់គ្រង និងមើលព័ត៌មានផលិតផល ({state.list.length} មុខ)
          </p>
        </div>

        {/* Filters + Add */}
        <div className="flex items-center gap-2 flex-wrap">
          <Input.Search
            placeholder="ស្វែងរកផលិតផល..."
            onChange={(e) =>
              setFilter((p) => ({ ...p, search: e.target.value }))
            }
            onSearch={getAll}
            allowClear
            className="w-48"
          />
          <Select
            placeholder="ប្រភេទ"
            className="w-40"
            allowClear
            onChange={(id) =>
              setFilter((p) => ({ ...p, category_id: id ?? "" }))
            }
          >
            {state.category?.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
          <Button onClick={getAll} className="font-battambang">
            តម្រង
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={onClickOpenModal}
            className="font-battambang shadow-sm"
          >
            + បង្កើតផលិតផលថ្មី
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={
          <span className="font-battambang">
            {isEditing ? "កែសម្រួលផលិតផល" : "បង្កើតផលិតផលថ្មី"}
          </span>
        }
        footer={null}
        open={state.modal}
        onCancel={() => setState((prev) => ({ ...prev, modal: false }))}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="font-battambang">ឈ្មោះផលិតផល</span>}
                name="name"
                rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះផលិតផល" }]}
              >
                <Input placeholder="ឈ្មោះផលិតផល" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="font-battambang">ប្រភេទ</span>}
                name="category_id"
                rules={[{ required: true, message: "សូមជ្រើសរើសប្រភេទ" }]}
              >
                <Select placeholder="ជ្រើសរើសប្រភេទ" size="large">
                  {state.category?.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="font-battambang">បរិមាណ</span>}
                name="qty"
                rules={[{ required: true, message: "សូមបញ្ចូលបរិមាណ" }]}
              >
                <Input placeholder="បរិមាណ" type="number" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="font-battambang">ផលិតផលចូល</span>}
                name="product_in"
                rules={[{ required: true, message: "សូមបញ្ចូលផលិតផលចូល" }]}
              >
                <Input placeholder="ផលិតផលចូល" type="number" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="font-battambang">ផលិតផលចេញ</span>}
                name="product_out"
                rules={[{ required: true, message: "សូមបញ្ចូលផលិតផលចេញ" }]}
              >
                <Input placeholder="ផលិតផលចេញ" type="number" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="font-battambang">បញ្ចុះតម្លៃ</span>}
                name="discount"
              >
                <Input placeholder="បញ្ចុះតម្លៃ" type="number" size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={<span className="font-battambang">បរិយាយ</span>}
                name="description"
              >
                <Input.TextArea placeholder="បរិយាយផលិតផល" rows={3} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={<span className="font-battambang">រូបភាព</span>}
                name="image"
              >
                <Upload
                  customRequest={(op) => op.onSuccess()}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  maxCount={1}
                >
                  {fileList.length >= 1 ? null : (
                    <button
                      style={{ border: 0, background: "none" }}
                      type="button"
                    >
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }} className="font-battambang">
                        Upload
                      </div>
                    </button>
                  )}
                </Upload>
              </Form.Item>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (v) => setPreviewOpen(v),
                    afterOpenChange: (v) => !v && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Col>
          </Row>

          <Space style={{ marginTop: 8 }}>
            <Button
              onClick={() => setState((prev) => ({ ...prev, modal: false }))}
              className="font-battambang"
            >
              បោះបង់
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={state.loading}
              className="font-battambang"
            >
              {isEditing ? "កែប្រែ" : "រក្សាទុក"}
            </Button>
          </Space>
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
              key: "name",
              dataIndex: "name",
              title: <span className="font-battambang">ឈ្មោះផលិតផល</span>,
            },
            {
              key: "category_name",
              dataIndex: "category_name",
              title: <span className="font-battambang">ប្រភេទ</span>,
            },
            {
              key: "qty",
              dataIndex: "qty",
              title: <span className="font-battambang">បរិមាណ</span>,
            },
            {
              key: "product_in",
              dataIndex: "product_in",
              title: <span className="font-battambang">ចូល</span>,
            },
            {
              key: "product_out",
              dataIndex: "product_out",
              title: <span className="font-battambang">ចេញ</span>,
            },
            {
              key: "image",
              dataIndex: "image",
              title: <span className="font-battambang">រូបភាព</span>,
              render: (value) =>
                value ? (
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                    src={Config.image_path + value}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                    N/A
                  </div>
                ),
            },
            {
              key: "description",
              dataIndex: "description",
              title: <span className="font-battambang">បរិយាយ</span>,
              render: (value) => (
                <p className="w-40 font-battambang text-xs truncate">{value}</p>
              ),
            },
            {
              key: "discount",
              dataIndex: "discount",
              title: <span className="font-battambang">បញ្ចុះតម្លៃ</span>,
            },
            {
              key: "create_by",
              dataIndex: "create_by",
              title: <span className="font-battambang">បង្កើតដោយ</span>,
            },
            {
              key: "created_at",
              dataIndex: "created_at",
              title: <span className="font-battambang">កាលបរិច្ឆេទ</span>,
              render: (value) => formatDate(value),
            },
            {
              title: <span className="font-battambang">សកម្មភាព</span>,
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

export default ProductPage;
