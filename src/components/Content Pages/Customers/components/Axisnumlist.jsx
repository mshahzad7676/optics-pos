import React, { useState, useEffect } from "react";
import { Select } from "antd";

function AxisNumberSelector({ id, value = "0.00", onChange }) {
  const [options, setOptions] = useState([]);

  // Function to generate numbers from -25.00 to 25.00 with 0.25 steps
  const generateOptions = () => {
    const tempOptions = [];
    for (let i = 0.0; i <= 180.0; i += 1.0) {
      tempOptions.push({
        value: i.toFixed(2),
        label: i.toFixed(2),
      });
    }
    return tempOptions;
  };

  useEffect(() => {
    const generatedOptions = generateOptions();
    setOptions(generatedOptions); // Set the generated options in state
  }, []);

  return (
    <Select
      showSearch
      style={{
        width: 100,
      }}
      placeholder="Select Number"
      optionFilterProp="label"
      // defaultValue="0.00"
      value={value}
      options={options}
      onChange={(value) => onChange(value)}
    />
  );
}

export default AxisNumberSelector;
