import BaseApi from "./BaseApi";

class OrderTableApi extends BaseApi {
  // Fetch Order Details with optional customer info
  static async fetchOrders(searchTerm = "", s_id) {
    try {
      // Prepare the base query
      let query = this.supabase
        .from("orders")
        .select(
          `
          order_id,
          order_date,
          total_items,
          total_price,
          status,
          m_id,
          customers!inner (
            id,
            name,
            phone,
            store
          )
        `,
          { count: "exact" }
        )
        .eq("s_id", s_id)
        .order("order_id", { ascending: false });

      if (Boolean(searchTerm)) {
        query = query.or(
          `name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`,
          { referencedTable: "customers" }
        );
      }

      const { data, count, error } = await query;

      if (error) {
        console.error("Error fetching order details:", error);
        return null;
      }

      // Map through the data to format order_date
      const formattedData = data.map((order) => ({
        ...order,
        order_date: order.order_date
          ? new Date(order.order_date).toISOString().split("T")[0]
          : null,
      }));

      return { orders: formattedData, count };
    } catch (e) {
      console.error("Error in fetchOrderDetails:", e);
      return null;
    }
  }

  static async fetchOrderDetails(order_id = null) {
    try {
      // Prepare the base query
      let query = this.supabase
        .from("orders")
        .select(
          `
          order_id,
          order_date,
          total_items,
          total_price,
          customers (
            id,
            name,
            phone
          ),
          order_items (
            order_item_id,
            category,
            order_item_object
          ),order_transactions(id,trans_type,total_price,balance)
        `
        )
        .order("order_id", { ascending: false });

      // Conditionally add the filter if order_id is provided
      if (order_id) {
        query = query.eq("order_id", order_id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching order details:", error);
        return null;
      }

      // Map through the data to format order_date
      const formattedData = {
        ...data,
        order_date: data.order_date
          ? new Date(data.order_date).toISOString().split("T")[0]
          : null,
      };

      return formattedData;
    } catch (e) {
      console.error("Error in fetchOrderDetails:", e);
      return null;
    }
  }

  // Delete a Order by Order_id
  static async deleteOrder(order_id) {
    try {
      // Begin transaction
      const { error: orderItemsError } = await this.supabase
        .from("order_items")
        .delete()
        .eq("order_id", order_id);

      if (orderItemsError) {
        throw new Error(
          `Error deleting order items: ${orderItemsError.message}`
        );
      }

      // Delete from orders table
      const { error: ordersError } = await this.supabase
        .from("orders")
        .delete()
        .eq("order_id", order_id);

      if (ordersError) {
        throw new Error(`Error deleting order: ${ordersError.message}`);
      }

      return true;
    } catch (e) {
      console.error("Error deleting order and related items:", e);
      return false;
    }
  }

  // fetch Customer Orders
  static async fetchCustomerOrders(customerId) {
    try {
      // Prepare the query to fetch orders for a single customer
      let query = this.supabase
        .from("orders")
        .select(
          `
          order_id,
          order_date,
          total_items,
          total_price,
          customers!inner (
            id
            
          )
        `
        )
        .eq("customers.id", customerId) // Filter by the specific customer ID
        .order("order_id", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching customer orders:", error);
        return null;
      }

      // Map through the data to format order_date
      const formattedData = data.map((order) => ({
        ...order,
        order_date: order.order_date
          ? new Date(order.order_date).toISOString().split("T")[0]
          : null,
      }));

      return formattedData;
    } catch (e) {
      console.error("Error in fetchCustomerOrders:", e);
      return null;
    }
  }

  // assign order to Member
  static async assignOrder(order_id, member_id) {
    try {
      const { data, error } = await this.supabase
        .from("orders")
        .update({ m_id: member_id })
        .eq("order_id", order_id);
      if (error) {
        console.error("Error updating assign field:", error);
        throw new Error(error.message);
      }

      return data[0];
    } catch (err) {
      console.error("Failed to assign order:", err);
      throw err;
    }
  }
}

export default OrderTableApi;
