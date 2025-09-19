"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function NavBar() {
  const router = useRouter();
  const supabase = createClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();      
    router.refresh();                   
    router.push("/login");              
    setIsDropdownOpen(false);           
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <Link href="/">Home</Link>
      <Link href="/timer">Timer</Link>
      <div className="navbar-right">
        <Link href="/login">Login</Link>
        <span className="greeting">Hi Lina!</span>
        <div className="dropdown-container">
          <button 
            onClick={toggleDropdown}
            className="avatar-button"
            style={{ backgroundColor: '#FFB6C1' }}
          >
            LH
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="dropdown-overlay"
                onClick={closeDropdown}
              />
              
              <div className="dropdown-menu">
                <Link 
                  href="/settings" 
                  onClick={closeDropdown}
                  className="dropdown-item"
                >
                  Settings
                </Link>
                <Link 
                  href="/stats" 
                  onClick={closeDropdown}
                  className="dropdown-item"
                >
                  Stats
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="dropdown-item dropdown-button"
                >
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