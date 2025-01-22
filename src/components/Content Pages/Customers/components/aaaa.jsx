import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Select,
  InputNumber,
  Input,
  Typography,
} from "antd";
import { DeleteOutlined, PlusSquareTwoTone } from "@ant-design/icons";
import SphNumberSelector from "./sphnumlist";
import CylNumberSelector from "./Cylnumlist";
import AddtitionNumList from "./Additionnumlist";
import { glassItemType } from "../../../../utils/constants";
import AdditemDetail from "../../../../api/Glasses Inventory/AdditemDetail";

function WholeSaleRow({ key, order_items, addRow, name, form, onDelete }) {
  const [selectedLensType, setSelectedLensType] = useState(undefined);
  const [selectedSph, setSelectedSph] = useState(undefined);
  const [selectedCyl, setSelectedCyl] = useState(undefined);
  const [selectedAdd, setSelectedAdd] = useState(undefined);
  const [itemData, setItemData] = useState({});
  const [updatedInventory, setUpdatedInventory] = useState({});

  // console.log(oldPrice, "updated");

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const filter = {
  //         lensType: selectedLensType,
  //         sph: selectedSph,
  //         cyl: selectedCyl,
  //         addition: selectedAdd,
  //         // lensRange: selectedLensRange,
  //       };
  //       const { success, data } = await AdditemDetail.fetchAllDetailsWithtype(
  //         filter
  //       );
  //       if (success) {
  //         setItemData(data);

  //       } else {
  //         setItemData([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setItemData([]);
  //     }
  //   }

  //   if (selectedLensType && (selectedSph || selectedCyl || selectedAdd)) {
  //     fetchData();
  //   }
  // }, [selectedLensType, selectedSph, selectedCyl, selectedAdd]);

  useEffect(() => {
    async function fetchData() {
      try {
        const filter = {
          lensType: selectedLensType,
          sph: selectedSph,
          cyl: selectedCyl,
          addition: selectedAdd,
        };
        const { success, data } = await AdditemDetail.fetchAllDetailsWithtype(
          filter
        );
        if (success && data.length) {
          const invItem = data[0];
          // setCurrentInvItem(invItem.id);
          setItemData((itemData) => {
            return {
              ...itemData,
              [invItem.id]: invItem,
            };
          });
        }
        // else {
        //   setItemData([]);
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
        setItemData([]);
      }
    }

    if (selectedLensType && (selectedSph || selectedCyl || selectedAdd)) {
      // update inv item's held_quantity

      fetchData();
    }
  }, [selectedLensType, selectedSph, selectedCyl, selectedAdd]);

  const initialLensType = Form.useWatch(["order_items", name, "glass", "type"]);

  const initialSph = Form.useWatch(["order_items", name, "glass", "sph"]);

  const initialCyl = Form.useWatch(["order_items", name, "glass", "cyl"]);

  const initialAdd = Form.useWatch(["order_items", name, "glass", "addition"]);

  useEffect(() => {
    if (initialLensType !== selectedLensType) {
      setSelectedLensType(initialLensType);
    }
  }, [initialLensType]);

  useEffect(() => {
    if (initialSph !== selectedSph) {
      setSelectedSph(initialSph);
    }
  }, [initialSph]);

  useEffect(() => {
    if (initialCyl !== selectedCyl) {
      setSelectedCyl(initialCyl);
    }
  }, [initialCyl]);

  useEffect(() => {
    if (initialAdd !== selectedAdd) {
      setSelectedAdd(initialAdd);
    }
  }, [initialAdd]);

  // useEffect(() => {
  //   const initialSph = form.getFieldValue([
  //     "order_items",
  //     name,
  //     "glass",
  //     "sph",
  //   ]);
  //   const initialCyl = form.getFieldValue([
  //     "order_items",
  //     name,
  //     "glass",
  //     "cyl",
  //   ]);
  //   const initialAdd = form.getFieldValue([
  //     "order_items",
  //     name,
  //     "glass",
  //     "addition",
  //   ]);

  //   if (initialLensType) setSelectedLensType(initialLensType);
  //   if (initialSph) setSelectedSph(initialSph);
  //   if (initialCyl) setSelectedCyl(initialCyl);
  //   if (initialAdd) setSelectedAdd(initialAdd);
  // }, []);

  const handleLensTypeChange = (value) => {
    setSelectedLensType(value);
  };
  const handleLensSphChange = (value) => {
    setSelectedSph(value);
  };
  const handleLensCylChange = (value) => {
    setSelectedCyl(value);
  };
  const handleLensAddChange = (value) => {
    setSelectedAdd(value);
  };

  // const handleQuantityChange = (value) => {
  //   if (itemData?.[0]?.price && itemData?.[0]?.held_quantity) {
  //     const unitPrice = itemData[0].price;
  //     const heldQuantity = itemData[0].held_quantity;

  //     // Calculate total price
  //     const totalPrice = value * unitPrice;
  //     form.setFieldValue(["order_items", name, "glass", "price"], totalPrice);

  //     // Calculate updated held quantity
  //     const updatedHeldQuantity = heldQuantity - value;

  //     //inventory object
  //     updateInventoryObject(updatedHeldQuantity, value);
  //   }
  // };

  let previousQuantity = 0; // Initialize to track the previous quantity

  const handleQuantityChange = (newQuantity) => {
    if (itemData?.[0]?.price && itemData?.[0]?.held_quantity) {
      const unitPrice = itemData[0].price;
      let heldQuantity = itemData[0].held_quantity;

      // Calculate the difference in quantity
      const quantityDifference = newQuantity - previousQuantity;

      // Adjust the held quantity
      heldQuantity -= quantityDifference;

      // Calculate the total price
      const totalPrice = newQuantity * unitPrice;

      // Update form fields
      form.setFieldValue(["order_items", name, "glass", "price"], totalPrice);

      // Update the inventory object
      updateInventoryObject(heldQuantity, newQuantity);

      console.log("Previous Quantity:", previousQuantity);
      console.log("New Quantity:", newQuantity);
      console.log("Held Quantity:", heldQuantity);

      // Update the previous quantity to the current one
      previousQuantity = newQuantity;
    }
  };

  const updateInventoryObject = (updatedQuantity) => {
    const inventoryObject = {
      id: itemData?.[0]?.id || null,
      glass_type: selectedLensType,
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
  };

  return (
    <>
      <Row gutter={8}>
        <Col span={4} style={{ display: "none" }}>
          <Form.Item name={[name, "glass", "order_item_id"]}>
            <Input type="hidden" value={order_items?.glass?.order_item_id} />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            label="Lense Type"
            // name="order_items"
            // name={["order_items", index, "glass_type"]}
            name={[name, "glass", "type"]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[{ required: true, message: "Please Select Type" }]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Select Item"
              optionFilterProp="label"
              options={glassItemType}
              onChange={handleLensTypeChange}
            />
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item
            label="Sph"
            // name={["order_items", index, "sph"]}
            name={[name, "glass", "sph"]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <SphNumberSelector onChange={handleLensSphChange} />
          </Form.Item>
        </Col>

        <Col span={3}>
          <Form.Item
            label="Cyl"
            // name={["order_items", index, "cyl"]}
            name={[name, "glass", "cyl"]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <CylNumberSelector onChange={handleLensCylChange} />
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item
            label="Add."
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            // name={["order_items", index, "addition"]}
            name={[name, "glass", "addition"]}
          >
            <AddtitionNumList onChange={handleLensAddChange} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            style={{ margin: 0 }}
            label="Quantity"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            // name={["order_items", index, "quantity"]}
            name={[name, "glass", "quantity"]}
          >
            <InputNumber
              step={0.5}
              placeholder="Enter Quantity"
              style={{ width: "100%" }}
              suffix="Pair"
              onChange={handleQuantityChange}
            />
          </Form.Item>
          <Typography.Text style={{ fontSize: "12px" }}>
            <strong>Held Quantity: </strong>
            {itemData?.[0]?.held_quantity}
          </Typography.Text>
          <Typography.Text style={{ fontSize: "12px" }}>
            <strong> Quantity: </strong>
            {updatedInventory?.held_quantity}
          </Typography.Text>
        </Col>
        <Col span={3}>
          <Form.Item
            label="Price"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            // name={["order_items", index, "price"]}
            name={[name, "glass", "price"]}
            style={{ margin: 0 }}
          >
            <Input placeholder="Enter Price" />
          </Form.Item>
          <Typography.Text style={{ fontSize: "12px" }}>
            <strong>Unit Price: </strong>
            {itemData?.[0]?.price}
          </Typography.Text>
        </Col>
        <Col style={{ marginLeft: 10 }}>
          <Form.Item style={{ marginTop: 40 }}>
            <Button
              color="primary"
              variant="filled"
              onClick={addRow}
              icon={<PlusSquareTwoTone twoToneColor="#52c41a" />}
            ></Button>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item style={{ marginTop: 40 }}>
            <Button
              color="danger"
              variant="filled"
              // onClick={() => removeRow(index)}
              onClick={onDelete}
              icon={<DeleteOutlined />}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
export default WholeSaleRow;
