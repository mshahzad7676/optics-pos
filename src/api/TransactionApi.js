import { calculateOrderAmount } from "../utils/helpers";
import BaseApi from "./BaseApi";

class TransactionApi extends BaseApi {
  //fetch latest transaction
  static async fetchLatestTransaction(customer_id, s_id) {
    try {
      const { data, error } = await this.supabase
        .from("order_transactions")
        .select("*")
        .eq("c_id", customer_id)
        .eq("s_id", s_id)
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        throw new Error(
          `Failed to fetch the latest transaction: ${error.message}`
        );
      }

      return data;
    } catch (e) {
      console.error("Error fetching the latest transaction:", e.message);
      return null;
    }
  }

  //upsert transaction
  static async addTransaction(transactionPayload) {
    let totalPrice = 0;
    let newBalance = 0;

    try {
      const { data, error } = await this.supabase
        .from("order_transactions")
        .upsert({
          id: transactionPayload.id,
          trans_type: transactionPayload.trans_type,
          total_price: transactionPayload.total_price,
          c_id: transactionPayload.c_id,
          s_id: transactionPayload.s_id || null,
          order_id: transactionPayload.order_id,
          balance: transactionPayload.balance,
          comments: transactionPayload.comments,
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      console.log("Transaction created successfully!", data);
      return { data, error };
    } catch (e) {
      console.error("Error creating transaction:", e);
      return { error: e.message };
    }
  }

  //fetch All transactions
  static async fetchOrderTransacton(
    searchTerm = "",
    selectedCustomer = "",
    s_id
  ) {
    try {
      // const { data, error } = await this.supabase
      let query = this.supabase
        .from("order_transactions")
        .select(
          `*, customers!inner (
            id,
            name,
            phone
          )`
        )
        .eq("s_id", s_id)
        .order("id", { ascending: false });

      if (Boolean(searchTerm)) {
        query = query.eq("id", searchTerm);
      }
      if (Boolean(selectedCustomer)) {
        query = query.eq("c_id", selectedCustomer);
      }

      const { data, error } = await query;
      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.error("Error fetching Glass:", err);
      return [];
    }
  }
}
export default TransactionApi;
