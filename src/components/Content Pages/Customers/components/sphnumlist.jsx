import React, { useState, useEffect } from "react";
import { Select } from "antd";

export function SphNumberSelector({ id, value = "", onChange }) {
  const [options, setOptions] = useState([]);

  // Function to generate numbers from -25.00 to 25.00 with 0.25 steps
  const generateOptions = () => {
    const tempOptions = [];
    for (let i = -25.0; i <= 25.0; i += 0.25) {
      const formattedValue = i > 0 ? `+${i.toFixed(2)}` : i.toFixed(2);
      tempOptions.push({
        value: formattedValue,
        label: formattedValue,
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
      allowClear
      showSearch
      // style={{
      //   width: "auto",
      // }}
      placeholder={!value ? "Sph." : undefined}
      optionFilterProp="label"
      value={value || undefined}
      options={options}
      onChange={(value) => onChange(value)}
    />
  );
}

export default SphNumberSelector;
