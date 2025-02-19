import BaseApi from "../BaseApi";

class FrameDetails extends BaseApi {
  static async addFrame(framePayload) {
    try {
      const s_id = framePayload.s_id ? parseInt(framePayload.s_id) : null;
      // const id = framePayload.id ? framePayload.id : null;
      // Perform upsert operation
      const { data, error } = await this.supabase
        .from("frame_details")
        .upsert(
          {
            id: framePayload.id || undefined,
            category: framePayload.category,
            shape: framePayload.shape,
            brand: framePayload.brand,
            quantity: framePayload.quantity,
            price: framePayload.price,
            s_id,
          },
          { onConflict: ["id"] }
        )
        .select()
        .single();

      if (error) {
        console.log(data);

        return { success: false, error: "Failed to Add or Update Frame" };
      }

      return {
        success: true,
        message: "Successfully Added or Updated Frame",
        data,
      };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, error: "Unexpected error occurred" };
    }
  }
  // fetch Frames
  static async fetchFrame(
    searchTerm = "",
    searchShape = "",
    searchCategory = "",
    s_id,
    filter
  ) {
    try {
      // const { data, error } = await this.supabase
      let query = this.supabase
        .from("frame_details")
        .select("*")
        .eq("s_id", s_id);

      if (Boolean(searchTerm)) {
        query = query.eq("id", searchTerm); // (`id.ilike.%${searchTerm}%`);
        // query = query.or(
        //   `id.eq.${searchTerm},category.ilike.%${searchCategory}%,shape.ilike.%${searchShape}%`
        // );
      }
      if (Boolean(searchCategory)) {
        query = query.ilike("category", `%${searchCategory}%`);
      }
      if (Boolean(searchShape)) {
        query = query.ilike("shape", `%${searchShape}%`);
      }

      if (filter?.brand) {
        query = query.eq("brand", filter.brand);
      }
      if (filter?.shape) {
        query = query.eq("shape", filter.shape);
      }
      if (filter?.category) {
        query = query.eq("category", filter.category);
      }
      if (filter?.id) {
        query = query.eq("id", filter.id);
      }

      // Excute Query
      const { data, error } = await query;
      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.error("Error fetching frames:", err);
      return [];
    }
  }

  // Delete a frame by ID
  static async deleteFrame(frameid) {
    try {
      const { error } = await this.supabase
        .from("frame_details")
        .delete()
        .eq("id", frameid);

      if (error) {
        throw new Error(error.message);
      }
      return true;
    } catch (e) {
      console.error("Error deleting Frame:", e);
      return false;
    }
  }
}

export default FrameDetails;
