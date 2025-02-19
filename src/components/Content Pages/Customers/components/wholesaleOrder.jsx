import React, { useEffect, useState } from "react";
import { Form, Card, Flex, Button } from "antd";
import { PlusSquareTwoTone } from "@ant-design/icons";

import WholeSaleRow from "./wholesaleRow";

function WholeSaleOrder({ form, onFinish }) {
  const order_items = form.getFieldValue("order_items");

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
