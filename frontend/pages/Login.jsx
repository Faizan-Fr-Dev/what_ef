import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/comics");
    }
  }, [user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };
  return <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg border-2 border-yellow-400">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400">What Ef</h1>
          <p className="mt-2 text-gray-300">E-Commerce Dashboard</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
    id="email-address"
    name="email"
    type="email"
    autoComplete="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
    placeholder="Email address"
  />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
    id="password"
    name="password"
    type="password"
    autoComplete="current-password"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
    placeholder="Password"
  />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
    type="submit"
    disabled={loading}
    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-500"
  >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <div className="text-center mt-4 space-y-2">
              <button
    type="button"
    onClick={() => navigate("/register")}
    className="block w-full text-sm text-yellow-500 hover:text-yellow-400"
  >
                Need an account? Create one here.
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>;
};
export default Login;
