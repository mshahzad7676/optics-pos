import BaseApi from "../BaseApi";

class UploadInventory extends BaseApi {
  static async uploadFrameImg(file, frameid) {
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    try {
      // Generate a unique file path/name
      // const filePath = `${Date.now()}-${file.name}`;
      const filePath = `${frameid}-image`;
      console.log(filePath, "FileApi");

      // Upload file to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from("upload")
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.log(data);
        console.error("Upload error:", error);
        return { success: false, error: "Failed to upload file" };
      }
      return { success: true, error: "Successfully upload file" };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, error: "Unexpected error occurred" };
    }
  }
}

export default UploadInventory;
