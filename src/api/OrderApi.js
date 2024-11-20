import BaseApi from "./BaseApi";

class OrderApi extends BaseApi {
  // Method of CreateOrder

  // static async addOrder(payload) {
  //   let totalPrice = 0;

  //   // Calculate total price
  //   if (Array.isArray(payload.order_items)) {
  //     payload.order_items.forEach((item) => {
  //       const framePrice = parseFloat(item.frame?.price) || 0;
  //       const lensPrice = parseFloat(item.lens?.price) || 0;
  //       const contactLensPrice = parseFloat(item.contactLense?.price) || 0;
  //       totalPrice += framePrice + lensPrice + contactLensPrice;
  //     });
  //   }
  //   // console.log("Total Price:", totalPrice);

  //   try {
  //     // Upsert into the orders table and retrieve order ID

  //     const { data, error } = await this.supabase
  //       .from("orders")
  //       .upsert({
  //         order_id: payload.order_id,
  //         c_id: payload.c_id,
  //         s_id: payload.s_id || "",
  //         total_price: totalPrice,
  //         total_items: payload.order_items?.length,
  //       })
  //       .select();

  //     if (error) {
  //       console.error("Error upserting into 'orders':", error);
  //       return;
  //     }

  //     const orderId = data[0]?.order_id;
  //     if (!orderId) {
  //       console.error("Order ID not returned in response.");
  //       return;
  //     }

  //     // Prepare each order item with order_id, category, and order_item_object fields
  //     const orderItemsPayload = payload.order_items.map((item) => ({
  //       order_id: orderId,
  //       category: item.category,
  //       order_item_id: item.order_item_id,
  //       order_item_object: {
  //         frame: item.frame,
  //         lens: item.lens,
  //         contactLense: item.contactLense,
  //         manualPrescription: item.manualPrescription,
  //         prescriptionType: item.prescriptionType,
  //       },
  //     }));

  //     // Upsert mapped order items into `order_items` table
  //     const { data: itemData, error: itemError } = await this.supabase
  //       .from("order_items")
  //       .upsert(orderItemsPayload);

  //     if (itemError) {
  //       console.error("Error upserting into 'order_items':", itemError);
  //       return;
  //     }

  //     console.log("Upsert into 'order_items' response:", itemData);

  //     return { orderData: data, orderItemsData: itemData };
  //   } catch (e) {
  //     console.error("Error creating or updating order:", e);
  //   }
  // }
  static async addOrder(payload) {
    let totalPrice = 0;

    // Calculate total price
    if (Array.isArray(payload.order_items)) {
      payload.order_items.forEach((item) => {
        const framePrice = parseFloat(item.frame?.price) || 0;
        const lensPrice = parseFloat(item.lens?.price) || 0;
        const contactLensPrice = parseFloat(item.contactLense?.price) || 0;
        totalPrice += framePrice + lensPrice + contactLensPrice;
      });
    }

    try {
      // Upsert into the orders table and retrieve order ID
      const { data, error } = await this.supabase
        .from("orders")
        .upsert({
          order_id: payload.order_id,
          c_id: payload.c_id,
          s_id: payload.s_id || "",
          total_price: totalPrice,
          total_items: payload.order_items?.length,
        })
        .select();

      if (error) {
        console.error("Error upserting into 'orders':", error);
        return;
      }

      const orderId = data[0]?.order_id;
      if (!orderId) {
        console.error("Order ID not returned in response.");
        return;
      }

      // Prepare order items payload
      const orderItemsPayload = payload.order_items.map((item) => {
        const orderItem = {
          order_id: orderId,
          category: item.category,
          order_item_object: {
            frame: item.frame,
            lens: item.lens,
            contactLense: item.contactLense,
            manualPrescription: item.manualPrescription,
            prescriptionType: item.prescriptionType,
          },
        };

        if (item.order_item_id) {
          orderItem.order_item_id = item.order_item_id;
        }

        return orderItem;
      });

      // Debugging
      // console.log("Mapped orderItemsPayload:", orderItemsPayload);

      // Upsert into the order_items table
      const { data: itemData, error: itemError } = await this.supabase
        .from("order_items")
        .upsert(orderItemsPayload);

      if (itemError) {
        console.error("Error upserting into 'order_items':", itemError);
        return;
      }

      console.log("Upsert into 'order_items' response:", itemData);

      return { orderData: data, orderItemsData: itemData };
    } catch (e) {
      console.error("Error creating or updating order:", e);
    }
  }

  // Fetch Orderitems
  static async fetchOrderItemDetails(order_id) {
    try {
      // Fetch order details from the 'orders' table
      const { data: orderData, error: orderError } = await this.supabase
        .from("orders")
        .select("*")
        .eq("order_id", order_id)

        .single();

      if (orderError) {
        console.error("Error fetching order details:", orderError);
        return;
      }

      // Fetch corresponding order items from the 'order_items' table
      const { data: orderItemsData, error: itemsError } = await this.supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order_id);

      if (itemsError) {
        console.error("Error fetching order items:", itemsError);
        return;
      }

      // Combine order and order items data into a single object
      const orderDetails = {
        ...orderData,
        order_items: orderItemsData,
      };

      // console.log("Fetched Order Details:", orderDetails);

      return orderDetails;
    } catch (e) {
      console.error("Error fetching order:", e);
    }
  }
}

export default OrderApi;
