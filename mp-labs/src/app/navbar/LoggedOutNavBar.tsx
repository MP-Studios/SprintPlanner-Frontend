import Link from "next/link";

export default function LoggedOutNavBar() {
  return (
    <nav className="navbar flex justify-center items-center py-4 bg-white shadow-md">
      <Link 
        href="/" 
        className="text-6xl font-bold text-[#edf7f2] font-logo"
      >
        Planlli
      </Link>
    </nav>
  );
}
