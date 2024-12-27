import BaseApi from "./BaseApi";

class TranscationApi extends BaseApi {
  //upsert Transcation
  static async addTranscation(transcationPayload) {
    // Calculate total price
    let totalPrice = 0;
    if (Array.isArray(transcationPayload.order_items)) {
      transcationPayload.order_items.forEach((item) => {
        const framePrice = parseFloat(item.frame?.price) || 0;
        const lensPrice = parseFloat(item.lens?.price) || 0;
        const contactLensPrice = parseFloat(item.contactLense?.price) || 0;
        const glassesPrice = parseFloat(item.glass?.price) || 0;
        const customrightPrice = parseFloat(item.custom?.right?.price) || 0;
        const customleftPrice = parseFloat(item.custom?.lefy?.price) || 0;
        totalPrice +=
          framePrice +
          lensPrice +
          contactLensPrice +
          glassesPrice +
          customleftPrice +
          customrightPrice;
      });
    }
    try {
      const { data, error } = await this.supabase
        .from("order_transcations")
        .upsert({
          id: transcationPayload.id,
          trans_type: "Credit",
          total_price: totalPrice,
          c_id: transcationPayload.c_id,
          s_id: transcationPayload.s_id || null,
          order_id: transcationPayload.order_id,
        })
        .select();

      if (error) {
        throw new Error(error.message);
      }
      console.log("Transcation created successfully!");
      return { data, error };
    } catch (e) {
      console.error("Error creating Transcation:", e);
    }
  }

  //fetch transcations
  static async fetchOrderTranscaton(searchTerm = "", s_id) {
    try {
      // const { data, error } = await this.supabase
      let query = this.supabase
        .from("order_transcations")
        .select(
          `*, customers!inner (
            id,
            name,
            phone
          )`
        )
        .eq("s_id", s_id);

      if (Boolean(searchTerm)) {
        query = query.eq("id", searchTerm);
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
export default TranscationApi;
