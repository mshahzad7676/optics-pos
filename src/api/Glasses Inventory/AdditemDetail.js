import BaseApi from "../BaseApi";

class AdditemDetail extends BaseApi {
  // add Item Details
  static async addDetails(
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
          held_quantity: item.quantity || "0",
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
        .from("glass_details")
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

  //fetch data on basis of glasstype , store id and range
  static async fetchDetails(glass_type_id, range, s_id) {
    try {
      if (!glass_type_id || !range) {
        console.error("glass_id or range is not provided.");
        return { success: false, error: "Missing glass_id or range parameter" };
      }

      const { data, error } = await this.supabase
        .from("glass_details")
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
  // fetch all data by rangefilters
  static async fetchAllDetails(glass_type_id, selectedRangeFilter, s_id) {
    try {
      let query = this.supabase
        .from("glass_details")
        .select(
          `
          *
        `
        )
        .eq("glass_id", glass_type_id)
        .eq("s_id", s_id)
        .order("id", { ascending: true });

      if (selectedRangeFilter) {
        query = query.eq("range", selectedRangeFilter);
      }

      const { data, error } = await query;

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
  // fetch all data without rangefilters
  static async fetchAllDetail(s_id) {
    try {
      let query = this.supabase
        .from("glass_details")
        .select(
          `
          *
        `
        )
        .eq("s_id", s_id)
        .order("id", { ascending: true });

      // if (selectedRangeFilter) {
      //   query = query.eq("range", selectedRangeFilter);
      // }

      const { data, error } = await query;

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
  // fetch just glasstype
  static async fetchGlassType() {
    try {
      const { data, error } = await this.supabase
        .from("glass_details")
        .select("glass_type");

      if (error) {
        console.error("Error fetching GlassType:", error);
        return { success: false, error: "Failed to fetch data from database" };
      }

      // console.log("Fetched Data:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error while fetching details:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }

  // fetch all data filter by type and range
  static async fetchAllDetailsWithtype(filter) {
    try {
      let query = this.supabase.from("glass_details").select("*");

      if (filter?.lensType) {
        query = query.eq("glass_type", filter.lensType);
      }
      if (filter?.sph) {
        query = query.eq("sph", filter.sph);
      }
      if (filter?.cyl) {
        query = query.eq("cyl", filter.cyl);
      }
      if (filter?.addition) {
        query = query.eq("addition", filter.addition);
      }

      let { data, error } = await query;

      if (error) {
        console.error("Error fetching details from glass_details:", error);
        return { success: false, error: "Failed to fetch data from database" };
      }

      if (data && data.length > 0) {
        return { success: true, data };
      }

      // If no data found, query the price_list table with the same filters
      let priceQuery = this.supabase.from("price_list").select("*");

      if (filter?.lensType) {
        priceQuery = priceQuery.eq("glass_type", filter.lensType);
      }
      if (filter?.sph) {
        priceQuery = priceQuery.eq("sph", filter.sph);
      }
      if (filter?.cyl) {
        priceQuery = priceQuery.eq("cyl", filter.cyl);
      }
      if (filter?.addition) {
        priceQuery = priceQuery.eq("addition", filter.addition);
      }

      let { data: priceData, error: priceError } = await priceQuery;

      if (priceError) {
        console.error("Error fetching details from price_list:", priceError);
        return {
          success: false,
          error: "Failed to fetch data from price_list",
        };
      }

      return { success: true, data: priceData };
    } catch (error) {
      console.error("Unexpected error while fetching details:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }

  //fetch filtered data
  static async fetchFilteredDetails(filters, s_id) {
    try {
      let query = this.supabase
        .from("glass_details")
        .select("*")
        .eq("s_id", s_id)
        .order("id", { ascending: true });

      // Apply filters dynamically
      if (filters?.glassType) query = query.eq("glass_type", filters.glassType);
      if (filters?.sph) query = query.eq("sph", filters.sph);
      if (filters?.cyl) query = query.eq("cyl", filters.cyl);
      if (filters?.addition) query = query.eq("addition", filters.addition);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching details:", error);
        return { success: false, error: "Failed to fetch data from database" };
      }

      if (data.length > 0) {
        return { success: true, data };
      }

      // No data found in glass_details, fetch from price_list
      let priceQuery = this.supabase
        .from("price_list")
        .select("*")
        .eq("s_id", s_id);

      if (filters?.glassType)
        priceQuery = priceQuery.eq("glass_type", filters.glassType);
      if (filters?.sph) priceQuery = priceQuery.eq("sph", filters.sph);
      if (filters?.cyl) priceQuery = priceQuery.eq("cyl", filters.cyl);
      if (filters?.addition)
        priceQuery = priceQuery.eq("addition", filters.addition);

      const { data: priceData, error: priceError } = await priceQuery;

      if (priceError) {
        console.error("Error fetching price details:", priceError);
        return { success: false, error: "Failed to fetch price data" };
      }

      if (priceData.length > 0) {
        return { success: true, data: priceData };
      }

      return {
        success: false,
        error: "No data found in glass_details or price_list",
      };
    } catch (error) {
      console.error("Unexpected error while fetching details:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }

  //Update quantity
  static async updateItemQuantity(updatedQuantity) {
    try {
      const { data, error } = await this.supabase
        .from("glass_details")
        .update({ held_quantity: updatedQuantity.held_quantity })
        .eq("id", updatedQuantity.id);

      if (error) {
        console.log("Quantity updated successfully");
      }
      return data;
    } catch (e) {
      console.error("Error updating Quantity:", e);
    }
  }
}

export default AdditemDetail;
