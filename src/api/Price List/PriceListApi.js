import BaseApi from "../BaseApi";

class priceList extends BaseApi {
  // add item price
  static async additemPrice(
    processedData,
    glass_type_id,
    glass_type,
    glassMinusRange,
    s_id
  ) {
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
          price: item.price || "0",
          glass_id: glass_type_id,
          glass_type: glass_type,
          range: glassMinusRange,
          s_id: s_id,
        };
        if (item.id) {
          tempItem.id = item.id;
        }
        return tempItem;
      });

      // console.log("Upserting Data:", upsertData);

      const { data, error } = await this.supabase
        .from("price_list")
        .upsert(upsertData, { onConflict: ["id"] })
        .select();

      if (error) {
        // console.log(data, "Api Response");

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

  //fetch data on basis of glasstype_id , store_id and range
  static async fetchitemPrice(glass_type_id, range, s_id) {
    try {
      if (!glass_type_id || !range) {
        console.error("glass_id or range is not provided.");
        return { success: false, error: "Missing glass_id or range parameter" };
      }

      const { data, error } = await this.supabase
        .from("price_list")
        .select("*")
        .eq("glass_id", glass_type_id)
        .eq("range", range)
        .eq("s_id", s_id);

      if (error) {
        console.error("Error fetching details:", error);
        return { success: false, error: "Failed to fetch data from database" };
      }

      // console.log("Fetched Data:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error while fetching details:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }
}

export default priceList;
