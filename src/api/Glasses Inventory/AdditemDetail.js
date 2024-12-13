import BaseApi from "../BaseApi";

class AdditemDetail extends BaseApi {
  // add Item Details
  static async addDetails(processedData, glass_type_id, glassMinusRange) {
    try {
      if (!processedData || processedData.length === 0) {
        console.error("Data source is empty or undefined.");
        return;
      }

      const upsertData = processedData.map((item) => {
        let tempItem = {
          sph: item.sph,
          cyl: item.cyl,
          addition: item.add,
          held_quantity: item.quantity || "0",
          price: item.price || "0",
          hc_id: glass_type_id,
          range: glassMinusRange,
        };
        if (item.id) {
          tempItem.id = item.id;
        }
        return tempItem;
      });

      console.log("Upserting Data:", upsertData);

      const { data, error } = await this.supabase
        .from("glass_details")
        .upsert(upsertData, { onConflict: ["id"] })
        .select();

      if (error) {
        console.log(data, "Api Response");

        return { success: false, error: "Failed to Add Item Details" };
      }

      return {
        success: true,
        message: "Successfully Added Item Details",
        data,
      };
    } catch (error) {
      console.error("An error occurred while upserting data:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }
  //fetch data on basis of glasstype id and range
  static async fetchDetails(glass_type_id, range) {
    try {
      if (!glass_type_id || !range) {
        console.error("hc_id or range is not provided.");
        return { success: false, error: "Missing hc_id or range parameter" };
      }

      const { data, error } = await this.supabase
        .from("glass_details")
        .select("*")
        .eq("hc_id", glass_type_id)
        .eq("range", range);

      if (error) {
        console.error("Error fetching details:", error);
        return { success: false, error: "Failed to fetch data from database" };
      }

      console.log("Fetched Data:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error while fetching details:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }
  // fetch all data  and by filters
  static async fetchAllDetails(selectedRangeFilter) {
    try {
      let query = this.supabase
        .from("glass_details")
        .select(
          `
          *
        `
        )
        .order("id", { ascending: true });

      if (selectedRangeFilter) {
        query = query.eq("range", selectedRangeFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching details:", error);
        return { success: false, error: "Failed to fetch data from database" };
      }

      console.log("Fetched Data:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error while fetching details:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }
}

export default AdditemDetail;
