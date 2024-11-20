// import { useLocation } from "react-router-dom";
// import { Breadcrumb } from "antd";
// import {
//   HomeOutlined,
//   UserOutlined,
//   DatabaseOutlined,
//   ShoppingCartOutlined,
//   EyeOutlined,
//   PlusOutlined,
//   OrderedListOutlined,
//   BarChartOutlined,
//   EditOutlined,
// } from "@ant-design/icons";

// function DynamicBreadcrumb() {
//   const location = useLocation();
//   const pathSnippets = location.pathname.split("/").filter((i) => i); // Split the pathname

//   const routes = [
//     {
//       path: "/customers",
//       label: "Customers",
//       icon: <UserOutlined />,
//     },
//     {
//       path: "/inventory",
//       label: "Inventory",
//       icon: <DatabaseOutlined />,
//     },
//     {
//       path: "/estore",
//       label: "E-Store",
//       icon: <ShoppingCartOutlined />,
//     },
//     {
//       path: "/view-visited-history",
//       label: "Visited History",
//       icon: <EyeOutlined />,
//     },
//     {
//       path: "/addvisitcustomer",
//       label: "Add Visit",
//       icon: <PlusOutlined />,
//     },
//     {
//       path: "/editvisitcustomer",
//       label: "Edit Visit",
//       icon: <EditOutlined />,
//     },
//     {
//       path: "/orderdetails",
//       label: "Order Details",
//       icon: <OrderedListOutlined />,
//     },

//     {
//       path: "/sales",
//       label: "Sales",
//       icon: <BarChartOutlined />,
//     },
//   ];

//   const breadcrumbItems = [
//     {
//       href: "/",
//       title: <HomeOutlined />,
//     },
//     ...pathSnippets.map((_, index) => {
//       const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
//       const route = routes.find((r) => r.path === url); // Find corresponding route
//       return {
//         href: url,
//         title: (
//           <>
//             {route?.icon}
//             <span>{route?.label}</span>
//           </>
//         ),
//       };
//     }),
//   ];

//   return <Breadcrumb items={breadcrumbItems} />;
// }
// export default DynamicBreadcrumb;
