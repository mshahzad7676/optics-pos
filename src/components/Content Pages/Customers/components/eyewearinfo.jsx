import React, { useState, useEffect, useContext } from "react";
import { Form, Col, Input, Select, Row, Avatar, Typography } from "antd";
import Prescription from "./prescription";
import { baseImageUrl, glassItemType } from "../../../../utils/constants";
import { AppContext } from "../../../SideNav";
import FrameDetails from "../../../../api/Frame Inventory/FrameDetailApi";

function EyewearInfo({ form, key, onFinish, name, orderItem }) {
  const { user, store } = useContext(AppContext);
  const [frameData, setFrameData] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(undefined);
  const [preQuantity, setPrevQuantityValue] = useState(0);
  const [updatedInventory, setUpdatedInventory] = useState({});
  const [prevInvItem, setPrevInvItem] = useState({});
  const [editFormData, setEditFormData] = useState({});

  // console.log(preQuantity, "inv");
  const order_item_id = Form.useWatch(["order_items", name, "order_item_id"]);
  const frameQuantity = Form.useWatch([
    "order_items",
    name,
    "frame",
    "quantity",
  ]);

  useEffect(() => {
    async function fetchFrame(searchTerm, searchCategory, searchShape) {
      try {
        const frames = await FrameDetails.fetchFrame("", "", "", store.s_id);

        if (frames) {
          setFrameData(frames);
        } else {
          setFrameData([]);
        }
      } catch (error) {
        console.error("Failed to fetch Frames:", error);
        setFrameData([]);
      }
    }

    if (store?.s_id) {
      fetchFrame();
    }
  }, [store?.s_id]);

  useEffect(() => {
    const originalInventoryItem = form.getFieldValue([
      "order_items",
      name,
      "originalFrameInventoryItem",
    ]);

    async function fetchFrame(searchTerm, searchCategory, searchShape) {
      try {
        const filter = {
          brand: selectedFrame?.brand,
          shape: selectedFrame?.shape,
          category: selectedFrame?.category,
          id: selectedFrame?.id,
        };
        const frames = await FrameDetails.fetchFrame(
          "",
          "",
          "",
          store.s_id,
          filter
        );

        if (frames) {
          // setFrameData(frames);
          if (order_item_id && !Boolean(originalInventoryItem)) {
            const Updatedquantity = frames?.[0]?.quantity + frameQuantity;
            form.setFieldValue(
              ["order_items", name, "originalFrameInventoryItem"],
              {
                ...frames[0],
                quantity: Updatedquantity,
              }
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch Frames:", error);
        // setFrameData([]);
      }
    }
    if (selectedFrame?.id) {
      if (
        originalInventoryItem &&
        order_item_id &&
        selectedFrame?.id === originalInventoryItem.id &&
        selectedFrame?.brand === originalInventoryItem.brand &&
        selectedFrame?.shape === originalInventoryItem.shape &&
        selectedFrame?.category === originalInventoryItem.category
      ) {
        form.setFieldValue(
          ["order_items", name, "frame", "quantity"],
          orderItem?.frame?.quantity
        );
      }
      fetchFrame();
    }
  }, [selectedFrame, order_item_id]);

  // useEffect(() => {
  //   if (store?.s_id) {
  //     fetchFrame();
  //   }
  // }, [store?.s_id]);

  const frameOptions = frameData.map((frame) => ({
    value: `${frame.brand}-${frame.shape}-${frame.category}-${frame.id}`,
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Avatar
          src={`${baseImageUrl}/${frame.id}-image?${performance.now()}`}
          alt="Frame Image"
        />
        <span>{`${frame.brand}-${frame.shape}-${frame.category}-${frame.id}`}</span>
      </div>
    ),
  }));

  // const initialFrame = Form.useWatch([
  //   "order_items",
  //   name,
  //   "frame",
  //   "inv_type",
  // ]);

  // useEffect(() => {
  //   if (initialFrame !== selectedFrame) {
  //     setSelectedFrame(initialFrame);
  //   }
  // }, [initialFrame]);

  useEffect(() => {
    const previousQuantity =
      form.getFieldValue(["order_items", name, "frame", "quantity"]) || 0;

    setPrevQuantityValue(previousQuantity);

    if (frameData && frameData.length > 0) {
      setPrevInvItem(frameData?.[0]);
    }
  }, [order_item_id, frameData]);

  const handleFieldChange = (field, value) => {
    setEditFormData((prevData) => ({
      ...prevData,
      [field]: value,
      preQuantity: 0,
    }));
    if (field === "inv_frame") {
      form.setFieldValue(["order_items", name, "frame", "quantity"], 0);
      setPrevQuantityValue(0);
    }
  };

  const handleFrameSelection = (value) => {
    if (value) {
      const selectframe = frameData.find(
        (frame) =>
          `${frame.brand}-${frame.shape}-${frame.category}-${frame.id}` ===
          value
      );

      if (selectframe) {
        const updatedQuantity = selectframe.quantity - 1;
        const enterQuantity = 1;

        form.setFieldValue(
          ["order_items", name, "frame", "quantity"],
          enterQuantity
        );
        form.setFieldValue(
          ["order_items", name, "frame", "id"],
          selectframe.id
        );
        form.setFieldValue(
          ["order_items", name, "frame", "price"],
          selectframe.price
        );
        form.setFieldValue(
          ["order_items", name, "frame", "category"],
          selectframe.category
        );
        form.setFieldValue(
          ["order_items", name, "frame", "shape"],
          selectframe.shape
        );
        form.setFieldValue(
          ["order_items", name, "frame", "brand"],
          selectframe.shape
        );

        updateInventoryObject(selectframe, updatedQuantity);
        setSelectedFrame(selectframe);
        handleFieldChange("quantity", enterQuantity);
      }
    } else {
      form.setFieldValue(["order_items", name, "frame", "id"], null);
      form.setFieldValue(["order_items", name, "frame", "quantity"], null);
      form.setFieldValue(["order_items", name, "frame", "price"], null);
      form.setFieldValue(["order_items", name, "frame", "category"], null);
      form.setFieldValue(["order_items", name, "frame", "shape"], null);
      form.setFieldValue(["order_items", name, "frame", "brand"], null);

      updateInventoryObject(null, null);
      setSelectedFrame(null);
    }
  };

  const updateInventoryObject = (frame, updatedQuantity) => {
    const inventoryObject = frame
      ? {
          id: frame.id,
          brand: frame.brand,
          shape: frame.shape,
          category: frame.category,
          quantity: updatedQuantity,
        }
      : null;

    setUpdatedInventory(inventoryObject);

    form.setFieldValue(
      ["order_items", name, "updatedframeInventory"],
      inventoryObject
    );

    // Update the edit form state with the inventory object
    setEditFormData((prevData) => ({
      ...prevData,
      updatedInventory: inventoryObject,
    }));

    // console.log("Updated Inventory Object:", inventoryObject);
  };

  const orderFrame = form.getFieldValue(["order_items", name, "frame"]);

  useEffect(() => {
    if (orderFrame?.id && frameData.length) {
      // console.log("orderItem?.order_item_id", orderFrame);
      handleFrameSelection(orderFrame.inv_frame);
    }
  }, [orderFrame?.id, frameData]);

  return (
    <>
      <div className="eyewear-info-container" style={{ padding: "0px 10px" }}>
        <Form.Item
          style={{ display: "none" }}
          name={[name, "frame", "quantity"]}
        ></Form.Item>
        <Form.Item
          style={{ display: "none" }}
          name={[name, "frame", "id"]}
        ></Form.Item>
        <Row gutter={16}>
          {/* Inv Frame */}
          <Col span={8}>
            <Form.Item
              label="Frame from Inventory"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 23 }}
              name={[name, "frame", "inv_frame"]}
              style={{ marginBottom: 0 }}
            >
              <Select
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.value ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                // onChange={handleFrameSelection}
                onChange={(value) => {
                  handleFrameSelection(value);
                  handleFieldChange("inv_type", value);
                }}
                placeholder="Select Frame from Inv."
                optionFilterProp="label"
                options={frameOptions}
              />
            </Form.Item>
            <Typography.Text style={{ fontSize: "12px" }}>
              <strong>Held Quantity: </strong>
              {selectedFrame?.quantity}
            </Typography.Text>
            <Typography.Text style={{ fontSize: "12px" }}>
              <strong> Left Quantity: </strong>
              {updatedInventory?.quantity}
            </Typography.Text>
          </Col>

          <Row gutter={16}>
            {/* Frame Type */}
            {!selectedFrame && (
              <Col span={5}>
                <Form.Item
                  label="Frame Category"
                  name={[name, "frame", "category"]}
                  // rules={[
                  //   { required: true, message: "Please Select the Frame Type" },
                  // ]}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 23 }}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="Select Frame Type"
                    optionFilterProp="label"
                    defaultValue={"Unisex"}
                    options={[
                      { value: "Female", label: "Female" },
                      { value: "Male", label: "Male" },
                      { value: "Unisex", label: "Unisex" },
                    ]}
                  />
                </Form.Item>
              </Col>
            )}
            {/* Frame Shape */}
            {!selectedFrame && (
              <Col span={5}>
                <Form.Item
                  label="Frame Shape"
                  name={[name, "frame", "shape"]}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 23 }}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please Select the Frame Shape",
                  //   },
                  // ]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="Select Frame Shape"
                    optionFilterProp="label"
                    options={[
                      { value: "Square", label: "Square" },
                      { value: "Cat Eye", label: "Cat Eye" },
                      { value: "Rectangle", label: "Rectangle" },
                    ]}
                  />
                </Form.Item>
              </Col>
            )}

            {/* Frame Comments */}
            <Col span={7}>
              <Form.Item
                label="Comments"
                name={[name, "frame", "comment"]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 23 }}
              >
                <Input placeholder="Brand Name, Job No." />
              </Form.Item>
            </Col>

            {/* Frame Price */}
            <Col span={5}>
              <Form.Item
                label="Frame Price"
                name={[name, "frame", "price"]}
                rules={[
                  { required: true, message: "Please Enter Frame Price" },
                ]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input placeholder="Rs. 404" />
              </Form.Item>
            </Col>
          </Row>
        </Row>

        <Row gutter={16}>
          {/* Lens Category */}
          <Col span={6}>
            <Form.Item
              label="Lens Category"
              name={[name, "lens", "lcategory"]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 23 }}
            >
              <Select
                showSearch
                placeholder="Select Lens Category"
                optionFilterProp="label"
                options={[
                  { value: "Single Vision", label: "Single Vision" },
                  { value: "Bifocal Lens", label: "Bifocal Lens" },
                  { value: "Progressive Lens", label: "Progressive Lens" },
                  { value: "High Index", label: "High Index" },
                ]}
              />
            </Form.Item>
          </Col>

          {/* Lens Type */}
          <Col span={6}>
            <Form.Item
              label="Lens Type"
              name={[name, "lens", "type"]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 23 }}
            >
              <Select
                showSearch
                placeholder="Select Lens Type"
                optionFilterProp="label"
                options={glassItemType}
              />
            </Form.Item>
          </Col>

          {/* Lens Comments */}
          <Col span={6}>
            <Form.Item
              label="Comments"
              name={[name, "lens", "comment"]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 23 }}
            >
              <Input placeholder="Brand Name" />
            </Form.Item>
          </Col>

          {/* Lens Price */}
          <Col span={6}>
            <Form.Item
              label="Lens Price"
              name={[name, "lens", "price"]}
              // rules={[{ required: true, message: "Please Enter Lense Price" }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 23 }}
            >
              <Input placeholder="Rs. 404" />
            </Form.Item>
          </Col>
        </Row>
        {/* Prescription Component */}
        <Prescription form={form} name={name} />
      </div>
    </>
  );
}

export default EyewearInfo;
