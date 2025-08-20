"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function NavBar() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();      // default = global
    router.refresh();                   // re-render any server comps
    router.push("/login");              // send user to login
  }

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "0.5rem", background: "#f0b040f0" }}>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/settings" className="ml-auto">Settings</Link>
      <div style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
        <Link href="/login">Login</Link>
        {/*<Link href="/register">Register</Link>*/}
        <button onClick={handleSignOut} style={{ background: "transparent", border: 0, cursor: "pointer" }}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
