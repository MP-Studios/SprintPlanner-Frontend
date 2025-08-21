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
    <nav style={{ display: "flex", gap: "1rem", padding: "0.5rem", backgroundColor: "var(--primary)", color: "white" }}>
      <Link
      href="/"
      style={{
        color: "inherit",
        textDecoration: "none",
        transition: "all 0.2s ease",
      }}
      onMouseOver={(e) => {
        (e.target as HTMLElement).style.color = "var(--accent)";
        (e.target as HTMLElement).style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        (e.target as HTMLElement).style.color = "inherit";
        (e.target as HTMLElement).style.transform = "scale(1)";
      }}
    >
      Home
    </Link>

    <Link
      href="/about"
      style={{
        color: "inherit",
        textDecoration: "none",
        transition: "all 0.2s ease",
      }}
      onMouseOver={(e) => {
        (e.target as HTMLElement).style.color = "var(--accent)";
        (e.target as HTMLElement).style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        (e.target as HTMLElement).style.color = "inherit";
        (e.target as HTMLElement).style.transform = "scale(1)";
      }}
    >
      About
    </Link>

    <Link
      href="/settings"
      style={{
        marginLeft: "auto",
        color: "inherit",
        textDecoration: "none",
        transition: "all 0.2s ease",
      }}
      onMouseOver={(e) => {
        (e.target as HTMLElement).style.color = "var(--accent)";
        (e.target as HTMLElement).style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        (e.target as HTMLElement).style.color = "inherit";
        (e.target as HTMLElement).style.transform = "scale(1)";
      }}
    >
      Settings
    </Link>

    <div style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
      <Link
        href="/login"
        style={{
          color: "inherit",
          textDecoration: "none",
          transition: "all 0.2s ease",
        }}
        onMouseOver={(e) => {
          (e.target as HTMLElement).style.color = "var(--accent)";
          (e.target as HTMLElement).style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          (e.target as HTMLElement).style.color = "inherit";
          (e.target as HTMLElement).style.transform = "scale(1)";
        }}
      >
        Login
      </Link>

      <button
        onClick={handleSignOut}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          font: "inherit",
          color: "inherit",
          transition: "all 0.2s ease",
        }}
        onMouseOver={(e) => {
          (e.target as HTMLElement).style.color = "var(--accent)";
          (e.target as HTMLElement).style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          (e.target as HTMLElement).style.color = "inherit";
          (e.target as HTMLElement).style.transform = "scale(1)";
        }}
      >
        Sign Out
      </button>
      </div>
    </nav>
  );
}
