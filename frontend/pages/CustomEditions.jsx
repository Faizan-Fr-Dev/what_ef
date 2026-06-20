import { useState, useEffect, useCallback } from "react";
import { getCustomEditions, getComics } from "../services/api";
import { useAuth } from "../context/AuthContext";
import CustomEditionForm from "../components/CustomEditionForm";
import CustomEditionCard from "../components/CustomEditionCard";
const CustomEditions = () => {
  const { user } = useAuth();
  const [editions, setEditions] = useState([]);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchEditions = useCallback(async () => {
    setLoading(true);
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const [editionsData, comicsData] = await Promise.all([
        getCustomEditions(user.user_id),
        getComics()
      ]);
      setEditions(editionsData);
      setComics(comicsData);
    } catch (error) {
      console.error("Failed to fetch custom editions", error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    fetchEditions();
  }, [fetchEditions]);
  if (loading) {
    return <div className="text-center text-yellow-400 text-2xl">Loading Your Custom Editions...</div>;
  }
  if (!user) {
    return <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
        <p className="text-gray-400 mb-6">You need to be logged in to access Custom Editions.</p>
        <button onClick={() => window.location.hash = "/login"} className="bg-yellow-400 text-slate-900 px-6 py-2 rounded font-bold">Log In</button>
      </div>;
  }
  if (user.role === "guest") {
    return <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Account Required</h2>
        <p className="text-gray-400 mb-6 font-bold">Guest accounts cannot access Custom Editions.</p>
        <p className="text-gray-500 mb-6">Please create a full account to request custom comics.</p>
        <button onClick={() => {
      window.location.hash = "/register";
    }} className="bg-cyan-400 text-slate-900 px-6 py-2 rounded font-bold">Create Account</button>
      </div>;
  }
  return <div className="container mx-auto max-w-5xl">
      <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8">Custom Editions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <CustomEditionForm comics={comics} onNewEdition={fetchEditions} />

        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">Your Requests</h2>
          <div className="space-y-4">
            {editions.length > 0 ? editions.map((edition) => <CustomEditionCard key={edition.edition_id} edition={edition} />) : <p className="text-gray-400 bg-gray-800 p-4 rounded-lg">You haven't requested any custom editions yet.</p>}
          </div>
        </div>
      </div>
    </div>;
};
export default CustomEditions;
