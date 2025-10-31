import { createClient } from '@/utils/supabase/client';

export default async function loadData() {
    try {
      const supabase = createClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        return('Not authenticated. Please log in.');
      }
        return session.access_token;
    } catch ( err) {
      if (err instanceof Error) {
        return("Error:"+err.message);
      } else {
        return("Unexpected error");
      }
    }
  }