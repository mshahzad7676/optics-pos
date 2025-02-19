import BaseApi from "./BaseApi";
class AuthServieApi extends BaseApi {
  // signUp User
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
          // type: "Retail & Wholesale",
        })
        .select()
        .single();
      if (storeError) throw storeError;

      //Create a member of member Table
      const { data: memberData, error: memberError } = await this.supabase
        .from("members")
        .insert({
          name: email,
          roles: "Admin",
          u_id: userId,
          s_id: storeData.s_id,
        })
        .select()
        .single();

      if (memberError) throw memberError;

      return {
        data: { user: signUpData.user, store: storeData, member: memberData },
        error: null,
      };
    } catch (error) {
      console.error(
        "Sign up, store creation, or member creation error:",
        error.message
      );
      return { data: null, error };
    }
  }

  // update UserInfo
  static async updateMember(memberData) {
    try {
      const { data, error } = await this.supabase
        .from("members")
        .update(memberData)
        .eq("id", memberData.id)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (e) {
      console.error("Error updating member:", e);
      return { data: null, error: e };
    }
  }
  //Update StoreInfo
  static async updateStore(storeData) {
    try {
      const { data, error } = await this.supabase
        .from("e_store")
        .update(storeData)
        .eq("u_id", storeData.u_id)
        .select();
      if (error) {
        throw new Error(error.message);
      }
      return { data, error: null };
    } catch (e) {
      console.error("Error updating Store:", e);
      return { data: null, error: e };
    }
  }

  // signIn user
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
  // Send Reset Link
  static async sendResetLink(email) {
    try {
      const { data, error } = await this.supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: "http://localhost:3000/SetNewPassword", // Ensure it matches your frontend route
        }
      );
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
