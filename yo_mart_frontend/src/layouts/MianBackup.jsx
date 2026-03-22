import { useEffect, useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Input, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import {
  MdCategory,
  MdOutlineMarkEmailUnread,
  MdProductionQuantityLimits,
} from "react-icons/md";
import logo from "../../assets/image/logo.png";
import users from "../../assets/image/user.jpg";
import { getProfile, setAcccessToken, setProfile } from "../../store/profile";

const { Content, Sider } = Layout;

const items = [
  {
    key: "",
    label: "ផ្ទាំងគ្រប់គ្រង",
    icon: <PieChartOutlined />,
  },
  {
    key: "pos",
    label: "POS",
    icon: <DesktopOutlined />,
  },
  {
    key: "customer",
    label: "ផ្ទាំងអតិថិជន",
    icon: <TeamOutlined />,
  },
  {
    key: "employees",
    label: "ផ្ទាំងបុគ្គលិក",
    icon: <TeamOutlined />,
  },
  {
    key: "product",
    label: "ផលិតផល",
    icon: <MdProductionQuantityLimits />,
    children: [
      {
        key: "product_detail",
        label: "ផលិតផលលម្អិត",
        icon: <MdProductionQuantityLimits />,
      },
      {
        key: "category",
        label: "ប្រភេទផលិតផល",
        icon: <MdCategory />,
      },
    ],
  },
  {
    key: "order",
    label: "ការបញ្ជាទិញ",
    icon: <UserOutlined />,
  },
  {
    key: "expanse",
    label: "ការចំណាយ",
    icon: <PieChartOutlined />,
  },
  {
    key: "user",
    label: "User",
    icon: <UserOutlined />,
    children: [
      {
        key: "user",
        label: "User",
        icon: <SmileOutlined />,
      },
      {
        key: "role",
        label: "Role",
        icon: <DesktopOutlined />,
      },
      {
        key: "role_permission",
        label: "Role Permission",
        icon: <FileOutlined />,
      },
    ],
  },
  {
    key: "Setting",
    label: "Setting",
    icon: <PieChartOutlined />,
    children: [
      {
        key: "Currency",
        label: "Currency",
        icon: <FileOutlined />,
      },
      {
        key: "language",
        label: "Language",
        icon: <DesktopOutlined />,
      },
    ],
  },
];

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const profile = getProfile();

  const onClickMenu = (item) => {
    setSelectedKey(item.key);
    navigate(item.key);
  };

  const itemsDropdown = [
    {
      key: "1",
      label: (
        <a target="_blank" rel="noopener noreferrer" href="/">
          Profile
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a target="_blank" rel="noopener noreferrer" href="/">
          Change Password
        </a>
      ),
      icon: <SmileOutlined />,
      disabled: true,
    },
    {
      key: "logout",
      danger: true,
      label: "Logout",
    },
  ];

  useEffect(() => {
    if (!profile) {
      navigate("/login");
    }
  }, []);

  const onLoginOut = () => {
    setProfile("");
    setAcccessToken("");
    navigate("/login");
  };

  if (!profile) {
    navigate("/login");
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />

        <Menu
          className="font-battambang text-lg font-light"
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items}
          onClick={onClickMenu}
        />
      </Sider>
      <Layout>
        <div className="bg-white h-20 flex justify-between px-2.5 py-1.5 items-center">
          <div className="flex">
            <div className="w-20">
              <img className="w-full" src={logo} alt="Logo" />
            </div>
            <div>
              <div className="text-lg font-bold">Coffee</div>
              <div>Home</div>
            </div>
            <div>
              <Input.Search
                className="ml-4 mt-2.5 w-44"
                size="large"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="flex items-center">
            <IoIosNotifications className="text-2xl mr-3.5" />
            <MdOutlineMarkEmailUnread className="text-2xl mr-3.5" />
            <div>
              <div className="text-base font-bold">{profile?.name}</div>
              <div>Sale</div>
            </div>
            <Dropdown
              menu={{
                items: itemsDropdown,
                onClick: (event) => {
                  if (event.key === "logout") {
                    onLoginOut();
                  }
                },
              }}
            >
              <div className="w-10">
                <img
                  className="w-full rounded-full cursor-pointer"
                  src={users}
                  alt="User"
                />
              </div>
            </Dropdown>
          </div>
        </div>
        <Content className="m-2.5">
          <div
            className="p-4 h-[calc(100vh-110px)] overflow-y-scroll"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
