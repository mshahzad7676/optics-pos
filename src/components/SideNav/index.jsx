import { Link } from "react-router-dom";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DatabaseOutlined,
  SettingOutlined,
  LogoutOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Avatar, Dropdown } from "antd";

import Estore from "../Content Pages/E-Store";
import Customers from "../Content Pages/Customers";
import ViewVisitedHistory from "../Content Pages/Customers/Page/Visit History";
import Addvisitcustomer from "../Content Pages/Customers/components/addvisit";
import Sales from "../Content Pages/Sales";
import MenuItem from "antd/es/menu/MenuItem";
import OrderDetails from "../Content Pages/Sales/Page/Order Details";
import { createContext } from "react";
import UserApi from "../../api/UserApi";
import StoreApi from "../../api/StoreApi";
import Profile from "../../Auth/Profile";
import Setting from "../../Auth/Setting";

import FramesInventory from "../Content Pages/Inventory/components/Frames Inventory";
import GlassesInventory from "../Content Pages/Inventory/components/Glasses Inventory";
import AddItemDetails from "../Content Pages/Inventory/components/Glasses Inventory/addItemsDetails";
import ViewItemDetails from "../Content Pages/Inventory/components/Glasses Inventory/Minus Ranges/ViewItemDetails";
import Employee from "../Content Pages/Employees";

const { Header, Sider, Content } = Layout;

export const AppContext = createContext({
  user: undefined,
  store: undefined,
});

function MainPage({ onLogout, password, setPassword }) {
  const [user, setUser] = useState();
  const [store, setStore] = useState();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  // fetchUser
  // on success fetchStore
  // on failure redirect to signin
  const handlefetchUserAndStore = async () => {
    try {
      const authUser = await UserApi.fetchUser();
      console.log(authUser, "userhandle");
      if (authUser) {
        setUser(authUser);
      } else {
        // If no user data is returned, navigate to signup
        console.error("No user found. Redirecting to login.");
        navigate("/login");
      }

      const userStore = await StoreApi.fetchStore(authUser.id);
      // console.log(userStore, "storehandle");
      if (userStore) {
        setStore(userStore.store);
      }
    } catch (error) {
      console.error("Unexpected error in fetchUserAndStore:", error.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    handlefetchUserAndStore();
  }, []);

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSetting = () => {
    navigate("/setting");
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: "1",
          icon: <UserOutlined />,
          label: "Profile",
          onClick: handleProfile,
        },
        {
          key: "2",
          icon: <SettingOutlined />,
          label: "Settings",
          onClick: handleSetting,
        },
        {
          key: "3",
          icon: <LogoutOutlined />,
          label: "Logout",
          onClick: onLogout,
        },
      ]}
    />
  );

  return (
    // <Router>
    <AppContext.Provider
      value={{
        user: user,
        store: store,
      }}
    >
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div
            className="demo-logo-vertical"
            style={{
              height: "49px",
              margin: "16px",
              borderRadius: "0px",
              borderBottom: "solid hsla(0, 0%, 100%, .1)",
              borderBottomWidth: "1px",
              overflow: "hidden",
              letterSpacing: "3px",
              textAlign: "center",
              fontSize: "20px",
              lineHeight: "30px",
            }}
          >
            <h1
              style={{
                margin: "0",
              }}
            >
              <Link
                style={{
                  color: "white",
                }}
                to="#"
              >
                {" "}
                MAYAAR
              </Link>
            </h1>
          </div>

          {/* Menu with routing links */}
          <Menu
            mode="inline"
            defaultOpenKeys={["3"]}
            defaultSelectedKeys={["1"]}
            theme="dark"
          >
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/">Customers</Link>
            </Menu.Item>
            <MenuItem key="2" icon={<BarChartOutlined />}>
              <Link to="/sales">Sales</Link>
            </MenuItem>
            <Menu.SubMenu
              key="3"
              icon={<DatabaseOutlined />}
              defaultSelectedKeys={[3 - 1]}
              title="Inventory"
            >
              <Menu.Item key="3-1">
                <Link to="/frames">Frames</Link>
              </Menu.Item>
              <Menu.Item key="3-2">
                <Link to="/glasses">Glasses</Link>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="4" icon={<ShoppingCartOutlined />}>
              <Link to="/estore">E-Store</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<UserOutlined />}>
              <Link to="/employee">Users</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              {/* Profile section with dropdown */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "16px",
                }}
              >
                <Dropdown overlay={userMenu} placement="bottomRight">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Avatar
                      size="large"
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#87d068", marginRight: "8px" }}
                    />
                    {/* <span style={{ marginRight: "12px" }}>John Doe</span>
                     */}
                    <span style={{ marginRight: "12px" }}>
                      {/* {user?.email || "Guest"} */}
                      {user?.user_metadata.name || user?.email}
                    </span>
                  </div>
                </Dropdown>
              </div>
            </div>
          </Header>
          {/* <NavHeader></NavHeader> */}
          <div style={{ padding: "20px 0px 0px 20px" }}>
            {/* <Dynam></Dynam icBreadcrumb> */}
          </div>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: "100vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Define routes for your components */}
            <Routes>
              <Route path="/" element={<Customers />} />
              <Route path="/frames" element={<FramesInventory />} />
              <Route path="/glasses" element={<GlassesInventory />} />
              {/* <Route path="/contactlense" element={<ContactLenseInventory />} /> */}
              <Route path="/estore" element={<Estore />} />
              <Route path="/employee" element={<Employee></Employee>}></Route>
              <Route path="/sales" element={<Sales />}></Route>
              <Route path="/profile" element={<Profile></Profile>} />
              <Route
                path="/setting"
                element={
                  <Setting
                    password={password}
                    setPassword={setPassword}
                  ></Setting>
                }
              />
              <Route
                path="/view-visited-history/:customerId"
                element={<ViewVisitedHistory></ViewVisitedHistory>}
              />
              {/* <Route
                  path="/view-visited-history/:name"
                  element={<ViewVisitedHistory></ViewVisitedHistory>}
                /> */}
              <Route
                path="/customer/:customer_id/order/:order_id?"
                element={<Addvisitcustomer></Addvisitcustomer>}
              ></Route>
              {/* <Route
                  path="/editvisitcustomer/:order_id"
                  element={<Addvisitcustomer></Addvisitcustomer>}
                ></Route> */}
              <Route
                path="/orderdetails/:order_id"
                element={<OrderDetails></OrderDetails>}
              ></Route>
              <Route
                path="/orderdetails"
                element={<OrderDetails></OrderDetails>}
              ></Route>
              <Route
                path="/addItemsDetails/:glass_type_id"
                element={<AddItemDetails></AddItemDetails>}
              ></Route>
              <Route
                path="/viewItemsDetails/:glass_type_id"
                element={<ViewItemDetails></ViewItemDetails>}
              ></Route>
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </AppContext.Provider>
    // </Router>
  );
}

export default MainPage;
