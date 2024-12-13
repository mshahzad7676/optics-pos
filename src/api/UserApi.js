import BaseApi from "./BaseApi";

class UserApi extends BaseApi {
  // fetchUser
  static async fetchUser() {
    try {
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser();

      if (authError) {
        throw new Error(`Authentication Error: ${authError.message}`);
      }

      return user;
    } catch (error) {
      console.error("Error fetching authenticated user:", error);
      throw error;
    }
  }
  //  updateUser Name
  static async updateUserProfile(updatedData) {
    try {
      const { data, error } = await this.supabase.auth.updateUser({
        data: {
          name: updatedData.name,
        },
      });

      if (error) {
        throw new Error(`Update Error: ${error.message}`);
      }

      console.log("User profile updated successfully:", data);
      return data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
}

export default UserApi;
