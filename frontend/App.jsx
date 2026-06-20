import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ComicsCatalogue from "./pages/ComicsCatalogue";
import FanPolls from "./pages/FanPolls";
import SeriesBundles from "./pages/SeriesBundles";
import CustomEditions from "./pages/CustomEditions";
import BundleDetail from "./pages/BundleDetail";
import Toast from "./components/Toast";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageComics from "./pages/admin/ManageComics";
import ManagePolls from "./pages/admin/ManagePolls";
import ManageBundles from "./pages/admin/ManageBundles";
import ManageCustomEditions from "./pages/admin/ManageCustomEditions";
import GumroadRedirect from "./pages/GumroadRedirect";
const App = () => {
  return <>
    <ToastProvider>
      <AuthProvider>
        <HashRouter>
          <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col">
            <AppContent />
          </div>
        </HashRouter>
      </AuthProvider>
    </ToastProvider>
    </>;
};
const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return <>
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? "flex-grow" : "p-4 sm:p-6 lg:p-8 flex-grow"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/comics" element={<ComicsCatalogue />} />
          <Route path="/polls" element={<FanPolls />} />
          <Route path="/bundles" element={<SeriesBundles />} />
          <Route path="/bundles/:bundleId" element={<BundleDetail />} />
          <Route path="/custom" element={<CustomEditions />} />
          <Route path="/gumroad" element={<GumroadRedirect />} />

          {
    /* Admin Routes */
  }
          <Route path="/admin" element={user && user.role === "admin" ? <AdminLayout /> : <Navigate to="/login" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="comics" element={<ManageComics />} />
            <Route path="polls" element={<ManagePolls />} />
            <Route path="bundles" element={<ManageBundles />} />
            <Route path="custom-editions" element={<ManageCustomEditions />} />
          </Route>

          <Route path="*" element={<Navigate to="/comics" />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <Toast />
    </>;
};
export default App;
