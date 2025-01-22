import React, { useState, useEffect, useContext } from "react";
import { Form, Col, Input, Select, Row, Avatar } from "antd";
import Prescription from "./prescription";
import { baseImageUrl, glassItemType } from "../../../../utils/constants";
import { AppContext } from "../../../SideNav";
import FrameDetails from "../../../../api/Frame Inventory/FrameDetailApi";

function EyewearInfo({ form, key, onFinish, name }) {
  const [frameData, setFrameData] = useState([]);
  const { user, store } = useContext(AppContext);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [preQuantity, setPrevQuantityValue] = useState(0);
  const [prevInvItem, setPrevInvItem] = useState({});
  const [updatedInventory, setUpdatedInventory] = useState({});
  const [editFormData, setEditFormData] = useState({});

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

  useEffect(() => {
    if (store?.s_id) {
      fetchFrame();
    }
  }, [store?.s_id]);

  const frameOptions = frameData.map((frame) => ({
    value: `${frame.brand}-${frame.shape}-${frame.category}`,
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Avatar
          src={`${baseImageUrl}/${frame.id}-image?${performance.now()}`}
          alt="Frame Image"
        />
        <span>{`${frame.brand}-${frame.shape}-${frame.category}`}</span>
      </div>
    ),
  }));
  const order_item_id = Form.useWatch(["order_items", name, "order_item_id"]);

  useEffect(() => {
    const previousQuantity =
      form.getFieldValue(["order_items", name, "frame", "quantity"]) || 0;

    setPrevQuantityValue(previousQuantity);

    if (frameData && frameData.length > 0) {
      setPrevInvItem(frameData?.[0]);
    }
  }, [order_item_id, frameData]);

  const handleQuantityChange = (newQuantity) => {
    if (frameData?.[0]?.price && frameData?.[0]?.quantity) {
      let heldQuantity = frameData[0].quantity;

      // Calculate the difference in quantity
      const quantityDifference = newQuantity - preQuantity;

      // Adjust the held quantity
      heldQuantity -= quantityDifference;

      // Update the inventory object
      updateInventoryObject(heldQuantity, newQuantity);
    }
  };

  const updateInventoryObject = (updatedQuantity) => {
    const inventoryObject = {
      id: frameData?.[0]?.id || null,
      inv_frame: selectedFrame,
      held_quantity: updatedQuantity,
    };

    setUpdatedInventory(inventoryObject);

    form.setFieldValue(
      ["order_items", name, "updatedInventory"],
      inventoryObject
    );

    // Update the edit form state with the inventory object
    setEditFormData((prevData) => ({
      ...prevData,
      updatedInventory: inventoryObject,
    }));
  };

  const handleFrameSelection = (value) => {
    if (value) {
      const selectframe = frameData.find(
        (frame) => `${frame.brand}-${frame.shape}-${frame.category}` === value
      );
      if (selectframe) {
        setSelectedFrame(selectframe);
        // form.setFieldValue([name, "frame", "price"], selectframe.price);
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
      }
    } else {
      setSelectedFrame(null);
      form.setFieldValue(["order_items", name, "frame", "price"]);
      form.setFieldValue(["order_items", name, "frame", "category"]);
      form.setFieldValue(["order_items", name, "frame", "shape"]);
    }
  };
  return (
    <>
      {/* <Form
        key={key}
        onFinish={onFinish}
        layout="vertical"
        style={{ padding: "0px 20px" }}
        form={form}
      > */}
      <div className="eyewear-info-container" style={{ padding: "0px 10px" }}>
        <Form.Item
          style={{ display: "none" }}
          name={[name, "frame", "quantity"]}
        ></Form.Item>
        <Row gutter={16}>
          {/* Inv Frame */}
          <Col span={8}>
            <Form.Item
              label="Frame from Inventory"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 23 }}
              name={[name, "frame", "inv_frame"]}
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
                  handleQuantityChange(value);
                }}
                placeholder="Select Frame from Inv."
                optionFilterProp="label"
                options={frameOptions}
              />
            </Form.Item>
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
      {/* </Form> */}
    </>
  );
}

export default EyewearInfo;
