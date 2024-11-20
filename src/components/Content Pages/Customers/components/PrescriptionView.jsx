import React from "react";
import { Col, Row, Input, Typography } from "antd";

function PrescriptionView({ prescriptionType, orderData }) {
  console.log(prescriptionType, "11");

  const manualPrescriptionView = (
    <div style={{ paddingLeft: 10 }}>
      <h2>Prescription Details</h2>
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
          <Input
            suffix="Sph"
            value={orderData?.right?.sph}
            style={{ width: 100 }}
            readOnly
          />
        </Col>
        <Col span={2.5}>
          <Input
            suffix="Cyl"
            value={orderData?.right?.cyl}
            style={{ width: 100 }}
            readOnly
          />
        </Col>
        <Col span={2.5}>
          <Input
            suffix="Axis"
            value={orderData?.right?.axis}
            style={{ width: 100 }}
            readOnly
          />
        </Col>
      </Row>
      {/* Left Eye */}
      <Typography.Title
        level={4}
        style={{
          fontWeight: "bold",
          fontSize: 16,
          marginTop: 10,
          paddingRight: 12,
        }}
      >
        Left Eye
      </Typography.Title>
      <Row gutter={12} style={{ marginBottom: 15 }}>
        <Col span={2.5}>
          <Input
            suffix="Sph"
            value={orderData?.left?.sph}
            style={{ width: 100 }}
            readOnly
          />
        </Col>
        <Col span={2.5}>
          <Input
            suffix="Cyl"
            value={orderData?.left?.cyl}
            style={{ width: 100 }}
            readOnly
          />
        </Col>
        <Col span={2.5}>
          <Input
            suffix="Axis"
            value={orderData?.left?.axis}
            style={{ width: 100 }}
            readOnly
          />
        </Col>
      </Row>
      {/* Addition */}
      <Row gutter={12} style={{ marginBottom: 10 }}>
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
          <Input value={orderData?.addition} style={{ width: 100 }} readOnly />
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
          <Input
            suffix="mm"
            value={orderData?.pd}
            style={{ width: 100 }}
            readOnly
          />
        </Col>
      </Row>
    </div>
  );

  const uploadPrescription = (
    <div style={{ paddingLeft: 10 }}>
      <h2>Prescription Details</h2>

      <Typography.Title
        level={4}
        style={{
          fontWeight: "bold",
          fontSize: 16,
          marginTop: 30,
        }}
      >
        {/* href={orderData?.uploadPrescriptionLink} */}
        Prescription Link
      </Typography.Title>
    </div>
  );

  if (prescriptionType === "manualPrescription") return manualPrescriptionView;
  else if (prescriptionType === "uploadPrescription") return uploadPrescription;

  return null;
}

export default PrescriptionView;
