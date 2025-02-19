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

function WholeSaleRow({ key, orderItem, addRow, name, form, onDelete }) {
  const [selectedLensType, setSelectedLensType] = useState(undefined);
  const [selectedSph, setSelectedSph] = useState(undefined);
  const [selectedCyl, setSelectedCyl] = useState(undefined);
  const [selectedAdd, setSelectedAdd] = useState(undefined);
  const [preQuantity, setPrevQuantityValue] = useState(0);
  const [itemData, setItemData] = useState([]);
  const [updatedInventory, setUpdatedInventory] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [prevInvItem, setPrevInvItem] = useState({});

  // console.log(editFormData, "updated");

  // fetch item Details from inventory
  useEffect(() => {
    const originalInventoryItem = form.getFieldValue([
      "order_items",
      name,
      "originalInventoryItem",
    ]);

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
        // if (success) {
        //   setItemData(data);
        //   // match selectedType, selectedSql etc
        //   // if matched, set originalInventoryItem in form
        // } else {
        //   setItemData([]);
        // }
        if (success) {
          setItemData(data);
          // Match selectedLensType, selectedSph, selectedCyl, selectedAdd with data
          if (orderItem?.order_item_id && !Boolean(originalInventoryItem)) {
            // const matchedItem = data.find(
            //   (item) =>
            //     item.lensType === selectedLensType &&
            //     item.sph === selectedSph &&
            //     item.cyl === selectedCyl &&
            //     item.addition === selectedAdd
            // );
            const quantity = data[0].held_quantity + orderItem?.glass?.quantity;
            form.setFieldValue(["order_items", name, "originalInventoryItem"], {
              ...data[0],
              held_quantity: quantity,
            });
          }

          // if (matchedItem) {
          //   // Set the matched item as originalInventoryItem in form
          //   form.setFieldsValue({
          //     originalInventoryItem: matchedItem,
          //   });
          // }
        } else {
          setItemData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setItemData([]);
      }
    }

    //if (selectedLensType && (selectedSph || selectedCyl || selectedAdd)) {
    // match selectedType, selectedSql etc
    // if matched, update originalInventoryItem quantity
    // set originalInventroyItem in form
    // fetchData();
    //}
    if (selectedLensType && (selectedSph || selectedCyl || selectedAdd)) {
      // Match selectedType, selectedSph, selectedCyl, and selectedAdd with the fetched itemData
      if (
        originalInventoryItem &&
        orderItem &&
        selectedLensType === originalInventoryItem.glass_type &&
        selectedSph === String(originalInventoryItem.sph) &&
        selectedCyl == originalInventoryItem.cyl &&
        selectedAdd == originalInventoryItem.addition
      ) {
        form.setFieldValue(
          ["order_items", name, "glass", "quantity"],
          orderItem?.glass.quantity
        );
      }

      fetchData();
    }
  }, [selectedLensType, selectedSph, selectedCyl, selectedAdd]);

  const order_item_id = Form.useWatch(["order_items", name, "order_item_id"]);

  const initialLensType = Form.useWatch(["order_items", name, "glass", "type"]);

  const initialSph = Form.useWatch(["order_items", name, "glass", "sph"]);

  const initialCyl = Form.useWatch(["order_items", name, "glass", "cyl"]);

  const initialAdd = Form.useWatch(["order_items", name, "glass", "addition"]);

  useEffect(() => {
    const previousQuantity =
      form.getFieldValue(["order_items", name, "glass", "quantity"]) || 0;

    setPrevQuantityValue(previousQuantity);

    if (itemData && itemData.length > 0) {
      setPrevInvItem(itemData?.[0]);
    }
  }, [order_item_id, itemData]);

  // useEffect(() => {
  //   const previousQuantity =
  //     form.getFieldValue(["order_items", name, "glass", "quantity"]) || 0;
  //   setPrevQuantityValue(previousQuantity);

  //   // setPrevInvItem(itemData?.[0]);
  // }, [order_item_id]);

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

  const handleFieldChange = (field, value) => {
    setEditFormData((prevData) => ({
      ...prevData,
      [field]: value,
      preQuantity: 0,
    }));
    if (field === "sph") {
      form.setFieldValue(["order_items", name, "glass", "quantity"], 0);
      setPrevQuantityValue(0);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (itemData?.[0]?.price && itemData?.[0]?.held_quantity) {
      const unitPrice = itemData[0].price;
      let heldQuantity = itemData[0].held_quantity;

      // Calculate the difference in quantity
      const quantityDifference = newQuantity - preQuantity;

      // Adjust the held quantity
      heldQuantity -= quantityDifference;

      // Calculate the total price
      const totalPrice = newQuantity * unitPrice;

      // Update form fields
      form.setFieldValue(["order_items", name, "glass", "price"], totalPrice);

      // Update the inventory object
      updateInventoryObject(heldQuantity, newQuantity);

      // Update the edit form state
      handleFieldChange("quantity", newQuantity);

      console.log("Previous Quantity:", preQuantity);
      console.log("New Quantity:", newQuantity);
      // console.log("difference:", quantityDifference);
      // console.log("Held Quantity:", heldQuantity);
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

    // Update the edit form state with the inventory object
    setEditFormData((prevData) => ({
      ...prevData,
      updatedInventory: inventoryObject,
    }));
  };

  return (
    <>
      <Row gutter={8}>
        <Col span={4} style={{ display: "none" }}>
          <Form.Item name={[name, "glass", "order_item_id"]}>
            <Input type="hidden" value={orderItem?.glass?.order_item_id} />
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
              // onChange={handleLensTypeChange}
              onChange={(value) => {
                handleLensTypeChange(value);
                handleFieldChange("type", value);
              }}
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
            <SphNumberSelector
              //  onChange={handleLensSphChange}
              onChange={(value) => {
                handleLensSphChange(value);
                handleFieldChange("sph", value);
              }}
            />
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
            <CylNumberSelector
              // onChange={handleLensCylChange}
              onChange={(value) => {
                handleLensCylChange(value);
                handleFieldChange("cyl", value);
              }}
            />
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
            <AddtitionNumList
              // onChange={handleLensAddChange}
              onChange={(value) => {
                handleLensAddChange(value);
                handleFieldChange("addition", value);
              }}
            />
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
