export const calculateOrderAmount = (orderItems = []) => {
  let totalAmount = 0;

  if (Array.isArray(orderItems)) {
    orderItems.forEach((item) => {
      const framePrice = parseFloat(item.frame?.price) || 0;
      const lensPrice = parseFloat(item.lens?.price) || 0;
      const contactLensPrice = parseFloat(item.contactLense?.price) || 0;
      const glassesPrice = parseFloat(item.glass?.price) || 0;
      const customRightPrice = parseFloat(item.custom?.right?.price) || 0;
      const customLeftPrice = parseFloat(item.custom?.left?.price) || 0;
      const itemPrice = parseFloat(item.price) || 0;

      totalAmount +=
        framePrice +
        lensPrice +
        contactLensPrice +
        glassesPrice +
        customRightPrice +
        customLeftPrice +
        itemPrice;
    });
  }
  return totalAmount;
};
