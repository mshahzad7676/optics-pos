import BaseApi from "./BaseApi";
import TranscationApi from "./TranscationApi";

class OrderApi extends BaseApi {
  static async addOrder(payload) {
    let totalPrice = 0;
    const updatedInventoryList = [];

    // Calculate total price
    if (Array.isArray(payload.order_items)) {
      payload.order_items.forEach((item) => {
        const framePrice = parseFloat(item.frame?.price) || 0;
        const lensPrice = parseFloat(item.lens?.price) || 0;
        const contactLensPrice = parseFloat(item.contactLense?.price) || 0;
        const glassesPrice = parseFloat(item.glass?.price) || 0;
        const customrightPrice = parseFloat(item.custom?.right?.price) || 0;
        const customleftPrice = parseFloat(item.custom?.lefy?.price) || 0;
        totalPrice +=
          framePrice +
          lensPrice +
          contactLensPrice +
          glassesPrice +
          customleftPrice +
          customrightPrice;

        if (item.updatedInventory) {
          updatedInventoryList.push(item.updatedInventory);
        }
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
            glass: item.glass,
            custom: item.custom,
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

      // Upsert into the order_items table
      const { data: itemData, error: itemError } = await this.supabase
        .from("order_items")
        .upsert(orderItemsPayload);

      if (itemError) {
        console.error("Error upserting into 'order_items':", itemError);
        return;
      }

      console.log("Upsert into 'order_items' response:", itemData);

      if (updatedInventoryList.length) {
        // Upsert into the glass_details table
        const { data: glassData, error: glassError } = await this.supabase
          .from("glass_details")
          .upsert(updatedInventoryList, { onConflict: ["id"] })
          .select();

        if (glassError) {
          console.error("Error upserting into 'glass_details':", glassError);
          return;
        }

        console.log("Upsert into 'glass_details' response:", glassData);
      }
      //create transcation
      try {
        const transactionResponse = await TranscationApi.addTranscation({
          order_id: orderId,
        });

        console.log("Transaction created successfully:", transactionResponse);
      } catch (transactionError) {
        console.error("Error creating transaction:", transactionError);
        return;
      }

      return { orderData: data, orderItemsData: itemData };
    } catch (e) {
      console.error("Error creating or updating order:", e);
    }
  }

  // static async addOrder(payload) {
  //   let totalPrice = 0;

  //   // Calculate total price
  //   if (Array.isArray(payload.order_items)) {
  //     payload.order_items.forEach((item) => {
  //       const framePrice = parseFloat(item.frame?.price) || 0;
  //       const lensPrice = parseFloat(item.lens?.price) || 0;
  //       const contactLensPrice = parseFloat(item.contactLense?.price) || 0;
  //       const glassesPrice = parseFloat(item.glass?.price) || 0;
  //       const customrightPrice = parseFloat(item.custom?.right?.price) || 0;
  //       const customleftPrice = parseFloat(item.custom?.lefy?.price) || 0;
  //       totalPrice +=
  //         framePrice +
  //         lensPrice +
  //         contactLensPrice +
  //         glassesPrice +
  //         customleftPrice +
  //         customrightPrice;
  //     });
  //   }

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

  //     // Prepare order items payload
  //     const orderItemsPayload = payload.order_items.map((item) => {
  //       const orderItem = {
  //         order_id: orderId,
  //         category: item.category,
  //         order_item_object: {
  //           frame: item.frame,
  //           lens: item.lens,
  //           glass: item.glass,
  //           custom: item.custom,
  //           contactLense: item.contactLense,
  //           manualPrescription: item.manualPrescription,
  //           prescriptionType: item.prescriptionType,
  //         },
  //       };

  //       if (item.order_item_id) {
  //         orderItem.order_item_id = item.order_item_id;
  //       }

  //       return orderItem;
  //     });

  //     // Upsert into the order_items table
  //     const { data: itemData, error: itemError } = await this.supabase
  //       .from("order_items")
  //       .upsert(orderItemsPayload);

  //     if (itemError) {
  //       console.error("Error upserting into 'order_items':", itemError);
  //       return;
  //     }

  //     console.log("Upsert into 'order_items' response:", itemData);

  //     try {
  //       debugger;
  //       // Update or upsert held_quantity in glass_details table
  //       const glassDetailsPayload = payload.order_items
  //         .filter((item) => item.glass)
  //         .map((item) => ({
  //           id: item.glass?.id,
  //           sph: item.glass?.sph,
  //           cyl: item.glass?.cyl,
  //           addition: item.glass?.addition,
  //           // held_quantity: -(item.glass?.quantity || 0),
  //           held_quantity: item.glass?.updatedQuantity,
  //         }));

  //       for (const glassDetail of glassDetailsPayload) {
  //         if (!glassDetail.id) {
  //           console.error("Missing ID for glass detail:", glassDetail);
  //           continue;
  //         }

  //         // Fetch the existing held_quantity if needed
  //         const { data: existingGlass, error: fetchError } = await this.supabase
  //           .from("glass_details")
  //           .select("id, held_quantity")
  //           .eq("id", glassDetail.id)
  //           .single();

  //         if (fetchError && fetchError.details !== "Row not found") {
  //           console.error(
  //             "Error fetching glass details for held_quantity update:",
  //             fetchError
  //           );
  //           continue;
  //         }

  //         const updatedQuantity =
  //           (existingGlass?.held_quantity || 0) +
  //           parseFloat(glassDetail.held_quantity);

  //         // Use upsert with conflict on 'id'
  //         const { error: upsertError } = await this.supabase
  //           .from("glass_details")
  //           .upsert(
  //             {
  //               id: glassDetail.id, // Unique identifier for conflict resolution
  //               sph: glassDetail.sph,
  //               cyl: glassDetail.cyl,
  //               addition: glassDetail.addition,
  //               held_quantity: updatedQuantity < 0 ? 0 : updatedQuantity, // Prevent negative quantities
  //             },
  //             { onConflict: ["id"] }
  //           ); // Specify conflict key

  //         if (upsertError) {
  //           console.error(
  //             "Error upserting into glass_details table:",
  //             upsertError
  //           );
  //           continue;
  //         }
  //       }

  //       console.log("Held quantities updated successfully.");

  //       // Add transaction
  //       const transactionResponse = await TranscationApi.addTranscation({
  //         order_id: orderId,
  //       });

  //       console.log("Transaction created successfully:", transactionResponse);
  //     } catch (heldQuantityError) {
  //       console.error(
  //         "Error updating held_quantity in glass_details table:",
  //         heldQuantityError
  //       );
  //     }

  //     return { orderData: data, orderItemsData: itemData };
  //   } catch (e) {
  //     console.error("Error creating or updating order:", e);
  //   }
  // }

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
