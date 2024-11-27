import BaseApi from "./BaseApi";
class AuthServieApi extends BaseApi {
  // static async signUp(email, password) {
  //   try {
  //     const { data, error } = await this.supabase.auth.signUp({
  //       email,
  //       password,
  //     });
  //     if (error) throw error;
  //     return { data, error: null };
  //   } catch (error) {
  //     console.error("Sign up error:", error.message);
  //     return { data: null, error };
  //   }
  // }

  static async signUp(email, password, storeDescription) {
    try {
      // Sign up the user
      const { data: signUpData, error: signUpError } =
        await this.supabase.auth.signUp({
          email,
          password,
        });
      if (signUpError) throw signUpError;

      // Get the user ID (Supabase may return it in the session data after sign-up)
      const userId = signUpData.user?.id;
      if (!userId) throw new Error("User ID not found after sign-up.");

      //Create a store associated with the new user
      const { data: storeData, error: storeError } = await this.supabase
        .from("e_store")
        .insert({
          name: email,
          description: storeDescription,
          u_id: userId,
        });

      if (storeError) throw storeError;

      return { data: { user: signUpData.user, store: storeData }, error: null };
    } catch (error) {
      console.error("Sign up or store creation error:", error.message);
      return { data: null, error };
    }
  }

  static async signIn(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error.message);
      return { data: null, error };
    }
  }

  static async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      return null;
    } catch (error) {
      console.error("Sign out error:", error.message);
      return error;
    }
  }

  static async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return null;
      }
      return user;
    } catch (err) {
      console.error("Unexpected error fetching user:", err);
      return null;
    }

  }
  static async sendResetLink(email) {
    try {
      const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/SetNewPassword", // Ensure it matches your frontend route
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error sending reset link:", error.message);
      return { data: null, error };
    }
  }
  // Update the user's password
  static async updatePassword(newPassword) {
    try {
      const { data, error } = await this.supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw new Error(error.message);

      return { data, error: null };
    } catch (error) {
      console.error("Error updating password:", error.message);
      return { data: null, error };
    }
  }
}
export default AuthServieApi;
