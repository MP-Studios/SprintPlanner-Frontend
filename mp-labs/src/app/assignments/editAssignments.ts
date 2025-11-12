"use-client"
import { createClient } from '@/utils/supabase/client';
export default async function(assignmentId: String, formData: { className: string; name: string; details: string; dueDate: string }){
    
    const supabase = createClient();

    const {data: {session}, error: sessionError} = await supabase.auth.getSession(); // this is insecure but temporary

    const response = await fetch(`/api/fetchUpdate/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({
            Id: assignmentId,
            className: formData.className,
            Name: formData.name,
            Details: formData.details,
            DueDate: formData.dueDate
          })
        });
        return response;
}