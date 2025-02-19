import React, { useState, useEffect } from "react";
import { PlusSquareTwoTone } from "@ant-design/icons";
import { Table, Button } from "antd";
import WholesaleApi from "../../../../api/wholesaleApi";

function WholesaleTable({ data }) {
  const columns = [
    {
      title: "Store ID",
      dataIndex: "s_id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Category",
      dataIndex: "type",
    },
    {
      title: "Place",
      dataIndex: "city",
    },

    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {/* View Frame */}
          <Button color="primary" variant="filled" size="small">
            <PlusSquareTwoTone twoToneColor="#52c41a" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="middle"
      />
    </>
  );
}
export default WholesaleTable;
