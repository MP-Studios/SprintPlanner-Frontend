"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

type LoggedInNavBarProps = {
  user: User;
};

export default function LoggedInNavBar({ user }: LoggedInNavBarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.push("/login");
    router.refresh();
  }

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  // Get user display name
  const getDisplayName = () => {
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  };

  // Get user initials
  const getInitials = () => {
    if (user?.user_metadata?.initials) return user.user_metadata.initials;
  
    const name = user?.user_metadata?.name;
    if (typeof name === "string" && name.trim().length > 0) {
      const names = name.trim().split(/\s+/); // split by any whitespace
      return names.map(n => n[0]?.toUpperCase() ?? "").join("").slice(0, 2);
    }
  
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <nav className="navbar">
      <Link href="/">Home</Link>
      <Link href="/timer">Timer</Link>
      
      <div className="navbar-right">
        <span className="greeting">Hi {getDisplayName()}!</span>
        <div className="dropdown-container">
          <button
            onClick={toggleDropdown}
            className="avatar-button"
            style={{ backgroundColor: "#FFB6C1" }}
          >
            {getInitials()}
          </button>
          {isDropdownOpen && (
            <>
              <div className="dropdown-overlay" onClick={closeDropdown} />
              <div className="dropdown-menu">
                <Link href="/settings" onClick={closeDropdown} className="dropdown-item">
                  Settings
                </Link>
                <Link href="/stats" onClick={closeDropdown} className="dropdown-item">
                  Stats
                </Link>
                <button onClick={handleSignOut} className="dropdown-item dropdown-button">
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}