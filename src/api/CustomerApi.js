import BaseApi from "./BaseApi";

class CustomerAPI extends BaseApi {
  // Method to createCustomer
  static async createCustomer(userData) {
    try {
      const { error } = await this.supabase.from("customers").insert({
        ...userData,
        // s_id: userData.storeId,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Customer created successfully!");
    } catch (e) {
      console.error("Error creating customer:", e);
    }
  }

  // Method to fetch all customers
  static async fetchCustomers(searchTerm = "", s_id) {
    try {
      // Select customer data along with their orders' order_dates
      let query = this.supabase
        .from("customers")
        .select(
          `
                *,
                orders:orders(order_date)
            `,
          { count: "exact" }
        )
        .eq("s_id", s_id)
        .order("id", { ascending: false });

      if (Boolean(searchTerm)) {
        query = query.or(
          `name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
        );
      }

      // Execute the query
      const { data, count, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Process data to calculate last_visit_date and total_visits for each customer
      const processedData = data.map((customer) => {
        const orderDates =
          customer.orders?.map((order) => new Date(order.order_date)) || [];

        // Sort orders by date to find the most recent one
        const lastOrderDate =
          orderDates.length > 0 ? orderDates.sort((a, b) => b - a)[0] : null;

        return {
          ...customer,
          last_visit_date: lastOrderDate
            ? lastOrderDate.toISOString().split("T")[0]
            : null,
          total_visits: orderDates.length,
        };
      });

      return { data: processedData, count }; // Return customer data with last_visit_date and total_visits
    } catch (e) {
      console.error("Error fetching customers:", e);
      return null;
    }
  }

  // Delete a customer by ID
  static async deleteCustomer(customerId) {
    try {
      const { error } = await this.supabase
        .from("customers")
        .delete()
        .eq("id", customerId);

      if (error) {
        throw new Error(error.message);
      }
      return true;
    } catch (e) {
      console.error("Error deleting customer:", e);
      return false;
    }
  }

  // Update customer
  static async updateCustomer(updatedCustomer) {
    try {
      const { error } = await this.supabase
        .from("customers")
        .update(updatedCustomer)
        .eq("id", updatedCustomer.id); // Assuming id is the unique identifier

      if (error) {
        throw new Error(error.message);
      }
    } catch (e) {
      console.error("Error updating customer:", e);
    }
  }
}

export default CustomerAPI;
