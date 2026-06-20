import { useState, useEffect, useMemo } from "react";
import { getComics, getBundles } from "../serviceshttps://what-ef-production.up.railway.app/api";
import ComicCard from "../components/ComicCard";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
const ComicsCatalogue = () => {
  const [comics, setComics] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBundleId, setFilterBundleId] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [comicsData, bundlesData] = await Promise.all([
          getComics(),
          getBundles()
        ]);
        setComics(comicsData);
        setBundles(bundlesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const filteredComics = useMemo(() => {
    return comics.filter(
      (comic) => comic.title.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(
      (comic) => filterBundleId ? comic.bundle_id === parseInt(filterBundleId, 10) : true
    );
  }, [comics, searchTerm, filterBundleId]);
  const handleBuy = (comic) => {
    if (comic.gumroad_link) {
      window.open(comic.gumroad_link, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/gumroad?product=${encodeURIComponent(comic.title)}`);
    }
  };
  if (loading) {
    return <div className="text-center text-yellow-400 text-2xl">Loading Comics...</div>;
  }
  return <div className="container mx-auto">
      <HeroSection /> {
    /* Added HeroSection */
  }
      <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8">Comics Catalogue</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <input
    type="text"
    placeholder="Search by title..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="flex-grow bg-gray-800 text-white rounded-md px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
  />
        <select
    value={filterBundleId}
    onChange={(e) => setFilterBundleId(e.target.value)}
    className="bg-gray-800 text-white rounded-md px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
  >
          <option value="">All Bundles</option>
          {bundles.map((bundle) => <option key={bundle.bundle_id} value={bundle.bundle_id}>{bundle.bundle_name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredComics.map((comic) => <ComicCard key={comic.comic_id} comic={comic} onBuy={handleBuy} />)}
      </div>
      {filteredComics.length === 0 && <p className="text-center text-gray-400 mt-8">No comics found.</p>}
    </div>;
};
export default ComicsCatalogue;
