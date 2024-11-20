import BaseApi from "./BaseApi";

class UserApi extends BaseApi {
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
}

export default UserApi;
