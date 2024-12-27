import BaseApi from "./BaseApi";

class StoreApi extends BaseApi {
  // Creating Store
  static async createStore(StoreData) {
    try {
      // Create the store
      const { data: storeData, error: storeError } = await this.supabase
        .from("e_store")
        .insert({
          name: StoreData.name,
          u_id: StoreData.u_id,
        })
        .select()
        .single();

      if (storeError) throw storeError;

      // Create the member using the store id
      const { data: memberData, error: memberError } = await this.supabase
        .from("members")
        .insert({
          name: StoreData.username,
          phone: StoreData.phone,
          roles: "Admin",
          s_id: storeData.s_id,
          u_id: StoreData.u_id,
        })
        .select()
        .single();

      if (memberError) throw memberError;

      return {
        data: { store: storeData, member: memberData },
        error: null,
      };
    } catch (error) {
      console.error("Error in store creation", error.message);
      return { data: null, error };
    }
  }

  //Updating Store
  // static async updateStore(updatedStore) {
  //   try {
  //     const { error } = await this.supabase
  //       .from("e_store")
  //       .update(updatedStore)
  //       .eq("id", updatedStore.id); // Assuming id is the unique identifier

  //     if (error) {
  //       throw new Error(error.message);
  //     }
  //   } catch (e) {
  //     console.error("Error updating store:", e);
  //   }
  // }

  // fetchStore
  static async fetchStore(id) {
    try {
      // Fetch store data, allowing for multiple rows
      const { data: storeData, error: storeError } = await this.supabase
        .from("e_store")
        .select("*")
        .eq("u_id", id);

      if (storeError) throw storeError;

      if (!storeData || storeData.length === 0) {
        throw new Error("No store found for the provided ID.");
      }

      // Return the first store if needed or all matching rows
      return { store: storeData[0], error: null };
    } catch (error) {
      console.error("Error fetching store:", error.message);
      return { store: null, error };
    }
  }
}
export default StoreApi;
