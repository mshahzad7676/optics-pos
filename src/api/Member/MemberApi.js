import BaseAdminApi from "../BaseAdminApi";

class MemberApi extends BaseAdminApi {
  // static async Createmember(email, password, name, phone, s_id) {
  static async CreateMember(memberData) {
    try {
      //Sign up the member Auth
      const { data: authData, error: authError } =
        // await this.supabase.auth.signUp({
        await this.supabase.auth.admin.createUser({
          email: memberData.email,
          password: memberData.password,
          email_confirm: true,
        });

      if (authError) {
        throw new Error(authError.message);
      }

      // Insert additional details into the member table
      const userId = authData.user.id;

      const { data: memberRecord, error: memberError } = await this.supabase
        .from("members")
        .upsert(
          {
            id: memberData.id || undefined,
            name: memberData.name,
            phone: memberData.phone,
            roles: memberData.roles,
            s_id: memberData.s_id,
            u_id: memberData.u_id || userId,
          },
          { onConflict: ["id"] }
        );

      if (memberError) {
        throw new Error(memberError.message);
      }

      return { success: true, data: memberRecord };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  //  invite member with store id
  static async inviteMember(email) {
    try {
      const { data: inviteMember, error: inviteError } =
        await this.supabase.auth.admin.inviteUserByEmail(email);

      if (inviteError) {
        throw new Error(inviteError.message);
      }
      return { success: true, data: inviteMember };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // fetchMember with store id
  static async fetchMember(searchTerm = "", s_id) {
    try {
      let query = this.supabase.from("members").select("*").eq("s_id", s_id);

      // if (Boolean(searchTerm)) {
      //   query = query.eq("id", searchTerm); // (`id.ilike.%${searchTerm}%`);
      //   // query = query.or(`id.eq.${searchTerm},name.ilike.%${searchTerm}%`);
      // }
      if (Boolean(searchTerm)) {
        query = query.or(
          `name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
        );
      }

      // Excute Query
      const { data, error } = await query;
      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.error("Error fetching Members:", err);
      return [];
    }
  }

  // delete member by id
  static async deleteMember(memberId) {
    try {
      const { error } = await this.supabase
        .from("members")
        .delete()
        .eq("id", memberId);

      if (error) {
        throw new Error(error.message);
      }
      return true;
    } catch (e) {
      console.error("Error deleting Member:", e);
      return false;
    }
  }
  //  fetchMember with uuid
  static async fetchallMembers(id) {
    try {
      // Fetch store data, allowing for multiple rows
      const { data: storeMember, error: memberError } = await this.supabase
        .from("members")
        // .select("*")
        .select(`id,name,phone,roles,s_id,u_id, e_store!inner(s_id,name,u_id)`)
        .eq("u_id", id);

      if (memberError) throw memberError;

      if (!storeMember || storeMember.length === 0) {
        throw new Error("No store Found for the provided ID.");
      }

      // Return the first store if needed or all matching rows
      return { memberRecord: storeMember, error: null }; // Use storeData for all rows
    } catch (error) {
      console.error("Error fetching store:", error.message);
      return { member: null, error };
    }
  }
}
export default MemberApi;
