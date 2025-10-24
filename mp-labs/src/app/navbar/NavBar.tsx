"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function NavBar() {
  const router = useRouter();
  const supabase = createClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session (if any)
    const getUser = async () => {
      // Force a fresh session check from the server
      const { data, error } = await supabase.auth.refreshSession();
      if (!error && data.session) {
        setUser(data.session.user);
      } else {
        // Fallback to getSession if refresh fails
        const { data: sessionData } = await supabase.auth.getSession();
        setUser(sessionData.session?.user ?? null);
      }
      setLoading(false);
    };

    getUser();

    // Listen for login/logout changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event, session?.user);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null); // Immediately clear user state
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
    if (user?.user_metadata?.name) {
      const names = user.user_metadata.name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  // Don't render anything while loading
  if (loading) {
    return (
      <nav className="navbar">
        <Link href="/">Home</Link>
        <Link href="/timer">Timer</Link>
        <div className="navbar-right">
          <span>Loading...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <Link href="/">Home</Link>
      <Link href="/timer">Timer</Link>
      
      {user ? (
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
      ) : (
        <div className="navbar-right">
        </div>
      )}
    </nav>
  );
}