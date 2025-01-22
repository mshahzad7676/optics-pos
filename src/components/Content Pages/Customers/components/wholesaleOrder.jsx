import React, { useEffect, useState } from "react";
import { Form, Card, Flex, Button } from "antd";
import { PlusSquareTwoTone } from "@ant-design/icons";

import WholeSaleRow from "./wholesaleRow";

function WholeSaleOrder({ form, onFinish }) {
  const [rows, setRows] = useState([{}]);
  const [hover, setHover] = useState(false);

  // add New Row
  const addRow = () => {
    form
      .validateFields()
      .then(() => {
        setRows([...rows, {}]);
      })
      .catch((err) => {
        console.log("Please fill all fields before adding a new row:", err);
      });
  };

  // del selected row
  const removeRow = (index) => {
    if (rows.length > 1) {
      const updatedRows = [...rows];
      updatedRows.splice(index, 1);
      setRows(updatedRows);
    }
  };

  const order_items = form.getFieldValue("order_items");

  // useEffect(() => {
  //   if (order_items?.length) {
  //     setRows(Array(order_items.length).fill({}));
  //     order_items.forEach((item, index) => {
  //       form.setFieldValue(
  //         ["order_items", index, "order_item_id"],
  //         item.order_item_id
  //       );
  //     });
  //   }
  // }, [order_items]);

  return (
    <>
      <Card
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}
        title="Order Item"
      >
        {/* <Form
          onFinish={onFinish}
          form={form}
          layout="vertical"
          initialValues={{ order_items: [] }}
        >
          {rows.map((_, index) => (
            <WholeSaleRow
              index={index}
              order_items={order_items}
              addRow={addRow}
              form={form}
              removeRow={removeRow}
            ></WholeSaleRow>
          ))}
        </Form> */}
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{ order_items: [{ category: "Glasses" }] }}
        >
          <Form.List name="order_items">
            {(orderItems, { add, remove }) => (
              <>
                {orderItems.map((orderItem, index) => (
                  // <Flex key={index} align="center" style={{ marginBottom: 10 }}>
                  <WholeSaleRow
                    onDelete={() => remove(index)}
                    addRow={() => add({ category: "Glasses" })}
                    form={form}
                    key={index}
                    name={orderItem.name}
                    orderItem={order_items?.[index]}
                    onChange={(data) => {
                      const updatedItems = [...orderItems];
                      updatedItems[index] = {
                        ...updatedItems[index],
                        ...data,
                      };
                    }}
                  />
                  // <Button
                  //   variant="filled"
                  //   size="middle"
                  //   onMouseEnter={() => setHover(true)}
                  //   onMouseLeave={() => setHover(false)}
                  //   // onClick={() => add({ category: "Glasses" })}
                  //   style={{
                  //     color: "#52c41a",
                  //     border: 0,
                  //     marginLeft: 10,
                  //     backgroundColor: hover
                  //       ? "rgb(82 196 26 / 0.25)"
                  //       : "rgb(82 196 26 / 0.15)",
                  //   }}
                  //   icon={<PlusSquareTwoTone twoToneColor="#52c41a" />}
                  // ></Button>
                  // </Flex>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Card>
    </>
  );
}
export default WholeSaleOrder;
