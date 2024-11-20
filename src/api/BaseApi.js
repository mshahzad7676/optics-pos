import { createClient } from "@supabase/supabase-js";

// class BaseApi {
//   constructor() {
//     const supabaseUrl = "https://jphbwllfvhpwixzpjxnd.supabase.co";
//     const supabaseKey =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwaGJ3bGxmdmhwd2l4enBqeG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMTc2NzMsImV4cCI6MjA0NTY5MzY3M30.p2oBd68yk2RCr__mD80__5xF9Zb4Pid0jlHN3jCXivM";
//     this.supabase = createClient(supabaseUrl, supabaseKey);
//   }
// }
class BaseApi {
  static supabase = createClient(
    "https://jphbwllfvhpwixzpjxnd.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwaGJ3bGxmdmhwd2l4enBqeG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMTc2NzMsImV4cCI6MjA0NTY5MzY3M30.p2oBd68yk2RCr__mD80__5xF9Zb4Pid0jlHN3jCXivM"
  );
}

export default BaseApi;
