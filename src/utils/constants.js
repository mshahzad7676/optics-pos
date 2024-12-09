export const baseImageUrl = `https://jphbwllfvhpwixzpjxnd.supabase.co/storage/v1/object/public/upload`;

export const glassItemType = [
  { label: "HC", value: "HC" },
  { label: "BC", value: "BC" },
];

export const glassMinusRange = [
  { label: "Plain to -2.00 / 2", value: "Plain to -2.00 / 2" },
  { label: "-16.25 to -20.00", value: "-16.25 to -20.00" },
  { label: "-12.25 to -16.00", value: "-12.25 to -16.00" },
  { label: "-10.25 to -12.00", value: "-10.25 to -12.00" },
  { label: "-8.25 to -10.00", value: "-8.25 to -10.00" },
  { label: "-6.25 to -8.00", value: "-6.25 to -8.00" },
  { label: "-4.25 to -6.00", value: "-4.25 to -6.00" },
  { label: "-2.25 to -4.00", value: "-2.25 to -4.00" },
  { label: "Plain to -2.00", value: "Plain to -2.00" },
  { label: "All", value: "All" },
  { label: "Plain to +2.00", value: "Plain to +2.00" },
  { label: "+2.25 to +4.00", value: "+2.25 to +4.00" },
  { label: "+4.25 to +6.00", value: "+4.25 to +6.00" },
  { label: "+6.25 to +8.00", value: "+6.25 to +8.00" },
  { label: "+8.25 to +10.00", value: "+8.25 to +10.00" },
  { label: "+10.25 to +12.00", value: "+10.25 to +12.00" },
  { label: "+12.25 to +16.00", value: "+12.25 to +16.00" },
  { label: "+16.25 to +20.00", value: "+16.25 to +20.00" },
  { label: "+1.00 to +3.00 Add +1.00", value: "+1.00 to +3.00 Add +1.00" },
];

const glassRangeAdd = [];

// function createCustomRanges() {
//   const range = [];

//   // First group: 0.00 to -2.00 (step size of 2.00)
//   let firstGroup = [];
//   for (let i = 0.0; i >= -2.0; i -= 0.25) {
//     firstGroup.push(i.toFixed(2));
//   }
//   range.push({
//     label: `${firstGroup[0]} to ${firstGroup[firstGroup.length - 1]}`,
//     value: `${firstGroup[0]} to ${firstGroup[firstGroup.length - 1]}`,
//   });

//   // Second group: -2.25 to 4.00 (step size of 2.25)
//   let secondGroup = [];
//   for (let i = -2.25; i >= -4.0; i -= 0.25) {
//     secondGroup.push(i.toFixed(2));
//   }
//   range.push({
//     label: `${secondGroup[0]} to ${secondGroup[secondGroup.length - 1]}`,
//     value: `${secondGroup[0]} to ${secondGroup[secondGroup.length - 1]}`,
//   });

//   // Third group: -18.00 to -20.00 (step size of 0.25)
//   let thirdGroup = [];
//   for (let i = -18.0; i >= -20.0; i -= 0.25) {
//     thirdGroup.push(i.toFixed(2));
//   }
//   range.push({
//     label: `${thirdGroup[0]} to ${thirdGroup[thirdGroup.length - 1]}`,
//     value: `${thirdGroup[0]} to ${thirdGroup[thirdGroup.length - 1]}`,
//   });

//   return range;
// }

// export const rangeData = createCustomRanges();
// console.log(rangeData);
