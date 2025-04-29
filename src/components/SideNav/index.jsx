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
  UserOutlined,
  DatabaseOutlined,
  SettingOutlined,
  LogoutOutlined,
  BarChartOutlined,
  AppstoreAddOutlined,
  SwitcherOutlined,
  ShopOutlined,
  ShoppingOutlined,
  StockOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Avatar, Dropdown } from "antd";
import { List, Popup, Collapse } from "antd-mobile";
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
import ViewItemDetails from "../Content Pages/Inventory/components/Glasses Inventory/ViewItemDetails";
import Employee from "../Content Pages/Employees";
import MemberApi from "../../api/Member/MemberApi";
import MemberStores from "../Content Pages/Employees/Member Stores";
import CreateStore from "../Content Pages/E-Store/Modal/createStoreModal";
import OrderTransactions from "../Content Pages/Billing";
import InventoryFilter from "../Content Pages/Inventory/components/Glasses Inventory/inventoryFilter";
import AddVisitWholeSale from "../Content Pages/Customers/components/addVisitWholeSale";
import Wholesalers from "../Content Pages/Wholesale";
import { Footer } from "antd/es/layout/layout";
import { computeHeadingLevel } from "@testing-library/react";
import PricingList from "../Content Pages/Inventory/components/Pricing List";

const { Panel } = Collapse;
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
        console.error("No user Found. Redirecting to login.");
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

  //Mobile View
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [visible, setVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState("/store/:s_id");
  const [expandedMenu, setExpandedMenu] = useState(null);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuClick = (key, parentKey = null) => {
    if (key === expandedMenu) {
      setExpandedMenu(null);
    } else if (menuItems.find((item) => item.key === key && item.children)) {
      setExpandedMenu(key);
    } else {
      setActiveMenu(key);
      setVisible(false);

      // Keep parent expanded if it's a submenu item
      if (parentKey) {
        setExpandedMenu(parentKey);
      }

      navigate(key);
    }
  };

  const menuItems = [
    // { key: "Dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    {
      key: "/store/:s_id",
      label: "Customers",
      icon: <UserOutlined />,
      component: <Customers />,
    },
    {
      key: "/sales",
      label: "Sales",
      icon: <BarChartOutlined />,
      component: <Sales />,
    },
    {
      key: "inv",
      label: "Inventory",
      icon: <DatabaseOutlined />,
      children: [
        {
          key: "/frames",
          label: "Frames",
          component: <FramesInventory></FramesInventory>,
        },
        {
          key: "/glasses",
          label: "Glasses",
          component: <GlassesInventory></GlassesInventory>,
        },
        {
          key: "/inventory-filter",
          label: "Inventory Filter",
          component: <InventoryFilter></InventoryFilter>,
        },
      ],
    },
    {
      key: "/estore",
      label: "E-Store",
      icon: <ShoppingOutlined />,
      component: <Estore></Estore>,
    },
    {
      key: "/employee",
      label: "Members",
      icon: <UserOutlined />,
      component: <Employee></Employee>,
    },
    {
      key: "/billing",
      label: "Billing",
      icon: <StockOutlined />,
      component: <OrderTransactions></OrderTransactions>,
    },
    {
      key: "/wholesale",
      label: "Wholesalers",
      icon: <AppstoreAddOutlined />,
      component: <Wholesalers></Wholesalers>,
    },
  ];

  const hideLayoutPaths = ["/memberstores"];
  const isLayoutHidden = hideLayoutPaths.includes(location.pathname);

  const isHistoryPage = location.pathname.startsWith("/view-visited-history/");
  const isRetailOrderPage = location.pathname.startsWith("/retail/customer/");
  const isWholesaleOrderPage = location.pathname.startsWith(
    "/wholesale/customer/"
  );
  const isOrderDetailPage = location.pathname.startsWith("/orderdetails/");
  const isaddItemsDetailsPage =
    location.pathname.startsWith("/addItemsDetails/");
  const isviewItemsDetailsPage =
    location.pathname.startsWith("/viewItemsDetails/");

  const isviewItemsPriceDetails =
    location.pathname.startsWith("/addItemsPrice/");

  useEffect(() => {
    if (
      !isHistoryPage &&
      !isRetailOrderPage &&
      !isWholesaleOrderPage &&
      !isOrderDetailPage &&
      !isaddItemsDetailsPage &&
      !isviewItemsDetailsPage &&
      !isviewItemsPriceDetails
    ) {
      // Default menu when returning
      setActiveMenu(`${activeMenu}`);
    }
  }, [location.pathname]);

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
      {isMobileView ? (
        <div style={{ padding: "5px" }}>
          {/* Top Bar with Menu Icon */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // background: "#1890ff",
              background: "#001529",
              padding: "10px",
              color: "white",
              borderRadius: "8px",
              marginBottom: 0,
            }}
          >
            <Button
              type="text"
              icon={
                <MenuFoldOutlined
                  style={{ fontSize: "20px", color: "white" }}
                />
              }
              onClick={() => setVisible(true)}
            />
            <h2 style={{ margin: 0 }}>MAYAAR TECH</h2>
            <div></div> {/* Placeholder for right-aligned items if needed */}
          </div>
          {/* Sidebar Drawer */}
          <div>
            <Popup
              visible={visible}
              onMaskClick={() => setVisible(false)}
              position="left"
              // bodyStyle={{ width: "75vw", background: "#f0f2f5" }}
              bodyStyle={{
                width: "80vw",
                display: "flex",
                flexDirection: "column",
                height: "100vh",
              }}
            >
              {/* Profile Section */}
              <div
                style={{
                  // display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  // background: "#1890ff",
                  background: "#001529",
                  padding: "15px",
                  height: 100,
                }}
              >
                <Avatar size={60} src="https://i.pravatar.cc/150?img=3" />
                <Dropdown
                  arrow
                  menu={{
                    items: storeOptions,
                  }}
                >
                  <div
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ color: "#ffff" }}>
                      {user?.user_metadata.name || user?.email}
                    </h3>
                    <h3>
                      <DownOutlined
                        style={{ color: "#ffff", marginLeft: "5px" }}
                      />
                    </h3>
                  </div>
                </Dropdown>
              </div>

              {/* Navigation List */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                <List style={{ margin: 0 }}>
                  {menuItems.map((item) => (
                    <React.Fragment key={item.key}>
                      <List.Item
                        prefix={item.icon}
                        arrow={
                          item.key === "inv" ? (
                            expandedMenu === "inv" ? (
                              <UpOutlined />
                            ) : (
                              <DownOutlined />
                            )
                          ) : (
                            false
                          )
                        }
                        onClick={() =>
                          item.children
                            ? setExpandedMenu(
                                expandedMenu === item.key ? null : item.key
                              )
                            : handleMenuClick(item.key)
                        }
                        style={{
                          backgroundColor:
                            activeMenu === item.key ? "#e6f7ff" : "",
                          fontWeight:
                            activeMenu === item.key ? "bold" : "normal",
                        }}
                      >
                        {item.label}
                      </List.Item>

                      {/* Render Submenu when expanded */}
                      {item.children && expandedMenu === item.key && (
                        <List
                          style={{
                            paddingLeft: 20,
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          {item.children.map((subItem) => (
                            <List.Item
                              key={subItem.key}
                              arrow={false}
                              onClick={() =>
                                handleMenuClick(subItem.key, item.key)
                              }
                              style={{
                                backgroundColor:
                                  activeMenu === subItem.key ? "#e6f7ff" : "",
                                fontWeight:
                                  activeMenu === subItem.key
                                    ? "bold"
                                    : "normal",
                              }}
                            >
                              {subItem.label}
                            </List.Item>
                          ))}
                        </List>
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </div>

              {/* Footer Section */}
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f5f5f5",
                  position: "sticky",
                  bottom: 0,
                  zIndex: 999,
                }}
              >
                {/* <Dropdown arrow menu={{ items: settingMenu }} placement="top"> */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    height: 30,
                  }}
                  onClick={onLogout}
                >
                  <LogoutOutlined style={{ marginRight: 8 }} />
                  <span>Logout</span>
                </div>
                {/* </Dropdown> */}
              </div>
            </Popup>
          </div>
          {/* Content */}
          <div
            style={{
              padding: "20px",
              minHeight: "82dvh",
            }}
          >
            {/* {menuItems.find((item) => item.key === activeMenu)?.component} */}
            {!isHistoryPage &&
              !isRetailOrderPage &&
              !isWholesaleOrderPage &&
              !isOrderDetailPage &&
              !isaddItemsDetailsPage &&
              !isviewItemsDetailsPage &&
              !isviewItemsPriceDetails && (
                <>
                  {
                    menuItems
                      .flatMap((item) =>
                        item.children ? [item, ...item.children] : [item]
                      )
                      .find((item) => item.key === activeMenu)?.component
                  }
                </>
              )}
            <Routes>
              <Route
                path="/view-visited-history/:customerId"
                element={<ViewVisitedHistory></ViewVisitedHistory>}
              />
              <Route
                path="/retail/customer/:customer_id/order/:order_id?"
                element={<Addvisitcustomer></Addvisitcustomer>}
              ></Route>
              <Route
                path="/wholesale/customer/:customer_id/order/:order_id?"
                element={<AddVisitWholeSale></AddVisitWholeSale>}
              ></Route>
              <Route
                path="/orderdetails/:order_id"
                element={<OrderDetails></OrderDetails>}
              ></Route>
              <Route
                path="/addItemsDetails/:glass_type_id/:glass_type"
                element={<AddItemDetails></AddItemDetails>}
              ></Route>
              <Route
                path="/addItemsPrice/:glass_type_id/:glass_type"
                element={<PricingList />}
              />
              <Route
                path="/viewItemsDetails/:glass_type_id/:glass_type"
                element={<ViewItemDetails store={store}></ViewItemDetails>}
              ></Route>
            </Routes>
          </div>
          <Footer style={{ paddingBottom: 10, textAlign: "center" }}>
            Design ©{new Date().getFullYear()} Created by MAYAAR TECH
          </Footer>
        </div>
      ) : (
        <>
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
                      to="/"
                    >
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
                    <Menu.Item key="3-3">
                      <Link to="/inventoryfilter">Inventory Filter</Link>
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
                  <Menu.Item key="7" icon={<AppstoreAddOutlined />}>
                    <Link to="/wholesale">Wholesalers</Link>
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
                        collapsed ? (
                          <MenuUnfoldOutlined />
                        ) : (
                          <MenuFoldOutlined />
                        )
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
                    <Route
                      path="/inventoryfilter"
                      element={<InventoryFilter />}
                    />

                    {/* <Route path="/contactlense" element={<ContactLenseInventory />} /> */}
                    <Route path="/estore" element={<Estore />} />
                    <Route
                      path="/employee"
                      element={<Employee></Employee>}
                    ></Route>
                    <Route path="/sales" element={<Sales />}></Route>
                    <Route path="/profile" element={<Profile></Profile>} />
                    <Route
                      path="/billing"
                      element={<OrderTransactions></OrderTransactions>}
                    />
                    <Route
                      path="/wholesale"
                      element={<Wholesalers></Wholesalers>}
                    ></Route>
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
                      path="/retail/Customer/:customer_id/order/:order_id?"
                      element={<Addvisitcustomer></Addvisitcustomer>}
                    ></Route>
                    <Route
                      path="/wholesale/customer/:customer_id/order/:order_id?"
                      element={<AddVisitWholeSale></AddVisitWholeSale>}
                    ></Route>

                    {/* <Route
                  path="/editvisitcustomer/:order_id"
                  element={<Addvisitcustomer></Addvisitcustomer>}
                ></Route> */}
                    <Route
                      path="/orderdetails/:order_id"
                      element={<OrderDetails></OrderDetails>}
                    ></Route>
                    {/* <Route
                  path="/orderdetails/:order_id"
                  element={<OrderDetails></OrderDetails>}
                ></Route> */}
                    <Route
                      path="/addItemsDetails/:glass_type_id/:glass_type"
                      element={<AddItemDetails></AddItemDetails>}
                    ></Route>

                    <Route
                      path="/addItemsPrice/:glass_type_id/:glass_type"
                      element={<PricingList />}
                    />
                    <Route
                      path="/viewItemsDetails/:glass_type_id/:glass_type"
                      element={
                        <ViewItemDetails store={store}></ViewItemDetails>
                      }
                    ></Route>
                  </Routes>
                </Content>
                <Footer style={{ paddingBottom: 10, textAlign: "center" }}>
                  Design ©{new Date().getFullYear()} Created by MAYAAR TECH
                </Footer>
              </Layout>
            </Layout>
          )}
        </>
      )}
    </AppContext.Provider>
    // </Router>
  );
}

export default MainPage;
