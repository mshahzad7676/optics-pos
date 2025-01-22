import React, { useState, useEffect } from "react";
import { Form, Col, Input, Select, Row, Typography } from "antd";
import { glassMinusRange } from "../../../../utils/constants";
import AdditemDetail from "../../../../api/Glasses Inventory/AdditemDetail";

function GlassesInfo({ form, key, onFinish, name, glassTypes }) {
  const [selectedLensType, setSelectedLensType] = useState(undefined);
  const [selectedLensRange, setSelectedLensRange] = useState(undefined);
  const [itemData, setItemData] = useState([]);
  const [sphList, setSphList] = useState([]);
  const [cylList, setCylList] = useState([]);
  const [addList, setAddList] = useState([]);
  const [itemQuantityMap, setItemQuantityMap] = useState({});
  const [updatedInventory, setUpdatedInventory] = useState({});
  // console.log(updatedInventory, "updatedInventory");

  useEffect(() => {
    async function fetchData() {
      try {
        const filter = {
          lensType: selectedLensType,
          lensRange: selectedLensRange,
        };
        const { success, data } = await AdditemDetail.fetchAllDetailsWithtype(
          filter
        );
        if (success) {
          setItemData(data);
          const sphMap = {};
          const cylMap = {};
          const addMap = {};
          const quantityMap = {};
          data.forEach((item) => {
            sphMap[item.sph] = true;
            if (item.cyl !== null) {
              cylMap[item.cyl] = true;
            }
            if (item.addition !== null) {
              addMap[item.addition] = true;
            }
            // quantityMap[`${item.sph}/${item.cyl}/${item.addition}`] =
            //   item.held_quantity;
            quantityMap[`${item.sph}/${item.cyl}/${item.addition}`] = item;
          });
          // console.log(quantityMap);
          setSphList(Object.keys(sphMap));
          setCylList(Object.keys(cylMap));
          setAddList(Object.keys(addMap));
          setItemQuantityMap(quantityMap);
        } else {
          setItemData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setItemData([]);
      }
    }

    if (selectedLensType && selectedLensRange) {
      fetchData();
    }
  }, [selectedLensType, selectedLensRange]);

  const handleLensTypeChange = (value) => {
    setSelectedLensType(value);

    form.setFieldValue(["order_items", name, "glass", "range"], null);
    form.setFieldValue(["order_items", name, "glass", "sph"], null);
    form.setFieldValue(["order_items", name, "glass", "cyl"], null);
    form.setFieldValue(["order_items", name, "glass", "addition"], null);
    form.setFieldValue(["order_items", name, "glass", "quantity"], null);
    form.setFieldValue(["order_items", name, "glass", "price"], null);
  };

  const handleLensRangeChange = (value) => {
    setSelectedLensRange(value);
    form.setFieldValue(["order_items", name, "glass", "sph"], null);
    form.setFieldValue(["order_items", name, "glass", "cyl"], null);
    form.setFieldValue(["order_items", name, "glass", "addition"], null);
    form.setFieldValue(["order_items", name, "glass", "quantity"], null);
  };

  const lensType = Form.useWatch(["order_items", name, "glass", "type"], form);

  const selectedSph = Form.useWatch(
    ["order_items", name, "glass", "sph"],
    form
  );

  const selectedCyl = Form.useWatch(
    ["order_items", name, "glass", "cyl"],
    form
  );

  const selectedAdd = Form.useWatch(
    ["order_items", name, "glass", "addition"],
    form
  );

  useEffect(() => {
    handleLensTypeChange(lensType);
  }, [lensType]);
  // const handleQuantityChange = (e) => {
  //   const quantity = parseFloat(e.target.value) || 0;
  //   const unitPrice = parseFloat(itemData?.[0]?.price) || 0;
  //   const totalPrice = quantity * unitPrice;
  //   form.setFieldValue(["order_items", name, "glass", "price"], totalPrice);

  // };

  const handleQuantityChange = (e) => {
    const quantity = parseFloat(e.target.value) || 0;
    const unitPrice = parseFloat(itemData?.[0]?.price) || 0;
    const totalPrice = quantity * unitPrice;
    form.setFieldValue(["order_items", name, "glass", "price"], totalPrice);

    // Calculate updated quantity
    const totalAvailableQuantity =
      itemQuantityMap[
        `${selectedSph}/${selectedCyl ?? null}/${selectedAdd ?? null}`
      ]?.held_quantity || 0;
    const updatedQuantity = Math.max(totalAvailableQuantity - quantity);
    // console.log(updatedQuantity, "qqq");
    updateInventoryObject(updatedQuantity);
  };

  const updateInventoryObject = (updatedQuantity) => {
    const lensItem =
      itemQuantityMap[
        `${selectedSph}/${selectedCyl ?? null}/${selectedAdd ?? null}`
      ];

    if (lensItem) {
      const inventoryObject = {
        id: lensItem.id,
        glass_type: selectedLensType,
        range: selectedLensRange,
        sph: selectedSph,
        cyl: selectedCyl,
        addition: selectedAdd,
        held_quantity: updatedQuantity,
      };
      setUpdatedInventory(inventoryObject);
      form.setFieldValue(
        ["order_items", name, "updatedInventory"],
        inventoryObject
      );
    }
  };

  return (
    <>
      <div className="eyewear-info-container" style={{ padding: "0px 10px" }}>
        {/* Lens Type */}
        <Col span={6}>
          <Form.Item
            label="Lens Type"
            name={[name, "glass", "type"]}
            rules={[{ required: true, message: "Please Select Lense Type" }]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Select or Add Lens Type"
              optionFilterProp="label"
              options={glassTypes.map((type) => ({
                label: type.name,
                value: type.name,
              }))}
              // onChange={handleLensTypeChange}
            />
          </Form.Item>
        </Col>

        {selectedLensType && (
          <Row gutter={16}>
            {/* Lens Range */}
            <Col span={7}>
              <Form.Item
                label="Lens Range"
                name={[name, "glass", "range"]}
                rules={[
                  { required: true, message: "Please Select Lense Range" },
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Select Lens Range"
                  optionFilterProp="label"
                  options={glassMinusRange}
                  onChange={handleLensRangeChange}
                />
              </Form.Item>
            </Col>

            {/* Sph Number */}
            <Col span={3}>
              <Form.Item
                label="Sph"
                name={[name, "glass", "sph"]}
                rules={[{ required: true, message: "Please Select Sph" }]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Select Sph."
                  optionFilterProp="label"
                  options={sphList.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
              </Form.Item>
            </Col>

            {/* Cyl Number */}
            {cylList.length > 0 && (
              <Col span={3}>
                <Form.Item
                  label="Cyl"
                  name={[name, "glass", "cyl"]}
                  rules={[{ required: true, message: "Please Select Cyl." }]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder="Select Cyl."
                    optionFilterProp="label"
                    options={cylList.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                </Form.Item>
              </Col>
            )}

            {/* Addition Number */}
            {addList.length > 0 && (
              <Col span={3}>
                <Form.Item
                  label="Add"
                  name={[name, "glass", "addition"]}
                  rules={[{ required: true, message: "Please Select Add." }]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder="Select Addition"
                    optionFilterProp="label"
                    options={addList.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                </Form.Item>
              </Col>
            )}

            {/* Lens Quantity */}
            <Col span={4}>
              <Form.Item
                label="Quantity"
                style={{ marginBottom: 0 }}
                name={[name, "glass", "quantity"]}
                rules={[{ required: true, message: "Please Enter Quantity" }]}
              >
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  placeholder="3"
                  suffix="Pair"
                  onChange={handleQuantityChange}
                />
              </Form.Item>
              <Typography.Text style={{ fontSize: "12px" }}>
                <strong>Total Quantity: </strong>
                {itemQuantityMap[
                  `${selectedSph}/${selectedCyl ?? null}/${selectedAdd ?? null}`
                ]?.held_quantity ?? 0}
              </Typography.Text>
            </Col>

            {/* Lens Price */}
            <Col span={4}>
              <Form.Item
                label="Price"
                style={{ marginBottom: 0 }}
                name={[name, "glass", "price"]}
              >
                <Input
                  type="number"
                  min={0}
                  value={itemData?.[0]?.price}
                  placeholder="Rs. 404"
                />
              </Form.Item>
              <Typography.Text style={{ fontSize: "12px" }}>
                <strong>Unit Price: </strong>
                {itemData?.[0]?.price}{" "}
              </Typography.Text>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default GlassesInfo;
