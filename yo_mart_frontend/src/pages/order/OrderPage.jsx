import { useEffect, useRef, useState } from "react";
import MainPage from "@/layouts/auth/MainPage";
import {
  Button,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { request } from "@/store/Configstore.js";
import { IoEyeSharp } from "react-icons/io5";
import dayjs from "dayjs";
import { FaFileInvoice } from "react-icons/fa";
import { Printer, X } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "../../components/POS/PrintInvoice";

const OrderPage = () => {
  const [state, setState] = useState({
    list: [],
    loading: false,
    modalVisible: false,
    order_view_one: [],
    selected_order: null,
  });

  const [searchText, setSearchText] = useState("");

  // ✅ Ref for print target
  const refInvoice = useRef(null);

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async (txtSearch = "") => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await request(`order?search=${txtSearch}`, "get");
      if (res && res.getAll) {
        setState((prev) => ({ ...prev, list: res.getAll, loading: false }));
      } else {
        message.warning("No data found.");
        setState((prev) => ({ ...prev, list: [], loading: false }));
      }
    } catch (error) {
      message.error("Failed to fetch orders. Please try again later.");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSearch = () => {
    getAll(searchText);
  };

  const handleViewOne = async (id) => {
    try {
      const res = await request(`order_detail/${id}`, "get");
      if (res) {
        setState((prev) => ({
          ...prev,
          order_view_one: res.get_one,
          selected_order: res.order,
          modalVisible: true,
        }));
      } else {
        message.warning("Order not found.");
      }
    } catch (error) {
      message.error(`Failed to fetch order. Error: ${error.message}`);
    }
  };

  const formatOrderTime = (value) => dayjs(value).format("YYYY-MM-DD HH:mm A");

  // ✅ Grand total
  const grandTotal = state.order_view_one.reduce(
    (sum, row) => sum + parseFloat(row.total || 0),
    0,
  );

  // ✅ Summary object passed to PrintInvoice
  const objSummary = state.selected_order;

  // ✅ Print handler
  const handlePrint = useReactToPrint({
    contentRef: refInvoice,
    documentTitle: `Invoice-${state.selected_order?.order_num || ""}`,
    onAfterPrint: () => setState((prev) => ({ ...prev, modalVisible: false })),
  });

  return (
    <>
      {/* Header */}
      <div className="flex bg-white p-3 rounded-md flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-battambang">
            បញ្ជីការបញ្ជាទិញ
          </h1>
          <p className="text-sm text-slate-500 font-battambang">
            គ្រប់គ្រង និងមើលព័ត៌មានការបញ្ជាទិញ ({state.list.length} កំណត់ត្រា)
          </p>
        </div>
      </div>
      <div className="mb-3 flex gap-2">
        <Input
          placeholder="ស្វែងរកលេខបញ្ជា/អតិថិជន/អ្នកលក់"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          allowClear
          // prefix={<SearchOutlined />}
          className="w-72"
        />
        <Button
          type="primary"
          onClick={handleSearch}
          className="font-battambang"
        >
          ស្វែងរក
        </Button>
      </div>

      <div className="hidden">
        <PrintInvoice
          ref={refInvoice}
          objSummary={objSummary}
          cart_list={state.order_view_one}
        />
      </div>

      {/* View Detail Modal */}
      <Modal
        open={state.modalVisible}
        onCancel={() => setState((prev) => ({ ...prev, modalVisible: false }))}
        title={<span className="font-battambang">លម្អិតការបញ្ជាទិញ</span>}
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() =>
                setState((prev) => ({ ...prev, modalVisible: false }))
              }
              className="font-battambang"
              icon={<X size={14} />}
            >
              បិទ
            </Button>
            <Button
              type="primary"
              onClick={handlePrint}
              className="font-battambang"
              icon={<Printer size={14} />}
            >
              បោះពុម្ព
            </Button>
          </div>
        }
        width={1000}
      >
        {/* Order Info Summary */}
        {state.selected_order && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 bg-gray-50 p-3 rounded-md">
            <div>
              <p className="text-gray-400 text-xs font-battambang">លេខបញ្ជា</p>
              <p className="font-semibold text-blue-600">
                #{state.selected_order.order_num}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-battambang">
                អ្នកប្រើប្រាស់
              </p>
              <p className="font-semibold font-battambang">
                {state.selected_order.create_by || "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-battambang">
                វិធីទូទាត់
              </p>
              <p className="font-semibold font-battambang">
                {state.selected_order.payment_method || "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-battambang">
                ចំនួនទូទាត់
              </p>
              <p className="font-semibold text-green-600">
                ${parseFloat(state.selected_order.paid_amount || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-battambang">
                កត់សម្គាល់
              </p>
              <p className="font-semibold font-battambang">
                {state.selected_order.remark || "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-battambang">
                កាលបរិច្ឆេទ
              </p>
              <p className="font-semibold font-battambang">
                {formatOrderTime(state.selected_order.created_at)}
              </p>
            </div>
          </div>
        )}

        {/* Order Detail Table */}
        <Table
          size="small"
          bordered
          rowKey="id"
          dataSource={state.order_view_one}
          pagination={false}
          columns={[
            {
              key: "no",
              title: <span className="font-battambang">ល.រ</span>,
              width: 50,
              render: (_, __, index) => (
                <span className="font-battambang">{index + 1}</span>
              ),
            },
            {
              key: "p_name",
              dataIndex: "p_name",
              title: <span className="font-battambang">ឈ្មោះផលិតផល</span>,
              render: (value) => (
                <span className="font-battambang">{value}</span>
              ),
            },
            {
              key: "p_category_name",
              dataIndex: "p_category_name",
              title: <span className="font-battambang">ប្រភេទ</span>,
              render: (value) => (
                <span className="font-battambang">{value}</span>
              ),
            },
            {
              key: "price",
              dataIndex: "price",
              title: <span className="font-battambang">តម្លៃ</span>,
              render: (value) => (
                <span className="text-blue-600 font-semibold">
                  ${parseFloat(value || 0).toFixed(2)}
                </span>
              ),
            },
            {
              key: "qty",
              dataIndex: "qty",
              title: <span className="font-battambang">បរិមាណ</span>,
              render: (value) => (
                <span className="font-battambang">{value}</span>
              ),
            },
            {
              key: "discount",
              dataIndex: "discount",
              title: <span className="font-battambang">បញ្ចុះតម្លៃ</span>,
              render: (value) => (
                <span className="text-orange-500 font-semibold">{value}%</span>
              ),
            },
            {
              key: "total",
              dataIndex: "total",
              title: <span className="font-battambang">សរុប</span>,
              render: (value) => (
                <span className="text-green-600 font-bold">
                  ${parseFloat(value || 0).toFixed(2)}
                </span>
              ),
            },
          ]}
          summary={() => (
            <Table.Summary.Row className="bg-gray-50">
              <Table.Summary.Cell colSpan={6} className="text-right">
                <span className="font-battambang font-semibold text-slate-700">
                  សរុបទាំងអស់
                </span>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <span className="text-green-600 font-bold">
                  ${grandTotal.toFixed(2)}
                </span>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Modal>

      {/* Main Table */}
      <div className="bg-white p-3 rounded-md">
        <Table
          size="small"
          bordered
          rowKey="id"
          dataSource={state.list}
          loading={state.loading}
          columns={[
            {
              key: "customer_name",
              dataIndex: "customer_name",
              title: <span className="font-battambang">អតិថិជន</span>,
              sorter: (a, b) =>
                (a.customer_name || "").localeCompare(b.customer_name || "-"),
            },
            {
              key: "user_name",
              dataIndex: "user_name",
              title: <span className="font-battambang">អ្នកលក់</span>,
              sorter: (a, b) =>
                (a.user_name || "").localeCompare(b.user_name || ""),
            },
            {
              key: "order_num",
              dataIndex: "order_num",
              title: <span className="font-battambang">លេខបញ្ជា</span>,
              sorter: (a, b) =>
                (a.order_num || "").localeCompare(b.order_num || ""),
            },
            {
              key: "paid_amount",
              dataIndex: "paid_amount",
              title: <span className="font-battambang">ចំនួនទូទាត់</span>,
              render: (value) => (
                <span className="text-green-600 font-semibold">
                  ${parseFloat(value || 0).toFixed(2)}
                </span>
              ),
              sorter: (a, b) => a.paid_amount - b.paid_amount,
            },
            {
              key: "payment_method",
              dataIndex: "payment_method",
              title: <span className="font-battambang">វិធីទូទាត់</span>,
              sorter: (a, b) =>
                (a.payment_method || "").localeCompare(b.payment_method || ""),
            },
            {
              key: "remark",
              dataIndex: "remark",
              title: <span className="font-battambang">កត់សម្គាល់</span>,
              render: (value) => value || "—",
              sorter: (a, b) => (a.remark || "").localeCompare(b.remark || ""),
            },
            {
              key: "create_by",
              dataIndex: "create_by",
              title: <span className="font-battambang">បង្កើតដោយ</span>,
              render: (val) => (
                <Tag color="geekblue" className="font-battambang">
                  {val}
                </Tag>
              ),
              sorter: (a, b) =>
                (a.create_by || "").localeCompare(b.create_by || ""),
            },
            {
              key: "created_at",
              dataIndex: "created_at",
              title: <span className="font-battambang">ពេលវេលា</span>,
              render: (value) => formatOrderTime(value),
              sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            },
            {
              title: <span className="font-battambang">សកម្មភាព</span>,
              key: "action",
              render: (item) => (
                <Space size={6}>
                  <Tooltip title="មើលលម្អិត">
                    <Button
                      size="small"
                      icon={<IoEyeSharp size={15} />}
                      onClick={() => handleViewOne(item.id)}
                      className="!bg-green-500 hover:!bg-green-600 !text-white !border-green-500 rounded-md"
                    />
                  </Tooltip>
                  <Tooltip title="Print Invoice">
                    <Button
                      size="small"
                      icon={<FaFileInvoice size={15} />}
                      onClick={() => handleViewOne(item.id)}
                      className="!bg-blue-500 hover:!bg-blue-600 !text-white !border-blue-500 rounded-md"
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

export default OrderPage;
