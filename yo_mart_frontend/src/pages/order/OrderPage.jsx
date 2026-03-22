import { useEffect, useState } from "react";
import MainPage from "@/layouts/auth/MainPage";
import { Button, message, Modal, Space, Table, Tag, Tooltip } from "antd";
import { request } from "@/store/Configstore.js";
import { IoEyeSharp } from "react-icons/io5";
import dayjs from "dayjs";
import { FaFileInvoice } from "react-icons/fa";

const OrderPage = () => {
  const [state, setState] = useState({
    list: [],
    loading: false,
    modalVisible: false,
    order_view_one: [],
  });

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await request("order", "get");
      if (res && res.getAll) {
        setState((prev) => ({ ...prev, list: res.getAll, loading: false }));
      } else {
        message.warning("No data found.");
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      message.error("Failed to fetch orders. Please try again later.");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleViewOne = async (id) => {
    try {
      const res = await request(`order_detail/${id}`, "get");
      if (res) {
        setState((prev) => ({
          ...prev,
          order_view_one: res.get_one,
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

  const handleRePrintInvoice = () => {};

  return (
    <MainPage loading={state.loading}>
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

      {/* View Detail Modal */}
      <Modal
        open={state.modalVisible}
        onCancel={() => setState((prev) => ({ ...prev, modalVisible: false }))}
        title={<span className="font-battambang">លម្អិតការបញ្ជាទិញ</span>}
        footer={
          <Button
            onClick={() =>
              setState((prev) => ({ ...prev, modalVisible: false }))
            }
            className="font-battambang"
          >
            បិទ
          </Button>
        }
        width={800}
      >
        <div className="bg-white rounded-md">
          <Table
            size="small"
            bordered
            rowKey="order_num"
            dataSource={state.order_view_one}
            pagination={false}
            columns={[
              {
                key: "p_category_name",
                dataIndex: "p_category_name",
                title: <span className="font-battambang">ប្រភេទ</span>,
              },
              {
                key: "user_name",
                dataIndex: "user_name",
                title: <span className="font-battambang">អ្នកប្រើប្រាស់</span>,
              },
              {
                key: "order_num",
                dataIndex: "order_num",
                title: <span className="font-battambang">លេខបញ្ជា</span>,
              },
              {
                key: "paid_amount",
                dataIndex: "paid_amount",
                title: <span className="font-battambang">ចំនួនទូទាត់</span>,
              },
              {
                key: "payment_method",
                dataIndex: "payment_method",
                title: <span className="font-battambang">វិធីទូទាត់</span>,
              },
              {
                key: "remark",
                dataIndex: "remark",
                title: <span className="font-battambang">កត់សម្គាល់</span>,
              },
              {
                key: "created_at",
                dataIndex: "created_at",
                title: <span className="font-battambang">កាលបរិច្ឆេទ</span>,
                render: (val) => dayjs(val).format("YYYY-MM-DD HH:mm:ss"),
              },
            ]}
          />
        </div>
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
            },
            {
              key: "user_name",
              dataIndex: "user_name",
              title: <span className="font-battambang">អ្នកលក់</span>,
            },
            {
              key: "order_num",
              dataIndex: "order_num",
              title: <span className="font-battambang">លេខបញ្ជា</span>,
            },
            {
              key: "paid_amount",
              dataIndex: "paid_amount",
              title: <span className="font-battambang">ចំនួនទូទាត់</span>,
            },
            {
              key: "payment_method",
              dataIndex: "payment_method",
              title: <span className="font-battambang">វិធីទូទាត់</span>,
            },
            {
              key: "remark",
              dataIndex: "remark",
              title: <span className="font-battambang">កត់សម្គាល់</span>,
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
            },
            {
              key: "created_at",
              dataIndex: "created_at",
              title: <span className="font-battambang">ពេលវេលា</span>,
              render: (value) => formatOrderTime(value),
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
                      // className="!bg-green-500 hover:!bg-green-600 !text-white !border-green-500 rounded-md"
                    />
                  </Tooltip>

                  <Tooltip title="Print Invoice">
                    <Button
                      size="small"
                      icon={<FaFileInvoice size={15} />}
                      // onClick={() => handleViewOne(item.id)}
                      // className="!bg-blue-500 hover:!bg-blue-600 !text-white !border-blue-500 rounded-md"
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

export default OrderPage;
