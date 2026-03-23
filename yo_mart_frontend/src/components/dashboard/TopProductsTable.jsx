import { Table } from "antd";
import { FaBox, FaDollarSign, FaShoppingCart } from "react-icons/fa";

const TopProductsTable = ({ data }) => {
  const columns = [
    {
      title: (
        <span className="flex items-center gap-2">
          <FaBox className="text-purple-500" />
          ផលិតផល
        </span>
      ),
      dataIndex: "name",
      key: "name",
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <FaShoppingCart className="text-blue-500" />
          ចំនួនលក់
        </span>
      ),
      dataIndex: "sold",
      key: "sold",
      sorter: (a, b) => a.sold - b.sold,
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <FaDollarSign className="text-green-500" />
          ចំណូល
        </span>
      ),
      dataIndex: "revenue",
      key: "revenue",
      sorter: (a, b) => a.revenue - b.revenue,
      render: (value) => `$${value.toLocaleString()}`,
    },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="mb-4 font-semibold text-gray-700 flex items-center gap-3">
        <span className="p-2 bg-purple-50 text-purple-500 rounded-lg">
          <FaBox />
        </span>
        តារាងផលិតផលលក់ដាច់បំផុត
      </h3>

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record, index) => index}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
        }}
        bordered
        size="middle"
        locale={{
          emptyText: "គ្មានទិន្នន័យ",
        }}
      />
    </div>
  );
};

export default TopProductsTable;
