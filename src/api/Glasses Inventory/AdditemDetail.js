import BaseApi from "../BaseApi";

class AdditemDetail extends BaseApi {
  // add Item Details
  static async addDetails(
    processedData,
    glass_type_id,
    glass_type,
    glassMinusRange
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
          hc_id: glass_type_id,
          glass_type: glass_type,
          range: glassMinusRange,
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

      // console.log("Fetched Data:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error while fetching details:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  }
  // fetch all data by rangefilters
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
      let query = this.supabase.from("glass_details").select(
        `
          *
        `
      );

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

  //fetch filtered data
  static async fetchFilteredDetails(filters) {
    try {
      let query = this.supabase
        .from("glass_details")
        .select("*")
        .order("id", { ascending: true });

      // Apply filters dynamically
      if (filters?.glassType) {
        query = query.eq("glass_type", filters.glassType);
      }
      if (filters?.sph) {
        query = query.eq("sph", filters.sph);
      }
      if (filters?.cyl) {
        query = query.eq("cyl", filters.cyl);
      }
      if (filters?.addition) {
        query = query.eq("addition", filters.addition);
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
