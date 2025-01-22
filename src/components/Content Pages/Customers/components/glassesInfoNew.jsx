import React, { useState, useEffect, useContext } from "react";
import { Form, Col, Input, Select, Row, Typography, Flex, Button } from "antd";
import { PlusSquareTwoTone } from "@ant-design/icons";

import { glassMinusRange } from "../../../../utils/constants";
import AdditemDetail from "../../../../api/Glasses Inventory/AdditemDetail";
import SphNumberSelector from "./sphnumlist";
import CylNumberSelector from "./Cylnumlist";
import AddtitionNumList from "./Additionnumlist";
import WholeSaleInputs from "./wholesaleInputs";
import GlassTypeApi from "../../../../api/Glasses Inventory/GlassTypeApi";
import { AppContext } from "../../../SideNav";

function GlassesInfoNew({ form, key, onFinish, name, glassTypes }) {
  const [selectedLensType, setSelectedLensType] = useState(undefined);
  const [selectedLensRange, setSelectedLensRange] = useState(undefined);
  const [itemData, setItemData] = useState([]);
  const [sphList, setSphList] = useState([]);
  const [cylList, setCylList] = useState([]);
  const [addList, setAddList] = useState([]);
  const [itemQuantityMap, setItemQuantityMap] = useState({});
  const [updatedInventory, setUpdatedInventory] = useState({});
  const [hover, setHover] = useState(false);

  // console.log(glassTypes, "updatedInventory");

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
        <Form form={form} onFinish={onFinish}>
          <Form.List name="order_items">
            {(orderItems, { add, remove }) => (
              <>
                <WholeSaleInputs
                  form={form}
                  name={name}
                  glassTypes={glassTypes}
                ></WholeSaleInputs>
                <Flex justify="center">
                  <Button
                    variant="filled"
                    size="middle"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={() => add({ category: "Glasses Inventory" })}
                    style={{
                      color: "#52c41a",
                      border: 0,
                      marginTop: 20,
                      backgroundColor: hover
                        ? "rgb(82 196 26 / 0.25)"
                        : "rgb(82 196 26 / 0.15)",
                    }}
                  >
                    <PlusSquareTwoTone twoToneColor="#52c41a" /> Add Item
                  </Button>
                </Flex>
              </>
            )}
          </Form.List>
        </Form>
      </div>
    </>
  );
}

export default GlassesInfoNew;
