import { useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const AdminLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  const navClass = ({ isActive }) => `block px-4 py-2 rounded-md mb-2 transition-colors ${isActive ? "bg-yellow-400 text-slate-900 font-bold" : "text-gray-300 hover:bg-slate-700 hover:text-white"}`;
  const closeSidebar = () => setIsSidebarOpen(false);
  return <div className="flex flex-col md:flex-row min-h-screen bg-slate-900">
            {
    /* Mobile Header */
  }
            <div className="md:hidden bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center sticky top-0 z-40">
                <h2 className="text-xl font-bangers text-yellow-400">What Ef Admin</h2>
                <button
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    className="text-gray-300 focus:outline-none"
  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isSidebarOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                    </svg>
                </button>
            </div>

            {
    /* Backdrop for mobile */
  }
            {isSidebarOpen && <div
    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
    onClick={closeSidebar}
  />}

            {
    /* Sidebar */
  }
            <aside className={`
                fixed inset-y-0 left-0 w-64 bg-slate-800 shadow-xl border-r border-slate-700 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-6 hidden md:block border-b border-slate-700 mb-6">
                    <h2 className="text-2xl font-bangers text-yellow-400">What Ef Admin</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage everything</p>
                </div>
                <nav className="px-4 py-4">
                    <NavLink to="/admin" end onClick={closeSidebar} className={navClass}>Dashboard</NavLink>
                    <NavLink to="/admin/users" onClick={closeSidebar} className={navClass}>Users</NavLink>
                    <NavLink to="/admin/comics" onClick={closeSidebar} className={navClass}>Comics</NavLink>
                    <NavLink to="/admin/bundles" onClick={closeSidebar} className={navClass}>Bundles</NavLink>
                    <NavLink to="/admin/polls" onClick={closeSidebar} className={navClass}>Polls</NavLink>
                    <NavLink to="/admin/custom-editions" onClick={closeSidebar} className={navClass}>Custom Editions</NavLink>

                    <div className="mt-8 pt-4 border-t border-slate-700">
                        <NavLink to="/comics" className="block px-4 py-2 text-gray-400 hover:text-white text-sm">
                            ← Back to Site
                        </NavLink>
                    </div>
                </nav>
            </aside>

            {
    /* Content Area */
  }
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>;
};
export default AdminLayout;
