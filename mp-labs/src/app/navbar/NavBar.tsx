"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "0.5rem", background: "#f0b040f0" }}>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/settings" className="ml-auto">Settings</Link>
      <div style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </nav>
  );
}