import BaseApi from "./BaseApi";
class WholesaleApi extends BaseApi {
  // fetchStore
  static async fetchAllStore(filters) {
    try {
      // Fetch store data, allowing for multiple rows
      // const { data: storeData, error: storeError } = await this.supabase
      let query = this.supabase
        .from("e_store")
        .select("*")
        .order("s_id", { ascending: true });

      // Apply filters dynamically
      if (filters?.city) {
        query = query.eq("city", filters.city);
      }
      if (filters?.type) {
        query = query.eq("type", filters.type);
      }
      if (filters?.name) {
        query = query.eq("name", filters.name);
      }
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching details:", error);
        return { success: false, error: "Failed to fetch data from database" };
      }

      // console.log("Fetched Data:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching store:", error.message);
      return { store: null, error };
    }
  }
}

export default WholesaleApi;
