'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  console.log("🔵 [LOGIN] Server action triggered");

  const supabase = await createClient();
  console.log("🔵 [LOGIN] Supabase client created");

  const form = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  console.log("🔵 [LOGIN] Form data:", form);

  try {
    const { data, error } = await supabase.auth.signInWithPassword(form);
    console.log("🔵 [LOGIN] Supabase response:", { data, error });

    if (error) {
      console.error("🔴 [LOGIN] Error:", error);
      return redirect('/error');
    }

    console.log("🟢 [LOGIN] User logged in:", data.user);
    
    revalidatePath('/', 'layout');
    console.log("🔵 [LOGIN] Path revalidated, redirecting");

    redirect('/');
  } catch (err) {
    console.error("🔥 [LOGIN] Unexpected Exception:", err);
    return redirect('/error');
  }
}

export async function signup(formData: FormData) {
  console.log("🟣 [SIGNUP] Server action triggered");

  const supabase = await createClient();
  console.log("🟣 [SIGNUP] Supabase client created");

  const form = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  console.log("🟣 [SIGNUP] Form data:", form);

  try {
    const { data, error } = await supabase.auth.signUp(form);
    console.log("🟣 [SIGNUP] Supabase response:", { data, error });

    if (error) {
      console.error("🔴 [SIGNUP] Error:", error);
      return redirect('/error');
    }

    console.log("🟢 [SIGNUP] User signed up:", data.user);

    revalidatePath('/', 'layout');
    console.log("🟣 [SIGNUP] Path revalidated, redirecting");

    redirect('/');
  } catch (err) {
    console.error("🔥 [SIGNUP] Unexpected Exception:", err);
    return redirect('/error');
  }
}
