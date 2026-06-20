import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };
  const linkClass = (isActive) => `px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 block md:inline-block ${isActive ? "bg-yellow-400 text-slate-900 shadow-lg scale-105" : "text-gray-300 hover:bg-slate-700 hover:text-white"}`;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  return <header className="bg-slate-800 shadow-lg sticky top-0 z-[100] border-b border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-3xl text-yellow-400 font-bangers cursor-pointer" onClick={() => navigate("/")}>What Ef?</h1>
            <nav className="hidden md:flex items-baseline ml-10 space-x-4">
              <NavLink to="/comics" className={({ isActive }) => linkClass(isActive)}>Comics</NavLink>
              <NavLink to="/bundles" className={({ isActive }) => linkClass(isActive)}>Bundles</NavLink>
              <NavLink to="/polls" className={({ isActive }) => linkClass(isActive)}>Fan Polls</NavLink>
              <NavLink to="/custom" className={({ isActive }) => linkClass(isActive)}>Custom Editions</NavLink>
              {user?.role === "admin" && <NavLink to="/admin" className={({ isActive }) => linkClass(isActive).replace("text-gray-300", "text-red-400 font-bold")}>Admin Panel</NavLink>}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? <>
                <span className="text-gray-300 hidden lg:inline">Welcome, <span className="font-bold text-yellow-400">{user.name}</span></span>
                <button
    onClick={handleLogout}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-all shadow-md hover:shadow-red-900/50"
  >
                  Logout
                </button>
              </> : <button
    onClick={() => navigate("/login")}
    className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-1.5 rounded-md font-bold text-sm transition-all shadow-md hover:shadow-yellow-400/30"
  >
                Login
              </button>}
          </div>

          {
    /* Hamburger Icon */
  }
          <div className="md:hidden flex items-center">
            <button
    onClick={toggleMenu}
    className="text-gray-300 hover:text-white focus:outline-none p-2"
    aria-label="Toggle menu"
  >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {
    /* Mobile Menu */
  }
      <div
    className={`md:hidden bg-slate-800 border-t border-slate-700 transition-all duration-300 overflow-hidden ${isMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"}`}
  >
        <div className="px-4 space-y-2 text-center">
          <NavLink to="/comics" onClick={closeMenu} className={({ isActive }) => linkClass(isActive)}>Comics</NavLink>
          <NavLink to="/bundles" onClick={closeMenu} className={({ isActive }) => linkClass(isActive)}>Bundles</NavLink>
          <NavLink to="/polls" onClick={closeMenu} className={({ isActive }) => linkClass(isActive)}>Fan Polls</NavLink>
          <NavLink to="/custom" onClick={closeMenu} className={({ isActive }) => linkClass(isActive)}>Custom Editions</NavLink>
          {user?.role === "admin" && <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => linkClass(isActive).replace("text-gray-300", "text-red-400 font-bold")}>Admin Panel</NavLink>}
          <div className="pt-4 border-t border-slate-700 mt-4">
            {user ? <div className="space-y-3">
                <p className="text-gray-300">Logged in as <span className="text-yellow-400 font-bold">{user.name}</span></p>
                <button
    onClick={handleLogout}
    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-bold transition-colors"
  >
                  Logout
                </button>
              </div> : <button
    onClick={() => {
      closeMenu();
      navigate("/login");
    }}
    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md font-bold transition-colors"
  >
                Login
              </button>}
          </div>
        </div>
      </div>
    </header>;
};
export default Navbar;
