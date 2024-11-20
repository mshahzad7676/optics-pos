const order = {
  totalItems: 10,
  totalPrice: 1000,
  customerId: 2,

  orderItems: [
    {
      category: "eye_wear",
      frame: {
        type: "rimless",
        shape: "square",
        price: 1000,
        comments: "Rayban",
      },
      lense: {
        type: "blue-cut",
        category: "single-vision",
        price: 1000,
        comment: "",
      },
      prescription: {
        right_eye_sph: 0.0,
        right_eye_cyl: 0.0,
        right_eye_axis: 0.0,
        left_eye_sph: 0.0,
        left_eye_cyl: 0.0,
        left_eye_axis: 0.0,
        addition: 0.0,
        pupillary_distance: 0,
      },
    },
  ],
};

const order_items = [
  {
    category: "eye_wear",
    frame: {
      shape: "Square",
      comments: "Rayban",
      price: "1000",
    },
    manualPrescription: {
      right: {
        sph: "-0.50",
        cyl: "-1.00",
        axis: "2.00",
      },
      left: {
        sph: "-1.25",
        cyl: "-1.50",
        axis: "4.00",
      },
      addition: "+1.50",
      pd: 26,
      uploadPres: {
        urlPres: {
          url: "----------",
        },
      },
    },
    lens: {
      category: "Single Vision",
      type: "EyeTech",
      comment: "ORB",
      price: "1500",
    },
  },
];

{
  /* <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <>
              <Descriptions bordered items={[
                { label: "Frame Type", children: record.frame || "N/A" },
                { label: "Lens Type", children: record.lens || "N/A" },
                { label: "Manual Prescription", children: record.manualPrescription || "N/A" },
              ]} column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }} style={{ marginTop: 15 }} />
            </>
          ),
        }}
        dataSource={orderData.map((order) => ({
          key: order.order_id,
          order_id: order.order_id,
          category: order.order_items?.category || "N/A",
          price: "Rs. 5000", // Replace with actual price field
          ...order.order_items?.order_item_object,
        }))}
      /> */
}
