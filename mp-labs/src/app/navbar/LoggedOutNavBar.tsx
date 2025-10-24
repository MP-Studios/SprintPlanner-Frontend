// components/LoggedOutNavBar.tsx
import Link from "next/link";

export default function LoggedOutNavBar() {
  return (
    <nav className="navbar">
      <Link href="/">Home</Link>
      <Link href="/timer">Timer</Link>
      <div className="navbar-right">
      </div>
    </nav>
  );
}