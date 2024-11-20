// import React from "react";
// import { Typography, Descriptions, Table } from "antd";
// import { Color } from "antd/es/color-picker";
// const { Text } = Typography;

// const borderedItems = [
//   {
//     label: "User ID",
//     children: "1",
//   },
//   {
//     label: "Customer item",
//     children: "Jim Green",
//   },
//   {
//     label: "Phone No.",
//     children: "+9200000000",
//   },
// ];

// const columns = [
//   {
//     title: "Item",
//     dataIndex: "item",
//   },
//   {
//     title: "Detail",
//     dataIndex: "detail",
//   },
//   {
//     title: "Price",
//     dataIndex: "price",
//   },
// ];

// const dataSource = [
//   {
//     key: "1",
//     item: "Order Category",
//     detail: "EyeWear",
//   },
//   {
//     key: "2",
//     item: "Frame Type",
//     detail: "Rimless",
//     price: 2000,
//   },
//   {
//     key: "3",
//     item: "Frame Comment",
//     detail: "Rayban",
//   },
//   {
//     key: "4",
//     item: "Lens Type",
//     detail: "BC",
//     price: 3000,
//   },
//   {
//     key: "5",
//     item: "Lens Comment",
//     detail: "EyeTech",
//   },
// ];

// function OrderViewDetails() {
//   return (
//     <>
//       <Typography.Title
//         level={2}
//         style={{
//           fontWeight: "bold",
//           fontSize: 20,
//           marginBottom: 20,
//         }}
//       >
//         Customer Info.
//       </Typography.Title>
//       <Descriptions
//         bordered
//         items={borderedItems}
//         column={{
//           xs: 1,
//           sm: 2,
//           md: 3,
//           lg: 3,
//           xl: 4,
//           xxl: 4,
//         }}
//       />
//       <Typography.Title
//         level={2}
//         style={{
//           fontWeight: "bold",
//           fontSize: 20,
//           marginTop: 25,
//         }}
//       >
//         Order Details
//       </Typography.Title>
//       <Table
//         bordered
//         columns={columns}
//         dataSource={dataSource}
//         pagination={false}
//         summary={(pageData) => {
//           let totalPayment = 0;
//           pageData.forEach(({ price }) => {
//             if (price) {
//               totalPayment += price;
//             }
//           });
//           return (
//             <>
//               <Table.Summary.Row>
//                 <Table.Summary.Cell index={0} />
//                 <Table.Summary.Cell index={1}>Total</Table.Summary.Cell>
//                 <Table.Summary.Cell style={{ background: "#ffcccc" }} index={2}>
//                   <Text>{totalPayment}</Text>
//                 </Table.Summary.Cell>
//               </Table.Summary.Row>
//             </>
//           );
//         }}
//       />
//     </>
//   );
// }

// export default OrderViewDetails;
