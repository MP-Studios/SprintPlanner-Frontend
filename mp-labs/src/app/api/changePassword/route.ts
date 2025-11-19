import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPassword = body.newPassword;
    
    if (!newPassword || newPassword.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Missing new password" },
        { status: 400 }
      );
    }

    // Validate password requirements (same as login page)
    const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{15,}$/.test(newPassword);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Password must include at least 15 characters, one upper-case, one lower-case, one number, and one special character" },
        { status: 400 }
      );
    }

    // Create server-side Supabase client
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Update user password through Supabase Auth
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully!"
    });

  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}