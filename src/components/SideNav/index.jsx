import { Link, useLocation } from "react-router-dom";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DatabaseOutlined,
  SettingOutlined,
  LogoutOutlined,
  BarChartOutlined,
  SwitcherTwoTone,
  SwitcherOutlined,
  ShopOutlined,
  ShoppingOutlined,
  StockOutlined,
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
import MemberApi from "../../api/Member/MemberApi";
import MemberStores from "../Content Pages/Employees/Member Stores";
import CreateStore from "../Content Pages/E-Store/Modal/createStoreModal";
import OrderTranscations from "../Content Pages/Billing";

const { Header, Sider, Content } = Layout;

export const AppContext = createContext({
  user: undefined,
  store: undefined,
  member: undefined,
  storesList: [],
});

function MainPage({ onLogout, password, setPassword }) {
  const [user, setUser] = useState();
  const [store, setStore] = useState();
  const [member, setMember] = useState();
  const [memberRecord, setMemberRecord] = useState([]);
  const [storesList, setStoresList] = useState([]);
  const [isstoreModal, setStoreModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hidebutton, setHideButton] = useState();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const showModal = () => {
    setStoreModal(true);
  };

  // fetchUser
  // on success fetchStore
  // on failure redirect to signin
  const handlefetchUserAndStore = async () => {
    try {
      const authUser = await UserApi.fetchUser();
      // console.log(authUser, "userhandle");
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

      const storeMember = await MemberApi.fetchallMembers(authUser.id);
      if (storeMember) {
        setMemberRecord(storeMember.memberRecord);
      }
    } catch (error) {
      console.error("Unexpected error in fetchUserAndStore:", error.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    handlefetchUserAndStore();
  }, []);

  useEffect(() => {
    const stores = [];
    memberRecord?.forEach((record) => {
      stores.push({
        name: record?.e_store?.name || "Unknown Store",
        role: record?.roles || "Unknown Role",
        s_id: record?.s_id,
        u_id: record?.e_store?.u_id,
      });
    });
    setStoresList(stores);
  }, [memberRecord]);

  const displayBtn = useMemo(() => {
    return (
      storesList.filter(
        (store) => store.u_id === user.id && store.role === "Admin"
      )?.length < 1
    );
  }, [storesList, user]);

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSetting = () => {
    navigate("/setting");
  };

  const switchStore = (s_id) => {
    // console.log(`Switched to ${storeName}`);
    navigate(`/store/${s_id}`);
  };

  //generate store options
  const storeOptions =
    storesList.length > 0
      ? storesList.map((store, index) => ({
          key: `3-${index + 1}`,
          label: `${store.name} (${store.role})`,
          onClick: () => switchStore(store.s_id),
        }))
      : [
          {
            key: "3-0",
            label: "No Store Found",
            disabled: true,
          },
        ];

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
          icon: <SwitcherOutlined />,
          label: "Switch Store",
          children: storeOptions,
        },
        {
          key: "4",
          icon: <LogoutOutlined />,
          label: "Logout",
          onClick: onLogout,
        },
      ]}
    />
  );

  const hideLayoutPaths = ["/memberstores"];
  const isLayoutHidden = hideLayoutPaths.includes(location.pathname);

  return (
    // <Router>
    <AppContext.Provider
      value={{
        user: user,
        store: store,
        member: member,
        storesList,
      }}
    >
      {isLayoutHidden ? (
        // Render only the content for hidden layout paths
        <Routes>
          <Route path="/memberstores" element={<MemberStores />} />
        </Routes>
      ) : (
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
                <Link to="/store/:s_id">Customers</Link>
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
              <Menu.Item key="4" icon={<ShoppingOutlined />}>
                <Link to="/estore">E-Store</Link>
              </Menu.Item>
              <Menu.Item key="5" icon={<UserOutlined />}>
                <Link to="/employee">Members</Link>
              </Menu.Item>
              <Menu.Item key="6" icon={<StockOutlined />}>
                <Link to="/billing">Billing</Link>
              </Menu.Item>
            </Menu>

            {displayBtn && (
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <button
                  style={{
                    width: "90%",
                    padding: "10px",
                    margin: "0 auto",
                    border: "none",
                    borderRadius: "4px",
                    backgroundColor: "#1677ff",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={showModal}
                >
                  <ShopOutlined></ShopOutlined> Create Store
                </button>
              </div>
            )}
          </Sider>
          <CreateStore
            open={isstoreModal}
            onModalClose={() => setStoreModal(false)}
          ></CreateStore>

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
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
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
                        style={{
                          backgroundColor: "#87d068",
                          marginRight: "8px",
                        }}
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
                minHeight: "80vh",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {/* Define routes for your components */}
              <Routes>
                <Route path="/store/:s_id" element={<Customers />} />
                <Route path="/frames" element={<FramesInventory />} />
                <Route path="/glasses" element={<GlassesInventory />} />
                {/* <Route path="/contactlense" element={<ContactLenseInventory />} /> */}
                <Route path="/estore" element={<Estore />} />
                <Route path="/employee" element={<Employee></Employee>}></Route>
                <Route path="/sales" element={<Sales />}></Route>
                <Route path="/profile" element={<Profile></Profile>} />
                <Route
                  path="/billing"
                  element={<OrderTranscations></OrderTranscations>}
                />
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
                  path="/addItemsDetails/:glass_type_id/:glass_type"
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
      )}
    </AppContext.Provider>
    // </Router>
  );
}

export default MainPage;
