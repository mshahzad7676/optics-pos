import BaseApi from "./BaseApi";

// class StoreApi extends BaseApi {
//   static async fetchStore(id) {
//     try {
//       // Fetch store data from the "e_store" table using the user's ID
//       const { data: storeData, error: storeError } = await this.supabase
//         .from("e_store")
//         .select("*")
//         .eq("u_id", id);

//       if (storeError) throw storeError;

//       return { store: storeData, error: null };
//     } catch (error) {
//       console.error("Error fetching store:", error.message);
//       return { store: null, error };
//     }
//   }
// }

// export default StoreApi;
class StoreApi extends BaseApi {
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
      return { store: storeData[0], error: null }; // Use storeData for all rows
    } catch (error) {
      console.error("Error fetching store:", error.message);
      return { store: null, error };
    }
  }
}
export default StoreApi;
