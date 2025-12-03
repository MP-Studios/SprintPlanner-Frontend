"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import SettingsDrawer from './SettingsDrawer';

// --- HoverLink component for links with hover color swap ---
function HoverLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      style={{
        color: hover ? "#edf7f2" : "#3a554c",
        padding: "3px 6px",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </Link>
  );
}

// --- HoverButton component for buttons with hover color swap ---
function HoverButton({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      style={{
        color: hover ? "#edf7f2" : "#3a554c",
        padding: "3px 6px",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
}

type LoggedInNavBarProps = {
  user: User;
};

export default function LoggedInNavBar({ user }: LoggedInNavBarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);


  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await fetch('/api/updateNavbar');
        console.log('Response status:', res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log('Response data:', data);
          console.log('Username from data:', data.username);
          
          if (data.username) {
            setUsername(data.username);
            console.log('Username set to:', data.username);
          } else {
            console.log('No username in response');
          }
        }
      } catch (error) {
        console.error('Failed to fetch username:', error);
      }
    };
    fetchUsername();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.push("/login");
    router.refresh();
  }

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    setIsSettingsOpen(true);
  };

  const getDisplayName = () => {
    if (username) return username;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  };

  const getInitials = () => {
    if (user?.user_metadata?.initials) return user.user_metadata.initials;
  
    const name = user?.user_metadata?.name;
    if (typeof name === "string" && name.trim().length > 0) {
      const names = name.trim().split(/\s+/);
      return names.map(n => n[0]?.toUpperCase() ?? "").join("").slice(0, 2);
    }
  
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <>
      <nav className="navbar">
        <HoverLink href="/">Home</HoverLink>
        <HoverLink href="/timer">Timer</HoverLink>

        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfAqPRd7dXe7OBVJVjyqtjnAUxPhzFbenmyk_2k-OBP9qlznQ/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
        >
          <HoverButton>Give Feedback</HoverButton>
        </a>

        <div className="navbar-right">
          <span className="greeting" style={{color: "#3a554c"}}>Hi {getDisplayName()}!</span>
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
                  <button 
                    onClick={handleSettingsClick} 
                    className="dropdown-item dropdown-button"
                  >
                    Settings
                  </button>
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

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
