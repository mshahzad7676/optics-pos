import BaseApi from "../BaseApi";

class GlassTypeApi extends BaseApi {
  // add GlassItems
  static async addGlassType(itemPayload) {
    const s_id = itemPayload.s_id ? parseInt(itemPayload.s_id) : null;
    try {
      const { data, error } = await this.supabase.from("glass_types").upsert({
        name: itemPayload.name,
        s_id,
      });

      if (error) {
        throw new Error(error.message);
      }
      console.log("Customer created successfully!");
      return { data, error };
    } catch (e) {
      console.error("Error creating customer:", e);
    }
  }
  // fetch GlassItems
  static async fetchGlassType(searchTerm = "", s_id) {
    try {
      // const { data, error } = await this.supabase
      let query = this.supabase
        .from("glass_types")
        .select("*")
        .eq("s_id", s_id);

      if (Boolean(searchTerm)) {
        query = query.eq("id", searchTerm); // (`id.ilike.%${searchTerm}%`);
        // query = query.or(`id.eq.${searchTerm},name.ilike.%${searchTerm}%,`);
      }
      // Excute Query
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

  // delete item by id
  static async deleteGlassType(itemid) {
    try {
      const { error } = await this.supabase
        .from("glass_types")
        .delete()
        .eq("id", itemid);

      if (error) {
        throw new Error(error.message);
      }
      return true;
    } catch (e) {
      console.error("Error deleting Item:", e);
      return false;
    }
  }
}
export default GlassTypeApi;
