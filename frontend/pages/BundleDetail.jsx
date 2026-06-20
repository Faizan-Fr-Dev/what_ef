import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBundleById, getComicsByBundleId } from "../services/api";
import ComicCard from "../components/ComicCard";
import { useNavigate } from "react-router-dom";
const BundleDetail = () => {
  const { bundleId } = useParams();
  const [bundle, setBundle] = useState(null);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBundleData = async () => {
      if (!bundleId) return;
      setLoading(true);
      try {
        const id = parseInt(bundleId, 10);
        const [bundleData, comicsData] = await Promise.all([
          getBundleById(id),
          getComicsByBundleId(id)
        ]);
        setBundle(bundleData);
        setComics(comicsData);
      } catch (error) {
        console.error("Failed to fetch bundle data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBundleData();
  }, [bundleId]);
  if (loading) {
    return <div className="text-center text-yellow-400 text-2xl">Loading Bundle Details...</div>;
  }
  const handleBuyComic = (comic) => {
    if (comic.gumroad_link) {
      window.open(comic.gumroad_link, "_blank");
    } else {
      navigate(`/gumroad?product=${encodeURIComponent(comic.title)}`);
    }
  };
  if (!bundle) {
    return <div className="text-center text-red-500 text-2xl">Bundle not found.</div>;
  }
  return <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">{bundle.bundle_name}</h1>
      <p className="text-gray-300 mb-8">{bundle.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {comics.map((comic) => <ComicCard key={comic.comic_id} comic={comic} onBuy={handleBuyComic} />)}
      </div>
    </div>;
};
export default BundleDetail;
