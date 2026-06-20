import { useState } from "react";
import { useAuth } from "../context/AuthContext";
const GuestModal = ({ isOpen, onClose, onSuccess, actionName = "continue" }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { guestLogin } = useAuth();
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const guestUser = await guestLogin(name, email, country);
      onSuccess(guestUser);
      onClose();
    } catch (err) {
      setError(err.message || "Guest login failed");
    } finally {
      setLoading(false);
    }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm px-4">
            <div className="bg-gray-800 border border-cyan-400 rounded-lg p-6 w-full max-w-sm shadow-2xl">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">Guest Checkout</h2>
                <p className="text-gray-400 text-sm mb-6">Please provide your details to {actionName}.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Name</label>
                        <input
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
  />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Email</label>
                        <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
  />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Country</label>
                        <input
    type="text"
    required
    value={country}
    onChange={(e) => setCountry(e.target.value)}
    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
  />
                    </div>

                    {error && <p className="text-red-500 text-xs">{error}</p>}

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 text-gray-400 hover:text-white text-sm"
  >
                            Cancel
                        </button>
                        <button
    type="submit"
    disabled={loading}
    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded text-sm disabled:opacity-50"
  >
                            {loading ? "Processing..." : `Continue to ${actionName}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>;
};
export default GuestModal;
