import React from "react";
import {
  Form,
  Col,
  Row,
  Button,
  Typography,
  Radio,
  Upload,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CylNumberSelector from "./Cylnumlist";
import AxisNumberSelector from "./Axisnumlist";
import SphNumberSelector from "./sphnumlist";
import AddtitionNumList from "./Additionnumlist";
const options = [
  {
    label: "Enter Your Prescription",
    value: "manualPrescription",
  },
  {
    label: "Upload Your Card",
    value: "uploadPrescription",
  },
];

function Prescription({ name, form }) {
  const selectedPresType = Form.useWatch(
    ["order_items", name, "prescriptionType"],
    form
  );
  // const [selectedPres, setSelectedPres] = useState({});
  // const [radioOption, setRadioOption] = useState("");

  // const handleRadioChange = (e) => {
  //   const selectedValue = e.target.value;
  //   setSelectedPres(selectedValue);
  //   setRadioOption((prevData) => ({
  //     ...prevData,
  //     radiotype: selectedValue,
  //   }));
  //   console.log(selectedValue);
  // };
  return (
    <>
      {/* Radio Buttons */}
      <Row
        style={{
          padding: "20px 0px",
        }}
      >
        <Form.Item name={[name, "prescriptionType"]}>
          <Radio.Group
            // onChange={handleRadioChange}
            options={options}
            defaultValue={selectedPresType}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
      </Row>
      {/* Prescription Fields */}
      {selectedPresType === "manualPrescription" && (
        <>
          {/* Right Eye */}
          <Typography.Title
            level={4}
            style={{
              fontWeight: "bold",
              fontSize: 16,
              marginTop: 30,
            }}
          >
            Right Eye
          </Typography.Title>
          <Row gutter={12}>
            <Col span={2.5}>
              <Form.Item
                label="SPH"
                name={[name, "manualPrescription", "right", "sph"]}
                // rules={[
                //   { required: true, message: "Please Select the Right SPH" },
                // ]}
              >
                <SphNumberSelector></SphNumberSelector>
              </Form.Item>
            </Col>
            <Col span={2.5}>
              <Form.Item
                label="CYL"
                name={[name, "manualPrescription", "right", "cyl"]}
                // rules={[
                //   { required: true, message: "Please Select the Right CYL" },
                // ]}
              >
                <CylNumberSelector></CylNumberSelector>
              </Form.Item>
            </Col>
            <Col span={2.5}>
              <Form.Item
                label="Axis"
                name={[name, "manualPrescription", "right", "axis"]}
                // rules={[
                //   { required: true, message: "Please Select the Right Axis" },
                // ]}
              >
                <AxisNumberSelector></AxisNumberSelector>
              </Form.Item>
            </Col>
          </Row>
          {/* Left Eye */}
          <Typography.Title
            level={4}
            style={{
              fontWeight: "bold",
              fontSize: 16,
              marginTop: 0,
              paddingRight: 12,
            }}
          >
            Left Eye
          </Typography.Title>
          <Row gutter={12}>
            <Col span={2.5}>
              <Form.Item
                label="SPH"
                name={[name, "manualPrescription", "left", "sph"]}
                // rules={[
                //   { required: true, message: "Please Select the Left SPH" },
                // ]}
              >
                <SphNumberSelector></SphNumberSelector>
              </Form.Item>
            </Col>
            <Col span={2.5}>
              <Form.Item
                label="CYL"
                name={[name, "manualPrescription", "left", "cyl"]}
                // rules={[
                //   { required: true, message: "Please Select the Left CYL" },
                // ]}
              >
                <CylNumberSelector></CylNumberSelector>
              </Form.Item>
            </Col>
            <Col span={2.5}>
              <Form.Item
                label="Axis"
                name={[name, "manualPrescription", "left", "axis"]}
                // rules={[
                //   { required: true, message: "Please Select the Left Axis" },
                // ]}
              >
                <AxisNumberSelector></AxisNumberSelector>
              </Form.Item>
            </Col>
          </Row>
          {/* Addition */}
          <Row gutter={12}>
            <Typography.Title
              level={4}
              style={{
                fontWeight: "bold",
                fontSize: 16,
                paddingRight: 12,
                marginTop: 0,
              }}
            >
              Addition
            </Typography.Title>
            <Col span={2.5}>
              <Form.Item
                name={[name, "manualPrescription", "addition"]}
                // rules={[
                //   { required: true, message: "Please Select the Addition" },
                // ]}
              >
                <AddtitionNumList></AddtitionNumList>
              </Form.Item>
            </Col>
          </Row>
          {/* PD */}
          <Row gutter={12}>
            <Typography.Title
              level={4}
              style={{
                fontWeight: "bold",
                fontSize: 16,
                paddingRight: 12,
                marginTop: 0,
              }}
            >
              Pupillary Distance (PD)
            </Typography.Title>
            <Col span={2.5}>
              <Form.Item name={[name, "manualPrescription", "pd"]}>
                <InputNumber
                  min={1}
                  max={100}
                  defaultValue={0}
                  addonAfter="mm"
                  style={{
                    width: 150,
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
      {/* Upload Prescription */}
      {selectedPresType === "uploadPrescription" && (
        <>
          <Row gutter={12}>
            <Col span={5}>
              <Form.Item
                label="Upload Prescription"
                name={[name, "uploadPrescription", "presurl"]}
                labelCol={{
                  style: { fontWeight: "bold", fontSize: 20 },
                }}
              >
                <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default Prescription;
